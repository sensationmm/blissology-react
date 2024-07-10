import { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import { useSelector } from 'react-redux';

import store, { RootState } from 'src/store';
import { IFilters } from 'src/store/reducers/filters';
import { IMenuItemPlating, initialState as emptyMenuState } from 'src/store/reducers/menu';

import { wpRestApiHandler } from 'src/api/wordpress';

import Layout from 'src/components/Layout/Layout';
import TabbedCards from 'src/components/TabbedCards';
import ToggleFilter from 'src/components/ToggleFilter';

import { useSnackbar } from 'src/hooks/useSnackbar';
import { useUnsaved } from 'src/hooks/useUnsaved';
import { diningChoicesPayload } from 'src/utils/wordpress/dining';
import { formatMenuItems } from 'src/utils/wordpress/menu';

type IMenuSetup = {
  id: string;
  label: string;
};

const Menu = () => {
  const authState = (state: RootState['auth']) => state.auth;
  const { token } = useSelector(authState);
  const diningState = (state: RootState['menu']) => state.dining;
  const Dining = useSelector(diningState);
  const filtersState = (state: RootState) => state.filters;
  const Filters: IFilters = useSelector(filtersState);
  const menuState = (state: RootState['menu']) => state.menu;
  const Menu = useSelector(menuState);
  const uiState = (state: RootState['ui']) => state.ui;
  const { isLoading } = useSelector(uiState);
  const weddingState = (state: RootState['wedding']) => state.wedding;
  const { weddingID } = useSelector(weddingState);

  const [resetDining, setResetDining] = useState<RootState['dining']>();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [activeTab2, setActiveTab2] = useState<number>(0);
  const [filterPlating, setFilterPlating] = useState<IMenuItemPlating>('plated');
  const [openSnackbar] = useSnackbar();

  const isEdited = JSON.stringify(Dining) !== JSON.stringify(resetDining);

  useEffect(() => {
    if (Menu === emptyMenuState && !!token) {
      store.dispatch({
        payload: { isLoading: true },
        type: 'ui/setLoading'
      });
      wpRestApiHandler(`menu`, undefined, 'GET', token).then(async (resp) => {
        const respJson = await resp.json();

        const dispatchPayload = formatMenuItems(respJson);

        await store.dispatch({
          payload: dispatchPayload,
          type: 'menu/set'
        });
        store.dispatch({
          payload: { isLoading: false },
          type: 'ui/setLoading'
        });
      });
    }
  }, []);

  useEffect(() => {
    !resetDining && setResetDining(cloneDeep(Dining));
  }, [Dining]);

  useEffect(() => {
    setActiveTab2(0);
  }, [activeTab]);

  const onSelect = (itemID: number | string, type: string, stateObject: RootState[keyof RootState], action: string) => {
    const currentChoices = stateObject[type].slice();
    if (currentChoices.includes(itemID)) {
      currentChoices.splice(currentChoices.indexOf(itemID), 1);
    } else {
      currentChoices.push(itemID);
    }

    store.dispatch({
      payload: { choices: currentChoices, type: type },
      type: `${action}/update`
    });
  };

  const onSaveChoices = () => {
    store.dispatch({
      payload: { isLoading: true },
      type: 'ui/setLoading'
    });

    wpRestApiHandler(
      `wedding/${weddingID}`,
      {
        acf: {
          dining: diningChoicesPayload(Dining)
        }
      },
      'POST',
      token
    ).then(async (resp) => {
      const respJson = await resp.json();

      store.dispatch({
        payload: { isLoading: false },
        type: 'ui/setLoading'
      });

      if (!respJson.data?.status) {
        openSnackbar('Dining choices updated');
        return respJson;
      } else {
        openSnackbar(respJson.message, 'error');
      }
    });
  };

  const onResetChoices = () => {
    store.dispatch({
      payload: resetDining,
      type: 'dining/set'
    });
  };

  const onSetPlatingFilter = (newPlating: string) => {
    if (newPlating !== null) {
      setFilterPlating(newPlating as IMenuItemPlating);
    }
  };

  const menuSetup: IMenuSetup[] = [];
  Menu.reception.length > 0 && menuSetup.push({ id: 'reception', label: 'Reception Options' });
  Object.values(Menu.dinner).flat().length > 0 && menuSetup.push({ id: 'dinner', label: 'Dinner Options' });
  Menu.evening.length > 0 && menuSetup.push({ id: 'evening', label: 'Evening Options' });
  Object.values(Menu.kids).flat().length > 0 && menuSetup.push({ id: 'kids', label: 'Kids Options' });

  useUnsaved({
    isUnsaved: isEdited,
    onConfirm: onResetChoices
  });

  return (
    <Layout
      title="Menu"
      actions={[
        { color: 'secondary', disabled: !isEdited, label: 'Reset', onClick: onResetChoices },
        { disabled: !isEdited, label: 'Save', onClick: onSaveChoices }
      ]}>
      {!isLoading ? (
        <TabbedCards
          topLevelFilter={
            <ToggleFilter
              id="filter-diets"
              value={Filters.diet}
              onSelect={(value) => onSelect(value, 'diet', Filters, 'filters')}
              options={[
                { label: 'DF', value: 'df' },
                { label: 'GF', value: 'gf' },
                { label: 'V', value: 'v' },
                { label: 'VE', value: 've' }
              ]}
            />
          }
          filterValue2={filterPlating}
          fliterValue2Type={typeof filterPlating}
          secondLevelFilter={
            <ToggleFilter
              id="filter-plating"
              label="Show"
              value={filterPlating}
              onSelect={onSetPlatingFilter}
              options={[
                { label: 'Plated', value: 'plated' },
                { label: 'Feasting', value: 'feasting' }
              ]}
            />
          }
          tabsSetup={menuSetup}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeTab2={activeTab2}
          setActiveTab2={setActiveTab2}
          onSelect={onSelect}
          Filters={Filters}
          Content={Menu}
          SelectedContent={Dining}
        />
      ) : (
        <></>
      )}
    </Layout>
  );
};

export default Menu;
