/* eslint-disable sort-keys */
/* eslint-disable @typescript-eslint/no-explicit-any */

import siteConfig from 'src/siteConfig';

export const wpRestApiHandler = function (route: string, data: any, method = 'GET', authToken: string) {
  if (!route) route = 'posts';
  if (!method) method = 'GET';

  return fetch(`${siteConfig.cmsDomain}/wp-json/wp/v2/${route}`, {
    method,
    body: JSON.stringify(data),
    headers: {
      // 'X-WP-Nonce': wpApiSettings.nonce,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    }
  });
};
