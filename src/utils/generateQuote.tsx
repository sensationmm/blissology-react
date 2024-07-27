import { IDrinkChoices } from 'src/store/reducers/drinkChoices';
import { IDrinks } from 'src/store/reducers/drinks';
import { IGuests } from 'src/store/reducers/guests';
import { IOrders } from 'src/store/reducers/orders';
import { IPayment } from 'src/store/reducers/payments';
import { IQuoteConfig, IQuoteConfigItem, IQuotePackageItem } from 'src/store/reducers/quoteConfig';
import { IRoom, IRooms } from 'src/store/reducers/rooms';
import { IUpgradeChoices } from 'src/store/reducers/upgradeChoices';
import { IUpgrades } from 'src/store/reducers/upgrades';

import { blissDate, currencyFormat, uniqueArrayObjects } from './common';

const quoteTableData = (description: string, quantity: string, unitPrice: string, total: string) => {
  return { description, quantity, total, unitPrice };
};

export const generateQuote = (
  QuoteConfig: IQuoteConfig,
  Drinks: IDrinks,
  DrinksChoices: IDrinkChoices,
  Guests: IGuests,
  Orders: IOrders,
  Payments: IPayment[],
  Rooms: IRooms,
  Upgrades: IUpgrades,
  UpgradeChoices: IUpgradeChoices
) => {
  const items = [];
  const issues: Array<string> = [];
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

  // Food Package
  QuoteConfig.packages.forEach((packageItem: IQuotePackageItem) => {
    const quantity = Guests[packageItem.priceCalculation.timeframe][packageItem.priceCalculation.guest_type];
    const lineTotal = addToTotal(quantity, packageItem.cost);
    items.push(quoteTableData(packageItem.description, quantity.toString(), currencyFormat(packageItem.cost), currencyFormat(lineTotal)));
  });

  const hasChosenDrinks = (listToCheck: Array<number>) => {
    const packageDrinkIds = Object.values(Drinks)
      .flat()
      .filter((drink) => drink.packageIds.some((d) => listToCheck.includes(d)))
      .map((drink) => drink.id);

    return packageDrinkIds.filter((value) => DrinksChoices.includes(value));
  };

  // Drinks Package
  if (QuoteConfig?.drinksPackages.length > 0) {
    let drinksPackage: IQuotePackageItem = {} as IQuotePackageItem;
    let packagesPickedFrom = 0;
    QuoteConfig.drinksPackages
      .slice()
      .reverse()
      .forEach((packageItem: IQuotePackageItem) => {
        const packageConfig = packageItem.choices.map(({ taxonomy, ...rest }) => ({ categoryId: taxonomy.id, ...rest }));
        const packageCategoryIds = packageConfig.map((pkg) => pkg.categoryId);

        const chosenPackageDrinks = hasChosenDrinks(packageCategoryIds);

        if (chosenPackageDrinks.length > 0) {
          packagesPickedFrom++;
          drinksPackage = packageItem;
        }
      });

    if (Object.keys(drinksPackage).length > 0) {
      const quantity = Guests[drinksPackage.priceCalculation.timeframe][drinksPackage.priceCalculation.guest_type];
      const lineTotal = addToTotal(quantity, drinksPackage.cost);
      items.push(quoteTableData(drinksPackage.description, quantity.toString(), currencyFormat(drinksPackage.cost), currencyFormat(lineTotal)));

      drinksPackage.choices.forEach((choice) => {
        const numChosenDrinks = hasChosenDrinks([choice.taxonomy.id]).length;
        if (numChosenDrinks > choice.maximum) {
          if (!choice.additional_allowed) {
            issues.push(`You have picked too many ${choice.name} in your drinks package - the maximum is ${choice.maximum} and you have chosen ${numChosenDrinks}`);
          } else {
            const numExtra = numChosenDrinks - choice.maximum;
            const lineTotal = addToTotal(numExtra, choice.additional_cost);
            items.push(quoteTableData('Extra Drinks Package choices', numExtra.toString(), currencyFormat(choice.additional_cost), currencyFormat(lineTotal)));
          }
        } else if (numChosenDrinks < choice.minimum) {
          issues.push(`You have not picked enough ${choice.name} in your drinks package - the minimum is ${choice.minimum} and you have chosen ${numChosenDrinks}`);
        }

        if (packagesPickedFrom > 1) {
          issues.push(`You have picked wines from more than one drinks package - this may incur an extra charge`);
        }
      });
    } else {
      issues.push(`You haven't chosen your Drinks Package options`);
    }
  }

  // Upgrades
  const myChoices = UpgradeChoices.slice().flat();
  const myUpgrades = Object.values(Upgrades)
    .flat()
    .filter((upgrade) => myChoices.includes(upgrade.id));
  myUpgrades.forEach((upgrade) => {
    let quantity = Orders[upgrade.id];
    if (upgrade.minimumOrder.hasMinimum === 'percentage') {
      quantity = Math.round((quantity * Guests.daytime.adults) / 100);
    }
    const lineTotal = addToTotal(quantity, parseFloat(upgrade.price));
    items.push(quoteTableData(upgrade.name, quantity.toString(), currencyFormat(parseFloat(upgrade.price)), currencyFormat(lineTotal)));

    if (upgrade.setupFee && parseFloat(upgrade.setupFee) !== 0) {
      const lineTotal = addToTotal(1, parseFloat(upgrade.setupFee));
      items.push(quoteTableData(`${upgrade.name} setup fee`, '1', currencyFormat(parseFloat(upgrade.setupFee)), currencyFormat(lineTotal)));
    }
  });

  // Accommodation
  const roomBreakdown = Object.values(Rooms).map(({ costCategory, costPerNight }) => ({ costCategory, costPerNight }));
  const roomBreakdownCombined = uniqueArrayObjects(roomBreakdown) as IRooms;
  roomBreakdownCombined.map((rbc: IRoom) => {
    const stringified = JSON.stringify(rbc);
    const occurrences = roomBreakdown.filter((rb) => JSON.stringify(rb) === stringified).length;
    const lineTotal = addToTotal(occurrences, rbc.costPerNight);
    items.push(quoteTableData(rbc.costCategory as string, occurrences.toString(), currencyFormat(rbc.costPerNight), currencyFormat(lineTotal)));
  });

  // Payments Received
  Payments?.map((payment) => {
    const paymentValue = payment.amount * -1;
    const lineTotal = addToTotal(1, paymentValue);
    items.push(quoteTableData(`${payment.label || 'Payment'} (Received ${blissDate(payment.date, true)})`, '', '', currencyFormat(lineTotal)));
  });

  items.push(quoteTableData('Invoice Total', '', '', currencyFormat(quoteTotal)));

  return { issues, items };
};
