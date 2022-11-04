// ==UserScript==
// @name         Fullscreen Youtube TV
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       SkyHacker
// @match        https://www.youtube.com/tv
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    GoFullscreen();
    document.addEventListener('keydown', function(event) {
        if(event.key == "ArrowLeft" && event.shiftKey == true) {
            GoFullscreen();
            //alert('Left was pressed');
        }
    });
})();

function GoFullscreen()
{
    const elem = document.body;

    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    }
}
