var buildUrl = "Build";
var loaderUrl = buildUrl + "/development.loader.js?638683001754469688";
var config = {
    dataUrl: buildUrl + "/89a4cd7bc617236baf54a6e495e3bed8.data.unityweb",
    frameworkUrl: buildUrl + "/22da774bfe047c48192687e30f09f96b.js.unityweb",
    codeUrl: buildUrl + "/bc822b67baa14b2f2db776b52c7630b2.wasm.unityweb",
    symbolsUrl: buildUrl + "/cdafe618271c915d9a41a910ffc028b3.json.unityweb",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "Mirailabs",
    productName: "Waifu Tap",
    productVersion: "1.0.9",

    cacheControl: function (url) {
        // Caching enabled for .data and .bundle files.
        // Revalidate if file is up to date before loading from cache
        if (url.match(/\.data/) || url.match(/\.bundle/)) {
            return "must-revalidate";
        }

        // Caching enabled for .mp4 and .custom files
        // Load file from cache without revalidation.
        if (url.match(/\.mp4/) || url.match(/\.custom/)) {
            return "immutable";
        }

        // Disable explicit caching for all other files.
        // Note: the default browser cache may cache them anyway.
        return "no-store";
    },
};

var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
if (isMobile) {
    // Define a maximum pixel ratio for mobile to avoid rendering at too high resolutions
    const maxPixelRatioMobile = 2.0;
    config.devicePixelRatio = Math.min(window.devicePixelRatio, maxPixelRatioMobile);
}
else {
    config.devicePixelRatio = 2.0;
}

var canvas = document.querySelector("#unity-canvas");
var loadingBar = document.querySelector("#unity-loading-fg");

var unityGame;
var script = document.createElement("script");
script.src = loaderUrl;
script.onload = function () {
    createUnityInstance(canvas, config, function (progress) {
        loadingBar.style.width = 75 * progress + "%";
    }).then(function (unityInstance) {
        unityGame = unityInstance;
    }).catch(function (message) {
        alert(message);
    });
};
document.body.appendChild(script);
function runUnityCommand(method, params) {
    unityGame?.SendMessage("WebBridge", method, params);
}
function UnityTaskCallBack(taskId, success, data) {
    runUnityCommand("UnityTaskCallBack", JSON.stringify({
        taskId,
        success,
        data: ((typeof data === 'object' && data !== null) ? JSON.stringify(data) : data.toString())
    }));
}

const miraiWallet = {
    appName: "miraiapp-tg",
    name: "Mirai App",
    imageUrl: "https://cdn.mirailabs.co/miraihub/miraiapp-tg-icon-288.png",
    aboutUrl: "https://mirai.app",
    // #if PRODUCTION_BUILD == 1
    // universalLink: "https://t.me/MiraiAppBot/app",
    // #else
    universalLink: "https://t.me/mirai_app_dev_bot/MiraiWallet",
    // #endif
    bridgeUrl: "https://bridge.tonapi.io/bridge",
    platforms: ["ios", "android", "macos", "windows", "linux"],
}

const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: 'https://cdn.mirailabs.co/waifu-tap/static/tele-config.json',
    walletsListConfiguration: {
        includeWallets: [miraiWallet]
    }
});

tonConnectUI.onStatusChange(walletAndwalletInfo => {
    runUnityCommand("StatusChange");
});
tonConnectUI.connectionRestored.then(restored => {
    if (restored) {
        console.log('Connection restored.');
    } else {
        console.log('Connection was not restored.');
    }
});
