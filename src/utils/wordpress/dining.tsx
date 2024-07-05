import { IDining } from 'src/store/reducers/dining';

export type WPChoice = {
  choice: number;
};

export type WPDiningChoices = {
  reception_canapes: WPChoice[];
};

export const formatDiningChoicesResponse = (dining: WPDiningChoices): IDining => {
  return {
    dessert: [],
    dinner: [],
    evening: [],
    main: [],
    reception: dining.reception_canapes.map((choices) => choices.choice),
    starter: []
  };
};
