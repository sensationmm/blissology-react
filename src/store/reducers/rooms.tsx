/* eslint-disable @typescript-eslint/no-explicit-any */

export type IRoom = {
  amenities: Array<string>;
  beds: {
    bunkBeds: number;
    doubleBeds: number;
    singleBeds: number;
  };
  costCategory: string;
  costPerNight: number;
  id: number;
  location: Array<string>;
  name: string;
};

export type IRooms = IRoom[];

export const initialState: IRooms = [];

const roomsReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'rooms/set':
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

export default roomsReducer;
