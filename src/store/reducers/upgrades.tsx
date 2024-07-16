/* eslint-disable @typescript-eslint/no-explicit-any */

export type IUpgradePriceType = 'pp' | 'set';

export type IUpgradeParams = {
  additionalUnit: {
    cost: number;
    unit: string;
  };
  isUpgrade: boolean;
  minimumOrder: {
    hasMinimum: 'none' | 'people' | 'percentage';
    num: number;
    percentage: number;
  };
  price: number;
  priceType: IUpgradePriceType;
  priceFor?: {
    number: number;
    unit: string;
  };
  setupFee: number;
};

export interface IUpgradeItem extends IUpgradeParams {
  name: string;
  description: string;
  extraInfo?: {
    title: string;
    text: string;
  };
  id: number;
  image: string;
}

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
