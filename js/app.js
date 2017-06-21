'use strict'
$(document).ready(function() {
    $(document).foundation();

    //Set element to 100% height of its parent element
    function equalizeHeight(selector, mediaQuery) {
            var elements = $(selector);
            $.each(elements, function (key, item) {
                if (Foundation.MediaQuery.atLeast(mediaQuery)) {
                    $(item).height($(item).parent().height() + "px");
                } else {
                    $(item).removeAttr("style");
                }
            });
    }



    //scroll down to element position
    var scroller = function(event, element) {
        event.preventDefault();
        var topOffset = document.getElementById(element).offsetTop;

        //this variable controlls the speed
        var scrollAmount = 35;

        var totalScrolled = window.scrollY;

        var scrollDown = function() {
            if (element) {
                if (totalScrolled + scrollAmount < topOffset) {
                    window.scrollBy(0, scrollAmount);
                    totalScrolled = totalScrolled + scrollAmount;
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
    $("#scroll-1, #ourBeans").click(function(event) {
        scroller(event, "mod-1");
    });
    $("#scroll-2, #findUs").click(function(event) {
        scroller(event, "mod-2");
    });
    $("#scroll-3, #contactUs").click(function(event) {
        scroller(event, "mod-3");
    });



    //swap background images on fixed element on scroll
    //configuration - image to desplay for each module
    var modules = [
        { id: "mod-cover", img: "url(images/coffee-bean-cup.jpg) no-repeat 0 center/cover"},
        { id: "mod-1", img: "url(images/coffee-onTable.jpg) no-repeat left bottom/cover" },
        { id: "mod-2", img: "url(images/coffee-cup.jpg) no-repeat 75% center/cover" },
        { id: "mod-3", img: "url(images/coffee-smartphone.jpg) no-repeat 70% center/cover" }
    ]


    function getModule(mods, element) {
        var bgEl = element;
        var coordinates = mods.map(function(el, key) {
            return document.getElementById(el.id).offsetTop;
        });

        coordinates.sort(function(a, b) {
            return a-b;
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

    var currentModule = getModule(modules);


    function swapImages(currentMod, modules, img1, img2) {
        var nextMod = modules[currentMod + 1] || modules[currentMod];

        if (currentMod % 2 === 0) {
            img1.style.background = modules[currentMod].img;
            img2.style.background = nextMod.img;
        }
        if (currentMod % 2 != 0) {
            img1.style.background = nextMod.img;
            img2.style.background = modules[currentMod ].img;
        }
    }

    var currentScroll = 0;
    var leftImg = document.getElementById('img-left');
    var rightImg = document.getElementById('img-right')
    window.onscroll = function() {
        currentScroll = window.scrollY;
    }

    function update() {
        requestAnimationFrame(update);
        if (Foundation.MediaQuery.atLeast("medium")) {
            swapImages(currentModule(currentScroll), modules, leftImg, rightImg);
        }

    }

    requestAnimationFrame(update);

    $(window).resize(function() {
      equalizeHeight(".image-panel .cover-panel", "medium");
      currentModule = getModule(modules);
    });

});





