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
    propertyStore = await getAllPropertiesFromStorage()
  }
  return propertyStore;
};

export const saveBlockedProperty = async (propertyID: number, propertyDetails: Property): Promise<void> => {
  const properties: PropertyStore = await getProperties();
  properties[propertyID] = propertyDetails;
  browser.storage.sync.set({properties});
};

export const clearProperty = async (propertyID: number): Promise<void> => {
  const properties: PropertyStore = await getProperties();
  delete properties[propertyID];
  browser.storage.sync.set({properties});
};

export const clearAllProperties = async (): Promise<void> => {
  browser.storage.sync.set({properties: {}});
};



