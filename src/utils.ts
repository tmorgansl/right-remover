import * as Url from "url-parse";
import {HIDE_PROPERTY, SHOW_PROPERTY} from "./constants";
import {Message, MessageType, Property, PropertyStore} from "./types";

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

export const getPropertyID = (url: Url): number => {
  const path = url.pathname;
  return parseInt(path.substring(
    path.lastIndexOf('-') + 1,
    path.lastIndexOf('.')
  ), 10);
};

export const bindButtonEventListener = async (url: Url, propertyID: number, hidePropertyElement: Element): Promise<void> => {
  let isHidden = false;

  const togglePropertyState = (): void => {
    hidePropertyElement.textContent = (isHidden) ? SHOW_PROPERTY : HIDE_PROPERTY;
  };

  const properties = await browser.runtime.sendMessage<Message, PropertyStore>({ type: MessageType.GET_PROPERTIES });
  if (propertyID in properties) {
    isHidden = true;
  }

  togglePropertyState();

  hidePropertyElement.addEventListener('click', async (): Promise<void> => {
    if (isHidden) {
      await browser.runtime.sendMessage<Message, void>({
        type: MessageType.CLEAR_PROPERTY,
        id: propertyID,
      });

      isHidden = false;
      togglePropertyState();
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
    });

    isHidden = true;
    togglePropertyState();
  });
};
