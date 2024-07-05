import { IMenu, IMenuItem } from 'src/store/reducers/menu';

import { IDiets } from 'src/components/DietaryInfo';

import { WPPost } from 'src/types/wp-rest-api';

export type WPChoice = {
  choice: number;
};

export type WPDiningChoices = WPPost[];

export const formatMenuItems = (menuItems: WPDiningChoices): IMenu => {
  const menuReception: IMenuItem[] = [];
  const menuEvening: IMenuItem[] = [];
  const menuDinnerStarter: IMenuItem[] = [];
  const menuDinnerMain: IMenuItem[] = [];
  const menuDinnerDessert: IMenuItem[] = [];

  menuItems.forEach((item) => {
    const categories: IMenuItem['category'] = item._embedded['wp:term'].map((catList) => catList.map((cat) => cat.name)).flat();
    const newMenuItem: IMenuItem = {
      category: categories,
      description: item.acf.description as string,
      dietary: item.acf.dietary_information as IDiets[],
      id: item.id,
      image: item.acf.image as string,
      name: item.title.rendered
    };

    if (categories.includes('Evening Menu')) {
      menuEvening.push(newMenuItem);
    } else if (categories.includes('Dinner Menu')) {
      if (categories.includes('Dessert')) {
        menuDinnerDessert.push(newMenuItem);
      } else if (categories.includes('Main Course')) {
        menuDinnerMain.push(newMenuItem);
      } else if (categories.includes('Starter')) {
        menuDinnerStarter.push(newMenuItem);
      }
    } else if (categories.includes('Canapes')) {
      menuReception.push(newMenuItem);
    }
  });

  return {
    dinner: {
      dessert: menuDinnerDessert,
      main: menuDinnerMain,
      starter: menuDinnerStarter
    },
    evening: menuEvening,
    reception: menuReception
  };
};
