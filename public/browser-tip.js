;(function (root, factory) {
  if(typeof exports === 'object' && typeof module === 'object')
    module.exports = factory();
  else if(typeof define === 'function' && define.amd)
    define([], factory);
  else if(typeof exports === 'object')
    exports['browser-tip'] = factory();
  else
    root['browser-tip'] = factory();
})((typeof self !== 'undefined' ? self : this), function() {
  var ua = window.navigator.userAgent;
  var browserObj = {}; // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)

  browserObj.isOpera = !!window.opera || navigator.userAgent.indexOf(" OPR/") >= 0; // Firefox 1.0+

  browserObj.isEdge = /Edge/.test(navigator.userAgent);
  browserObj.isFirefox = /Firefox/.test(navigator.userAgent); // Safari 3.0+


  browserObj.isSafari = /constructor/i.test(window.HTMLElement) || function (p) {
    return p.toString() === "[object SafariRemoteNotification]";
  }(!window["safari"] || safari.pushNotification);
  // Internet Explorer 6-11
  browserObj.isIE =
    /*@cc_on!@*/
    false || !!document.documentMode; // Edge 20+

  browserObj.isChrome = /Google Inc/.test(navigator.vendor);
  browserObj.isChromeIOS = /CriOS/.test(navigator.userAgent);
  browserObj.meta = browserSpecs();
  browserObj.meta.ua = ua;

  function browserSpecs() {
    var tem,
      M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return {
        name: "IE",
        version: tem[1] || ""
      };
    }

    if (M[1] === "Chrome") {
      tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem != null) return {
        name: tem[1].replace("OPR", "Opera"),
        version: tem[2]
      };
    }

    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, "-?"];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return {
      name: M[0],
      version: M[1]
    };
  }

  // 自定义提示
  var browserVersion = +browserObj.meta.version;
  if (!browserObj.isChrome) {
   alert('请使用最新的chrome浏览器！');
  } else if (browserVersion < 70) {
    alert('chrome浏览器版本较低，请新的chrome浏览器');
  }

  return browserObj
});