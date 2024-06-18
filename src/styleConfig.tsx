type IColorPalette = {
  primary: string;
  secondary: string;
};

type ISiteConfig = {
  siteTitle: string;
  colorPalette: IColorPalette;
};

const colorPalette: IColorPalette = {
  primary: '#a519df',
  secondary: '#da85fd'
};

const siteTitle = 'Blissology';

const siteConfig: ISiteConfig = {
  siteTitle,
  colorPalette
};

export default siteConfig;
