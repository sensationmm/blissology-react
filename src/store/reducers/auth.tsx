/* eslint-disable @typescript-eslint/no-explicit-any */
const initialState = {
  isLoggedIn: false,
  userID: undefined,
  userName: undefined
};

const authReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'auth/login':
      return {
        ...state,
        isLoggedIn: true,
        ...action.payload
      };
    case 'auth/setIsLoggedIn':
      return {
        ...state,
        isLoggedIn: true
      };
    case 'auth/setUserID':
      return {
        ...state,
        userID: action.payload.userID
      };
    case 'auth/setUserName':
      return {
        ...state,
        userName: action.payload.userName,
        isLoggedIn: true,
        token: action.payload.token
      };
    case 'auth/logout':
      return initialState;
    default:
      return state;
  }
};

export default authReducer;
