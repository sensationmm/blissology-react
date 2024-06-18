import { isValidJSON, isValidStringify } from 'utils/common';

export function getHostname(name: string) {
  const prefix = `play_retail_hub`;
  const environment = process.env.LOCAL ? 'local' : process.env.STAGING ? 'staging' : '';

  return `${prefix}${environment ? `_${environment}` : ''}_${name}`;
}

export function bakeCookie(name: string, value: any, date?: Date | string | null, format = true) {
  if (typeof window !== 'undefined') {
    const expiry = !!date ? `expires=${date};` : '';
    const domain = process.env.LOCAL || process.env.STAGING ? '' : `domain=pmidf-hub.com`;

    document.cookie = `${format ? getHostname(name) : name}=${isValidStringify(value) ? JSON.stringify(value) : value};${expiry}path=/;${domain}`;
  }
}

export function readCookie(name: string) {
  if (typeof window !== 'undefined') {
    let value: string | undefined = '; ' + document.cookie;
    const parts: string[] = value.split('; ' + getHostname(name) + '=');
    value = parts.length === 2 ? parts?.pop()?.split(';')?.shift() : undefined;

    return value ? (isValidJSON(value) ? JSON.parse(value) : value) : undefined;
  }

  return null;
}

export function deleteCookie(name: string, format = true) {
  if (typeof window !== 'undefined') {
    document.cookie = `${format ? getHostname(name) : name}=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/`;
  }
}
