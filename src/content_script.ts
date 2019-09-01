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




