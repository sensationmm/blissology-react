/* eslint-disable @typescript-eslint/no-explicit-any */

import { IDiets } from 'src/components/DietaryInfo';

import { IMenuItemPlating } from './menu';

export type IFilters = {
  diet: IDiets[];
  plating: IMenuItemPlating;
};

const initialState: IFilters = {
  diet: [] as IDiets[],
  plating: 'plated'
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
