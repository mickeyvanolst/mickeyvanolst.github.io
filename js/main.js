var sliderRunning = false;
var slideDelay = 4000;

$(document).ready(function() {
    $(".video-container").fitVids({ customSelector: "iframe[src^='player.vimeo.com']"});

    $("#burger-menu").click(function( e ) {
        if($("#menu-overlay").css("display") == "block") {
          hideOverlayMenu(e);
        } else {
          showOverlayMenu(e);
        }
    });

    function hideOverlayMenu(e) {
      $("#menu-overlay").fadeOut({
          queue: false,
          duration: 500
      });
      $("body").removeClass( "hide-scroll");
      $("body").removeClass( "no-scroll");
    };

    function showOverlayMenu(e) {
      e.preventDefault();
      $("body").addClass( "hide-scroll");
      $("body, html").animate({
          scrollTop: 0,
          queue: false
      }, 500, "easeInOutSine", function() {
          $("body").removeClass( "hide-scroll");
          $("body").addClass( "no-scroll");
      });
      $("#menu-overlay").fadeIn({
          queue: false,
          duration: 500
      });
    };

    // check on window size and set the location fo the overview projects so it doesnt end up below the slideshow
    $( window ).resize(function() {
        // we fade out the overlay menu if the burger icon doesnt show anymore
        if ($("#burger-menu").css("display") == "none" ){
            $("#menu-overlay").fadeOut();
            $("body").removeClass( "no-scroll");
        }
    }).resize();

    var imgs = $(".slides-container > img").not(function() { return this.complete; });
    var count = imgs.length;

    if (count) {
        imgs.load(function() {
            count--;
            if (!count) {
                $(this).delay(slideDelay).queue(function() {
                  // console.log("all done!");
                  $('#slides').superslides('start');
                });
            }
        });
    }

    $(imgs.prevObject[0]).on('load',function(){
      // console.log("first slide image is loaded");
      sliderRunning = true;
      $('.loading-container').fadeOut( function() {
        $(this).remove();
      });
    });

    $('#slides').superslides({
        animation: 'fade',
        pagination: false,
        animation_easing: 'easeInOutSine',
        play: slideDelay
    });
    $('#slides').superslides('stop');


    // only if we're on the homepage, we attach a function to the scroll event to make the header stick
    if($("#homepage").length > 0) {
        // also we add an animation to the work button
        $(".work-btn").on("click", function( e ) {
            // console.log("work button clicked");
            if($("#menu-overlay").css("display") == "block") {
              // console.log("and overlay menu is active");
              hideOverlayMenu(e);
            }

            e.preventDefault();
            $("body, html").animate({
                scrollTop: $("#slides").height()
            }, 600, "easeInOutSine");

            // prevents animation from happening during user scroll
            $("body, html").on("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove", function(){
                $("body, html").stop();
            });

            return false;
        });

        var a = parseInt($("#header").css("marginLeft").replace(/[^-\d\.]/g, ''));
        var b = $("#homepage > #container").last().offset().left;

        $("#header > .left").css("position","fixed");
        $("#header > .right").css("position","fixed");

        // here we'll switch the header between fixed and absolute when we reached the threshold
        $.fn.followTo = function (pos) {
            var $this = this,
                $window = $(window);

            $window.scroll(function (e) {
                var a = parseInt($("#header").css("marginLeft").replace(/[^-\d\.]/g, ''));
                var b = $("#homepage > #container").last().offset().left;

                if ($window.scrollTop() > pos) {
                    $this.css({
                        position: 'absolute',
                        top: pos
                    });
                    $("#header > .right").css("right", (0 + 'px'));
                } else {
                    $this.css({
                        position: 'fixed',
                        top: $("#header").css("marginTop")
                    });
                    $("#header > .right").css("right", ((a+b) + 'px'));
                }
            });
        };

        // needed other wise it doesn't correct on the first load
        $("#header > .right").css("right", ((a+b) + 'px'));


        // check on window size and set the location fo the overview projects so it doesnt end up below the slideshow
        function setResize() {
            //console.log("resize fired");
            // only if we're on the homepage
            var a = parseInt($("#slides").height());
            var b = parseInt($("#header").height());
            var c = parseInt($("#header").css("marginTop").replace(/[^-\d\.]/g, ''));
            var d = parseInt($("#header").css("marginBottom").replace(/[^-\d\.]/g, ''));

            // we dynamically try to get the offset of the header
            $('#project-overview').css('margin-top',((a+b+c+d) +'px'));


            var a = parseInt($("#header").css("marginLeft").replace(/[^-\d\.]/g, ''));
            var b = $("#homepage > #container").last().offset().left;

            if($("#header > .right").css("position") == "fixed") {
                $("#header > .right").css("right", ((a+b) + 'px'));
            } else {
                $("#header > .right").css("right", (0 + 'px'));
            }

            $('#header > .left').followTo(parseInt($("#slides").height()));
            $('#header > .right').followTo(parseInt($("#slides").height()));
        }

        setResize();

        //window.onresize = setResize;
		window.addEventListener("resize", function() {
		    // Get screen size (inner/outerWidth, inner/outerHeight)
			setResize();
		}, false);

        function handleVisibilityChange() {
            if (document.hidden) {
                // console.log("document out of focus");
            } else  {
                setResize();
            }
        }

        document.addEventListener("visibilitychange", handleVisibilityChange, false);


        // in case someone hovers the project cover we still want a hover on the title
        // $("#project-overview-item a").hover(function() {
        //     $(this).parent().parent().find("#project-info").animate({
        //         opacity: 0.6,
        //         easing: "sineInOut",
        //         queue: false
        //     }, 300);
        // }, function() {
        //     $(this).parent().parent().find("#project-info").animate({
        //         opacity: 1,
        //         easing: "sineInOut",
        //         queue: false
        //     }, 300);
        // });
    }
});

$(window).load(function() {
  // just in case it doesn't trigger on load
  if(sliderRunning == false) {
    $('.loading-container').fadeOut( function() {
      $(this).remove();
    });

    $('body').delay(2000).queue(function() {
      $('#slides').superslides('start');
    });
  }
});
