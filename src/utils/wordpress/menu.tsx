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
    const categories: IMenuItem['category'] = item._embedded ? item._embedded['wp:term']?.map((catList) => catList.map((cat) => cat.name)).flat() : [];
    const newMenuItem: IMenuItem = {
      additionalUnit: {
        cost: item.acf.upgrade_additional_unit_cost.cost,
        unit: item.acf.upgrade_additional_unit_cost.unit
      },
      category: categories,
      description: item.acf.description as string,
      dietary: item.acf.dietary_information as IDiets[],
      id: item.id,
      image: item.acf.image as string,
      isUpgrade: item.acf.is_upgrade,
      minimumOrder: {
        hasMinimum: item.acf.upgrade_minimum_order.type,
        num: item.acf.upgrade_minimum_order_num,
        percentage: item.acf.upgrade_minimum_order_percentage
      },
      name: item.title.rendered,
      plating: item.acf.plating_type as IMenuItemPlating,
      price: item.acf.upgrade_price,
      priceFor: {
        number: item.acf.upgrade_price_for.number,
        unit: item.acf.upgrade_price_for.unit
      },
      priceType: item.acf.upgrade_price_type,
      setupFee: item.acf.upgrade_setup_fee
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
      } else if (categories.includes('Sides')) {
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
