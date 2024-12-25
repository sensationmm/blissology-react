declare module '*.svg';

export type CustomChild = JSX.Element[] | ReactNode | Element | JSX.Element | undefined | '' | boolean | string | number;

export type CustomChildren = CustomChild | CustomChild[];
