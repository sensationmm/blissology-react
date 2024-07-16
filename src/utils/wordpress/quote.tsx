import { IGuests } from 'src/store/reducers/guests';
import { IQuoteConfig, IQuoteConfigItem, IQuotePackageItem } from 'src/store/reducers/quoteConfig';
import { IRoom, IRooms } from 'src/store/reducers/rooms';

import { currencyFormat, uniqueArrayObjects } from '../common';

type WPQuoteConfig = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

type WPPackageChoice = {
  package_description: string;
  package_cost: number;
  package_price_calculation: {
    guest_type: string;
    timeframe: string;
  };
  taxonomy: {
    term_id: string;
    name: string;
    slug: string;
  };
};

export const formatQuoteConfigResponse = (quoteConfig: WPQuoteConfig): IQuoteConfig => {
  const qc: IQuoteConfig = {
    packages: [],
    setFees: []
  };
  Object.keys(quoteConfig)
    .slice()
    .filter((key) => key.substring(0, 5) === 'quote')
    .forEach((configKey) => {
      if (Object.keys(quoteConfig[configKey]).length > 0) {
        Object.keys(quoteConfig[configKey])
          .filter((key) => key !== '')
          .forEach((key) => {
            if (Array.isArray(quoteConfig[configKey][key])) {
              quoteConfig[configKey][key] &&
                quoteConfig[configKey][key].forEach((item: WPQuoteConfig) => {
                  if (key === 'quote_set_fees') {
                    const parsedItem: IQuoteConfigItem = {
                      description: item.description,
                      unit_price: parseInt(item.unit_price as unknown as string)
                    };
                    qc.setFees.push(parsedItem);
                  } else if (key === 'packages') {
                    const parsedItem: IQuotePackageItem = {
                      choices: (item.package_choices || []).map((choice: WPPackageChoice) => ({
                        ...choice,
                        taxonomy: {
                          id: choice.taxonomy.term_id,
                          name: choice.taxonomy.name,
                          slug: choice.taxonomy.slug
                        }
                      })),
                      cost: item.package_cost,
                      description: item.package_description,
                      priceCalculation: item.package_price_calculation
                    };
                    qc.packages.push(parsedItem);
                  }
                });
            }
          });
      }
    });

  return qc;
};

const quoteTableData = (description: string, quantity: string, unitPrice: string, total: string) => {
  return { description, quantity, total, unitPrice };
};

export const generateQuote = (QuoteConfig: IQuoteConfig, Guests: IGuests, Rooms: IRooms) => {
  const items = [];
  let quoteTotal = 0;

  const addToTotal = (units: number, unitPrice: number) => {
    const valueToAdd = units * unitPrice;
    quoteTotal += valueToAdd;

    return valueToAdd;
  };

  // Base Fees
  QuoteConfig.setFees.forEach((fee: IQuoteConfigItem) => {
    const lineTotal = addToTotal(1, fee.unit_price);
    items.push(quoteTableData(fee.description, '1', currencyFormat(fee.unit_price), currencyFormat(lineTotal)));
  });

  // Menu Choices Package Check
  QuoteConfig.packages.forEach((packageItem: IQuotePackageItem) => {
    const quantity = Guests[packageItem.priceCalculation.timeframe][packageItem.priceCalculation.guest_type];
    const lineTotal = addToTotal(quantity, packageItem.cost);
    items.push(quoteTableData(packageItem.description, quantity.toString(), currencyFormat(packageItem.cost), currencyFormat(lineTotal)));
  });

  // TODO: user adds number of orders where necessary
  // Upgrades
  // const myUpgrades = Object.values(Upgrades)
  //   .flat()
  //   .filter((upgr) => UpgradeChoices.includes(upgr.id));
  // myUpgrades.forEach(());

  // Accommodation
  const roomBreakdown = Object.values(Rooms).map(({ costCategory, costPerNight }) => ({ costCategory, costPerNight }));
  const roomBreakdownCombined = uniqueArrayObjects(roomBreakdown) as IRooms;
  roomBreakdownCombined.map((rbc: IRoom) => {
    const stringified = JSON.stringify(rbc);
    const occurrences = roomBreakdown.filter((rb) => JSON.stringify(rb) === stringified).length;
    const lineTotal = addToTotal(occurrences, rbc.costPerNight);
    items.push(quoteTableData(rbc.costCategory as string, occurrences.toString(), currencyFormat(rbc.costPerNight), currencyFormat(lineTotal)));
  });

  items.push(quoteTableData('Invoice Total', '', '', currencyFormat(quoteTotal)));

  return items;
};
