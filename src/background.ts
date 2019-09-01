// import * as browser from 'webextension-polyfill';


console.log('called');

function listener(details): Object {
    let filter = browser.webRequest.filterResponseData(details.requestId);
    let decoder = new TextDecoder("utf-8");
    let encoder = new TextEncoder();

    console.log('called');

    filter.ondata = event => {
        let str = decoder.decode(event.data, {stream: true});
        // Just change any instance of Example in the HTTP response
        // to WebExtension Example.
        // str = str.replace(/Example/g, 'WebExtension Example');
        console.log(str);
        filter.write(encoder.encode(str));
        filter.disconnect();
    };

    return {};
}

browser.webRequest.onBeforeRequest.addListener(
  listener,
  {urls: ["https://www.rightmove.co.uk/api/_mapSearch*"], types: ["main_frame"]},
  ["blocking"]
);

console.log('registered');
