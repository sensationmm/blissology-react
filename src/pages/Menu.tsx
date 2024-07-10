import { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import { useSelector } from 'react-redux';

import store, { RootState } from 'src/store';
import { IFilters } from 'src/store/reducers/filters';
import { IMenuItemPlating, initialState as emptyMenuState } from 'src/store/reducers/menu';

import { wpRestApiHandler } from 'src/api/wordpress';

import DietaryInfo from 'src/components/DietaryInfo';
import Layout from 'src/components/Layout/Layout';
import TabbedCards from 'src/components/TabbedCards';
import ToggleFilter from 'src/components/ToggleFilter';

import { useSnackbar } from 'src/hooks/useSnackbar';
import { useUnsaved } from 'src/hooks/useUnsaved';
import { formatMenuItems } from 'src/utils/wordpress/menu';
import { menuChoicesPayload } from 'src/utils/wordpress/menuChoices';

type IMenuSetup = {
  id: string;
  label: string;
};

const Menu = () => {
  const authState = (state: RootState['auth']) => state.auth;
  const { token } = useSelector(authState);
  const menuChoicesState = (state: RootState['menuChoices']) => state.menuChoices;
  const MenuChoices = useSelector(menuChoicesState);
  const filtersState = (state: RootState) => state.filters;
  const Filters: IFilters = useSelector(filtersState);
  const menuState = (state: RootState['menu']) => state.menu;
  const Menu = useSelector(menuState);
  const uiState = (state: RootState['ui']) => state.ui;
  const { isLoading } = useSelector(uiState);
  const weddingState = (state: RootState['wedding']) => state.wedding;
  const { weddingID } = useSelector(weddingState);

  const [resetMenuChoices, setResetMenuChoices] = useState<RootState['menuChoices']>();
  const [filterPlating, setFilterPlating] = useState<IMenuItemPlating>('plated');
  const [openSnackbar] = useSnackbar();

  const isEdited = JSON.stringify(MenuChoices) !== JSON.stringify(resetMenuChoices);

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
    !resetMenuChoices && setResetMenuChoices(cloneDeep(MenuChoices));
  }, [MenuChoices]);

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
          menuChoices: menuChoicesPayload(MenuChoices)
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
        openSnackbar('Menu choices updated');
        return respJson;
      } else {
        openSnackbar(respJson.message, 'error');
      }
    });
  };

  const onResetChoices = () => {
    store.dispatch({
      payload: resetMenuChoices,
      type: 'menuChoices/set'
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
          onSelect={onSelect}
          Filters={Filters}
          Content={Menu}
          SelectedContent={MenuChoices}
          cardContentKeys={[{ id: 'description' }, { Component: DietaryInfo, args: { key: 'diets', value: 'dietary' }, id: 'dietary' }]}
        />
      ) : (
        <></>
      )}
    </Layout>
  );
};

export default Menu;
