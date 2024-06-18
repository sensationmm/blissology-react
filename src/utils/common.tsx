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

export const isValidStringify = (value: any) => {
  return (typeof value === 'object' && value !== null) || Array.isArray(value);
};
