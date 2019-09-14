// A enum representing page types of rightmove
// SINGLE_PROPERTY - a page listing the details of a single property
// OTHER - a catch all for pages we can't recognise/don't care about
export enum PageType {
  SINGLE_PROPERTY ,
  MAP,
  LIST,
  OTHER
}

export interface PropertyStore {
  [propertyID: number]: Property;
}

export interface Property {
  address: string;
  url: string;
  imgUrl: string;
}
