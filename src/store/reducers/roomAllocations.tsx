/* eslint-disable @typescript-eslint/no-explicit-any */

export type IRoomAllocation = {
  id: number | undefined;
  contact_email: string;
  contact_number: string;
  guest_name: string;
  payment: 'invoice' | 'guest';
  room_id: number;
};

const initialState: IRoomAllocation[] = [] as IRoomAllocation[];

const roomAllocationsReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'wedding/set':
    case 'roomAllocations/set':
      return Object.values(action.payload.roomAllocations) as IRoomAllocation[];
    case 'roomAllocations/update': {
      const allocation = state[action.payload.id];

      return {
        ...state,
        [action.payload.id]: {
          ...allocation,
          [action.payload.key]: action.payload.value
        }
      };
    }
    case 'auth/logout':
      return initialState;
    default:
      return state;
  }
};

export default roomAllocationsReducer;
