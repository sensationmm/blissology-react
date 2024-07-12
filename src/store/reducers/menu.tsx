/* eslint-disable @typescript-eslint/no-explicit-any */
import { IDiets } from 'src/components/DietaryInfo';

import { IUpgradeParams } from './upgrades';

export type IMenuItemPlating = 'plated' | 'feasting';

export interface IMenuItem extends IUpgradeParams {
  id: number;
  category: Array<string>;
  dietary: IDiets[];
  description: string;
  name: string;
  image: string;
  plating: IMenuItemPlating;
}

export type IMenu = {
  dinner: {
    dessert: IMenuItem[];
    main: IMenuItem[];
    sides: IMenuItem[];
    starter: IMenuItem[];
  };
  evening: IMenuItem[];
  kids: {
    kidsDessert: IMenuItem[];
    kidsMain: IMenuItem[];
    kidsReception: IMenuItem[];
    kidsStarter: IMenuItem[];
  };
  reception: IMenuItem[];
};

export const initialState: IMenu = {
  dinner: {
    dessert: [],
    main: [],
    sides: [],
    starter: []
  },
  evening: [],
  kids: {
    kidsDessert: [],
    kidsMain: [],
    kidsReception: [],
    kidsStarter: []
  },
  reception: []
};

const menuReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'menu/set':
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

export default menuReducer;
