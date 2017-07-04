'use strict';
$(document).ready(function() {
    $(document).foundation();

    //Set element to 100% height of its parent element
    function equalizeHeight(selector, mediaQuery) {
        var elements = $(selector);
        $.each(elements, function(key, item) {
            if (Foundation.MediaQuery.atLeast(mediaQuery)) {
                $(item).height($(item).parent().height() + "px");
            } else {
                $(item).removeAttr("style");
            }
        });
    }

    //scroll down to element position
    var scroller = function(event, element, nav) {
        event.preventDefault();
        var topOffset = document.getElementById(element).offsetTop + getUiOffset(getScrSizeDensity()) - document.getElementById(nav).offsetHeight;
        var scrollPos = window.pageYOffset;

        //this variable controlls the speed
        var scrollSpeed = 35;

        //scroll by posity or negative amount depending on if elements position relative
        //to current position.
        var scrollAmount = (topOffset - scrollPos >= 0) ? scrollSpeed : scrollSpeed * -1;

        var scrollDown = function() {
            if (element) {
                if (Math.abs(scrollPos - topOffset) > Math.abs(scrollAmount)) {
                    window.scrollBy(0, scrollAmount);
                    scrollPos = scrollPos + scrollAmount;
                    aFrame = requestAnimationFrame(scrollDown);
                } else {
                    window.scrollTo(0, topOffset);
                    cancelAnimationFrame(aFrame);
                    return;
                }
            }
        };
        var aFrame = requestAnimationFrame(scrollDown);
    };

    //configure buttons
    $("#home").click(function(event) {
        scroller(event, "mod-cover", "nav");
    });
    $("#scroll-1, #ourBeans").click(function(event) {
        scroller(event, "mod-1", "nav");
    });
    $("#scroll-2, #findUs").click(function(event) {
        scroller(event, "mod-2", "nav");
    });
    $("#scroll-3, #contactUs").click(function(event) {
        scroller(event, "mod-3", "nav");
    });


    //configuration for which image to show for each module
    //includes several sizes of images. Correct image is selected based on screen size and pixel dnsity
    var images = [
        { id: "mod-cover", selectedImg: "images/coffee-bean-cup_md.jpg", cssProps: "no-repeat 0 center/cover", size: [{ width: 500, url: "images/coffee-bean-cup_sm.jpg" }, { width: 750, url: "images/coffee-bean-cup_md.jpg" }, { width: 1400, url: "images/coffee-bean-cup_lg.jpg" }] },
        { id: "mod-1", selectedImg: "images/coffee-onTable_md.jpg", cssProps: "no-repeat left bottom/cover", size: [{ width: 500, url: "images/coffee-onTable_sm.jpg" }, { width: 750, url: "images/coffee-onTable_md.jpg" }, { width: 1400, url: "images/coffee-onTable_lg.jpg" }] },
        { id: "mod-2", selectedImg: "images/coffee-cup_md.jpg", cssProps: "no-repeat 75% center/cover", size: [{ width: 500, url: "images/coffee-cup_sm.jpg" }, { width: 750, url: "images/coffee-cup_md.jpg" }, { width: 1400, url: "images/coffee-cup_lg.jpg" }] },
        { id: "mod-3", selectedImg: "images/coffee-smartphone_md.jpg", cssProps: "no-repeat 70% center/cover", size: [{ width: 500, url: "images/coffee-smartphone_sm.jpg" }, { width: 750, url: "images/coffee-smartphone_md.jpg" }, { width: 1400, url: "images/coffee-smartphone_lg.jpg" }] }
    ];

    function preloadImages(images) {

        images.forEach(function(item) {
            var image = new Image();
            image.src = item.selectedImg;
            item.css = "url(" + item.selectedImg + ") " + item.cssProps;
        });
    }

    function getScrSizeDensity() {
        //get width depending on orientation of device (portrait or landscape);
        var width = (window.matchMedia("(orientation: portrait)").matches) ? Math.min(window.screen.width, window.screen.height) : Math.max(window.screen.width, window.screen.height);
        var height = (window.matchMedia("(orientation: portrait)").matches) ? Math.max(window.screen.width, window.screen.height) : Math.min(window.screen.width, window.screen.height);
        return [width, window.devicePixelRatio, height];
    }

    function setImgSize(screenProps) {

        //set selected image based provided size
        function selectImage(size) {
            images.map(function(item) {
                for (var i = 0; i < item.size.length; i++) {
                    if (item.size[i].width > size) {
                        item.selectedImg = item.size[i].url;
                        break;
                    }
                }
            });
        }

        //get image width needed
        if (screenProps[1] < 2) {
            selectImage(screenProps[0] / 2);
        } else {
            selectImage(screenProps[0]);
        }
    }



    var screen = getScrSizeDensity();
    setImgSize(screen);
    //only preload when larger than mobile.
    if (screen[0] > 639) {
        preloadImages(images);
    }

    function getModule(mods) {
        // var bgEl = element;
        var coordinates = mods.map(function(el, key) {
            return document.getElementById(el.id).offsetTop;
        });

        coordinates.sort(function(a, b) {
            return a - b;
        });

        return function(scrollY) {
            var module = 0;
            for (var i = 0, length = coordinates.length; i < length; i++) {
                if (scrollY < coordinates[i]) {
                    break;
                }
                module = i;
            }
            return module;
        }
    }

    var currentModule = getModule(images);


    function swapImages(currentMod, images, img1, img2) {
        var nextMod = images[currentMod + 1] || images[currentMod];

        if (currentMod % 2 === 0) {
            img1.style.background = images[currentMod].css;
            img2.style.background = nextMod.css;
        }
        if (currentMod % 2 != 0) {
            img1.style.background = nextMod.css;
            img2.style.background = images[currentMod].css;
        }
    }

    function makeNavFixed(scrollY, element) {
        if (scrollY > 170) {
            element.className = "nav-fixed";
        }
        if (scrollY <= 170) {
            element.className = "nav";
        }
    }

    var currentScroll = 0;
    var leftImg = document.getElementById('img-left');
    var rightImg = document.getElementById('img-right');
    var nav = document.getElementById('nav');

    var running = false;

    window.onscroll = function() {
        currentScroll = window.pageYOffset;
        if (running === false) {

            runAnimation();
        }
    }

    function runAnimation() {
        running = true;
        requestAnimationFrame(update);
    }

    function update() {
        if (Foundation.MediaQuery.atLeast("medium")) {
            swapImages(currentModule(currentScroll), images, leftImg, rightImg);
            makeNavFixed(currentScroll, nav);
        }
        running = false;
    }

    $(window).resize(function() {
        equalizeHeight(".image-panel .cover-panel", "medium");
        makeNavFixed(currentScroll, nav);
        var scr = getScrSizeDensity();
        setImgSize(scr);
        if (scr[0] > 639) {
            preloadImages(images);
        }
        currentModule = getModule(images);
    });

    function hamburgerMenu(hamburger, menu) {

        hamburger.addEventListener("click", function(event) {
            event.preventDefault();
            menu.classList.toggle('menu-visible');
        });
        hamburger.addEventListener("blur", function() {
            menu.classList.remove('menu-visible');
        });

    }

    hamburgerMenu(document.getElementById("hamburger"), document.getElementById("menu"));

    //fix for Saari on iOS to add an extra offset on scroll for the url bar
    function getUiOffset(screenSize) {
        var safari  = (navigator.userAgent.toLowerCase().indexOf("iphone") >= 0 && navigator.userAgent.toLowerCase().indexOf("crios") < 0) ? true : false;
        return (safari && screenSize[2] < screenSize[0]) ? screenSize[2] - window.innerHeight : 0;
    }



});
