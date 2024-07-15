import { IQuoteConfig, IQuoteConfigItem, IQuotePackageItem } from 'src/store/reducers/quoteConfig';

import { currencyFormat } from '../common';

type WPQuoteConfig = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
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
                      choices: item.package_choices,
                      cost: item.package_cost,
                      description: item.package_description
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

export const generateQuote = (quoteConfig: IQuoteConfig) => {
  const items = [];
  let quoteTotal = 0;

  quoteConfig.setFees.forEach((fee: IQuoteConfigItem) => {
    quoteTotal += fee.unit_price;
    items.push(quoteTableData(fee.description, '1', currencyFormat(fee.unit_price), currencyFormat(fee.unit_price)));
  });

  items.push(quoteTableData('Invoice Total', '', '', currencyFormat(quoteTotal)));

  return items;
};
