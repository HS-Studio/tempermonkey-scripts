// ==UserScript==
// @name         Fullscreen Youtube TV
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       SkyHacker
// @match        https://www.youtube.com/tv
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        if(event.key == "ArrowLeft" && event.shiftKey == true) {
            GoFullscreen();
            //alert('Left was pressed');
        }
    });
})();

function GoFullscreen()
{
    const elem = document.documentElement;

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
