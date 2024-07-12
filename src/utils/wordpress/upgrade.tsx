import { IUpgradeItem, IUpgrades } from 'src/store/reducers/upgrades';

import { WPPost } from 'src/types/wp-rest-api';

export type WPUpgrades = WPPost[];

export const formatUpgradesResponse = (upgradeItems: WPUpgrades): IUpgrades => {
  const upgrades: IUpgrades = {};

  upgradeItems.forEach((item) => {
    const categories: string[] = item._embedded ? item._embedded['wp:term']?.map((catList) => catList.map((cat) => cat.name)).flat() : [];

    const newUpgradeItem: IUpgradeItem = {
      additionalUnit: {
        cost: item.acf.upgrade_additional_unit_cost.cost,
        unit: item.acf.upgrade_additional_unit_cost.unit
      },
      description: item.acf.upgrade_description,
      extraInfo: {
        text: item.acf.upgrades_extra_info.text,
        title: item.acf.upgrades_extra_info.title
      },
      id: item.id,
      image: item.acf.upgrades_image,
      isUpgrade: item.acf.is_upgrade,
      minimumOrder: {
        num: item.acf.upgrade_minimum_order_num,
        percentage: item.acf.upgrade_minimum_order_percentage
      },
      name: item.title.rendered,
      price: item.acf.upgrade_price,
      priceFor: {
        number: item.acf.upgrade_price_for.number,
        unit: item.acf.upgrade_price_for.unit
      },
      priceType: item.acf.upgrade_price_type,
      setupFee: item.acf.upgrade_setup_fee
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
