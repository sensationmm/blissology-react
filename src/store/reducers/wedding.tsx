/* eslint-disable @typescript-eslint/no-explicit-any */
export type IWeddingDeadline = {
  name: string;
  date: string;
  payment_deadline: boolean;
  attach_to: Array<string>;
};

export type IInvoiceEntry = {
  description: string;
  quantity: number;
  unitPrice: number;
};

export type IWeddingState = {
  customInvoiceEntries: IInvoiceEntry[];
  date: string | undefined;
  deadlines: IWeddingDeadline[];
  quoteLocked: boolean;
  weddingID: number | undefined;
  weddingName: string | undefined;
};

const initialState: IWeddingState = {
  customInvoiceEntries: [],
  date: undefined,
  deadlines: [],
  quoteLocked: false,
  weddingID: undefined,
  weddingName: undefined
};

const weddingReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'wedding/set':
      return {
        ...state,
        customInvoiceEntries: action.payload.customInvoiceEntries,
        date: action.payload.date,
        deadlines: action.payload.deadlines,
        quoteLocked: action.payload.quoteLocked,
        weddingID: action.payload.weddingID,
        weddingName: action.payload.weddingName
      };
    case 'auth/logout':
      return initialState;
    default:
      return state;
  }
};

export default weddingReducer;
