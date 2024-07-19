/* eslint-disable @typescript-eslint/no-explicit-any */

import { IDiets } from 'src/components/DietaryInfo';
import { IDrinkType, IWineType } from 'src/components/DrinksInfo';

import { IMenuItemPlating } from './menu';

export type IFilters = {
  diet: IDiets[];
  plating: IMenuItemPlating;
  drinkType: 'all' | IDrinkType;
  wineType: 'all' | IWineType;
};

const initialState: IFilters = {
  diet: [] as IDiets[],
  drinkType: 'all',
  plating: 'plated',
  wineType: 'all'
};

const filtersReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'filters/update':
      return {
        ...state,
        [action.payload.type]: action.payload.choices
      };
    case 'auth/logout':
      return initialState;
    default:
      return state;
  }
};

export default filtersReducer;
