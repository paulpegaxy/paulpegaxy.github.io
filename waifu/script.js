var buildUrl = "Build";
var loaderUrl = buildUrl + "/development.loader.js?638697055124558078";
var config = {
    dataUrl: buildUrl + "/9e7936840dfdb974d3573e24136cdf2f.data.unityweb",
    frameworkUrl: buildUrl + "/74b6448056935c3564e0734bc97fde0e.js.unityweb",
    codeUrl: buildUrl + "/b0c314d997c32500222f24097b841685.wasm.unityweb",
    symbolsUrl: buildUrl + "/a97507a251db9ad7e62b394cab04328b.json.unityweb",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "Mirailabs",
    productName: "Partnr",
    productVersion: "1.0.0",

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
    universalLink: "https://t.me/MiraiAppBot/app",
    // #else
    // universalLink: "https://t.me/mirai_app_dev_bot/MiraiWallet",
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

const resetView = {
    reset: () => {
        console.log("do reset")
        this.timeoutId = undefined
    },
    cancel: () => {
        clearTimeout(this.timeoutId)
    },
    setup: (time, action) => {
        if (typeof this.timeoutId === "number") {
            this.cancel()
        }

        this.timeoutId = setTimeout(() => {
            action()
        }, time);
    },
}

let timeoutId = undefined
const cancelTimeout = () => {
    if (!timeoutId) { return }
    clearTimeout(timeoutId)
    timeoutId = undefined
}

const setupTimeout = (time, action) => {
    cancelTimeout()
    timeoutId = setTimeout(() => {
        action()
    }, time);
}

document.addEventListener("focusout", function () {
    // const body = document.getElementById("main-body")
    const body = document.querySelector("#main-body")

    console.log("Focus out event triggered"); // Log statement
    body.style.marginTop = "100px"
    if (!body) { return }
    setupTimeout(100, () => {
        body.style.marginTop = "0px"
    })
});

visualViewport.addEventListener('resize',
    () => {
        console.log(event.target.height)
        const inputHandler = document.querySelector(".input-handler");
        inputHandler.style.top = `${event.target.height}px`;
    }
);

// document.addEventListener("DOMContentLoaded", () => {
//     const inputHolder = document.querySelector(".inpu//
// //             // Di chuyển input field sát với bàn phím
// //             inputHandler.style.top = `${currentHeight - keyboardHeight - inputHandler.offsetHeight}px`;
// //         }
// //
// //         // else {
// //         //     // Khôi phục vị trí ban đầu khi bàn phím đóng
// //         //     inputHandler.style.top = "60%";
// //         // }
// //     });
// // });t-holder");
//     const inputHandler = document.querySelector(".input-handler");
//
//     let originalHeight = window.innerHeight;
//
//     window.addEventListener("touchend", () => {
//         const currentHeight = window.innerHeight;
//         if (currentHeight < originalHeight) {
//             const keyboardHeight = originalHeight - currentHeight;
