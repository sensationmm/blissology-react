/* eslint-disable @typescript-eslint/no-explicit-any */
const initialState = {
  weddingID: undefined,
  weddingName: undefined,
  date: undefined,
  deadlines: []
};

const weddingReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'wedding/set':
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

export default weddingReducer;
