import { IDrinkChoices } from 'src/store/reducers/drinkChoices';
import { IDrinks } from 'src/store/reducers/drinks';
import { IGuests } from 'src/store/reducers/guests';
import { IMenu } from 'src/store/reducers/menu';
import { IMenuChoices } from 'src/store/reducers/menuChoices';
import { IOrders } from 'src/store/reducers/orders';
import { IPayment } from 'src/store/reducers/payments';
import { IQuoteConfig, IQuoteConfigItem, IQuotePackageItem } from 'src/store/reducers/quoteConfig';
import { IRoomAllocation } from 'src/store/reducers/roomAllocations';
import { IRoom, IRooms } from 'src/store/reducers/rooms';
import { IUpgradeChoices } from 'src/store/reducers/upgradeChoices';
import { IUpgrades } from 'src/store/reducers/upgrades';
import { IWeddingState } from 'src/store/reducers/wedding';

import { blissDate, currencyFormat, uniqueArrayObjects } from './common';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IObject = Record<string, any>;

const quoteTableData = (description: string, quantity: string, unitPrice: string, total: string) => {
  return { description, quantity, total, unitPrice };
};

export const generateQuote = (
  QuoteConfig: IQuoteConfig,
  Drinks: IDrinks,
  DrinksChoices: IDrinkChoices,
  Guests: IGuests,
  Menu: IMenu,
  MenuChoices: IMenuChoices,
  Orders: IOrders,
  Payments: IPayment[],
  RoomAllocations: IRoomAllocation[],
  Rooms: IRooms,
  Upgrades: IUpgrades,
  UpgradeChoices: IUpgradeChoices,
  Wedding: IWeddingState
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

  // Packages Functions
  const hasChosenItems = (listToCheck: Array<number>, Objects: IObject[], ObjectChoices: Array<number>, quantity?: number) => {
    const packageDrinkIds = Object.values(Objects)
      .flat()
      .map((item) => {
        if (!Object.prototype.hasOwnProperty.call(item, 'packageIds')) {
          return Object.values(item).flat();
        } else {
          return item;
        }
      })
      .flat()
      .filter((item: IObject) => {
        return item.packageIds.some((d: number) => listToCheck.includes(d));
      })
      .map((item: IObject) => {
        // Supplement charges
        if (ObjectChoices.includes(item.id) && item.upcharge && item.upcharge !== '' && quantity) {
          const upcharge = parseFloat(item.upcharge);
          const lineTotal = addToTotal(quantity, upcharge);
          items.push(quoteTableData(`${item.name} supplement`, quantity.toString(), currencyFormat(upcharge), currencyFormat(lineTotal)));
        }
        return item.id;
      });

    return packageDrinkIds.filter((value) => ObjectChoices.includes(value));
  };

  const selectTieredPackage = (configKey: keyof IQuoteConfig, Objects: IObject[], ObjectChoices: Array<number>) => {
    let selectedPackage: IQuotePackageItem = {} as IQuotePackageItem;
    let packagesPickedFrom = 0;
    (QuoteConfig[configKey] as IQuotePackageItem[])
      .slice()
      .reverse()
      .forEach((packageItem: IQuotePackageItem) => {
        const packageConfig = packageItem.choices.map(({ taxonomy, ...rest }) => ({ categoryId: taxonomy.id, ...rest }));
        const packageCategoryIds = packageConfig.map((pkg) => pkg.categoryId);

        const chosenPackageDrinks = hasChosenItems(packageCategoryIds, Objects, ObjectChoices);

        if (chosenPackageDrinks.length > 0) {
          packagesPickedFrom++;
          selectedPackage = packageItem;
        }
      });

    return { packagesPickedFrom, selectedPackage };
  };

  const addPackageToInvoice = (activePackage: IQuotePackageItem) => {
    const quantity = Guests[activePackage.priceCalculation.timeframe][activePackage.priceCalculation.guest_type];
    const lineTotal = addToTotal(quantity, activePackage.cost);
    items.push(quoteTableData(activePackage.description, quantity.toString(), currencyFormat(activePackage.cost), currencyFormat(lineTotal)));
  };

  const getPackageMaxMin = (activePackage: IQuotePackageItem, Package: IObject[], PackageChoices: Array<number>, label: string, packagesPickedFrom?: number) => {
    activePackage.choices.forEach((choice) => {
      const quantity = Guests[activePackage.priceCalculation.timeframe][activePackage.priceCalculation.guest_type];
      const numChosenItems = hasChosenItems([choice.taxonomy.id], Package, PackageChoices, quantity).length;
      if (numChosenItems > choice.maximum) {
        if (!choice.additional_allowed) {
          issues.push(`You have picked too many ${choice.name} in your ${label} package - the maximum is ${choice.maximum} and you have chosen ${numChosenItems}`);
        } else {
          const numExtra = numChosenItems - choice.maximum;
          for (let i = 0; i < numExtra; i++) {
            const lineTotal = addToTotal(quantity, choice.additional_cost);
            items.push(quoteTableData(`Additional ${choice.name} choice`, quantity.toString(), currencyFormat(choice.additional_cost), currencyFormat(lineTotal)));
          }
        }
      } else if (numChosenItems < choice.minimum) {
        issues.push(`You have not picked enough ${choice.name} in your ${label} package - the minimum is ${choice.minimum} and you have chosen ${numChosenItems}`);
      }

      if (packagesPickedFrom && packagesPickedFrom > 1) {
        issues.push(`You have picked ${choice.name} from more than one ${label} package - this may incur an extra charge`);
      }
    });
  };

  // Food Package
  QuoteConfig.packages.forEach((packageItem: IQuotePackageItem) => {
    if (Object.values(MenuChoices).flat().length !== 0) {
      addPackageToInvoice(packageItem);

      getPackageMaxMin(packageItem, Menu as unknown as IObject[], Object.values(MenuChoices).flat(), 'food');
    } else {
      issues.push(`You haven't chosen your Food Package options`);
    }
  });

  // Drinks Package
  if (QuoteConfig?.drinksPackages.length > 0) {
    const { packagesPickedFrom, selectedPackage: drinksPackage } = selectTieredPackage('drinksPackages', Drinks as unknown as IObject[], DrinksChoices);

    if (Object.keys(drinksPackage).length > 0) {
      addPackageToInvoice(drinksPackage);
      getPackageMaxMin(drinksPackage, Drinks as unknown as IObject[], DrinksChoices, 'drinks', packagesPickedFrom);
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
    const extraPriceScaled = upgrade.priceType === 'set' && upgrade.priceFor?.number && upgrade.additionalUnit.cost;

    if (upgrade.minimumOrder.hasMinimum === 'percentage') {
      quantity = Math.round((quantity * Guests.daytime.adults) / 100);
    }

    if(extraPriceScaled) {
      quantity = upgrade.priceFor?.number || 1;
    }
    const lineTotal = addToTotal(quantity, parseFloat(upgrade.price));
    items.push(quoteTableData(upgrade.name, quantity.toString(), currencyFormat(parseFloat(upgrade.price)), currencyFormat(lineTotal)));

    if(extraPriceScaled && Orders[upgrade.id] > (upgrade.priceFor?.number || 0)) {
      quantity = Orders[upgrade.id] - (upgrade.priceFor?.number || 0);

    const lineTotal = addToTotal(quantity, parseFloat(upgrade.additionalUnit.cost.toString()));
    items.push(quoteTableData(`${upgrade.name} ${upgrade.additionalUnit.unit}`, quantity.toString(), currencyFormat(parseFloat(upgrade.additionalUnit.cost.toString())), currencyFormat(lineTotal)));
    }

    if (upgrade.setupFee && parseFloat(upgrade.setupFee) !== 0) {
      const lineTotal = addToTotal(1, parseFloat(upgrade.setupFee));
      items.push(quoteTableData(`${upgrade.name} setup fee`, '1', currencyFormat(parseFloat(upgrade.setupFee)), currencyFormat(lineTotal)));
    }
  });
  
  // Accommodation
  // Remove guest-payable rooms
  const invoicedRoomBreakdown = Object.values(Rooms).filter(r => {
    const roomAllocation = RoomAllocations.find(ra => ra.room_id === r.id);
    return roomAllocation?.payment === 'invoice';
  });
  const roomBreakdown = invoicedRoomBreakdown.map(({ costCategory, costPerNight }) => ({ costCategory, costPerNight }));
  const roomBreakdownCombined = uniqueArrayObjects(roomBreakdown) as IRooms;
  roomBreakdownCombined.map((rbc: IRoom) => {
    const stringified = JSON.stringify(rbc);
    const occurrences = roomBreakdown.filter((rb) => JSON.stringify(rb) === stringified).length;
    const lineTotal = addToTotal(occurrences, rbc.costPerNight);
    items.push(quoteTableData(rbc.costCategory as string, occurrences.toString(), currencyFormat(rbc.costPerNight), currencyFormat(lineTotal)));
  });

  // Custom Adjustments
  Wedding?.customInvoiceEntries?.map((entry) => {
    const lineTotal = addToTotal(entry.quantity, entry.unitPrice);
    items.push(quoteTableData(entry.description, entry.quantity.toString(), currencyFormat(entry.unitPrice), currencyFormat(lineTotal)));
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
