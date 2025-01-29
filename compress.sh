cat << EOF > ./dist/9g-debot.js
(function() {
    const load = async function () {
        const gzipBase64String = "$(cat ./dist/app.js | gzip --best | base64 -w 0 -)";
        const stream = new Blob([Uint8Array.from(atob(gzipBase64String), c => c.charCodeAt(0))]).stream();
        let chunks = [];
        for await (const chunk of stream.pipeThrough(new DecompressionStream("gzip"))) chunks.push(chunk);
        new Function(new TextDecoder().decode(new Uint8Array(await new Blob(chunks).arrayBuffer())))();
        chunks = null;
    }

    load();
})();
EOF

cat << EOF > ./dist/9g-debot.user.js
// ==UserScript==
// @name         9g Debot
// @namespace    https://github.com/hp99-git/9g-debot
// @version      0.0.1
// @description  Help detect and block content spammers on the site.
// @author       https://github.com/hp99-git
// @match        https://9gag.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=9gag.com
// @updateURL    https://github.com/hp99-git/9g-debot/raw/refs/heads/tampermonkey/9g-debot.user.js
// @downloadURL  https://github.com/hp99-git/9g-debot/raw/refs/heads/tampermonkey/9g-debot.user.js
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const load = async function () {
        const gzipBase64String = "$(cat ./dist/app.js | gzip --best | base64 -w 0 -)";
        const stream = new Blob([Uint8Array.from(atob(gzipBase64String), c => c.charCodeAt(0))]).stream();
        let chunks = [];
        for await (const chunk of stream.pipeThrough(new DecompressionStream("gzip"))) chunks.push(chunk);
        new Function(new TextDecoder().decode(new Uint8Array(await new Blob(chunks).arrayBuffer())))();
        chunks = null;
    }

    load();
})();
EOF