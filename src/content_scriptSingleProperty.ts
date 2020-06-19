import * as Url from "url-parse";
import {bindButtonEventListener, getPropertyID} from "./utils";

const getAddress = (): string => {
  const text = document.querySelector('.property-header-bedroom-and-price').querySelector('address').textContent;
  if (text == null) {
    return "invalid_address";
  }
  return text.replace(/\n/g, ' ');
};

const getImgUrl = (): string => {
  const url = document.querySelector('.js-gallery-main').getAttribute('src');
  if (url == null) {
    return 'https://img.icons8.com/officel/40/000000/cottage.png';
  }
  return url;
};

export const bindSinglePageDOM = async (url: Url): Promise<void> => {
  const propertyID = getPropertyID(url);
  const propertyActions = document.querySelector(".property-actions");
  const removeProperty = document.createElement("li");
  const hidePropertyElement = document.createElement("a");
  hidePropertyElement.style.cssText = "cursor:pointer;";

  removeProperty.className = "bdr-b";
  removeProperty.appendChild(hidePropertyElement);
  removeProperty.style["border-bottom"] = "1px dashed #dfdfe1";
  propertyActions.insertBefore(removeProperty, propertyActions.children[1]);

  await bindButtonEventListener(url, propertyID, hidePropertyElement, getAddress, getImgUrl);
};
