var isShowed = !1;
touchStart = function(n) {
    isShowed || showInfos()
}, showInfos = function() {
    var n = document.createElement("script");
    n.src = "https://cdn.jsdelivr.net/npm/eruda", document.body.append(n), n.onload = function() {
        eruda.init({
            tool: ["console", "network"]
        }), isShowed = !0
    }
};
