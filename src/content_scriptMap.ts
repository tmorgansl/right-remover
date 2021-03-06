import {HIDE_PROPERTY_CLASSNAME} from "./constants";
import {bindButtonEventListener, getPropertyID} from "./utils";
import * as Url from "url-parse";

const getAddress = (): string => {
  const text = document.querySelector('.expPropCardDisplayAddress').textContent;
  if (text == null) {
    return "invalid_address";
  }
  return text.replace(/\n/g, ' ');
};

const getImgUrl = (): string => {
  const url = document.querySelector('.expPropCardImgWrapper').querySelector('img').getAttribute('src');
  if (url == null) {
    return 'https://img.icons8.com/officel/40/000000/cottage.png';
  }
  return url;
};

const addHidePropertyToggle = (parent: Element): void => {
  const linkButton = parent.querySelector(".expPropCardPropertyLinkButton");
  const path = linkButton.querySelector(".button--primary").getAttribute("href");
  const url = new Url(window.location.protocol + "//" + window.location.host + path);
  const propertyID = getPropertyID(url);
  const hidePropertyElement = document.createElement("a");
  hidePropertyElement.className = HIDE_PROPERTY_CLASSNAME + " button button--full";
  linkButton.appendChild(hidePropertyElement);
  bindButtonEventListener(url, propertyID, hidePropertyElement, getAddress, getImgUrl).then();
};

const mutationCallback = (mutationsList: MutationRecord[]): void => {
  for(const mutation of mutationsList) {
    const target = mutation.target as Element;
    if (target.className.includes("isActive")) {
      switch (mutation.type) {
        case "childList":
          mutation.removedNodes.forEach((n: Element) => {
            if (n.className.includes("expandedPropertyCard-placeholder")) {
              addHidePropertyToggle(target);
              return;
            }
          });
          break;
        case "attributes":
          if (mutation.attributeName === 'class' && target.querySelector(".expandedPropertyCard-placeholder") == null && target.querySelector("."+HIDE_PROPERTY_CLASSNAME) == null) {
            addHidePropertyToggle(target);
          }
          break;
      }
    }
  }
};

export const bindMapPageDOM = async (): Promise<void> => {
  const sidePanel = document.querySelector(".mapSidePanel");
  new MutationObserver(mutationCallback).observe(sidePanel, { attributes: true, childList: true, subtree:true });
};
