var banner_player, amsSlider;
var letMove = true;

(function ($) {
    $.sanitize = function (input) {
        /*
        var output = input.replace(/<script[^>]*?>.*?<\/script>/gi, '').
                     replace(/<[\/\!]*?[^<>]*?>/gi, '').
                     replace(/<style[^>]*?>.*?<\/style>/gi, '').
                     replace(/<![\s\S]*?--[ \t\n\r]*>/gi, '');
        return output;
        */
        if (input == '' || input == undefined) {
            return '';
        }
        return input.toString().replace(/<(|\/|[^>\/bi]|\/[^>bi]|[^\/>][^>]+|\/[^>][^>]+)>/g, '');
    };
})(jQuery);

jQuery(document).ready(function(){
    jQuery(this).scrollTop(0);
});

function sanatize_input(string) {
    return $.sanitize(string);
    // return DOMPurify.sanitize(string);
}
var $owlCatchUp;
var evt;
var count = 0;
var iFrameTO;
var five_slider;
var player_base_url_trailer = $('#player_base_url_trailer').data('value');

jQuery(document).ready(function () {


    // ADD HIDDEN CLASS IF EDVERTISEMENT IS NONE

    jQuery('.play-episode-external-right #MPU:empty').parents('.play-episode-external-right').addClass('hidden');
    jQuery('.play-episode-external-right #MPU:not(:empty)').parents('.play-episode-external-right').removeClass('hidden');


    /* START PODCAST JOIN POPUP CLOSE CLODE */
    jQuery('.primium_ac .embed_popup_close').click(function () {
        jQuery(this).parents('.primium_ac').removeClass('show-embed-popup');
    });
    /* END PODCAST JOIN POPUP CLOSE CLODE */

    /* START PODCAST JOIN POPUP CLOSE CLODE */
    jQuery('.podcast_popup .embed_popup_close').click(function () {
        jQuery(this).parents('.podcast_popup').removeClass('show-embed-popup');
    });
    /* END PODCAST JOIN POPUP CLOSE CLODE */

    /* START CUSTOM UPLOAD FILE CODE */
    jQuery("input[type=file]").change(function (e) {
        jQuery(this).parents(".uploadFile").find(".filename").text(e.target.files[0].name);
    });
    /* START CUSTOM UPLOAD FILE CODE */

    /* START TO STOP USER INPUT ON DOB */
    jQuery('#datepicker').keydown(function () {
        jQuery(this).attr('readonly', 'readonly');
    });
    /* END TO STOP USER INPUT ON DOB */


    // save to history in case first open popup show
    var urlPathArray = window.location.pathname.split('/');

    if (urlPathArray[1] == 'popup_carousel' && urlPathArray.length > 3) {
        history.pushState({
            event_type: 'open_popup',
            carousel_id: urlPathArray[2],
            carousel_title: '',
            urlPath: window.location.href,
            url: window.location.protocol + "//" + window.location.host + "/carousel/" + urlPathArray[2],
        }, "", window.location.href);
    }

    /* ADD CLASS ON BODY WHEN FULL PAGE APPEAR */
    if (jQuery('.play-episode-sec').hasClass('fullpage-video') === true) {
        jQuery('body').addClass('no_space');
    }
    /* ADD CLASS ON BODY WHEN FULL PAGE APPEAR */

    /* START PLAYLIST HIDE/SHOW CODE */
    jQuery('body').removeClass('no_scroll');
    jQuery('.title_box .title a').click(function () {
        var url = sanatize_input($(this).data("carousel-url"));
        open_popup(url);

        var carousel_popup_url = sanatize_input($(this).data("carousel-popup-url"));
        var carousel_title = sanatize_input($(this).data("carousel-title"));
        var carousel_id = sanatize_input($(this).data("carousel-id"));
        history.pushState({
            event_type: 'open_popup',
            carousel_id: carousel_id,
            carousel_title: carousel_title,
            urlPath: carousel_popup_url,
            url: url,
        }, "", carousel_popup_url);

    });
    jQuery(document).on("click", ".embed_popup_close", function (e) {
        jQuery(this).parents('.load_more_popup').removeClass('show-embed-popup');
        jQuery('body').removeClass('no_scroll');
        var carousel_popup_url = sanatize_input($('#current_url').val());
        var carousel_title = '';
        var carousel_id = '';
        var url = '';

        history.pushState({
            event_type: 'close_popup',
            carousel_id: carousel_id,
            carousel_title: carousel_title,
            urlPath: carousel_popup_url,
            url: url,
        }, "", carousel_popup_url);
    });

    window.addEventListener('popstate', function (e) {
        var old_data = e.state;
        var carousel_popup_url = sanatize_input($('#current_url').val());
        var carousel_title = '';
        var carousel_id = '';
        var url = null;
        var event_type = '';
        if (old_data != null && Object.keys(old_data).length !== 0) {
            carousel_id = old_data.carousel_id;
            carousel_title = old_data.carousel_title;
            carousel_popup_url = old_data.urlPath;
            event_type = old_data.event_type;
            url = old_data.url;
        }

        if (url != null && url != '' && event_type == 'open_popup') {
            open_popup(url);
        }

        if (event_type == 'close_popup') {
            jQuery('.embed_popup_close').parents('.load_more_popup').removeClass('show-embed-popup');
            jQuery('body').removeClass('no_scroll');
        }

    });

    jQuery('.playlist_btn_wrap a').click(function () {
        jQuery('body').addClass('no_scroll');
        jQuery('.playlist_wrap').addClass('show-embed-popup');
    });
    jQuery('.popup_close').click(function () {
        jQuery(this).parent().removeClass('show-embed-popup');
        jQuery(this).parents('.load_more_popup').removeClass('show-embed-popup');
        jQuery('body').removeClass('no_scroll');
    });


    //HIDE OPTIONS IF CLICKED ANYWHERE ELSE ON PAGE
    jQuery(document).bind('click', function (e) {
        var $clicked = jQuery(e.target);
        if ($clicked.hasClass("embed-popup-inner")) {
            jQuery(".load_more_popup").removeClass('show-embed-popup');
            jQuery('body').removeClass('no_scroll');
        }
    });


    /* END PLAYLIST HIDE/SHOW CODE */


    var height = $('.desc_box').height();
    console.log(height);

    if (height >= 20) {
        $('.read_more').click(function () {
            $('.desc_box').removeClass('max');
            $('.read_more').hide();
            $('.read_less').show();
        });

        $('.read_less').click(function () {
            $('.desc_box').addClass('max');
            $('.read_more').show();
            $('.read_less').hide();
        });

    } else {
        $('.read_more').hide();
        $('.read_less').hide();
    }

    //search  click
    jQuery(".search-click").click(function (e) {
        jQuery('body').addClass("search-screen-add");
        //most search
        most_search();
    });
    jQuery(".close-search").click(function (e) {
        jQuery('body').removeClass("search-screen-add");
        jQuery('#search-result-div').html('');
        jQuery('#inputSearchTerm').val('');
    });

    // lazy loads elements with default selector as '.lozad'
    // const observer = lozad();
    // observer.observe();


    // const observer = lozad('.item', {
    //     loaded: function(el) {
    //         // Custom implementation on a loaded element
    //         el.classList.add('loaded');
    //     }
    // }); // lazy loads elements with default selector as '.lozad'
    // observer.observe();



    //fixed header
    $(window).scroll(function () {
        var header = $('.header');
        var scroll = $(window).scrollTop();
        if (scroll > 160) {
            header.addClass('fixed');
        } else {
            header.removeClass('fixed');
        }
        var checkWidth = $(document).width();
        if (checkWidth <= 767) {
            if (scroll > 20) {
                header.addClass('fixed');
            } else {
                header.removeClass('fixed');
            }
        }

    });



    $(window).scroll(function () {
        let scroll = $(window).scrollTop();
        let external_height = 0;
        if ($('.external-banner-area').length) {
            external_height = $('.external-banner-area').height();
            scroll = scroll - external_height;
        }

        if (banner_player !== undefined && banner_player !== null) {
            if (scroll > (200 + external_height)) {
                banner_player.pause();
                console.log("Banner paused");
            } else {
                banner_player.play();
            }
        }
    });





    // menu toggle
    jQuery('.mmenu').click(function () {
        jQuery('body').toggleClass('show-menu');
        jQuery(this).toggleClass('menu-close-icon');
    });
    jQuery('.close-button').click(function () {
        jQuery('body').removeClass('show-menu');
    });

    jQuery('.mmenu').click(function () {
        jQuery('li.has-dropdown.channels-dropdown').removeClass('dropdown-open channels-dropdown-show');
    });


    //Menu active class script
    var url = window.location.pathname;
    if (url == "/") {
        url = "/index.php";
    }

    var urlRegExp = new RegExp(url.replace(/\/$/, '') + "$"); // create regexp to match current url pathname and remove trailing slash if present as it could collide with the link in navigation in case trailing slash wasn't present there

    // now grab every link from the navigation
    $('.navbar ul li a, .f-menu ul li a,.catchup_live_link_item li a').each(function () {
        //console.log("testlink"+this.href.replace(/\/$/, ''));
        // and test its normalized href against the url pathname regexp
        if (urlRegExp.test(this.href.replace(/\/$/, ''))) {
            $(this).parent('li').addClass('active');
        }
    });


    // Bottom-top
    jQuery("#myBtn").hide();
    jQuery(function () {
        jQuery(window).scroll(function () {
            if (jQuery(this).scrollTop() > 100) {
                jQuery('#myBtn').fadeIn();
            } else {
                jQuery('#myBtn').fadeOut();
            }
        });

        // scroll body to 0px on click
        jQuery('#myBtn').click(function () {
            jQuery('body,html').animate({
                scrollTop: 0
            }, 1000);
            return false;
        });
    });



    // START ON MOUSEENTER SMALL-IFRAME VIDEO PLAY

    //Init small trailer stuff.
    var small_iframe = null;
    var small_iframe_obj = null;
    var small_player_obj = null;
    var small_player_duration_interval = null;
    var small_player_timeout = null;
    var small_item_width = null;


    //Add handle for message coming from player.
    window.addEventListener("message", receiveMessage, false);
    function receiveMessage(event) {
        // if(event.origin !== player_base_url_trailer) return;

        var data = event.data;
        if (data.player && data.player == "mango_player" && data._method == "get_muted") {
            console.log('get_muted fn:');
            if (small_iframe) { //this case mean small player
                console.log("Small iframe get_muted event");
                var mute = data.value;
                //console.log('small_iframe mute: '+mute);
                var t = small_iframe.parents(".img-wrap").find(".mute-icon-handler");
                if (mute) {
                    t.attr('data-mute', 1);
                    t.removeClass("muted");
                } else {
                    t.attr('data-mute', 0);
                    t.addClass("muted");
                }
            } else {
                var mute = data.value;
                //console.log('default mute: '+mute);
                var t = $('.mute');
                if (mute) {
                    t.attr('data-mute', 0);
                    t.addClass("muted");
                } else {
                    t.attr('data-mute', 1);
                    t.removeClass("muted");
                }
                if ($('.volume').length) {
                    console.log("banner iframe get_muted event");
                    var t = $('.volume');
                    if (mute) {
                        t.attr('data-mute', 0);
                        t.addClass("muted");
                    } else {
                        t.attr('data-mute', 1);
                        t.removeClass("muted");

                    }
                }
            }

        }
    }



    jQuery(document).on("click", ".new-thumbnails-img-show-btn", function (e) {
        e.preventDefault();
        remove_small_player();
        // dataLayer.push({
        //     'event':'eventTracker',
        //     'eventCategory':'videos',
        //     'eventAction':'trailer : close',
        //     'eventLabel':$(this).parents('.img-wrap').data('trailer-show')
        // });
    });






    /* START ADVANCED VERTICAL SLIDER CODE */
    var time_scroll, time_scroll_leave;
    if (window.matchMedia('(min-width: 1201px)').matches) {

        jQuery( document ).on( "mousemove", "body", function ( e ) {
            // $this = jQuery(this);
            // $this.parents( ".advanced_movie_slider" ).removeClass( "stop_hover_slider" );
            // $this.parents( ".advanced_movie_slider" ).find( ".items" ).removeClass( "stop_hover" );

            jQuery( "body" ).find( ".advanced_movie_slider" ).removeClass( "stop_hover_slider" );
            jQuery( "body" ).find( ".advanced_movie_slider" ).find( ".items" ).removeClass( "stop_hover" );
        } );

        jQuery( document ).on( "mouseenter", ".advanced_movie_slider .owl-stage .items", function ( e ) {
            $this = jQuery(this);
            $this_width = $this.width();

            clearTimeout(time_scroll);
            time_scroll = setTimeout(() => {
                $this.parents( ".advanced_movie_slider" ).addClass( "stop_hover_slider" );
                $this.addClass( "stop_hover" );

                let hovered_width = $this.offset().left + $this.parents(".owl-item").width();
                console.log("hovered_width: ", hovered_width, " --- $this.offset().left: ", $this.offset().left);
                let ww = jQuery(window).width();
                let translate_val = $this.parents(".owl-stage").css("transform").split(",");
                let scrolled_pixel = translate_val[4];

                // let addValue = parseInt(149) + parseInt(translate_val[4]);
                // console.log("mari addValue " +  addValue);

                let allowed_scroll_width = $this.parents(".owl-stage").width() - jQuery(window).width();
                let abs_scrolled_pixel = Math.abs(scrolled_pixel);

                let move_slide = 1;

                console.log(hovered_width);
                if (hovered_width > ww) {
                    let scroll_pixel = ww - hovered_width;
                    // console.log( "scroll_pixel => " + scroll_pixel );
                    console.log("Scroll");
                    console.log("allowed_scroll_width: ", allowed_scroll_width);
                    console.log("Width-left: ", (hovered_width - $this.offset().left), " --- Item-width: ", $this.parents(".owl-item").width(), " scroll_pixel: ", scroll_pixel, " $this_width: ", $this_width);
                    let remaining_width = (hovered_width - ww);
                    if (remaining_width > $this_width) {
                        move_slide = Math.floor(remaining_width / $this_width) + 1;
                    }

                    if (translate_val) {
                        let new_scroll_pixel = parseFloat(scrolled_pixel) + parseFloat(scroll_pixel);
                        let translate_prop = `translate3d(${new_scroll_pixel}px, 0, 0)`;
                        console.log("translate_prop: ", translate_prop);
                        // $this.parents( ".owl-stage" ).css( "transform", translate_prop );

                        let current = $this.parents(".five-slider").find(".owl-item.active").index();
                        console.log("Current: ", current, " Move: ", move_slide);
                        $this.parents(".five-slider").data('owl.carousel').to(current + move_slide, 300, true);
                        // amsSlider.data('owl.carousel').to(current + 2, 100, true);
                    }
                } else if ($this.offset().left < 0) {
                    if (translate_val) {
                        let new_scroll_pixel = parseFloat(scrolled_pixel) - parseFloat($this.offset().left);
                        let scroll_pixel = hovered_width - $this.offset().left;

                        let remaining_width = (scroll_pixel - hovered_width);
                        if (remaining_width > $this_width) {
                            move_slide = Math.floor(remaining_width / $this_width) + 1;
                        }
                        let current = $this.parents(".five-slider").find(".owl-item.active").index();
                        let translate_prop = `translate3d(${new_scroll_pixel}px, 0, 0)`;
                        console.log("scroll_pixel: ", scroll_pixel, " new_scroll_pixel: ", new_scroll_pixel, " move_slide: ", move_slide);
                        $this.parents(".five-slider").data('owl.carousel').to(current + move_slide, 300, true);
                        // $this.parents( ".owl-stage" ).css( "transform", translate_prop );
                    }
                } else {
                    console.log("Don't Scroll");
                }
            }, 1200);
        });



        jQuery(document).on("mouseleave", ".advanced_movie_slider .owl-stage .items", function (e) {
            $this = jQuery(this);
            $this_width = $this.width();

            clearTimeout(time_scroll_leave);
            time_scroll_leave = setTimeout(() => {
                let hovered_width = $this.offset().left + $this.parents(".owl-item").width();
                console.log("hovered_width: ", hovered_width, " --- $this.offset().left: ", $this.offset().left);
                let ww = jQuery(window).width();
                let translate_val = $this.parents(".owl-stage").css("transform").split(",");
                let scrolled_pixel = translate_val[4];

                let allowed_scroll_width = $this.parents(".owl-stage").width() - $this.parents(".advanced_movie_slider ").width();
                let abs_scrolled_pixel = Math.abs(scrolled_pixel);

                let move_slide = 1;

                console.log("allowed_scroll_width: ", allowed_scroll_width, " --- abs_scrolled_pixel: ", abs_scrolled_pixel);

                if (allowed_scroll_width < abs_scrolled_pixel) {
                    // let tmp_revert_back = `translate3d(-${allowed_scroll_width}px, 0, 0)`;
                    // $this.parents( ".owl-stage" ).css( "transform", tmp_revert_back );
                    let current = $this.parents(".five-slider").find(".owl-item.active").index();
                    let move_slide = Math.floor(allowed_scroll_width / $this_width);
                    $this.parents(".five-slider").data('owl.carousel').to(current - move_slide, 300, true);
                }
            }, 600);
        });

    }
    /* END ADVANCED VERTICAL SLIDER CODE */


    $(document).on("mouseenter", ".slider .item", function (e) {
        var current_card = jQuery(this);
        var iframe_data = current_card.find('.img-wrap').attr('data-iframe');
        var iframe_ended = current_card.find('.img-wrap').attr('data-ended');
        var trailer_duration = current_card.find('.img-wrap').attr('data-duration');


        if (iframe_data != "" && iframe_data != undefined && iframe_ended != "yes") {
            //Add trailer iframe

            small_player_timeout = setTimeout(function () {

                current_card.find(".img-wrap").append('<iframe id="small_video_trailer" src="' + iframe_data + '" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" width="560" height="315" style="border: 0;"></iframe>');
                small_iframe = current_card.find("#small_video_trailer");


                //Try to remove big player if needed.
                //remove_big_player();


                //show mute icon.
                current_card.find(".mute-icon-handler").show();
                current_card.find(".progress-bar").show();
                current_card.find(".new-thumbnails-img-show-btn").show();

                jQuery('#small_video_trailer').each(function () {
                    small_player_obj = new playerjs.Player(jQuery(this)[0]);
                    small_iframe_obj = jQuery(this);






                    //we need to detect if the player by default is muted.
                    small_player_obj.on('play', function () {
                        console.log(small_iframe[0]);

                        if (banner_player !== undefined && banner_player !== null) {
                            banner_player.pause();
                            console.log("Banner paused");
                        }

                        if (small_iframe) {
                            small_iframe[0].contentWindow.postMessage({
                                "_method": "get_muted",
                                "player": "mango_player",
                                "parameter": "",
                            }, player_base_url_trailer);

                            //Send trailer dimension
                            // if(dataLayer){
                            //     dataLayer.push({
                            //         'cd_video_type': 'trailer',
                            //         "cd_show_category": current_card.find('.img-wrap').data("trailer-category"),
                            //         'cd_show_name': current_card.find('.img-wrap').data("trailer-show"),
                            //         'cd_show_season': current_card.find('.img-wrap').data("trailer-season")
                            //     });
                            // }
                        }
                    });

                    small_player_obj.on('pause', function () {
                        console.log("pause");
                    });

                    small_player_obj.on('ended', function () {
                        console.log('ended');
                        current_card.find('.img-wrap').attr('data-ended', 'yes');
                        remove_small_player();
                    });

                    update_progress_bar(current_card, trailer_duration);
                    small_player_duration_interval = window.setInterval(function () {
                        update_progress_bar(current_card, trailer_duration);
                    }, 2 * 1000);
                });
            }, 1500); //small wait to load the iframe
        }
    });


    $(document).on("click", ".mute-icon-handler", function (e) {
        e.preventDefault();
        // $( ".mute-icon-handler" ).click(function(e){ //this is the mute for small trailer video.
        if (!small_iframe) return false;

        var button = jQuery(this);
        var mute = sanatize_input(button.attr('data-mute'));

        if (mute == '0') {
            small_iframe[0].contentWindow.postMessage({
                "_method": "mute",
                "player": "mango_player",
                "parameter": "",
            }, player_base_url_trailer);

            console.log("mute is: " + mute);
            button.attr('data-mute', 1);
            button.removeClass("muted");

            // dataLayer.push({
            //     'event':'eventTracker',
            //     'eventCategory':'videos',
            //     'eventAction':'trailer : mute',
            //     'eventLabel':$(this).parents('.img-wrap').data('trailer-show')
            // });
        } else {
            small_iframe[0].contentWindow.postMessage({
                "_method": "unmute",
                "player": "mango_player",
                "parameter": "",
            }, player_base_url_trailer);
            //player.unmute();
            console.log("mute is: " + mute);

            button.attr('data-mute', 0);
            button.addClass("muted");

            // dataLayer.push({
            //     'event':'eventTracker',
            //     'eventCategory':'videos',
            //     'eventAction':'trailer : unmute',
            //     'eventLabel':$(this).parents('.img-wrap').data('trailer-show')
            //
            // });
        }
    });



    //this event to remove run iframe
    $(document).on("mouseleave", ".slider .item", function (e) {
        remove_small_player();
    });

    //this function to update progress bar of small trailer player.
    function update_progress_bar(current_card, trailer_duration) {
        if (!small_player_obj) return false;

        small_player_obj.getCurrentTime(function (duration) {
            var percentage = (100 - ((trailer_duration - duration) / trailer_duration) * 100);
            current_card.find(".progress-bar .total-width").css("width", percentage + "%");
            // console.log('small obj-Hunter' + small_player_obj);
        });
    }

    //remove small player
    function remove_small_player() {
        if (small_player_timeout) {
            clearTimeout(small_player_timeout);
        }

        if (small_iframe) {
            //Hide mute button.
            small_iframe.parents(".img-wrap").find(".mute-icon-handler").hide();
            small_iframe.parents(".img-wrap").find(".progress-bar").hide();
            small_iframe.parents('.img-wrap').find(".new-thumbnails-img-show-btn").hide();

            //Stop seek bar function update
            if (small_player_duration_interval) {
                clearInterval(small_player_duration_interval);
            }

            //remove iframe.
            small_iframe.off();
            small_iframe.remove();

            //zero all variable.
            small_iframe = null;
            small_player_obj = null;
            small_iframe_obj = null;
        }
    }
    // END ON MOUSEENTER SMALL-IFRAME VIDEO PLAY



    //home page banner close remove iframe ( Also, Use On Ramadan-Page )

    jQuery(document).on('click', '.action-button .close', function () {
        close_player();

    });

    var iframe = "";
    //Add click event on mute button.

    var action_button;

    if (jQuery('.ramadan_comm_sec ').length) {
        action_button = ".HeroSlider .slider_wrap";
    } else {
        action_button = ".HeroSlider .volume";
    }

    jQuery(document).on("click", action_button, function (e) {

        // action_button.click(function(e) {
        var t = jQuery(this);
        var mute = t.attr('data-mute');
        const activeIframe = jQuery(".hero-section .owl-item.active iframe")[0];
        const ifr = activeIframe ? activeIframe : iframe[0];
        if (ifr) {
            if (mute == '1') {
                // console.log(iframe[0]);
                // iframe[0].contentWindow.postMessage({
                ifr.contentWindow.postMessage({
                    "_method": "mute",
                    "player": "mango_player",
                    "parameter": "",
                }, '*');
                //player.mute();
                console.log("mute is" + mute);
                t.attr('data-mute', 0);
                t.addClass("muted");
            } else {
                // iframe[0].contentWindow.postMessage({
                ifr.contentWindow.postMessage({
                    "_method": "unmute",
                    "player": "mango_player",
                    "parameter": "",
                }, '*');
                //player.unmute();
                console.log("mute is" + mute);

                t.attr('data-mute', 1);
                t.removeClass("muted");
            }
        }
    });

    // jQuery(".owl-carousel").on("changed.owl.carousel", function (e) {
    //     const observer = lozad();
    //     observer.observe();
    // });
    // jQuery(".owl-carousel").on("initialized.owl.carousel", function (e) {
    //     const observer = lozad();
    //     observer.observe();
    // });
    jQuery(document).bind('ready ajaxComplete', function () {
        // lazy Load
        const observer = lozad(); // lazy loads elements with default selector as '.lozad'
        observer.observe();
    })



    var iframe = "";
    //Add click event on mute button.
    $(".banner-slide").find('.mute').click(function (e) {

        var t = jQuery(this);
        var mute = sanatize_input(t.attr('data-mute'));
        if (mute == '1') {
            iframe[0].contentWindow.postMessage({
                "_method": "mute",
                "player": "mango_player",
                "parameter": "",
            }, player_base_url_trailer);
            //player.mute();
            t.attr('data-mute', 0);
            console.log("mute is" + mute);
            t.addClass("muted");
            // dataLayer.push({
            //     'event':'eventTracker',
            //     'eventCategory':'videos',
            //     'eventAction':'trailer : mute',
            //     'eventLabel':$(this).parents('.banner-slide').data('trailer-show')
            // });

        } else {
            iframe[0].contentWindow.postMessage({
                "_method": "unmute",
                "player": "mango_player",
                "parameter": "",
            }, player_base_url_trailer);
            //player.unmute();
            console.log("mute is" + mute);

            t.attr('data-mute', 1);
            t.removeClass("muted");
            // dataLayer.push({
            //     'event':'eventTracker',
            //     'eventCategory':'videos',
            //     'eventAction':'trailer : unmute',
            //     'eventLabel':$(this).parents('.banner-slide').data('trailer-show')
            // });
        }
    });

    function moveSlider(e) {
        evt = e;
        var time_seconds;
        jQuery('.HeroSlider .item').removeClass('hide-caption');
        jQuery(".slider-banner").removeClass("hide-nav-slider");
        jQuery('.HeroSlider').find('iframe').remove();
        count++;

        console.log("Moving...");

        if (jQuery('.ramadan_comm_sec ').length) {
            time_seconds = 8000;
        } else {
            time_seconds = 5000;
        }

        clearTimeout(iFrameTO);
        iFrameTO = setTimeout(function () {
            console.log("In Timeout");
            var scurrent = e.item.index;
            jQuery('.HeroSlider .item').removeClass('hide-caption');
            jQuery(".slider-banner").removeClass("hide-nav-slider");
            jQuery('.HeroSlider-img').find('iframe').remove();
            iframe_src = jQuery(e.target).find(".owl-item").eq(scurrent).find('.HeroSlider-img').attr('data-embed-url');
            if (iframe_src != "" && iframe_src != undefined) {
                if (jQuery('.ramadan_comm_sec ').length) {
                    jQuery(e.target).find(".owl-item").eq(scurrent).find('.slider_wrap').append('<iframe id="video_trailer" src="' + iframe_src + '" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" width="560" height="315" style="border: 0;" title="video trailer"></iframe>');
                } else {
                    jQuery(e.target).find(".owl-item").eq(scurrent).find('.HeroSlider-img').append('<iframe id="video_trailer" src="' + iframe_src + '" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" width="560" height="315" style="border: 0;" title="video trailer"></iframe>');
                }

                jQuery(e.target).find(".owl-item").eq(scurrent).find('.item').addClass('hide-caption');
                jQuery(e.target).find(".owl-item").eq(scurrent).parents('.slider-banner').addClass('hide-nav-slider');


                iframe = jQuery(".HeroSlider .HeroSlider-img").find("iframe");
                var playerObj = "";
                var player_localhost = player_base_url_trailer.split('//')[1];
                jQuery('iframe[src*="'+ player_localhost +'"]').each(function () {
                    // var player = new playerjs.Player(jQuery(this)[0]);
                    // var playerIframe = document.getElementById('video_trailer');

                    banner_player = new playerjs.Player(jQuery(this)[0]);
                    playerIframe = document.getElementById('video_trailer');

                    playerObj = jQuery(this);

                    //we need to detect if the player by default is muted.
                    banner_player.on('play', function () {
                        if (typeof iframe[0] != "undefined") {
                            iframe[0].contentWindow.postMessage({
                                "_method": "get_muted",
                                "player": "mango_player",
                                "parameter": "",
                            }, '*');
                        }
                    });
                    banner_player.on('ended', function () {
                        console.log('ended');
                        // jQuery(".banner-slider .banner-slide").removeClass("hide-caption");
                        //  iframe.remove();
                        jQuery(".HeroSlider .item").removeClass("hide-caption");
                        jQuery(".slider-banner").removeClass("hide-nav-slider");
                        var iframe = jQuery(".HeroSlider .item").find("iframe");
                        iframe.remove();
                        //jQuery('.banner-slider').trigger('play.owl.autoplay',[5000]);
                    });
                });
            }

        }, time_seconds);
    }

    // Banner SLider Js

    jQuery('.HeroSlider').on('initialized.owl.carousel', function (e) {
        moveSlider(e);
        const observer = lozad();
        observer.observe();
    });


    // jQuery('.main-home-slider').on('initialized.owl.carousel', function(e) {
    //     moveSlider(e);
    // });
    // // // Banner SLider Js
    // jQuery('.play-trailer').click(function(e) {
    //     moveSlider(e);
    // });

    //owl rtl and ltr
    mydir = jQuery("html").attr("dir");
    mylang = jQuery("html").attr("lang");
    if (mydir == 'rtl' || mylang == 'ar') {
        rtlVal = true
    }
    else {
        rtlVal = false
    }


    var sync1 = $("#HeroSlider");
    var sync2 = $("#HeroSliderNav");
    var slidesPerPage = 5; //globaly define number of elements per page
    var syncedSecondary = true;

    sync1.owlCarousel({
        rtl: rtlVal,
        items: 1,
        slideSpeed: 2000,
        nav: false,
        autoplay: false,
        dots: true,
        loop: true,
        responsiveRefreshRate: 200,
        responsive: {
            767: {
                dots: true,
            }
        }
    }).on('changed.owl.carousel', syncPosition);

    // Banner SLider Js
    sync1.on('changed.owl.carousel', function (e) {

        // const observer = lozad();
        // observer.observe();

        if (!syncedSecondary) {
            console.log("Moving...");
            moveSlider(e);
            return;
        }

        if (sync2 != undefined && sync2.length) {
        } else {
            moveSlider(e);
        }
    });

    sync2
        .on('initialized.owl.carousel', function () {
            sync2.find(".owl-item").eq(0).addClass("current");
        })
        .owlCarousel({
            rtl: rtlVal,
            items: slidesPerPage,
            dots: false,
            nav: false,
            margin: 35,
            smartSpeed: 200,
            slideSpeed: 500,
            slideBy: slidesPerPage, //alternatively you can slide by 1, this way the active slide will stick to the first item in the second carousel
            responsiveRefreshRate: 100,
            responsive: {
                768: {
                    margin: 20,
                }
            },
        }).on('changed.owl.carousel', syncPosition2, moveSlider);

    function syncPosition(el, e) {
        //if you set loop to false, you have to restore this next line
        //var current = el.item.index;

        //if you disable loop you have to comment this block
        var count = el.item.count - 1;
        var current = Math.round(el.item.index - (el.item.count / 2) - .5);

        if (current < 0) {
            current = count;
        }
        if (current > count) {
            current = 0;
        }

        //end block

        console.log("In syncPosition: ", current, start, end, sync2);

        if (sync2 != undefined && sync2.length) {

            sync2
                .find(".owl-item")
                .removeClass("current")
                .eq(current)
                .addClass("current");
        }
        var onscreen = sync2.find('.owl-item.active').length - 1;
        var start = sync2.find('.owl-item.active').first().index();
        var end = sync2.find('.owl-item.active').last().index();

        if (current > end) {
            if (sync2 != undefined && sync2.length) {
                sync2.data('owl.carousel').to(current, 100, true);
            }
        } else if (current < start) {
            if (sync2 != undefined && sync2.length) {
                sync2.data('owl.carousel').to(current - onscreen, 100, true);
            }
        } else {
            moveSlider(el, e);
        }
    }

    function syncPosition2(el, e) {

        console.log("In syncPosition2: ", syncedSecondary);

        if (syncedSecondary) {
            var number = el.item.index;
            sync1.data('owl.carousel').to(number, 100, true);
        }
    }

    sync2.on("click", ".owl-item", function (e) {
        e.preventDefault();
        var number = $(this).index();
        sync1.data('owl.carousel').to(number, 300, true);
    });


    jQuery('.four-slider').owlCarousel({
        rtl: rtlVal,
        items: 6,
        loop: true,
        margin: 25,
        nav: true,
        // autoWidth:true,
        dots: false,
        navText: ['<img alt="slide left" src="/images/left-arrow.png">', '<img alt="slide right" src="/images/right-arrow.png">'],
        responsive: {
            0: {
                items: 2,
                margin: 10,
                autoWidth: true,
                loop: false,
            },
            375: {
                items: 2,
                margin: 10,
                autoWidth: true,
                loop: false,
            },
            768: {
                items: 4,
                margin: 20,
            },
            1200: {
                items: 6
            }
        }
    });

    jQuery('#InnerHeroSlider').owlCarousel({
        rtl: rtlVal,
        items: 1,
        loop: false,
        margin: 35,
        nav: false,
        dots: false,
        onInitialized: callback,
    });


    function callback(event) {
        var items = event.item.count;
        //console.log(items);
        if (items <= 1) {
            $('.owl-carousel .owl-stage').addClass("single");
        }
    }

    jQuery('.resume-watching .five-slider,.top_watch_sec .five-slider').owlCarousel({
        rtl: rtlVal,
        items: 6,
        navText: ['<img alt="slide left" src="/images/left-arrow.png">', '<img alt="slide right" src="/images/right-arrow.png">'],
        loop: false,
        margin: 4,
        // autoWidth:true,
        nav: true,
        dots: true,
        responsive: {
            0: {
                items: 2,
                // margin:10,
                autoWidth: true,
            },
            375: {
                items: 2,
                // margin:10,
                autoWidth: true,
            },
            768: {
                items: 4,
                // margin: 4,
                autoWidth: true,
            },
            1201: {
                items: 5,
            },
            1441: {
                items: 6,
            }
        }
    });

    amsSlider = jQuery('.advanced_movie_slider .five-slider').owlCarousel({
        rtl: rtlVal,
        // items:6,
        autoWidth: true,
        navText: ['<img alt="slide left" src="/images/left-arrow.png">', '<img alt="slide right" src="/images/right-arrow.png">'],
        loop: false,
        margin: 4,
        // autoWidth:true,
        nav: true,
        dots: true,
        responsive: {
            0: {
                items: 2,
                autoWidth: true,
            },
            375: {
                items: 2,
                autoWidth: true,
            },
            768: {
                items: 4,
                autoWidth: true,
            },
            1201: {
                items: 4,
            },
            1441: {
                items: 6,
            }
        }
    });

    // amsSlider.on('changed.owl.carousel', function(e) {

    // } );


    jQuery('.related .five-slider, .five-slider').owlCarousel({
        rtl: rtlVal,
        items: 6,
        navText: ['<img alt="slide left" src="/images/left-arrow.png">', '<img alt="slide right" src="/images/right-arrow.png">'],
        loop: false,
        margin: 4,
        // autoWidth:true,
        nav: true,
        dots: true,
        responsive: {
            0: {
                items: 2,
                // margin:10,
                autoWidth: true,
            },
            375: {
                items: 2,
                // margin:10,
                autoWidth: true,
            },
            768: {
                items: 4,
                // margin: 4,
                autoWidth: true,
            },
            1201: {
                items: 5,
            },
            1441: {
                items: 6,
            }
        }
    });





    five_slider = function (el) {
        jQuery(el).owlCarousel({
            rtl: rtlVal,
            items: 6,
            navText: ['<img alt="slide left" src="/images/left-arrow.png">', '<img alt="slide right" src="/images/right-arrow.png">'],
            loop: false,
            margin: 4,
            // autoWidth:true,
            nav: true,
            dots: true,
            responsive: {
                0: {
                    items: 2,
                    // margin:10,
                    autoWidth: true,
                },
                375: {
                    items: 2,
                    // margin:10,
                    autoWidth: true,
                },
                768: {
                    items: 4,
                    // margin: 4,
                    autoWidth: true,
                },
                1201: {
                    items: 5,
                },
                1441: {
                    items: 6,
                }
            }
        });
    };

    five_slider(".five-slider");



    // cast-and-crew-slider
    jQuery('.cast-and-crew-slider').owlCarousel({
        rtl: rtlVal,
        items: 6,
        loop: false,
        margin: 44,
        nav: false,
        dots: false,
        responsive: {
            0: {
                items: 2,
                margin: 10,
            },
            375: {
                items: 2,
                margin: 10,
            },
            768: {
                items: 6,
                margin: 20,
            },
            1200: {
                items: 7,
            },
            1441: {
                items: 8,
            }
        }
    });

    jQuery('.bbcplayer-slider').owlCarousel({
        rtl: rtlVal,
        loop: true,
        items: 3,
        responsiveClass: true,
        nav: true,
        margin: 0 - 550,
        center: true,
        dots: false,
        slideTransition: 'linear',
        responsive: {
            0: {
                items: 1,
                margin: 0,
            },
            768: {
                items: 3,
                margin: 0 - 450,
            },
            1200: {
                items: 3,
            },
        }
    });

    // //category slider
    // jQuery('.category-listing > ul').owlCarousel({
    //     rtl: rtlVal,
    //     items: 5,
    //     loop: false,
    //     margin: 0,
    //     nav: true,
    //     autoWidth:true,
    //     dots: false,
    //     responsive: {
    //         0: {
    //             items: 2,
    //         },
    //         375: {
    //             items: 2,
    //         },
    //         768: {
    //             items: 4,
    //         },
    //         1000: {
    //             items: 5,
    //         }
    //     }
    // });



    $owlCategoryListing = jQuery('.category-listing > ul');

    // $owlCategoryListing.on('initialized.owl.carousel', function(e) {
    //     let idxcl = jQuery( '.category-listing > ul div.owl-item a.active' ).parent().parent().index();
    //     console.log( idxcl );
    //     // let totalCLItems = jQuery( '.category-listing > ul div.owl-item' ).length;
    //     // idxcl = Math.abs( totalCLItems - idxcl );
    //     // console.log( idxcl );
    //     $owlCategoryListing.trigger('to.owl.carousel', [idxcl, 300, true]);
    // });

    $owlCategoryListing.owlCarousel({
        rtl: rtlVal,
        items: 5,
        loop: false,
        margin: 0,
        nav: true,
        autoWidth: true,
        dots: false,
        responsive: {
            0: {
                items: 2,
            },
            375: {
                items: 2,
            },
            768: {
                items: 4,
            },
            1000: {
                items: 5,
            }
        }
    });


    $(window).resize(function () {
        $('.category-listing > ul').trigger('refresh.owl.carousel');
    });

    // let clonedIdx = 0, stopped = 0;
    // jQuery( ".owl-item" ).each( function( i, el ){
    //     if( jQuery( el ).hasClass( "cloned" ) && !stopped ){
    //         ++clonedIdx;
    //     } else {
    //         stopped = 1;
    //     }
    // } );

    jQuery(".filter-button").click(function () {
        var value = jQuery(this).data("filter");
        if (value == "all") {
            jQuery('.filter').show('1000');
        } else {
            jQuery(".filter").not('.' + value).hide('3000');
            jQuery('.filter').filter('.' + value).show('3000');
        }
        jQuery(".filter-button").removeClass("active")
        jQuery(this).addClass("active");
        jQuery('.category-title').html(value);
    });

    //on scroll hide and show header
    var lastScrollTop = 0;
    var headerHeight = jQuery("header").height();
    jQuery(window).scroll(function (event) {
        jQuery(".search-suggestion").css('opacity', 0);
        document.activeElement.blur();
        var st = jQuery(this).scrollTop();
        if (st > lastScrollTop) {
            jQuery('.header').addClass('scrolling_down');
            jQuery('.header').removeClass('scrolling_up');
            jQuery('.has-dropdown').removeClass('channels-dropdown-show');
        } else {
            jQuery('.header').addClass('scrolling_up');
            jQuery('.header').removeClass('scrolling_down');
        }
        lastScrollTop = st;
    });
    jQuery(window).scroll(function () {
        setTimeout(function () {
            jQuery('.header').removeClass('scrolling_up');
            jQuery('.header').removeClass('scrolling_down');
        }, 1200);
    });

    jQuery(".search-form input").focus(function () {
        jQuery(".search-suggestion").css('opacity', 1);

    })





    // Responsive jQuery

    if ($(window).width() < 960) {
        // Mobie Dropdown Sub Menu
        jQuery('.has-dropdown > a').on('click', function () {
            jQuery(this).parents('li.has-dropdown').toggleClass('dropdown-open');
        });

        jQuery('.back-mobile').on('click', function () {
            jQuery(this).parents('li.has-dropdown').removeClass('dropdown-open channels-dropdown-show');
        });

    }

    // START CUSTOM STICKY ELEMENTS CODE
    if ($(window).width() > 767) {
        jQuery("#play_episode").sticky({ topSpacing: 130 });
    }
    // END CUSTOM STICKY ELEMENTS CODE




    //TOGGLING NESTED ul
    jQuery(".drop-down .selected").click(function () {
        if (jQuery(this).next().hasClass("active")) {
            jQuery(this).next().removeClass("active");
        } else {
            jQuery(".options").removeClass("active");
            jQuery(this).next().addClass("active");
        }
    });

    if (jQuery(".drop-down.channel").find(".options ul li a").hasClass("active")) {
        var text = jQuery(".drop-down.channel").find(".options ul li a.active").html();
        jQuery(".drop-down.channel").find(".selected a span").html(text);
    }

    //SELECT OPTIONS AND HIDE OPTION AFTER SELECTION
    jQuery(".drop-down .options ul li a").click(function () {
        var text = jQuery(this).html();
        jQuery(this).parents(".drop-down").find(".selected a span").html(text);
        jQuery(".options").removeClass("active");
    });


    //HIDE OPTIONS IF CLICKED ANYWHERE ELSE ON PAGE
    $(document).bind('click', function (e) {
        var $clicked = $(e.target);
        if (!$clicked.parents().hasClass("drop-down"))
            jQuery(".options").removeClass("active");
    });

    // Livestream Slider



    const slider = $(".slider-thumb");
    slider
        .slick({
            autoplay: false,
            vertical: true,
            infinite: true,
            verticalSwiping: true,
            slidesPerRow: 6,
            slidesToShow: 6,
            focusOnSelect: true,
            prevArrow: '<button aria-label="previous slider" type="button" class="slick-prev"><img alt="previous slider" src="https://product1-xmys-aazz.netlify.app/XMYS/images/up-arrow.png"/></button>',
            nextArrow: '<button aria-label="next slider" type="button" class="slick-next"><img alt="next slider" src="https://product1-xmys-aazz.netlify.app/XMYS/images/down-arrow.png"/></button>',
            responsive: [
                {
                    breakpoint: 767,
                    settings: {
                        vertical: false,
                        infinite: false,
                        slidesPerRow: 4,
                        slidesToShow: 4,
                    }
                },
                {
                    breakpoint: 479,
                    settings: {
                        vertical: false,
                        slidesPerRow: 3,
                        slidesToShow: 3,
                    }
                },
            ]
        });

    let currIdx = 0;
    let activeIdx = -1;
    let mobileElLeft = 0;
    jQuery(".slick-slide").each(function (idx, el) {
        if (!jQuery(el).hasClass("slick-cloned")) {
            currIdx++;
            if (jQuery(el).find(".current-item").length) {
                mobileElLeft = (jQuery(el).offset().left) + 50;
                activeIdx = (currIdx - 1);
            }
        }
    });

    if (jQuery(window).width() < 768) {
        jQuery('.slick-track').scrollLeft(mobileElLeft - ((jQuery(window).width()) / 2));
    } else {
        jQuery('.slick-slider').slick('slickGoTo', activeIdx);
    }

    var checkWidth = $(document).width();
    if (checkWidth >= 767) {
        jQuery('.channels-dropdown-menu').owlCarousel({
            rtl: rtlVal,
            items: 8,
            loop: false,
            nav: false,
            dots: false,
            autoWidth: true,
        });

        slider.on('wheel', (function (e) {
            e.preventDefault();

            if (e.originalEvent.deltaY < 0) {
                $(this).slick('slickNext');
            } else {
                $(this).slick('slickPrev');
            }
        }));
    }





    // $(function(){
    //     $('.slider-thumb').slick({

    //     });
    // });

    jQuery('.full-screen-icon').click(function () {
        jQuery('.livestrim-main-video')
    })

    // Tab JS

    // Work tab under 767px resolution
    if ($(window).width() < 767) {
        jQuery('.resume-watching-series-tab-contant').addClass('tab_container');
    }

    // tabbed content
    jQuery(".tab_container .tab_content").hide();
    jQuery(".tab_container .tab_content:first").show();

    /* if in tab mode */
    jQuery(".tab ul.tabs li").click(function () {

        jQuery(".tab_container .tab_content").hide();
        var activeTab = jQuery(this).attr("rel");
        jQuery("#" + activeTab).fadeIn();

        jQuery("#" + activeTab + ".tab ul.inner-tabs li:first").trigger('click');

        jQuery(".tab ul.tabs li").removeClass("active");
        jQuery(this).addClass("active");

        jQuery(".tab .tab_drawer_heading").removeClass("active");
        jQuery(".tab .tab_drawer_heading[rel^='" + activeTab + "']").addClass("active");

    });

    // Show the first tab by default
    jQuery('ul.newtabs li').click(function () {
        var tab_id = sanatize_input(jQuery(this).attr('data-tab'));

        jQuery('ul.newtabs li').removeClass('current');
        jQuery('.tab-newcontent').removeClass('current');

        jQuery(this).addClass('current');
        jQuery("#" + tab_id).addClass('current');
    });

    // Search Click JS
    jQuery('.search-click').click(function () {
        jQuery('.search-icon').toggleClass('show_search_bar');
        jQuery('.right-menu').toggleClass('add_width_search');
    });
    jQuery('.close-search').click(function () {
        jQuery('.search-icon').removeClass('show_search_bar');
    });

    // Fluid Slider
    jQuery('.fluid-slider').owlCarousel({
        loop: true,
        margin: 10,
        nav: false,
        dots: true,
        items: 1,
        rtl: rtlVal,
    });

    // episode-slider-invideo Slide
    jQuery('.episode-slider-invideo').owlCarousel({
        margin: 34,
        items: 6,
        rtl: rtlVal,
        dots: true,
        nav: true,
        dots: false,
        // navText: ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
        navText: ['<img alt="slide left" src="/images/left-arrow.png">', '<img alt="slide right" src="/images/right-arrow.png">'],
        responsive: {
            0: {
                items: 2,
                margin: 10,
            },
            375: {
                items: 2,
                margin: 10,
            },
            768: {
                items: 5,
                margin: 15,
            },
            1000: {
                items: 6,
            }
        }
    });

    //more episode click
    jQuery(".more-episode-click").on("click", function () {
        jQuery('body').toggleClass("show-more-ep");
        jQuery('.video-widget li.v-info').removeClass("show-info");
    });

    jQuery(".video-widget li.v-info").on("click", function () {
        jQuery('body').removeClass("show-more-ep");
        jQuery(this).toggleClass("show-info");
    });


    // Live Page Video JS


    // Channels Dropdown Click
    jQuery('.channels-dropdown a').click(function () {
        jQuery(this).parents("li").toggleClass('channels-dropdown-show');
    });


    jQuery('.full-screen-icon').click(function () {
        jQuery('.livestrim-main-video').toggleClass('full-screen-vodeo-show hide-slider-wrapper');
    });

    jQuery('.full-screen-icon').click(function () {
        jQuery('.livestrim-main-video').addClass('hide-slider-wrapper');
    });

    $owlCatchUp = jQuery('.catchup-slider');
    $owlCatchUp.owlCarousel({
        rtl: rtlVal,
        items: 7,
        loop: true,
        margin: 35,
        nav: true,
        center: true,
        navText: ['<img alt="slide left" src="/images/left-arrow.png">', '<img alt="slide right" src="/images/right-arrow.png">'],
        dots: false,
        responsive: {
            0: {
                items: 2,
                margin: 10,
            },
            375: {
                items: 3,
                margin: 0,
                autoWidth: true,
            },
            768: {
                items: 4,
                margin: 20,
            },
            1200: {
                items: 7,
            }
        }
    });

    let clonedIdx = 0, stopped = 0;
    jQuery(".catchup-slider .owl-item").each(function (i, el) {
        if (jQuery(el).hasClass("cloned") && !stopped) {
            ++clonedIdx;
        } else {
            stopped = 1;
        }
    });

    let idx = jQuery('.catchup-slider .current-item').parent().parent().parent().index();
    console.log(idx, clonedIdx);
    $owlCatchUp.trigger('to.owl.carousel', [idx + clonedIdx, 300, true]);

});

//scroll animation
jQuery(document).bind('ready ajaxComplete', function () {
    const observer = lozad(); // lazy loads elements with default selector as '.lozad'
    observer.observe();
    $.fn.visible = function (partial) {
        var $t = $(this),
            $w = $(window),
            viewTop = $w.scrollTop(),
            viewBottom = viewTop + $w.height(),
            _top = $t.offset().top,
            _bottom = _top + $t.height(),
            compareTop = partial === true ? _bottom : _top,
            compareBottom = partial === true ? _top : _bottom;
        return ((compareBottom <= viewBottom) && (compareTop >= viewTop));
    };
    var win = $(window);
    var allMods = $(".show-listing .show-item");

    allMods.each(function (i, el) {
        var el = $(el);
        if (el.visible(true)) {
            el.addClass("already-visible");
        }
    });

    win.scroll(function (event) {
        allMods.each(function (i, el) {
            var el = $(el);
            if (el.visible(true)) {
                el.addClass("come-in");
            }
        });
    });
});



jQuery('.cookies-close').click(function () {
    jQuery('.cookies-block').fadeOut();
});

jQuery('.btn-leaderboard-close.btn').click(function () {
    // jQuery('body').addClass('hide-add');
    jQuery('.external-banner').remove();
});

//datepicker
jQuery(function () {
    jQuery("#datepicker").datepicker({
        altFormat: "yy-mm-dd",
        dateFormat: "yy-mm-dd",
        changeMonth: true,
        changeYear: true,
        yearRange: "-100:+0",
        isRTL: rtlVal
    });
});

//idleTime
var idleTime = 0;
//Increment the idle time counter every minute.
var idleInterval = setInterval(timerIncrement, 5000);

//Zero the idle timer on mouse movement.
jQuery(document).mousemove(function (e) {
    idleTime = 0;
    jQuery(".main-contant, .play-video-live-sec").removeClass("hide-header");
});
jQuery(document).keypress(function (e) {
    idleTime = 0;
    jQuery(".main-contant, .play-video-live-sec").removeClass("hide-header");
});
//Zero the idle timer on touch events.
jQuery(document).bind('touchstart', function () {
    idleTime = 0;
    jQuery(".main-contant, .play-video-live-sec").removeClass("hide-header");
});
jQuery(document).bind('touchmove', function () {
    idleTime = 0;
    jQuery(".main-contant, .play-video-live-sec").removeClass("hide-header");
});

function timerIncrement() {
    idleTime = idleTime + 1;
    if (idleTime > 0.60) {
        jQuery(".fullpage-video, .play-video-live-overlay").parents(".main-contant, .play-video-live-sec").addClass("hide-header");

        var checkWidth = $(document).width();
        if (checkWidth >= 767) {
            jQuery('.v-info').removeClass('show-info');
        }
    }
}

jQuery('body').on('click', '[action-share-item]', function (e) {
    var t = jQuery(this);
    var is_shared = sanatize_input(t.attr('data-is-shared'));
    var shortUrl = sanatize_input(t.attr('shortUrl'));
    var media = sanatize_input(t.attr("data-media"));
    var url = sanatize_input(t.attr("data-url"));
    e.preventDefault();
    e.stopPropagation();
    var audio_id = sanatize_input($(this).attr("data-audio-id"));
    var show_id = sanatize_input($(this).attr("data-show-id"));
    var video_id = sanatize_input($(this).attr("data-video-id"));
    var news_id = sanatize_input($(this).attr("data-news-id"));
    var image_url = sanatize_input($(this).attr("data-img"));
    var description = sanatize_input($(this).attr("data-description"));
    var title = sanatize_input($(this).attr("data-title"));
    var show_title = sanatize_input($(this).attr("data-show-title"));
    var video_title = sanatize_input($(this).attr("data-video-title"));
    var category_title = sanatize_input($(this).attr("data-category-title"));
    var channel_title = sanatize_input($(this).attr("data-channel-title"));
    var subject = sanatize_input($(this).attr("data-subject"));
    var body = sanatize_input($(this).attr("data-body"));
    var data_username = sanatize_input($(this).attr("data-username"));

    if (!audio_id) {
        audio_id = null;
    }
    if (!show_id) {
        show_id = null;
    }
    if (!video_id) {
        video_id = null;
    }
    if (!news_id) {
        news_id = null;
    }

    var href = '';
    //make_shorturl

    if (is_shared) {
        share(media, title, shortUrl, data_username, subject, body)
    }
    if (!is_shared) {
        jQuery.ajax({
            type: "GET",
            url: sanatize_input($('#make_shorturl').data('value')),
            data: {
                longurl: url,
                audio_id: audio_id,
                show_id: show_id,
                video_id: video_id,
                news_id: news_id
            }, // serializes the form's elements.
            dataType: 'json',
            success: function (data) {
                console.log(data);
                if (data.error) {
                    alert('somthing went wrong!');
                    return false;
                }
                if (data.success && data.success === "yes") {
                    shortUrl = data.data.full_shorten_link;
                    share(media, title, shortUrl, data_username, subject);
                    t.attr('href', href);
                    t.attr('data-is-shared', 'true');
                    t.attr('shortUrl', shortUrl);

                }

            }
        });
    }
});

jQuery(document).on('click', function (e) {
    if (!jQuery(e.target).parents(".show_search_bar").length && !jQuery(e.target).hasClass("show_search_bar")) {
        jQuery('#inputSearchTerm').trigger("blur");
        jQuery(".search-suggestion").css('opacity', 0);
    }
});

function share(media, title, shortUrl, data_username, subject, body) {
    if (media == 'fb') {
        href = 'https://www.facebook.com/sharer/sharer.php?u=' + shortUrl;
        window.open(href, '_blank');
    }
    if (media == 'linkedin') {
        href = 'https://www.linkedin.com/shareArticle?mini=true&url=' + shortUrl + '&title=' + title;
        window.open(href, '_blank');
    }
    if (media == 'twitter') {
        href = 'https://twitter.com/share?url=' + shortUrl + '&text=' + title + '&original_referer=' + shortUrl + '&related=' + data_username + '&via=' + data_username + '&count=none';
        window.open(href, '_blank');
    }
    if (media == 'google') {
        href = 'https://plus.google.com/share?url=' + shortUrl;
        window.open(href, '_blank');
    }
    if (media == 'email') {
        href = 'mailto:?subject=' + subject + '&body=' + body + ' ' + shortUrl;
        window.open(href, '_blank');
    }
    if (media == 'clipboard') {
        t.attr('data-clipboard-text', shortUrl);
        // clipboard.copy(shortUrl);
        // t.removeAttr('action-share-item');
        //
        // setTimeout(function() {
        //         t.trigger( "click" );
        //         alert('Link copied to clipboard');
        //     }, 1500);

    }
    if (media == 'whatsapp') {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            href = 'whatsapp://send?text=' + title + ' ' + shortUrl;
            window.open(href, '_blank');
            // window.open( href, '_self');
        } else {
            //desktop
            href = 'https://web.whatsapp.com/send?text=' + title + ' ' + shortUrl;
            window.open(href, '_blank');
        }
    }
}


jQuery(window).load(function () {
    // setTimeout( function(){
    let idxcl = jQuery('.category-listing > ul div.owl-item a.active').parent().parent().index();
    let ww = jQuery(window).width();
    let tiletomove = 0;
    tiletomove = ((ww > 768) ? 3 : (ww > 525) ? 2 : (ww > 380) ? 1 : 0);
    idxcl = ((idxcl - tiletomove >= 0) ? (idxcl - tiletomove) : 0);
    console.log(tiletomove, idxcl);
    // let totalCLItems = jQuery( '.category-listing > ul div.owl-item' ).length;
    // idxcl = Math.abs( totalCLItems - idxcl );
    // console.log( idxcl );
    $owlCategoryListing.trigger('to.owl.carousel', [idxcl, 300, true]);
    // }, 3000 );
});

$(function () {
    //setup before functions
    var typingTimer;                //timer identifier
    var doneTypingInterval = 1500;  //time in ms (5 seconds)
    var current_request = null;


    //on keyup, start the countdown
    $('#inputSearchTerm').keyup(function () {
        clearTimeout(typingTimer);
        if (current_request) { current_request.abort() }

        if ($('#inputSearchTerm').val()) {
            typingTimer = setTimeout(start_search, doneTypingInterval);
        }
        if ($('#inputSearchTerm').val() == '') {
            typingTimer = setTimeout(most_search, doneTypingInterval);
        }
    });

    function start_search() {
        var val = $("#inputSearchTerm").val().trim();
        val = val.replace(/\s+/g, '');

        if (val.length >= 3) { //for checking 2 characters
            current_request = jQuery.ajax({
                type: "GET",
                url: sanatize_input($('#search_url').data('value')),
                data: {
                    term: $('#inputSearchTerm').val(),
                    page: 1,
                }, // serializes the form's elements.
                dataType: 'json',
                beforeSend: function () {
                    $('.search_wrap .loading').css('display', 'block');
                    $('#search-result-div').html('');
                    // $('.most-watch .loading').addClass("show-loader");
                },
                complete: function () {
                    //  $('.most-watch .loading').removeClass("show-loader");

                    five_slider("#search-result-div .five-slider");


                },
                success: function (data) {
                    $('.search_wrap .loading').css('display', 'none');
                    $('#search-result-div').html(data['html']);
                }
            });
        }
    }

});

function most_search() {

    current_request = jQuery.ajax({
        type: "GET",
        url: sanatize_input($('#most_searched_url').data('value')),
        data: {}, // serializes the form's elements.
        dataType: 'json',
        beforeSend: function () {
            $('.search_wrap .loading').css('display', 'block');
            // $('#read-more-btn-search').hide();
            $('#search-result-div').html('');

            // need to reload section
        },
        complete: function () {
            // need to remove reload section
        },
        success: function (data) {
            $('.search_wrap .loading').css('display', 'none');
            $('#search-result-div').html(data['html']);
        }
    });
}

function open_popup(url) {
    $.get(url, function (data) {

        $(".embed-popup-info-div").html(data);
        jQuery('body').addClass('no_scroll');
        jQuery('.load_more_popup').addClass('show-embed-popup');

    });
    close_player();
}

function close_player() {
    jQuery(".HeroSlider .item").removeClass("hide-caption");
    jQuery(".slider-banner").removeClass("hide-nav-slider");
    if (jQuery('.ramadan_comm_sec ').length) {
        var iframe = jQuery(".HeroSlider .slider_wrap").find("iframe");
        iframe.remove();
    } else {
        var iframe = jQuery(".HeroSlider .HeroSlider-img").find("iframe");
        iframe.remove();
    }
}

/* START TYPE ONLY NUMBER IN MOBILE FIELD */
function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}
/* END TYPE ONLY NUMBER IN MOBILE FIELD */
