/* eslint-disable @typescript-eslint/no-explicit-any */
export type IWeddingDeadline = {
  name: string;
  date: string;
  payment_deadline: boolean;
  attach_to: Array<string>;
};

export type IWeddingState = {
  weddingID: number | undefined;
  weddingName: string | undefined;
  date: string | undefined;
  deadlines: IWeddingDeadline[];
};

const initialState: IWeddingState = {
  date: undefined,
  deadlines: [],
  weddingID: undefined,
  weddingName: undefined
};

const weddingReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'wedding/set':
      return {
        ...state,
        date: action.payload.date,
        deadlines: action.payload.deadlines,
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
