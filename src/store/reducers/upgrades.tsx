/* eslint-disable @typescript-eslint/no-explicit-any */

import { IDiets } from 'src/components/DietaryInfo';

export type IUpgradePriceType = 'pp' | 'set';

export type IUpgradeParams = {
  additionalUnit: {
    cost: number;
    unit: string;
  };
  dietary: IDiets[];
  isUpgrade: boolean;
  minimumOrder: {
    hasMinimum: 'none' | 'people' | 'percentage';
    num: number;
    percentage: number;
  };
  price: string;
  priceType: IUpgradePriceType;
  priceFor?: {
    number: number;
    unit: string;
  };
  setupFee: string;
  hasOptions: boolean;
  hasOptionsPrices: boolean;
  options?: IUpgradeItemOptions[];
};

export type IUpgradeItemOptions = {
  option: string;
  price?: string;
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
  postType: string;
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
