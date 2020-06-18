import {HIDE_PROPERTY_CLASSNAME} from "./constants";
import {bindButtonEventListener, getPropertyID} from "./utils";
import * as Url from "url-parse";

const addHidePropertyToggle = (parent: Element): void => {
  const linkButton = parent.querySelector(".expPropCardPropertyLinkButton");
  const path = linkButton.querySelector(".button--primary").getAttribute("href");
  const url = new Url(window.location.protocol + "//" + window.location.host + path);
  const propertyID = getPropertyID(url);
  const hidePropertyElement = document.createElement("a");
  hidePropertyElement.className = HIDE_PROPERTY_CLASSNAME + " button button--full";
  linkButton.appendChild(hidePropertyElement);
  bindButtonEventListener(url, propertyID, hidePropertyElement).then();
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
