type IColorPalette = {
  primary: string;
  secondary: string;
};

type ISiteConfig = {
  siteTitle: string;
  cmsDomain: string;
  colorPalette: IColorPalette;
};

const colorPalette: IColorPalette = {
  primary: '#a519df',
  secondary: '#da85fd'
};

const siteTitle = 'Blissology';

const cmsDomain = 'http://hydehouse.blissology.local';

const siteConfig: ISiteConfig = {
  cmsDomain,
  colorPalette,
  siteTitle
};

export default siteConfig;
