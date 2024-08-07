type ISiteConfig = {
  siteTitle: string;
  cmsDomain: string;
};

const siteTitle = 'Blissology';

const cmsDomain = 'http://hydehouse.blissology.local';

const siteConfig: ISiteConfig = {
  cmsDomain,
  siteTitle
};

export default siteConfig;
