/* eslint-disable @typescript-eslint/no-explicit-any */
export type IDiningChoices = Array<number>;

export type IDining = {
  dessert: IDiningChoices;
  starter: IDiningChoices;
  main: IDiningChoices;
  dinner: IDiningChoices;
  evening: IDiningChoices;
  reception: IDiningChoices;
};

const initialState: IDining = {
  dessert: [],
  dinner: [],
  evening: [],
  main: [],
  reception: [],
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
