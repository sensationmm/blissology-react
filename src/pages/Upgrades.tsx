import { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import { useSelector } from 'react-redux';

import store, { RootState } from 'src/store';
import { IFilters } from 'src/store/reducers/filters';
import { initialState as emptyUpgradesState } from 'src/store/reducers/upgrades';

import { wpRestApiHandler } from 'src/api/wordpress';

import Layout from 'src/components/Layout/Layout';
import TabbedCards from 'src/components/TabbedCards';

import { useSnackbar } from 'src/hooks/useSnackbar';
import { useUnsaved } from 'src/hooks/useUnsaved';
import { capitalize } from 'src/utils/common';
import { formatUpgradesResponse } from 'src/utils/wordpress/upgrade';
import { upgradeChoicesPayload } from 'src/utils/wordpress/upgradeChoices';

type IUpgradesSetup = {
  id: string;
  label: string;
};

const Upgrades = () => {
  const authState = (state: RootState['auth']) => state.auth;
  const { token } = useSelector(authState);
  const upgradesState = (state: RootState['upgrades']) => state.upgrades;
  const Upgrades = useSelector(upgradesState);
  const upgradeChoicesState = (state: RootState['upgradeChoices']) => state.upgradeChoices;
  const UpgradeChoices = useSelector(upgradeChoicesState);
  const filtersState = (state: RootState) => state.filters;
  const Filters: IFilters = useSelector(filtersState);
  const uiState = (state: RootState['ui']) => state.ui;
  const { isLoading } = useSelector(uiState);
  const weddingState = (state: RootState['wedding']) => state.wedding;
  const { weddingID } = useSelector(weddingState);

  const [resetUpgradeChoices, setResetUpgradeChoices] = useState<RootState['upgradeChoices']>();
  const [openSnackbar] = useSnackbar();

  const isEdited = JSON.stringify(UpgradeChoices) !== JSON.stringify(resetUpgradeChoices);

  useEffect(() => {
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

  const onSelect = (itemID: number | string, type: string, stateObject: RootState[keyof RootState]) => {
    const currentChoices = stateObject.slice();
    if (currentChoices.includes(itemID)) {
      currentChoices.splice(currentChoices.indexOf(itemID), 1);
    } else {
      currentChoices.push(itemID);
    }

    store.dispatch({
      payload: currentChoices,
      type: 'upgradeChoices/set'
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
          upgradeChoices: upgradeChoicesPayload(UpgradeChoices)
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
        openSnackbar('Upgrades choices updated');
        return respJson;
      } else {
        openSnackbar(respJson.message, 'error');
      }
    });
  };

  const onResetChoices = () => {
    store.dispatch({
      payload: resetUpgradeChoices,
      type: 'upgradeChoices/set'
    });
  };

  const upgradesSetup: IUpgradesSetup[] = Object.keys(Upgrades).map((upgr: string) => ({ id: upgr, label: capitalize(upgr) }));

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
          selectedContentKey="upgradeChoices"
          cardSpan={6}
          cardContentKeys={[{ id: 'description' }]}
        />
      ) : (
        <></>
      )}
    </Layout>
  );
};

export default Upgrades;
