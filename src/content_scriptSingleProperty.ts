import * as Url from "url-parse";
import {bindButtonEventListener, getPropertyID} from "./utils";

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

  await bindButtonEventListener(url, propertyID, hidePropertyElement);
};
