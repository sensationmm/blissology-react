import { IDrinkChoices } from 'src/store/reducers/drinkChoices';

import { WPChoice } from 'src/types/wp-rest-api';

export type WPDrinkChoices = WPChoice[];

export const formatDrinkChoicesResponse = (drinks: WPDrinkChoices): IDrinkChoices => {
  return drinks?.map((choices) => choices.choice) || [];
};

export const drinkChoicesPayload = (drinks: IDrinkChoices): WPDrinkChoices => {
  return drinks?.map((choice) => {
    return { choice: choice };
  });
};
