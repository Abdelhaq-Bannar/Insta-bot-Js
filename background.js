let AccessToken = "",
    customHeaders = {};
Utility.getDB('').then(db => {
    db.config = db.config || { dailyLimitDate: moment().format(), noOfFollow: 0, noOfMessage: 0, messageBody: 'hiii', allocatedFollow: 50, allocatedMessage: 50 };
    console.log('db', db)
    Utility.setDB({ config: db.config, followList: db.followList || {}, messageList: db.messageList || {} })
});
chrome.webRequest.onBeforeSendHeaders.addListener(
    function (info) {
        // Replace the User-Agent header
        const userAgent = "Mozilla/5.0 (Linux; Android 8.1.0; motorola one Build/OPKS28.63-18-3; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/70.0.3538.80 Mobile Safari/537.36 Instagram 72.0.0.21.98 Android (27/8.1.0; 320dpi; 720x1362; motorola; motorola one; deen_sprout; qcom; pt_BR; 132081645)";
        var headers = info.requestHeaders;
        console.log(info)
        headers.forEach(function (header, i) {
            customHeaders[header.name.toLowerCase()] = header.value;
            if (header.name.toLowerCase() == 'user-agent') {
                header.value = userAgent;
            }
        });
        return { requestHeaders: headers };
    },
    // Request filter
    {
        // Modify the headers for these pages
        urls: [
            "https://i.instagram.com/*",
        ],
        // In the main window and frames
        types: ["xmlhttprequest"]
    }, ["blocking", "requestHeaders"]
);
(() => {

    let initialData, app = {
        sendTabsMessage: (tabId, message) => new Promise((r) => chrome.tabs.sendMessage(tabId, message, (d) => { r(d), chrome.runtime.lastError })),
        isInstaTab: (d = {}) => new Promise((r) => {
            chrome.tabs.query({ ... { url: '*://*.instagram.com/p/*' }, ...d }, function (tabs) {
                if (tabs.length) return r(tabs[0]);
                return r(false)
            });
        }),
        startAction(message) {
            return new Promise(async (r) => {
                let t = await this.isInstaTab();
                if (t) {
                    this.sendTabsMessage(t.id, message).then(x => { });
                    return r(true)
                }
                return r(false)
            })
        },
    }

    chrome.runtime.onMessage.addListener((message, sender, respond) => {
        //message.customHeaders = customHeaders;
        console.log(message)
        switch (true) {
            case 'isInstaTab' in message:
                app.isInstaTab({ active: true, currentWindow: true }).then(respond);
                break;
            case 'startAction' in message:
                app.startAction(message).then(x => respond(x));
                break;
            case 'getInstaInitialData' in message:
                respond(initialData);
                break;
            case 'getCustomHeaders' in message:
                respond(customHeaders);
                break;
            case 'APIgetUserInfo' in message:
                sendData(message, respond);
                break;
            case 'APImyInfo' in message:
                sendData(message, respond);
                break;;
            case 'followUser' in message:
                sendData(message, respond);
                break;
            case 'initialData' in message:
                initialData = message.initialData;
                console.log(initialData);
                respond();
                break;
        }
        return true;
    });

    function sendData(message, res) {
        app.isInstaTab().then(tab => {
            if (tab) {
                chrome.tabs.sendMessage(tab.id, message, (x) => {
                    console.log(x)
                    return res(x)
                });

            }
        });

    }

    function getActiveTab(cb) {
        chrome.tabs.query({ currentWindow: true, active: true }, cb);
    }

    chrome.runtime.onInstalled.addListener((info) => {
        reloadAllPages();
    });

    function reloadAllPages() {
        chrome.windows.getAll({ populate: true }, function (windows) {
            windows.forEach(function (window) {
                window.tabs.forEach(function (tab) {
                    if (tab.url.indexOf('https://www.instagram.com/') > -1)
                        chrome.tabs.reload(tab.id);
                });

            });
        });
    }
})()


chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        console.log(details)
        if (details.requestBody && details.requestBody.formData && details.requestBody.formData.access_token) {
            let accessToken = details.requestBody.formData.access_token;
            if (accessToken.length) {
                if (accessToken[0] != AccessToken) {
                    AccessToken = accessToken[0];
                    customHeaders.accessToken = accessToken[0];
                    customHeaders.form_data = details.requestBody.formData;
                }
            }

        }
    }, { urls: ['https://graph.instagram.com/logging_client_events'] }, ["blocking", "requestBody"]
);

chrome.webRequest.onHeadersReceived.addListener(
    function (info) {
        var headers = info.responseHeaders;
        for (var i = headers.length - 1; i >= 0; --i) {
            var header = headers[i].name.toLowerCase();
            if (header == 'x-frame-options' || header == 'frame-options') {
                //headers.splice(i, 1); // Remove header
                headers[i].value = 'allow-from chrome-extension://*'
            }
        }
        return { responseHeaders: headers };
    }, {
    urls: ['<all_urls>'], // Pattern to match all http(s) pages
    types: ['sub_frame']
}, ['blocking', 'responseHeaders']
);