import { IMenuChoices } from 'src/store/reducers/menuChoices';

import { WPChoice } from 'src/types/wp-rest-api';

export type WPMenuChoices = {
  evening: WPChoice[];
  reception: WPChoice[];
  dinner: {
    dessert: WPChoice[];
    main: WPChoice[];
    sides: WPChoice[];
    starter: WPChoice[];
  };
  kids: {
    dessert: WPChoice[];
    main: WPChoice[];
    reception: WPChoice[];
    starter: WPChoice[];
  };
};

export const formatMenuChoicesResponse = (menuChoices: WPMenuChoices): IMenuChoices => {
  return {
    dessert: menuChoices.dinner?.dessert?.map((choices) => choices.choice) || [],
    dinner: menuChoices.dinner?.main?.map((choices) => choices.choice) || [],
    evening: menuChoices.evening?.map((choices) => choices.choice) || [],
    main: menuChoices.dinner?.main?.map((choices) => choices.choice) || [],
    reception: menuChoices.reception?.map((choices) => choices.choice) || [],
    sides: menuChoices.dinner?.sides?.map((choices) => choices.choice) || [],
    starter: menuChoices.dinner?.starter?.map((choices) => choices.choice) || []
  };
};

export const menuChoicesPayload = (menuChoices: IMenuChoices): WPMenuChoices => {
  return {
    dinner: {
      dessert: menuChoices.dessert.map((choice) => ({ choice: choice })),
      main: menuChoices.main.map((choice) => ({ choice: choice })),
      sides: menuChoices.sides.map((choice) => ({ choice: choice })),
      starter: menuChoices.starter.map((choice) => ({ choice: choice }))
    },
    evening: menuChoices.evening.map((choice) => ({ choice: choice })),
    kids: {
      dessert: menuChoices.dessert.map((choice) => ({ choice: choice })),
      main: menuChoices.main.map((choice) => ({ choice: choice })),
      reception: menuChoices.reception.map((choice) => ({ choice: choice })),
      starter: menuChoices.starter.map((choice) => ({ choice: choice }))
    },
    reception: menuChoices.reception.map((choice) => ({ choice: choice }))
  };
};
