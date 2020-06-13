import * as Url from 'url-parse';
import {Message, MessageType, PageType, Property, PropertyStore} from "./types";

const HIDE_PROPERTY = "Hide Property";
const SHOW_PROPERTY = "Show Property";

// fails for large nodes
browser.runtime.sendMessage({ type: MessageType.GET_PROPERTIES }).then((p) => {
   new MutationObserver(function (mutations): void {
      mutations.some((mutation) => {
         if (mutation.type === 'childList') {
            return Array.prototype.some.call(mutation.addedNodes, function (addedNode) {
               if (addedNode.localName === 'script' && addedNode.textContent.includes('window.jsonModel ')) {
                  const textContent = `var badProperties = ${JSON.stringify(p)};
     window.jsonModel.properties = window.jsonModel.properties.filter(function(p) {
      return !(p.id in badProperties);
     });`;
                  addedNode.textContent += ";" + textContent;
                  return true;
               }

               return false;
            });
         }
         return false;
      });
   }).observe(document, {
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

const getPropertyID = (url: Url): number => {
   const path = url.pathname;
   return parseInt(path.substring(
     path.lastIndexOf('-') + 1,
     path.lastIndexOf('.')
   ), 10);
};

const getAddress = (): string => {
   const text = document.querySelector('.property-header-bedroom-and-price').querySelector('address').textContent;
   if (text == null) {
      return "invalid_address"
   }
   return text.replace(/\n/g, ' ');
};

const getImgUrl = (): string => {
  const url = document.querySelector('.js-gallery-main').getAttribute('src');
  if (url == null) {
     return 'https://img.icons8.com/officel/40/000000/cottage.png'
  }
  return url;
};

document.addEventListener('DOMContentLoaded', async (): Promise<void> => {
   const url = new Url(document.documentURI);
   const pageType = getPageType(url);

   if (pageType == PageType.SINGLE_PROPERTY) {
      const propertyID = getPropertyID(url);
      const propertyActions = document.querySelector(".property-actions");
      const removeProperty = document.createElement("li");
      const hidePropertyElement = document.createElement("a");
      removeProperty.className = "bdr-b";
      removeProperty.appendChild(hidePropertyElement);
      removeProperty.style["border-bottom"] = "1px dashed #dfdfe1";
      propertyActions.insertBefore(removeProperty, propertyActions.children[1]);

      const properties = await browser.runtime.sendMessage<Message, PropertyStore>({ type: MessageType.GET_PROPERTIES });
      let isHidden = false;
      if (propertyID in properties) {
         isHidden = true;
      }

      hidePropertyElement.textContent =  (isHidden) ? SHOW_PROPERTY : HIDE_PROPERTY;

      hidePropertyElement.addEventListener('click', async (): Promise<void> => {
         if (isHidden) {
            await browser.runtime.sendMessage<Message, void>({
              type: MessageType.CLEAR_PROPERTY,
              id: propertyID,
            })

            isHidden = false;
            hidePropertyElement.textContent = HIDE_PROPERTY;
            return;
         }

         const propertyDetails: Property = {
            url: url.toString(),
            address: getAddress(),
            imgUrl: getImgUrl(),
         };

         await browser.runtime.sendMessage<Message, void>({
            type: MessageType.SAVE_BLOCKED_PROPERTY,
            id: propertyID,
            property: propertyDetails,
         })

         isHidden= true;
         hidePropertyElement.textContent = SHOW_PROPERTY;
      });
   }
}, true);






