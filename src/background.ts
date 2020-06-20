import {clearProperty, getProperties, saveBlockedProperty} from "./storage";
import {Message, MessageType} from "./types";

interface ApiProperty {
    id: number;
}

const filterProperties = async (properties: Array<ApiProperty>): Promise<Array<ApiProperty>> => {
    const propertyStore = await getProperties();
    return properties.filter(p => !(p.id in propertyStore));
};

const filterResponse = (details, bodyKey?: string): Record<string, void> => {
    const filter = browser.webRequest.filterResponseData(details.requestId);
    const decoder = new TextDecoder("utf-8");
    const encoder = new TextEncoder();

    let str = '';

    filter.ondata = (event): void => {
        str += decoder.decode(event.data, {stream: false});
    };

    filter.onstop = async (): Promise<void> => {
        let body = JSON.parse(str);
        if (bodyKey != null) {
            body[bodyKey] = await filterProperties(body[bodyKey]);
        } else {
            body = await filterProperties(body);
        }

        filter.write(encoder.encode(JSON.stringify(body)));
        filter.disconnect();
    };

    return {};
};

browser.webRequest.onBeforeRequest.addListener(
  (details) => filterResponse(details, "properties"),
  {urls: ["https://www.rightmove.co.uk/api/_mapSearch*"]},
  ["blocking"]
);

browser.webRequest.onBeforeRequest.addListener(
  (details) => filterResponse(details),
  {urls: ["https://www.rightmove.co.uk/api/_searchByIds*"]},
  ["blocking"]
);

browser.runtime.onMessage.addListener(async (msg: Message) => {
    switch (msg.type) {
        case MessageType.CLEAR_PROPERTY:
            await clearProperty(msg.id);
            return;
        case MessageType.SAVE_BLOCKED_PROPERTY:
            await saveBlockedProperty(msg.id, msg.property);
            return;
        case MessageType.GET_PROPERTIES:
            return await getProperties();
    }
});
