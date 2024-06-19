type IColorPalette = {
  primary: string;
  secondary: string;
};

const colorPalette: IColorPalette = {
  primary: '#a519df',
  secondary: '#787878'
};

type SiteConfig = {
  siteTitle: string;
  colorPalette: IColorPalette;
};

const siteConfig: SiteConfig = {
  siteTitle: 'Blissology',
  colorPalette
};

export default siteConfig;
