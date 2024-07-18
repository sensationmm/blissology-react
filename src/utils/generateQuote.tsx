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
  Guests: IGuests,
  Orders: IOrders,
  Payments: IPayment[],
  Rooms: IRooms,
  Upgrades: IUpgrades,
  UpgradeChoices: IUpgradeChoices
) => {
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
    const lineTotal = addToTotal(quantity, upgrade.price);
    items.push(quoteTableData(upgrade.name, quantity.toString(), currencyFormat(upgrade.price), currencyFormat(lineTotal)));

    if (upgrade.setupFee && upgrade.setupFee !== 0) {
      const lineTotal = addToTotal(1, upgrade.setupFee);
      items.push(quoteTableData(`${upgrade.name} setup fee`, '1', currencyFormat(upgrade.setupFee), currencyFormat(lineTotal)));
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

  return items;
};
