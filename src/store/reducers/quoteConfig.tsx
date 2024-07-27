/* eslint-disable @typescript-eslint/no-explicit-any */

import { IGuestBreakdown, IGuests } from './guests';

export type IQuoteConfigItem = {
  description: string;
  unit_price: number;
};

export type IQuotePackageChoiceItem = {
  name: string;
  taxonomy: {
    id: number;
    name: string;
    slug: string;
  };
  minimum: number;
  maximum: number;
  additional_allowed: boolean;
  additional_cost: number;
};

export type IQuotePackageItem = {
  description: string;
  cost: number;
  choices: IQuotePackageChoiceItem[];
  priceCalculation: {
    guest_type: keyof Omit<IGuestBreakdown, 'total'>;
    timeframe: keyof Omit<IGuests, 'total'>;
  };
};

export type IQuoteConfig = {
  drinksPackages: IQuotePackageItem[];
  packages: IQuotePackageItem[];
  setFees: IQuoteConfigItem[];
};

const initialState: IQuoteConfig = {
  drinksPackages: [],
  packages: [],
  setFees: []
};

const quoteConfigReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'quoteConfig/update':
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

export default quoteConfigReducer;
