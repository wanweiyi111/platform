export default function JsLoader(jsUrl, objName) {
    return new Promise((resolve, reject) => {
        if (window[objName]) {
            resolve(window[objName]);
        } else {
            var script = document.createElement('script');
            var script1 = document.createElement('script');
            // script.type = 'text/javascript'
            script.async = true;
            script.src = jsUrl;
            script1.src = './h5splayer.js';
            script.onerror = reject;
            script.onload = function() {
                resolve(window[objName]);
            }
            document.head.appendChild(script);
        }
    })
}