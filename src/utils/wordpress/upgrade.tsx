import { IUpgradeItem, IUpgrades } from 'src/store/reducers/upgrades';

import { WPPost } from 'src/types/wp-rest-api';

export type WPUpgrades = WPPost[];

export const formatUpgradesResponse = (upgradeItems: WPUpgrades): IUpgrades => {
  const upgrades: IUpgrades = {};

  upgradeItems.forEach((item) => {
    const categories: string[] = item._embedded ? item._embedded['wp:term']?.map((catList) => catList.map((cat) => cat.name)).flat() : [];

    const newUpgradeItem: IUpgradeItem = {
      additionalUnit: {
        cost: item.acf.upgrades_additional_unit_cost.cost,
        unit: item.acf.upgrades_additional_unit_cost.unit
      },
      description: item.acf.upgrade_description,
      extraInfo: {
        name: item.acf.upgrades_extra_info.title,
        text: item.acf.upgrades_extra_info.text
      },
      id: item.id,
      image: item.acf.upgrades_image,
      minimumOrder: item.acf.upgrades_minimum_order,
      name: item.title.rendered,
      price: item.acf.upgrades_price,
      priceFor: {
        number: item.acf.upgrades_price_for.number,
        unit: item.acf.upgrades_price_for.unit
      },
      priceType: item.acf.upgrades_price_type,
      setupFee: item.acf.upgrades_setup_fee
    };

    categories.forEach((cat) => {
      const key = cat.split(' ').join('');
      if (Object.keys(upgrades).includes(key)) {
        upgrades[key] = upgrades[key].concat([newUpgradeItem]);
      } else {
        upgrades[key] = [newUpgradeItem];
      }
    });
  });

  return upgrades;
};
