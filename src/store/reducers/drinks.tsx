/* eslint-disable @typescript-eslint/no-explicit-any */

import { IDrinkType, IWineType } from 'src/components/DrinksInfo';

export interface IDrinksItem {
  id: number;
  description: string;
  drinkType: IDrinkType;
  name: string;
  origin: string;
  packageIds: Array<number>;
  postType: string;
  wineType?: IWineType;
}

export type IDrinks = {
  [key: string]: IDrinksItem[];
};

export const initialState: IDrinks = {};

const drinksReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'drinks/set':
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

export default drinksReducer;
