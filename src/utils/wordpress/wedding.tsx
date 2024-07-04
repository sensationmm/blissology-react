import { IGuests } from 'src/store/reducers/guests';

export type WPWeddingGuests = {
  guests_daytime: {
    guests_daytime_adults: number;
    guests_daytime_children: number;
    guests_daytime_babies: number;
  };
  guests_evening: {
    guests_evening_adults: number;
    guests_evening_children: number;
    guests_evening_babies: number;
  };
};

export const formatWeddingGuestsResponse = (guests: WPWeddingGuests): IGuests => {
  const totalDaytime = guests.guests_daytime.guests_daytime_adults + guests.guests_daytime.guests_daytime_children + guests.guests_daytime.guests_daytime_babies;
  const totalEvening = guests.guests_evening.guests_evening_adults + guests.guests_evening.guests_evening_children + guests.guests_evening.guests_evening_babies;

  return {
    daytime: {
      adults: guests.guests_daytime.guests_daytime_adults,
      babies: guests.guests_daytime.guests_daytime_babies,
      children: guests.guests_daytime.guests_daytime_children,
      total: totalDaytime
    },
    evening: {
      adults: guests.guests_evening.guests_evening_adults,
      babies: guests.guests_evening.guests_evening_babies,
      children: guests.guests_evening.guests_evening_children,
      total: totalEvening
    },
    total: totalDaytime + totalEvening
  };
};

export const weddingGuestsPayload = (guests: IGuests): WPWeddingGuests => {
  return {
    guests_daytime: {
      guests_daytime_adults: guests.daytime.adults,
      guests_daytime_babies: guests.daytime.babies,
      guests_daytime_children: guests.daytime.children
    },
    guests_evening: {
      guests_evening_adults: guests.evening.adults,
      guests_evening_babies: guests.evening.babies,
      guests_evening_children: guests.evening.children
    }
  };
};
