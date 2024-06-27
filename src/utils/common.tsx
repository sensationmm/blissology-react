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
