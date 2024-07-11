/* eslint-disable @typescript-eslint/no-explicit-any */

export type IUpgradePriceType = 'pp' | 'set';

export type IUpgradeItem = {
  name: string;
  description: string;
  extraInfo?: {
    name: string;
    text: string;
  };
  id: number;
  image: string;
  setupFee: number;
  price: number;
  priceType: IUpgradePriceType;
  minimumOrder: number;
  priceFor?: {
    number: number;
    unit: string;
  };
  additionalUnit: {
    cost: number;
    unit: string;
  };
};

export type IUpgrades = {
  [key: string]: IUpgradeItem[];
};

export const initialState: IUpgrades = {};

const upgradeReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'upgrade/set':
      return {
        ...state,
        ...action.payload
      };
    case 'auth/logout':
      return initialState;
    default:
      return state;
  }
};

export default upgradeReducer;
