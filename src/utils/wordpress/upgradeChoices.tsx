import { IUpgradeChoices } from 'src/store/reducers/upgradeChoices';

import { WPChoice } from 'src/types/wp-rest-api';

export type WPUpgradeChoices = WPChoice[];

export const formatUpgradeChoicesResponse = (upgrades: WPUpgradeChoices): IUpgradeChoices => {
  return upgrades?.map((choices) => choices.choice) || [];
};

export const upgradeChoicesPayload = (upgrades: IUpgradeChoices): WPUpgradeChoices => {
  return upgrades?.map((choice) => ({ choice: choice }));
};
