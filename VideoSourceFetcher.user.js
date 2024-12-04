// ==UserScript==
// @name         Video Source Fetcher
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fügt einen Link hinzu, der die Videoquelle anzeigt
// @author       Dein Name
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function addLink(source) {
        const link = document.createElement('a');
        link.href = source;
        link.textContent = 'Download Video';
        link.style.position = 'absolute';
        link.style.top = '10px';
        link.style.left = '10px';
        link.style.zIndex = '1000';
        link.target = '_blank';// Öffnet den Link in einem neuen Tab

        document.body.appendChild(link);
    }

    function monitorNetworkRequests() {
        const originalFetch = window.fetch;
        window.fetch = function() {
            return originalFetch.apply(this, arguments).then(response => {
                const url = response.url;
                if (url.includes('.mp4') || url.includes('.m3u8')) {
                    console.log('Gefundene Videoquelle:', url);
                    addLink(url);
                }
                return response;
            });
        };

        const originalXhrOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function() {
            this.addEventListener('load', function() {
                const url = this.responseURL;
                if (url.includes('.mp4') || url.includes('.m3u8')) {
                    console.log('Gefundene Videoquelle:', url);
                    addLink(url);
                }
            });
            originalXhrOpen.apply(this, arguments);
        };
    }

    function getVideoSources(video) {
        return new Promise((resolve, reject) => {
            var sourcesFound = { mp4: null, m3u8: null };

            var checkSources = function() {
                var sources = video.getElementsByTagName('source');
                for (var i = 0; i < sources.length; i++) {
                    if (sources[i].src.includes('.mp4')) {
                        sourcesFound.mp4 = sources[i].src;
                    }
                    if (sources[i].src.includes('.m3u8')) {
                        sourcesFound.m3u8 = sources[i].src;
                    }
                }
                if (sourcesFound.mp4 || sourcesFound.m3u8) {
                    resolve(sourcesFound);
                } else {
                    reject('Keine passenden Quellen gefunden');
                }
            };

            video.addEventListener('play', checkSources);

            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList') {
                        checkSources();
                    }
                });
            });

            observer.observe(video, { childList: true, subtree: true });
        });
    }

    function monitorIframes() {
        const iframes = document.getElementsByTagName('iframe');
        for (let i = 0; i < iframes.length; i++) {
            try {
                const video = iframes[i].contentWindow.document.getElementsByTagName('video')[0];
                if (video) {
                    video.addEventListener('play', function() {
                        const videoSrc = video.currentSrc;
                        if (videoSrc.includes('.mp4') || videoSrc.includes('.m3u8')) {
                            console.log('Gefundene Videoquelle:', videoSrc);
                            addLink(videoSrc);
                        }
                    });
                }
            } catch (e) {
                // Mögliche Same-Origin-Policy-Verletzung
            }
        }
    }

    function pollForVideos() {
        setInterval(() => {
            const videos = document.getElementsByTagName('video');
            for (let i = 0; i < videos.length; i++) {
                const video = videos[i];
                const videoSrc = video.currentSrc;
                if ((videoSrc && (videoSrc.includes('.mp4') || videoSrc.includes('.m3u8'))) ||
                    (video.children.length > 0 && video.children[0].tagName === 'SOURCE')) {
                    console.log('Gefundene Videoquelle:', videoSrc || video.children[0].src);
                    addLink(videoSrc || video.children[0].src);
                    return;
                }
            }
        }, 2000);
    }

    function processVideos() {
        const videos = document.getElementsByTagName('video');
        for (let i = 0; i < videos.length; i++) {
            getVideoSources(videos[i]).then(sources => {
                if (sources.mp4) {
                    addLink(sources.mp4);
                } else if (sources.m3u8) {
                    addLink(sources.m3u8);
                }
            }).catch(error => {
                console.error(error);
            });
        }
    }

    window.addEventListener('load', () => {
        monitorNetworkRequests();
        monitorIframes();
        pollForVideos();
        processVideos();
    });
})();
