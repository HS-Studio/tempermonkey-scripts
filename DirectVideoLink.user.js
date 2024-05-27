// ==UserScript==
// @name         Direct Video Link
// @namespace    http://tampermonkey.net/
// @version      0.4.6
// @updateURL    https://github.com/HS-Studio/tempermonkey-scripts/raw/main/DirectVideoLink.user.js
// @downloadURL  https://github.com/HS-Studio/tempermonkey-scripts/raw/main/DirectVideoLink.user.js
// @description  try to take over the world!
// @author       SkyHacker
// @match        http://*/*
// @match        https://*/*
// @match        https://vupload.com/*
// @icon         https://voe.sx/favicon.ico
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    //alert(document.documentURI.match(/\/e\//));
    //alert(document.title);

/*
    if(target == null)
    {
        video.addEventListener('loadeddata', function() {
            window.location.href = video.getAttribute("src");
            alert(video.getAttribute("src"));
        }, false);
    }
*/
    
    let data = TryVoe();

    if(data.link == null)
    {
        data = TryStreamtape();
    }

    if(data.link != null)
    {
        HidePlayerTitle();
        //CreateLink(data.video, data.link, data.link2);
        window.location.href = data.link;
        ToggleButton();
        document.onfullscreenchange = event => { ToggleButton() };
    }
})();

function TryVoe()
{
    const video = document.querySelector('video');

    let scripts = document.scripts;
    let link;
    let link2;

    for (var i = 0; i < scripts.length; i++)
    {
        if (scripts[i].text.match(/http.*\.mp4.*\d/) != null)
        {
            link = scripts[i].text.match(/http.*\.mp4.*\d/);
        }

        if (scripts[i].text.match(/http.*\.m3u8.*\d/) != null)
        {
            if (link == null)
            {
                link = scripts[i].text.match(/http.*\.m3u8.*\d/);
            }
            else
            {
                link2 = scripts[i].text.match(/http.*\.m3u8.*\d/);
            }
        }
    }
    return {video, link, link2};
}

async function TryStreamtape()
{
    let link = null;
    let video = await document.querySelectorAll("div[id*='link']");
    //const video = document.querySelector('video');

    for (link of Object.values(video))
    {
        var url = "https:" + link.textContent;
        if (url.includes(document.location.hostname + "/get_video?id="))
        {
            link = url;
            console.log(link);
            //alert(link);
        }
    }
    return {video, link};
}

function CreateLink(video, link, link2)
{
    let new_link = document.createElement("div");

    new_link.innerHTML = '<a class="videolink" id="VideoLink" style="display:block;user-select:all; z-index:99999 ;position: absolute; top: 10px; left: 10px; background-color: transparent; border: 0px;" href=' + link + '><svg width="32" height="32"><circle cx="16" cy="16" r="16" fill="white" fill-opacity="0.5" /><polygon points="13,10 13,22 23,16 "style="fill:;stroke:black;stroke-width:5;fill-rule:evenodd;stroke-linejoin:round" /></svg></a>';

    if(link2 != null)
    {
        new_link.innerHTML += '<a class="videolink" id="VideoLink2" style="user-select:all; z-index:99999 ;position: absolute; top: 10px; left: 50px; background-color: transparent; border: 0px;" href=' + link2 + '><svg width="32" height="32"><circle cx="16" cy="16" r="16" fill="white" fill-opacity="0.5" /><polygon points="13,10 13,22 23,16 "style="fill:;stroke:black;stroke-width:5;fill-rule:evenodd;stroke-linejoin:round" /></svg></a>';
    }

    video.parentNode.appendChild(new_link);
}

function ToggleButton()
{
    //alert(document.fullscreenElement);

    let buttons = document.getElementsByClassName('videolink');

    if(document.fullscreenElement)
    {
        for (let i = 0; i < buttons.length; i++)
        {
            buttons[i].style.display = "none";
        }
        //alert('Vollbild');
    }
    else
    {
        for (let i = 0; i < buttons.length; i++)
        {
            buttons[i].style.display = "block";
        }
    }
}

async function HidePlayerTitle()
{
    let vidTitle = await document.getElementsByClassName('plyr-player-title')[0];
    //alert(vidTitle);
    vidTitle.style.display = 'none';
}
