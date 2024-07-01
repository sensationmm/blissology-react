/* eslint-disable @typescript-eslint/no-explicit-any */
const initialState = {
  isLoading: false,
  menuOpen: true
};

const uiReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'ui/setLoading':
      return {
        ...state,
        ...action.payload,
        isLoading: action.payload.isLoading
      };
    case 'ui/toggleMenu':
      return {
        ...state,
        menuOpen: !state.menuOpen
      };
    case 'auth/login':
      return { ...state, menuOpen: true };
    case 'auth/logout':
      return { ...initialState, menuOpen: false };
    default:
      return state;
  }
};

export default uiReducer;
