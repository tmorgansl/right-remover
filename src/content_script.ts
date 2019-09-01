import * as Url from 'url-parse';
import {PageType} from "./types";

const getPageType = (url: Url): PageType => {
   if (url.pathname.includes('property-') && url.pathname.endsWith('.html')) {
      return PageType.SINGLE_PROPERTY;
   }
   return PageType.OTHER;
};

const url = new Url(document.documentURI);
const pageType = getPageType(url);

if (pageType == PageType.SINGLE_PROPERTY) {
   const propertyActions = document.querySelector(".property-actions");
   const removeProperty = document.createElement("li");
   const someElement = document.createElement("a");
   someElement.textContent = "Remove Property";
   removeProperty.className = "bdr-b";
   removeProperty.appendChild(someElement);
   removeProperty.style["border-bottom"] = "1px dashed #dfdfe1";
   propertyActions.insertBefore(removeProperty, propertyActions.children[1]);

   someElement.addEventListener('click', () => {
      console.log('clicked!')
   });
}




