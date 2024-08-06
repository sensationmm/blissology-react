/* eslint-disable @typescript-eslint/no-explicit-any */
export type IOrders = {
  [key: number]: { num: number; opt?: string };
};

const initialState: IOrders = {};

const ordersReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'wedding/set':
    case 'upgradeChoices/set':
      return {
        ...action.payload.orders
      };
    case 'auth/logout':
      return initialState;
    default:
      return state;
  }
};

export default ordersReducer;
