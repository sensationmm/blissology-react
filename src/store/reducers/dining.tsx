/* eslint-disable @typescript-eslint/no-explicit-any */
export type IDiningChoices = Array<number>;

export type IDining = {
  dessert: IDiningChoices;
  dinner: IDiningChoices;
  evening: IDiningChoices;
  main: IDiningChoices;
  reception: IDiningChoices;
  sides: IDiningChoices;
  starter: IDiningChoices;
};

const initialState: IDining = {
  dessert: [],
  dinner: [],
  evening: [],
  main: [],
  reception: [],
  sides: [],
  starter: []
};

const diningReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'dining/set':
      return action.payload;
    case 'dining/update': {
      return {
        ...state,
        [action.payload.type]: action.payload.choices
      };
    }
    case 'auth/logout':
      return initialState;
    default:
      return state;
  }
};

export default diningReducer;