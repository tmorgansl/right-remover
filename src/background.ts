// import * as browser from 'webextension-polyfill';

function listener(details): Object {
    let filter = browser.webRequest.filterResponseData(details.requestId);
    let decoder = new TextDecoder("utf-8");
    let encoder = new TextEncoder();

    console.log('called');

    filter.ondata = event => {
        const str = decoder.decode(event.data, {stream: true});
        console.log(str);
        // const body = JSON.parse(str);
        // const body = JSON.parse(decoder.decode(event.data, {stream: true}));
        // console.log('data');
        // Just change any instance of Example in the HTTP response
        // to WebExtension Example.
        // str = str.replace(/Example/g, 'WebExtension Example');
        // body.properties = [];
        // console.log(body);
        filter.write(event.data);
        filter.disconnect();
    };

    return {};
}

browser.webRequest.onBeforeRequest.addListener(
  listener,
  {urls: ["https://www.rightmove.co.uk/api/_mapSearch*"]},
  ["blocking"]
);
