 /*	
  * Based on:	
  * jquery.purr.js
  * Copyright (c) 2008 Net Perspective (net-perspective.com)
  * Licensed under the MIT License (http://www.opensource.org/licenses/mit-license.php)
  *
  * @spasquali : Largely rewritten, removing old IE support, no longer a jquery plugin,
  * 			 added icons, and various other improvements and refinements to tighten
  *				 and shorten the code, using modern jQuery methods.
  */
  //
var $view = this.$view;
	
var notifier = function(notice, options) { 

	//	Create a jQuery object for notice, and give it a unique id.
	//
	var nid		= path.nextId('_');
	var $notice = jQuery(notice).attr("id", nid);

	//	Close button
	//
	if(options.sticky) {
		jQuery('<a></a>')
			.addClass('close')
			.html('close')
			.attr({
				href: '#'
			})
			.appendTo($notice)
			.click(function() {
				removeNotice();
				return false;
			});
	}
	
	//	We hide this initially.
	//
	$notice
		.appendTo($view)
		.hide()
		.fadeIn(options.fadeInSpeed);

	//	Non-stickies get removed after some time
	//
	!options.sticky && setTimeout(function() {
		removeNotice(nid);
	}, options.lifespan);

	function removeNotice(id) {
		//	1. 	Fade out notification.
		//	2. 	Because notifications can be stacked, animate notification
		//		height to 0, sliding others up.
		//	3. 	Remove notification element
		//
		$notice.animate({  opacity: 0	}, { 
			duration: options.fadeOutSpeed, 
			complete: function() {
				$notice.animate({ height: 0 }, {
					duration: options.fadeOutSpeed,
					complete: function() {
						$notice.remove();
					}
				});
			}
		});
	};
};

this.api = {
	options		: {},
	
	//	The following options matter:
	//
	//	fadeInSpeed		: ms speed of notification fade in.
	//	fadeOutSpeed	: ms speed of notification fade out.
	//	lifespan		: ms for non-sticky notifications to live before fading out.
	//
	setOptions 	: function(opts) {
		opts = opts || {};
		var p;
		for(p in opts) {
			this.options[p] = opts[p];
		}
	},
	notify 	: function(msg, type, opts) {

		type = type || 'alert';

		//	Get any default options, merge in any sent options, handle remaining defaults.
		//
		opts = jQuery.extend({}, this.options, opts || {});
		
		opts.lifespan 		= opts.lifespan || 5000;
		opts.fadeInSpeed	= opts.fadeInSpeed || 500;
		opts.fadeOutSpeed	= opts.fadeOutSpeed || 300;

		//	keys with truthy values are sticky
		//
		var types = {
			announce	: 0,
			saving		: 0,
			error		: 1,
			info		: 0,
			help		: 1,
			deleting	: 0,
			loading		: 0,
			alert		: 1,
			note		: 0,
			publishing	: 0
		}	
		
		if(type in types) {
			var notice = '\
				<div class="notice">\
					<div class="notice-icon notice-icon-' + type + '" alt="" ></div>\
					<div class="notice-body">';
					
						if(opts.title) {
							notice += '<h3>' + opts.title + '</h3>';
						}
					
						notice += '<p>' + msg + '</p>\
					</div>\
					<div class="notice-bottom"></div>\
				</div>';
			
			opts.sticky = !!types[type];
			
			notifier(notice, opts);
	
		} else {
			console.log(msg);
		}
	}
}