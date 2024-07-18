import { IDrinks, IDrinksItem } from 'src/store/reducers/drinks';

import { WPPost } from 'src/types/wp-rest-api';

export type WPDrinks = WPPost[];

export const formatDrinksResponse = (drinkItems: WPDrinks): IDrinks => {
  const drinks: IDrinks = {};

  drinkItems.forEach((item) => {
    const categories: string[] = item._embedded ? item._embedded['wp:term']?.map((catList) => catList.map((cat) => cat.name)).flat() : [];

    const newDrinksItem: IDrinksItem = {
      description: item.acf.upgrade_description,
      drinkType: item.acf.drink_type,
      id: item.id,
      name: item.title.rendered,
      origin: item.acf.origin,
      postType: 'drink',
      wineType: item.acf.wine_type
    };

    categories.forEach((cat) => {
      const key = cat.split(' ').join('');
      if (Object.keys(drinks).includes(key)) {
        drinks[key] = drinks[key].concat([newDrinksItem]);
      } else {
        drinks[key] = [newDrinksItem];
      }
    });
  });

  return drinks;
};
