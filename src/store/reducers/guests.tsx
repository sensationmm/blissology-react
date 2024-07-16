/* eslint-disable @typescript-eslint/no-explicit-any */

export type IGuestBreakdown = {
  adults: number;
  children: number;
  babies: number;
  total: number;
};
export type IGuests = {
  daytime: IGuestBreakdown;
  evening: IGuestBreakdown;
  total: number;
};

const initialState: IGuests = {} as IGuests;

const guestsReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'wedding/set':
    case 'guests/set':
      return {
        ...state,
        ...action.payload.guests
      };
    case 'guests/update': {
      const topLevel = state[action.payload.topLevel as keyof IGuests] as IGuestBreakdown;
      const delta = action.payload.change;
      const originalSubtotal = topLevel.total;
      const originalTotal = state.total;

      return {
        ...state,
        [action.payload.topLevel]: {
          ...topLevel,
          [action.payload.secondLevel]: action.payload.value,
          total: originalSubtotal + delta
        },
        total: originalTotal + delta
      };
    }
    case 'auth/logout':
      return initialState;
    default:
      return state;
  }
};

export default guestsReducer;
