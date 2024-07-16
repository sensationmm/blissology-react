/* eslint-disable @typescript-eslint/no-explicit-any */

export type IPayment = {
  id: number | undefined;
  label: string;
  date: string;
  amount: number;
};

const initialState: IPayment[] = [] as IPayment[];

const paymentsReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'wedding/set':
    case 'payments/set':
      return Object.values(action.payload.payments) as IPayment[];
    case 'auth/logout':
      return initialState;
    default:
      return state;
  }
};

export default paymentsReducer;
