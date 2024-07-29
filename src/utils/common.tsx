import { formatDate } from 'date-fns';

export function isValidJSON(string: string) {
  return /^[\],:{}\s]*$/.test(
    /* eslint-disable */
    string
      .replace(/\\["\\\/bfnrtu]/g, '@')
      .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
      .replace(/(?:^|:|,)(?:\s*\[)+/g, '')
    /* eslint-enable */
  );
}

export const isValidStringify = (value: string) => {
  return (typeof value === 'object' && value !== null) || Array.isArray(value);
};

export type Route = {
  name?: string;
  path: string;
  permissions?: string[][];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component?: any;
  icon?: React.ReactElement;
  breadcrumb?: boolean;
  hidden?: boolean;
  disabled?: boolean;
  children?: Route[];
  exact?: boolean;
  private?: boolean;
  match?: boolean;
  redirect?: string;
  layout?: boolean;
};

export const routeMatches = (route: Route | undefined) => {
  if (!route) return false;
  if (route.match) return true;
  if (route?.children?.some(routeMatches)) return true;
};

export const wpDateToTimestamp = (date: string) => {
  const year = date.substring(0, 4);
  const month = date.substring(4, 6);
  const day = date.substring(6, 8);

  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
};

export const capitalize = (sentence: string): string => {
  if (sentence === '') return sentence;

  const parts = sentence
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.substring(1));
  return parts.join(' ');
};

export const blissDate = (date: string, isWordpressDate = true) => {
  const blissDate = isWordpressDate ? wpDateToTimestamp(date) : new Date(date);
  return formatDate(blissDate, 'd MMMM yyyy');
};

export const hexToRgb = (hex: string) => {
  if (!hex || hex === null) return;

  const rgb = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b);
  return rgb
    ? rgb
        .substring(1)
        .match(/.{2}/g)
        ?.map((x) => parseInt(x, 16))
    : '';
};

export const firstLetterUppercase = (testString: string): boolean => {
  return /^[A-Z]/.test(testString);
};

export const currencyFormat = (num: number) => {
  const isNegative = num < 0;
  const value = parseFloat((!isNegative ? num : num * -1) as unknown as string);
  const currency = '£' + value.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  return !isNegative ? currency : `(${currency})`;
};

export const uniqueArrayObjects = (array: Array<unknown>) => {
  return array.filter((obj1, i, arr) => arr.findIndex((obj2) => JSON.stringify(obj2) === JSON.stringify(obj1)) === i);
};
