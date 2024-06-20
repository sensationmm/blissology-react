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

const cmsDomain = 'http://hydehouse.blissology.local:50011';

const siteConfig: ISiteConfig = {
  siteTitle,
  cmsDomain,
  colorPalette
};

export default siteConfig;
