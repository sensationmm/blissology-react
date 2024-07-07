import { IDining } from 'src/store/reducers/dining';

export type WPChoice = {
  choice: number;
};

export type WPDiningChoices = {
  evening: WPChoice[];
  reception: WPChoice[];
  dinner: {
    dessert: WPChoice[];
    main: WPChoice[];
    starter: WPChoice[];
  };
  kids: {
    dessert: WPChoice[];
    main: WPChoice[];
    reception: WPChoice[];
    starter: WPChoice[];
  };
};

export const formatDiningChoicesResponse = (dining: WPDiningChoices): IDining => {
  return {
    dessert: dining.dinner?.dessert?.map((choices) => choices.choice) || [],
    dinner: dining.dinner?.main?.map((choices) => choices.choice) || [],
    evening: dining.evening?.map((choices) => choices.choice) || [],
    main: dining.dinner?.main?.map((choices) => choices.choice) || [],
    reception: dining.reception?.map((choices) => choices.choice) || [],
    starter: dining.dinner?.starter?.map((choices) => choices.choice) || []
  };
};

export const diningChoicesPayload = (dining: IDining): WPDiningChoices => {
  return {
    dinner: {
      dessert: dining.dessert.map((choice) => ({ choice: choice })),
      main: dining.main.map((choice) => ({ choice: choice })),
      starter: dining.starter.map((choice) => ({ choice: choice }))
    },
    evening: dining.evening.map((choice) => ({ choice: choice })),
    kids: {
      dessert: dining.dessert.map((choice) => ({ choice: choice })),
      main: dining.main.map((choice) => ({ choice: choice })),
      reception: dining.reception.map((choice) => ({ choice: choice })),
      starter: dining.starter.map((choice) => ({ choice: choice }))
    },
    reception: dining.reception.map((choice) => ({ choice: choice }))
  };
};
