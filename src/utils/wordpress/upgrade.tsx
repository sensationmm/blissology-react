import { IUpgradeItem, IUpgrades } from 'src/store/reducers/upgrades';

import { IDiets } from 'src/components/DietaryInfo';

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
      dietary: item.acf.dietary_information as IDiets[],
      extraInfo: {
        text: item.acf.upgrades_extra_info.text,
        title: item.acf.upgrades_extra_info.title
      },
      hasOptions: item.acf.has_options,
      hasOptionsPrices: item.acf.has_options_prices,
      id: item.id,
      image: item.acf.upgrades_image,
      isUpgrade: item.acf.is_upgrade,
      minimumOrder: {
        hasMinimum: item.acf.upgrade_minimum_order.type,
        num: item.acf.upgrade_minimum_order.num,
        percentage: item.acf.upgrade_minimum_order.percentage
      },
      name: item.title.rendered,
      options: item.acf.options || item.acf.options_prices,
      postType: 'upgrade',
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
