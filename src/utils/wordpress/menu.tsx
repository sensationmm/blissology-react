import { IMenu, IMenuItem, IMenuItemPlating } from 'src/store/reducers/menu';

import { IDiets } from 'src/components/DietaryInfo';

import { WPPost } from 'src/types/wp-rest-api';

export type WPMenuChoices = WPPost[];

export const formatMenuItems = (menuItems: WPMenuChoices): IMenu => {
  const menuReception: IMenuItem[] = [];
  const menuEvening: IMenuItem[] = [];
  const menuDinnerStarter: IMenuItem[] = [];
  const menuDinnerMain: IMenuItem[] = [];
  const menuDinnerSides: IMenuItem[] = [];
  const menuDinnerDessert: IMenuItem[] = [];
  const menuKidsStarter: IMenuItem[] = [];
  const menuKidsMain: IMenuItem[] = [];
  const menuKidsDessert: IMenuItem[] = [];
  const menuKidsReception: IMenuItem[] = [];

  menuItems.forEach((item) => {
    const categoryIds: Array<number> = [];
    const categories: IMenuItem['category'] = item._embedded
      ? item._embedded['wp:term']
          ?.map((catList) =>
            catList.map((cat) => {
              categoryIds.push(cat.id);
              return cat.name;
            })
          )
          .flat()
      : [];

    const newMenuItem: IMenuItem = {
      category: categories,
      description: item.acf.description as string,
      dietary: item.acf.dietary_information as IDiets[],
      id: item.id,
      image: item.acf.image as string,
      name: item.title.rendered,
      packageIds: categoryIds,
      plating: item.acf.plating_type as IMenuItemPlating,
      postType: 'menuItem',
      upcharge: item.acf.upcharge
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
      } else if (categories.includes('Side Dishes')) {
        menuDinnerSides.push(newMenuItem);
      }
    } else if (categories.includes('Canapes')) {
      menuReception.push(newMenuItem);
    } else if (categories.includes('Kids Menu')) {
      if (categories.includes('Dessert')) {
        menuKidsDessert.push(newMenuItem);
      } else if (categories.includes('Main Course')) {
        menuKidsMain.push(newMenuItem);
      } else if (categories.includes('Starter')) {
        menuKidsStarter.push(newMenuItem);
      } else if (categories.includes('Reception')) {
        menuKidsReception.push(newMenuItem);
      }
    }
  });

  return {
    dinner: {
      dessert: menuDinnerDessert,
      main: menuDinnerMain,
      sides: menuDinnerSides,
      starter: menuDinnerStarter
    },
    evening: menuEvening,
    kids: {
      kidsDessert: menuKidsDessert,
      kidsMain: menuKidsMain,
      kidsReception: menuKidsReception,
      kidsStarter: menuKidsStarter
    },
    reception: menuReception
  };
};
