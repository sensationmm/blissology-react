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
