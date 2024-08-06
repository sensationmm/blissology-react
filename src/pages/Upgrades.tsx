import { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import { useSelector } from 'react-redux';

import store, { RootState } from 'src/store';
import { IFilters } from 'src/store/reducers/filters';
import { initialState as emptyUpgradesState } from 'src/store/reducers/upgrades';

import { wpRestApiHandler } from 'src/api/wordpress';

import DietaryInfo from 'src/components/DietaryInfo';
import Layout from 'src/components/Layout/Layout';
import TabbedCards from 'src/components/TabbedCards';

import { useSnackbar } from 'src/hooks/useSnackbar';
import { useUnsaved } from 'src/hooks/useUnsaved';
import { capitalize } from 'src/utils/common';
import { formatUpgradesResponse } from 'src/utils/wordpress/upgrade';
import { upgradeChoicesPayload } from 'src/utils/wordpress/upgradeChoices';

import { WPTerm } from 'src/types/wp-rest-api';

type IUpgradesSetup = {
  id: string;
  label: string;
  description: string;
};

const Upgrades = () => {
  const authState = (state: RootState) => state.auth;
  const { token } = useSelector(authState);
  const upgradesState = (state: RootState) => state.upgrades;
  const Upgrades = useSelector(upgradesState);
  const upgradeChoicesState = (state: RootState) => state.upgradeChoices;
  const UpgradeChoices = useSelector(upgradeChoicesState);
  const upgradeOrdersState = (state: RootState) => state.orders;
  const UpgradeOrders = useSelector(upgradeOrdersState);
  const filtersState = (state: RootState) => state.filters;
  const Filters: IFilters = useSelector(filtersState);
  const uiState = (state: RootState) => state.ui;
  const { isLoading } = useSelector(uiState);
  const weddingState = (state: RootState) => state.wedding;
  const { weddingID } = useSelector(weddingState);

  const [resetUpgradeChoices, setResetUpgradeChoices] = useState<RootState['upgradeChoices']>();
  const [resetUpgradeOrders, setResetUpgradeOrders] = useState<RootState['upgradeChoices']>();
  const [openSnackbar] = useSnackbar();
  const [descriptions, setDescriptions] = useState<WPTerm[]>([]);

  const isEdited = JSON.stringify(UpgradeChoices) !== JSON.stringify(resetUpgradeChoices) || JSON.stringify(UpgradeOrders) !== JSON.stringify(resetUpgradeOrders);

  useEffect(() => {
    wpRestApiHandler('upgradeType', undefined, 'GET', token, false).then(async (resp) => {
      const respJson = await resp.json();
      setDescriptions(respJson.map((res: WPTerm) => ({ description: res.description, name: res.name })));
    });

    if (Upgrades === emptyUpgradesState && !!token) {
      store.dispatch({
        payload: { isLoading: true },
        type: 'ui/setLoading'
      });
      wpRestApiHandler(`upgrade`, undefined, 'GET', token).then(async (resp) => {
        const respJson = await resp.json();

        const dispatchPayload = formatUpgradesResponse(respJson);

        await store.dispatch({
          payload: dispatchPayload,
          type: 'upgrade/set'
        });
        store.dispatch({
          payload: { isLoading: false },
          type: 'ui/setLoading'
        });
      });
    }
  }, []);

  useEffect(() => {
    !resetUpgradeChoices && setResetUpgradeChoices(cloneDeep(UpgradeChoices));
  }, [UpgradeChoices]);

  useEffect(() => {
    !resetUpgradeOrders && setResetUpgradeOrders(cloneDeep(UpgradeOrders));
  }, [UpgradeOrders]);

  const onSelect = (
    itemID: number | string,
    type: string,
    stateObject: RootState[keyof RootState],
    action: string,
    set: 'push' | 'replace' = 'replace',
    orderNum: number | undefined
  ) => {
    let currentChoices;
    if (set === 'push') {
      currentChoices = stateObject.slice();
      const currentOrders = cloneDeep(UpgradeOrders);

      if (currentChoices.includes(itemID)) {
        currentChoices.splice(currentChoices.indexOf(itemID), 1);
        delete currentOrders[itemID];
      } else {
        currentChoices.push(itemID);
        currentOrders[itemID] = orderNum;
      }

      store.dispatch({
        payload: { orders: currentOrders, upgradeChoices: currentChoices },
        type: 'upgradeChoices/set'
      });
    }
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
          upgradeChoices: upgradeChoicesPayload(UpgradeChoices, UpgradeOrders)
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
        setResetUpgradeChoices(cloneDeep(UpgradeChoices));
        setResetUpgradeOrders(cloneDeep(UpgradeOrders));
        openSnackbar('Upgrades choices updated');
        return respJson;
      } else {
        openSnackbar(respJson.message, 'error');
      }
    });
  };

  const onResetChoices = () => {
    store.dispatch({
      payload: { orders: resetUpgradeOrders, upgradeChoices: resetUpgradeChoices },
      type: 'upgradeChoices/set'
    });
  };

  const upgradesSetup: IUpgradesSetup[] = Object.keys(Upgrades).map((upgr: string) => {
    return {
      description: descriptions?.filter((d) => d.name === capitalize(upgr))[0]?.description || '',
      id: upgr,
      label: capitalize(upgr)
    };
  });

  useUnsaved({
    isUnsaved: isEdited,
    onConfirm: onResetChoices
  });

  return (
    <Layout
      title="Upgrades"
      actions={[
        { color: 'secondary', disabled: !isEdited, label: 'Reset', onClick: onResetChoices },
        { disabled: !isEdited, label: 'Save', onClick: onSaveChoices }
      ]}>
      {!isLoading ? (
        <TabbedCards
          tabsSetup={upgradesSetup}
          onSelect={onSelect}
          Filters={Filters}
          Content={Upgrades}
          SelectedContent={UpgradeChoices}
          SelectedOrders={UpgradeOrders}
          selectedContentKey="upgradeChoices"
          cardSpan={6}
          cardContentKeys={[{ id: 'description' }]}
          cardIconKeys={[{ Component: DietaryInfo, args: [{ key: 'diets', value: 'dietary' }], id: 'dietary' }]}
        />
      ) : (
        <></>
      )}
    </Layout>
  );
};

export default Upgrades;
