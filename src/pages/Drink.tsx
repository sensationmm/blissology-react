import { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import { useSelector } from 'react-redux';

import store, { RootState } from 'src/store';
import { initialState as emptyDrinksState } from 'src/store/reducers/drinks';
import { IFilters } from 'src/store/reducers/filters';

import { wpRestApiHandler } from 'src/api/wordpress';

import DrinksInfo from 'src/components/DrinksInfo';
import Layout from 'src/components/Layout/Layout';
import TabbedCards from 'src/components/TabbedCards';
import ToggleFilter from 'src/components/ToggleFilter';

import { useSnackbar } from 'src/hooks/useSnackbar';
import { useUnsaved } from 'src/hooks/useUnsaved';
import { capitalize } from 'src/utils/common';
import { drinkChoicesPayload } from 'src/utils/wordpress/drinkChoices';
import { formatDrinksResponse } from 'src/utils/wordpress/drinks';

import { WPTerm } from 'src/types/wp-rest-api';

type IDrinksSetup = {
  id: string;
  label: string;
};

const Drink = () => {
  const authState = (state: RootState) => state.auth;
  const { token } = useSelector(authState);
  const drinksState = (state: RootState) => state.drinks;
  const Drinks = useSelector(drinksState);
  const drinkChoicesState = (state: RootState) => state.drinkChoices;
  const DrinkChoices = useSelector(drinkChoicesState);
  const filtersState = (state: RootState) => state.filters;
  const Filters: IFilters = useSelector(filtersState);
  const uiState = (state: RootState) => state.ui;
  const { isLoading } = useSelector(uiState);
  const weddingState = (state: RootState) => state.wedding;
  const { weddingID } = useSelector(weddingState);

  const [resetDrinkChoices, setResetDrinkChoices] = useState<RootState['drinkChoices']>();
  const [openSnackbar] = useSnackbar();
  const [descriptions, setDescriptions] = useState<WPTerm[]>([]);

  const isEdited = JSON.stringify(DrinkChoices) !== JSON.stringify(resetDrinkChoices);

  useEffect(() => {
    wpRestApiHandler('drinkType', undefined, 'GET', token, false).then(async (resp) => {
      const respJson = await resp.json();
      setDescriptions(respJson.map((res: WPTerm) => ({ description: res.description, name: res.name })));
    });

    if (Drinks === emptyDrinksState && !!token) {
      store.dispatch({
        payload: { isLoading: true },
        type: 'ui/setLoading'
      });
      wpRestApiHandler(`drink`, undefined, 'GET', token).then(async (resp) => {
        const respJson = await resp.json();

        const dispatchPayload = formatDrinksResponse(respJson);

        await store.dispatch({
          payload: dispatchPayload,
          type: 'drinks/set'
        });
        store.dispatch({
          payload: { isLoading: false },
          type: 'ui/setLoading'
        });
      });
    }
  }, []);

  useEffect(() => {
    !resetDrinkChoices && setResetDrinkChoices(cloneDeep(DrinkChoices));
  }, [DrinkChoices]);

  const onSelect = (itemID: number | string | null, type: string, stateObject: RootState[keyof RootState], action: string = 'drinkChoices', set: 'push' | 'replace' = 'push') => {
    let currentChoices;
    if (set === 'push') {
      currentChoices = stateObject.slice();
      if (currentChoices.includes(itemID)) {
        currentChoices.splice(currentChoices.indexOf(itemID), 1);
      } else {
        currentChoices.push(itemID);
      }
    } else {
      currentChoices = itemID !== null ? itemID : 'all';
    }

    store.dispatch({
      payload: action === 'drinkChoices' ? { drinkChoices: currentChoices } : { choices: currentChoices, type: type },
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
          drinkChoices: drinkChoicesPayload(DrinkChoices)
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
        setResetDrinkChoices(cloneDeep(DrinkChoices));
        openSnackbar('Drink choices updated');
        return respJson;
      } else {
        openSnackbar(respJson.message, 'error');
      }
    });
  };

  const onResetChoices = () => {
    store.dispatch({
      payload: { drinkChoices: resetDrinkChoices },
      type: 'drinkChoices/set'
    });
  };

  const drinksSetup: IDrinksSetup[] = Object.keys(Drinks).map((upgr: string) => ({
    description: descriptions?.filter((d) => d.name === capitalize(upgr))[0]?.description || '',
    id: upgr,
    label: capitalize(upgr)
  }));

  useUnsaved({
    isUnsaved: isEdited,
    onConfirm: onResetChoices
  });

  return (
    <Layout
      title="Drinks Package"
      actions={[
        { color: 'secondary', disabled: !isEdited, label: 'Reset', onClick: onResetChoices },
        { disabled: !isEdited, label: 'Save', onClick: onSaveChoices }
      ]}>
      {!isLoading ? (
        <TabbedCards
          topLevelFilter={
            <ToggleFilter
              id="filter-drinkType"
              value={Filters.drinkType}
              onSelect={(value) => onSelect(value, 'drinkType', Filters, 'filters', 'replace')}
              options={[
                { label: 'Wine', value: 'wine' },
                { label: 'Sparkling', value: 'sparkling' },
                { label: 'Beer', value: 'beer' },
                { label: 'Spirits', value: 'spirits' }
              ]}
              showSecondTierTest={'wine'}
              secondTier={
                <ToggleFilter
                  id="filter-wineType"
                  value={Filters.wineType}
                  label=""
                  onSelect={(value) => onSelect(value, 'wineType', Filters, 'filters', 'replace')}
                  options={[
                    { label: 'Red Wine', value: 'red' },
                    { label: 'White Wine', value: 'white' },
                    { label: 'Rose Wine', value: 'rose' }
                  ]}
                />
              }
            />
          }
          tabsSetup={drinksSetup}
          onSelect={onSelect}
          Filters={Filters}
          Content={Drinks}
          SelectedContent={DrinkChoices}
          selectedContentKey="drinkChoices"
          cardSpan={3}
          cardContentKeys={[{ id: 'origin' }]}
          cardIconKeys={[
            {
              Component: DrinksInfo,
              args: [
                { key: 'drinkType', value: 'drinkType' },
                { key: 'wineType', value: 'wineType' }
              ],
              id: 'drinkType'
            }
          ]}
        />
      ) : (
        <></>
      )}
    </Layout>
  );
};

export default Drink;
