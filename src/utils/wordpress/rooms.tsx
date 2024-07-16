import { IRoom, IRooms } from 'src/store/reducers/rooms';

import { WPPost } from 'src/types/wp-rest-api';

export type WPRooms = WPPost[];

export const formatRoomsResponse = (rooms: WPRooms): IRooms => {
  return rooms.map((item) => {
    const categories: string[] = item._embedded ? item._embedded['wp:term']?.map((catList) => catList.map((cat) => cat.name)).flat() : [];

    const newRoom: IRoom = {
      amenities: item.acf.amenities,
      beds: {
        bunkBeds: item.acf.beds.bunk_beds,
        doubleBeds: item.acf.beds.double_beds,
        singleBeds: item.acf.beds.single_beds
      },
      costCategory: item.acf.cost_category,
      costPerNight: item.acf.cost_per_night,
      id: item.id,
      location: categories,
      name: item.title.rendered
    };

    return newRoom;
  });
};
