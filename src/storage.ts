import * as browser from 'webextension-polyfill';
import {Property, PropertyStore} from "./types";

const PROPERTY_STORAGE_KEY = "properties";

let propertyStore: PropertyStore;

const getAllPropertiesFromStorage = async (): Promise<PropertyStore> => {
  return browser.storage.sync.get(PROPERTY_STORAGE_KEY).then((propertyStore: { properties?: PropertyStore }) => {
    if (propertyStore.properties != null) {
      return propertyStore.properties;
    }
    return {};
  })
};

export const getProperties = async (): Promise<PropertyStore> => {
  if (propertyStore == null) {
    // eslint-disable-next-line require-atomic-updates
    propertyStore = await getAllPropertiesFromStorage()
  }
  return propertyStore;
};

export const saveBlockedProperty = async (propertyID: number, propertyDetails: Property): Promise<void> => {
  const properties: PropertyStore = await getProperties();
  properties[propertyID] = propertyDetails;
  console.log(properties);
  browser.storage.sync.set({properties})
};




