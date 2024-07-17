import { IOrders } from 'src/store/reducers/orders';
import { IUpgradeChoices } from 'src/store/reducers/upgradeChoices';

import { WPChoice } from 'src/types/wp-rest-api';

export type WPUpgradeChoices = WPChoice[];

export const formatUpgradeChoicesResponse = (upgrades: WPUpgradeChoices): IUpgradeChoices => {
  return upgrades?.map((choices) => choices.choice) || [];
};

export const formatUpgradeOrdersResponse = (upgrades: WPUpgradeChoices): IOrders => {
  const orderObject: IOrders = {};
  upgrades?.forEach((choices) => {
    if (!['', undefined].includes(choices?.order as unknown as string)) {
      orderObject[choices.choice] = choices.order as number;
    }
  });

  return orderObject;
};

export const upgradeChoicesPayload = (upgrades: IUpgradeChoices, orders: IOrders): WPUpgradeChoices => {
  return upgrades?.map((choice) => {
    const order = orders[choice];
    return { choice: choice, order: order };
  });
};
