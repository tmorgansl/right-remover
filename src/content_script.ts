import * as Url from 'url-parse';
import {MessageType, PageType, PropertyStore} from "./types";
import {bindSinglePageDOM} from "./content_scriptSingleProperty";
import {bindMapPageDOM} from "./content_scriptMap";

const mutationCallback = (p: PropertyStore) => (mutations: MutationRecord[]): void => {
   mutations.some((mutation) => {
      if (mutation.type === 'childList') {
         return Array.prototype.some.call(mutation.addedNodes, function (addedNode) {
            if (addedNode.localName === 'script' && addedNode.textContent.includes('window.jsonModel ') && addedNode.textContent.endsWith('}')) {
               const textContent = `var badProperties = ${JSON.stringify(p)};
     window.jsonModel.properties = window.jsonModel.properties.filter(function(p) {
      return !(p.id in badProperties);
     })`;
               addedNode.textContent += ";" + textContent;
               return true;
            }

            return false;
         });
      }
      return false;
   });
}

browser.runtime.sendMessage({ type: MessageType.GET_PROPERTIES }).then((p) => {
   new MutationObserver(mutationCallback(p)).observe(document, {
      attributes: false,
      attributeOldValue: false,
      characterData: false,
      characterDataOldValue: false,
      childList: true,
      subtree: true
   });
});

const getPageType = (url: Url): PageType => {
   if (url.pathname.endsWith('map.html')) {
      return PageType.MAP;
   }
   if (url.pathname.endsWith('find.html')) {
      return PageType.LIST;
   }
   if (url.pathname.includes('property-') && url.pathname.endsWith('.html')) {
      return PageType.SINGLE_PROPERTY;
   }
   return PageType.OTHER;
};

document.addEventListener('DOMContentLoaded', async (): Promise<void> => {
   const url = new Url(document.documentURI);
   const pageType = getPageType(url);

   switch (pageType) {
      case PageType.SINGLE_PROPERTY:
         await bindSinglePageDOM(url);
         return;
      case PageType.MAP:
         await bindMapPageDOM();
         return;
   }
}, true);




