import { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import { useSelector } from 'react-redux';

import store, { RootState } from 'src/store';
import { IFilters } from 'src/store/reducers/filters';
import { initialState as emptyMenuState } from 'src/store/reducers/menu';

import { wpRestApiHandler } from 'src/api/wordpress';

import DietaryInfo from 'src/components/DietaryInfo';
import Layout from 'src/components/Layout/Layout';
import TabbedCards, { ITabs2Setup, ITabsSetup } from 'src/components/TabbedCards';
import ToggleFilter from 'src/components/ToggleFilter';
import UpgradeIcon from 'src/components/UpgradeIcon';

import { useSnackbar } from 'src/hooks/useSnackbar';
import { useUnsaved } from 'src/hooks/useUnsaved';
import { formatMenuItems } from 'src/utils/wordpress/menu';
import { menuChoicesPayload } from 'src/utils/wordpress/menuChoices';

import { WPTerm } from 'src/types/wp-rest-api';

const Menu = () => {
  const authState = (state: RootState) => state.auth;
  const { token } = useSelector(authState);
  const menuChoicesState = (state: RootState) => state.menuChoices;
  const MenuChoices = useSelector(menuChoicesState);
  const filtersState = (state: RootState) => state.filters;
  const Filters: IFilters = useSelector(filtersState);
  const menuState = (state: RootState) => state.menu;
  const Menu = useSelector(menuState);
  const uiState = (state: RootState) => state.ui;
  const { isLoading } = useSelector(uiState);
  const weddingState = (state: RootState) => state.wedding;
  const { weddingID } = useSelector(weddingState);

  const [resetMenuChoices, setResetMenuChoices] = useState<RootState['menuChoices']>();
  const [openSnackbar] = useSnackbar();
  const [descriptions, setDescriptions] = useState<WPTerm[]>([]);

  const isEdited = JSON.stringify(MenuChoices) !== JSON.stringify(resetMenuChoices);

  useEffect(() => {
    wpRestApiHandler('menuType', undefined, 'GET', token, false).then(async (resp) => {
      const respJson = await resp.json();
      setDescriptions(respJson.map((res: WPTerm) => ({ description: res.description, name: res.slug })));
    });

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

  const onSelect = (itemID: number | string | null, type: string, stateObject: RootState[keyof RootState], action: string, set: 'push' | 'replace' = 'push') => {
    let currentChoices;
    if (set === 'push') {
      currentChoices = stateObject[type].slice();
      if (currentChoices.includes(itemID)) {
        currentChoices.splice(currentChoices.indexOf(itemID), 1);
      } else {
        currentChoices.push(itemID);
      }
    } else {
      currentChoices = itemID;
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
        setResetMenuChoices(cloneDeep(MenuChoices));
        openSnackbar('Menu choices updated');
        return respJson;
      } else {
        openSnackbar(respJson.message, 'error');
      }
    });
  };

  const onResetChoices = () => {
    store.dispatch({
      payload: { menuChoices: resetMenuChoices },
      type: 'menuChoices/set'
    });
  };

  const menuSetup: ITabsSetup[] = [];
  Menu.reception.length > 0 &&
    menuSetup.push({
      description: descriptions?.filter((d) => d.name === 'canapes')[0]?.description || '',
      id: 'reception',
      label: 'Reception'
    });
  Object.values(Menu.dinner).flat().length > 0 &&
    menuSetup.push({
      description: descriptions?.filter((d) => d.name === 'dinner-menu')[0]?.description || '',
      id: 'dinner',
      label: 'Dinner'
    });
  Menu.evening.length > 0 &&
    menuSetup.push({
      description: descriptions?.filter((d) => d.name === 'evening-menu')[0]?.description || '',
      id: 'evening',
      label: 'Evening'
    });
  Object.values(Menu.kids).flat().length > 0 &&
    menuSetup.push({
      description: descriptions?.filter((d) => d.name === 'kids-menu')[0]?.description || '',
      id: 'kids',
      label: 'Kids'
    });

  const secondLevelSetup: ITabs2Setup = {
    dinner: [],
    kids: []
  };

  Menu.dinner.starter?.length > 0 &&
    secondLevelSetup.dinner.push({ description: descriptions?.filter((d) => d.name === 'starter')[0]?.description || '', id: 'starter', label: 'Starter' });
  Menu.dinner.main?.length > 0 &&
    secondLevelSetup.dinner.push({ description: descriptions?.filter((d) => d.name === 'main')[0]?.description || '', id: 'main', label: 'Main Course' });
  Menu.dinner.sides?.length > 0 &&
    secondLevelSetup.dinner.push({ description: descriptions?.filter((d) => d.name === 'sides')[0]?.description || '', id: 'sides', label: 'Side Dishes' });
  Menu.dinner.dessert?.length > 0 &&
    secondLevelSetup.dinner.push({ description: descriptions?.filter((d) => d.name === 'dessert')[0]?.description || '', id: 'dessert', label: 'Dessert' });

  Menu.kids.kidsReception?.length > 0 &&
    secondLevelSetup.kids.push({ description: descriptions?.filter((d) => d.name === 'reception-kids-menu')[0]?.description || '', id: 'kidsReception', label: 'Reception' });
  Menu.kids.kidsStarter?.length > 0 &&
    secondLevelSetup.kids.push({ description: descriptions?.filter((d) => d.name === 'starter-kids-menu')[0]?.description || '', id: 'kidsStarter', label: 'Starter' });
  Menu.kids.kidsMain?.length > 0 &&
    secondLevelSetup.kids.push({ description: descriptions?.filter((d) => d.name === 'main-course-kids-menu')[0]?.description || '', id: 'kidsMain', label: 'Main Course' });
  Menu.kids.kidsDessert?.length > 0 &&
    secondLevelSetup.kids.push({ description: descriptions?.filter((d) => d.name === 'dessert-kids-menu')[0]?.description || '', id: 'kidsDessert', label: 'Dessert' });

  useUnsaved({
    isUnsaved: isEdited,
    onConfirm: onResetChoices
  });

  return (
    <Layout
      title="Food Package"
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
          secondLevelFilter={
            <ToggleFilter
              id="filter-plating"
              label="Show"
              value={Filters.plating}
              onSelect={(value) => onSelect(value, 'plating', Filters, 'filters', 'replace')}
              options={[
                { label: 'Plated', value: 'plated' },
                { label: 'Feasting', value: 'feasting' }
              ]}
            />
          }
          tabsSetup={menuSetup}
          tabs2Setup={secondLevelSetup}
          onSelect={onSelect}
          Filters={Filters}
          Content={Menu}
          SelectedContent={MenuChoices}
          selectedContentKey="menuChoices"
          cardContentKeys={[{ id: 'description' }]}
          cardIconKeys={[
            { Component: DietaryInfo, args: [{ key: 'diets', value: 'dietary' }], id: 'dietary' },
            { Component: UpgradeIcon, id: 'upcharge' }
          ]}
        />
      ) : (
        <></>
      )}
    </Layout>
  );
};

export default Menu;
