/*!
 * Framework : jQuery JavaScript Library
 * http://jquery.com/
 *
 * Dynamic RSS Feed Slideshow - A jQuery Plugin
 *
 * Copyright 2011, Aravind Subramanian
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.aravindms.com
 * email: aravindtrue@gmail.com
 *
 * This notice must stay intact for use.
 * You can use this plugin even for commercial purpose 
 * and further enhancement and developement.
 *
 */

(function($){
	jQuery.fn.rss_slide_show = function(options){
		var default_values = {
			rsslink: null,
			limit: 10, //the limit of the feeds
			api_key: 'ABQIAAAAkGMwVXYXPd1ca9opxkmJeRT2yXp_ZAY8_ufC3CFXhHIE1NvwkxQ-135Pijwz1dke1QlhBlEzIQPfbQ', //goto http://code.google.com/apis/maps/signup.html signup your website url to create an API key.
			display_error: 1, // 1 indicates display the errors whereas the 0 indicates hides the errors.
			navigation: 1, // 1 indicates display previous and next navigation but this provided as 0, the navigation wont be display.
			effect: 'fade', // The effect you need 'fade, slideHorz, slideVert, none'
			timer: 8000, // the time interval to display the feeds.
			prev_image: 'images/nav_prev1.png', //The image display for previous navigation
			next_image: 'images/nav_next1.png', //Thee image display for next navigation
			rss_header_image: 'images/rss.png' //The rss image in the header
		};
		var options = $.extend(default_values, options);
		method.init(this, options);
	};
	
	var method = {
		init: function(elements, options){
			this.loadXML(elements, options);
		},
		
		loadXML: function(elements, options){
			//console.log(elements)
			elements.each(function(i, e){
				var $ele = $(e);
				if(!$ele.hasClass('rss_feeds'))
					$ele.addClass('rss_feeds');
					
				if(options.rsslink == null)
					return false;
				
				var rss_api = "http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&q="+options.rsslink;
				if(options.limit != null)
					rss_api += "&num="+options.limit;
				if(options.api_key != null)
					rss_api += "&key="+options.api_key;
				
				$.getJSON(rss_api, function(rss_json_data){
					if(rss_json_data.responseStatus == 200)
					{
						method.displayFeed(e, rss_json_data.responseData.feed, options);
						method.makeSlideShow(options, $ele);
						method.addEventListener(options, $ele);
					}
					else
					{
						if(options.display_error)
							var err_msg = "<strong>Error:</strong> "+rss_json_data.responseDetails;
						
						$ele.html('<div class="rss_feeds_err">'+err_msg+'</div>');
					}
				});
			});
			
		},
		
		displayFeed: function(e, feeds, options){
			var allfeeds = feeds.entries;
		
			var feed_detail = '<div class="rss_feeds_title"><div class="rss_feeds_title_left">&nbsp;</div><div class="rss_feeds_title_center"><img src="'+options.rss_header_image+'" border="0" /> '+feeds.title+'</div><div class="rss_feeds_title_right">&nbsp;</div>';
			
			feed_detail += '<div class="rss_feeds_content">';
			
			(options.navigation) ? feed_detail += '<div class="left_nav" style="background: url('+options.prev_image+') no-repeat;"><a href="javascript:void(0)"></a></div>' : feed_detail += '<div class="no_nav">&nbsp;</div>';
			
			feed_detail += '<div class="rss_feeds_entries"><ul class="rss_feeds_list">';
			
			for(var i=0; i<allfeeds.length; i++)
				feed_detail += '<li class="rssfeeds_'+(i+1)+'"><a href="'+allfeeds[i].link+'" target="_blank">'+allfeeds[i].title+'</a></li>';
			
			feed_detail += '</ul></div>';
			
			(options.navigation) ? feed_detail += '<div class="right_nav" style="background: url('+options.next_image+') no-repeat;"><a href="javascript:void(0)"></a></div>' : feed_detail += '<div class="no_nav">&nbsp;</div>';

			feed_detail += '</div><div class="rss_feed_footer"><div class="rss_feeds_foot_left">&nbsp;</div><div class="rss_feeds_foot_center">&nbsp;</div><div class="rss_feeds_foot_right">&nbsp;</div></div>';
			
			$(e).html(feed_detail);
		},
		
		makeSlideShow: function(options, ele){
			
			var $active = ele.find("ul.rss_feeds_list").find("li.active");
		
			if($active.length == 0) $active = ele.find("ul.rss_feeds_list").find("li:last");
			
			var $next = $active.next().length ? $active.next() : ele.find("ul.rss_feeds_list").find("li:first");
			
			$active.addClass('last_active');
			
			if(options.effect == 'fade')
			{
				$active.removeClass('active');
				$next.css({opacity: 0.0}).addClass('active').animate({opacity: 1.0}, "slow", function(){ $active.removeClass('last_active'); });
			}
			else if(options.effect == 'slideVert')
			{
				$active.animate({opacity: 0}, "slow").removeClass('active');
				$next.css({'position': 'relative', 'top': '20px'}).addClass('active').animate({opacity: 1.0, top: 0}, "slow", function(){ $active.removeClass('last_active'); });
			}
			else if(options.effect == 'slideHorz')
			{
				$active.animate({opacity: 0}, "slow").removeClass('active');
				$next.css({'position': 'relative', 'left': '-450px'}).addClass('active').animate({opacity: 1.0, left: 0}, "slow", function(){ $active.removeClass('last_active'); });
			}
			else
			{
				$active.removeClass('last_active active');
				$next.addClass('active');
			}
			
			var slideshow = setTimeout(function(){ method.makeSlideShow(options, ele) }, options.timer);
		},
		
		addEventListener: function(options, ele){
			if(!options.navigation)
				return false;
			
			ele.find("div.rss_feeds_title").find("div.rss_feeds_content").find("div.left_nav").bind('click', function(event){
				var feedentry_div = $(this).next();
				var active = feedentry_div.find("ul.rss_feeds_list").find("li.active");
				var prev = (active.prev().length == 1) ? active.prev() : feedentry_div.find("ul.rss_feeds_list").find("li:last");
				if(options.effect == 'fade')
				{
					active.removeClass('active');
					prev.css({opacity: 0.0}).addClass('active').animate({opacity: 1.0}, "slow");
				}
				else if(options.effect == 'slideHorz')
				{
					active.animate({opacity: 0}, "slow").removeClass('active');
					prev.css({'position': 'relative', 'left': '450px'}).addClass('active').animate({opacity: 1.0, left: 0}, "slow");
				}
				else if(options.effect == 'slideVert')
				{
					active.animate({opacity: 0}, "slow").removeClass('active');
					prev.css({'position': 'relative', 'top': '-20px'}).addClass('active').animate({opacity: 1.0, top: 0}, "slow");
				}
				else
				{
					active.removeClass('last_active active');
					prev.addClass('active');
				}
			})
			
			ele.find("div.rss_feeds_title").find("div.rss_feeds_content").find("div.right_nav").bind('click', function(event){
				var feedentry_div = $(this).prev();
				var active = feedentry_div.find("ul.rss_feeds_list").find("li.active");
				var next = (active.next().length == 1) ? active.next() : feedentry_div.find("ul.rss_feeds_list").find("li:first");
				if(options.effect == 'fade')
				{
					active.removeClass('active');
					next.css({opacity: 0.0}).addClass('active').animate({opacity: 1.0}, "slow");
				}
				else if(options.effect == 'slideHorz')
				{
					active.animate({opacity: 0}, "slow").removeClass('active');
					next.css({'position': 'relative', 'left': '-450px'}).addClass('active').animate({opacity: 1.0, left: 0}, "slow");
				}
				else if(options.effect == 'slideVert')
				{
					active.animate({opacity: 0}, "slow").removeClass('active');
					next.css({'position': 'relative', 'top': '20px'}).addClass('active').animate({opacity: 1.0, top: 0}, "slow");
				}
				else
				{
					active.removeClass('last_active active');
					next.addClass('active');
				}
			});
		}
	};
	
})(jQuery);