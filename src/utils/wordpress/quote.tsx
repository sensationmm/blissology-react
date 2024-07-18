import { IQuoteConfig, IQuoteConfigItem, IQuotePackageItem } from 'src/store/reducers/quoteConfig';

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
