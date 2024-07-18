/* eslint-disable @typescript-eslint/no-explicit-any */
export type IDrinkChoices = Array<number>;

const initialState: IDrinkChoices = [];

const drinkChoicesReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'wedding/set':
    case 'drinkChoices/set':
      return action.payload.drinkChoices;
    case 'auth/logout':
      return initialState;
    default:
      return state;
  }
};

export default drinkChoicesReducer;
