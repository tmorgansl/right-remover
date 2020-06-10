import {clearProperty, getProperties, saveBlockedProperty} from "./storage";
import {Message, MessageType} from "./types";

interface ApiProperty {
    id: number;
}

const filterProperties = async (properties: Array<ApiProperty>): Promise<Array<ApiProperty>> => {
    const propertyStore = await getProperties();
    return properties.filter(p => !(p.id in propertyStore));
};

function mapListener(details): Record<string, any> {
    const filter = browser.webRequest.filterResponseData(details.requestId);
    const decoder = new TextDecoder("utf-8");
    const encoder = new TextEncoder();

    let str = '';

    filter.ondata = (event): void => {
        str += decoder.decode(event.data, {stream: false});
    };

    filter.onstop = async (): Promise<void> => {
        const body = JSON.parse(str);
        body.properties = await filterProperties(body.properties);
        filter.write(encoder.encode(JSON.stringify(body)));
        filter.disconnect();
    };

    return {};
}

function searchListener(details): Record<string, any> {
    const filter = browser.webRequest.filterResponseData(details.requestId);
    const decoder = new TextDecoder("utf-8");
    const encoder = new TextEncoder();

    let str = '';
    filter.ondata = (event): void => {
        str += decoder.decode(event.data, {stream: false});
    };

    filter.onstop = async (): Promise<void> => {
        const body = await filterProperties(JSON.parse(str));
        filter.write(encoder.encode(JSON.stringify(body)));
        filter.disconnect();
    };

    return {};
}

browser.webRequest.onBeforeRequest.addListener(
  mapListener,
  {urls: ["https://www.rightmove.co.uk/api/_mapSearch*"]},
  ["blocking"]
);

browser.webRequest.onBeforeRequest.addListener(
  searchListener,
  {urls: ["https://www.rightmove.co.uk/api/_searchByIds*"]},
  ["blocking"]
);

browser.runtime.onMessage.addListener((msg: Message, sender, response) => {
    switch (msg.type) {
        case MessageType.CLEAR_PROPERTY:
            clearProperty(msg.id).then(response);
            break;
        case MessageType.SAVE_BLOCKED_PROPERTY:
            saveBlockedProperty(msg.id, msg.property).then(response);
            break;
        case MessageType.GET_PROPERTIES:
            getProperties().then(p => response(p))
            break;
    }
});
