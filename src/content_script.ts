import * as Url from 'url-parse';
import {PageType, Property} from "./types";
import {saveBlockedProperty} from "./storage";

const getPageType = (url: Url): PageType => {
   if (url.pathname.includes('property-') && url.pathname.endsWith('.html')) {
      return PageType.SINGLE_PROPERTY;
   }
   return PageType.OTHER;
};

const getPropertyID = (url: Url): number => {
   const path = url.pathname;
   return parseInt(path.substring(
     path.lastIndexOf('-') + 1,
     path.lastIndexOf('.')
   ), 10);
};

const getAddress = (): string => {
   const text = document.querySelector('address').textContent;
   if (text == null) {
      return "invalid_address"
   }
   return text.replace(/\n/g, ' ');
};

const url = new Url(document.documentURI);
const pageType = getPageType(url);

// https://www.rightmove.co.uk/api/_mapSearch?locationIdentifier=REGION%5E25570&numberOfPropertiesPerPage=499&radius=0.0&sortType=2&index=0&includeSSTC=false&viewType=MAP&channel=BUY&areaSizeUnit=sqft&currencyCode=GBP&viewport=-2.43206%2C-2.27301%2C53.4370%2C53.4495&isFetching=false
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/filterResponseData
// setTimeout(() => {
//    const listeners = (function listAllEventListeners() {
//       let elements = [];
//       const allElements = document.querySelectorAll('*');
//       const types = [];
//       for (let ev in window) {
//          if (/^on/.test(ev)) types[types.length] = ev;
//       }
//
//       for (let i = 0; i < allElements.length; i++) {
//          const currentElement = allElements[i];
//          for (let j = 0; j < types.length; j++) {
//             if (typeof currentElement[types[j]] === 'function') {
//                elements.push({
//                   "node": currentElement,
//                   "listeners": [ {
//                      "type": types[j],
//                      "func": currentElement[types[j]].toString(),
//                   }]
//                });
//             }
//          }
//       }
//
//       return elements.filter(element => element.listeners.length)
//    })();
//
//    console.table(listeners);
// }, 5000);

console.log('content_script');

if (pageType == PageType.SINGLE_PROPERTY) {
   const propertyID = getPropertyID(url);
   const propertyActions = document.querySelector(".property-actions");
   const removeProperty = document.createElement("li");
   const hidePropertyElement = document.createElement("a");
   hidePropertyElement.textContent = "Hide Property";
   removeProperty.className = "bdr-b";
   removeProperty.appendChild(hidePropertyElement);
   removeProperty.style["border-bottom"] = "1px dashed #dfdfe1";
   propertyActions.insertBefore(removeProperty, propertyActions.children[1]);

   hidePropertyElement.addEventListener('click', async (): Promise<void> => {
      const propertyDetails: Property = {
        url: url.toString(),
        address: getAddress(),
      };
      await saveBlockedProperty(propertyID, propertyDetails);
   });
}




