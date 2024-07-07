import { IDiets } from 'src/components/DietaryInfo';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type IMenuItem = {
  id: number;
  category: Array<string>;
  dietary: IDiets[];
  description: string;
  name: string;
  image: string;
  plating: string;
};

export type IMenu = {
  dinner: {
    dessert: IMenuItem[];
    main: IMenuItem[];
    starter: IMenuItem[];
  };
  evening: IMenuItem[];
  kids: {
    dessert: IMenuItem[];
    main: IMenuItem[];
    reception: IMenuItem[];
    starter: IMenuItem[];
  };
  reception: IMenuItem[];
};

export const initialState: IMenu = {
  dinner: {
    dessert: [],
    main: [],
    starter: []
  },
  evening: [],
  kids: {
    dessert: [],
    main: [],
    reception: [],
    starter: []
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
