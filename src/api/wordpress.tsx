/* eslint-disable sort-keys */
/* eslint-disable @typescript-eslint/no-explicit-any */

import siteConfig from 'src/siteConfig';

export const wpRestApiHandler = function (route: string, data: any, method = 'GET', authToken: string, isPost: boolean = true) {
  if (!route) route = 'posts';
  if (!method) method = 'GET';

  const suffix =
    method === 'GET' && isPost ? '?_embed=wp:term&_fields=id,title,description,_links,_embedded,acf&acf_format=standard&per_page=100&orderby=title&order=asc' : '?per_page=100';

  return fetch(`${siteConfig.cmsDomain}/wp-json/wp/v2/${route}${suffix}`, {
    method,
    body: JSON.stringify(data),
    headers: {
      // 'X-WP-Nonce': wpApiSettings.nonce,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    }
  });
};
