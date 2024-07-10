/* eslint-disable @typescript-eslint/no-explicit-any */
export type IMenuChoiceItem = Array<number>;

export type IMenuChoices = {
  dessert: IMenuChoiceItem;
  dinner: IMenuChoiceItem;
  evening: IMenuChoiceItem;
  main: IMenuChoiceItem;
  reception: IMenuChoiceItem;
  sides: IMenuChoiceItem;
  starter: IMenuChoiceItem;
};

const initialState: IMenuChoices = {
  dessert: [],
  dinner: [],
  evening: [],
  main: [],
  reception: [],
  sides: [],
  starter: []
};

const menuChoicesReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'menuChoices/set':
      return action.payload;
    case 'menuChoices/update': {
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

export default menuChoicesReducer;
