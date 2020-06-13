import {Message, MessageType, Property, PropertyStore} from "./types";
import * as Url from "url-parse";

const HIDE_PROPERTY = "Hide Property";
const SHOW_PROPERTY = "Show Property";

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

const togglePropertyState = (hidePropertyElement: HTMLAnchorElement, isHidden: boolean): void => {
  hidePropertyElement.textContent = (isHidden) ? SHOW_PROPERTY : HIDE_PROPERTY;
}

export const bindSinglePageDOM = async (url: Url): Promise<void> => {
  const propertyID = getPropertyID(url);
  const propertyActions = document.querySelector(".property-actions");
  const removeProperty = document.createElement("li");
  const hidePropertyElement = document.createElement("a");
  hidePropertyElement.style.cssText = "cursor:pointer;"

  removeProperty.className = "bdr-b";
  removeProperty.appendChild(hidePropertyElement);
  removeProperty.style["border-bottom"] = "1px dashed #dfdfe1";
  propertyActions.insertBefore(removeProperty, propertyActions.children[1]);

  const properties = await browser.runtime.sendMessage<Message, PropertyStore>({ type: MessageType.GET_PROPERTIES });
  let isHidden = false;
  if (propertyID in properties) {
    isHidden = true;
  }

  togglePropertyState(hidePropertyElement, isHidden)

  hidePropertyElement.addEventListener('click', async (): Promise<void> => {
    if (isHidden) {
      await browser.runtime.sendMessage<Message, void>({
        type: MessageType.CLEAR_PROPERTY,
        id: propertyID,
      })

      isHidden = false;
      togglePropertyState(hidePropertyElement, isHidden);
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
    togglePropertyState(hidePropertyElement, isHidden);
  });
}
