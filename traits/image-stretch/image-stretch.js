/*
 * Based on:
 *
 * jQuery Anystretch
 * Version 1.2 (@jbrooksuk / me.itslimetime.com)
 * https://github.com/jbrooksuk/jquery-anystretch
 * Based on Dan Millar's Port
 * https://github.com/danmillar/jquery-anystretch
 *
 * Add a dynamically-resized background image to the body
 * of a page or any other block level element within it
 *
 * Copyright (c) 2012 Dan Millar (@danmillar / decode.uk.com)
 * Dual licensed under the MIT and GPL licenses.
 *
 * This is a fork of jQuery Backstretch (v1.2)
 * Copyright (c) 2011 Scott Robbin (srobbin.com)
 *
 * @spasquali : Mostly rewritten to suit our purposes, removing special body/block
 * 				checks and keeping all resizing to the block level, adding 'fullscreen'
 *				option. No longer a jquery plugin. Resize events now bound to
 *				_/events/.resize path.
 *
*/
//
var $view 	= this.$view;

$view.find('*[image-stretch-src]').each(function(i) {

	var $el = $(this);

	var src = $el.attr('image-stretch-src');

	if(!src) {
		return;
	}

	var settings = {
		positionX	: 'center',     // Should we center the image on the X axis?
		positionY	: 'center',     // Should we center the image on the Y axis?
		
		// FadeIn speed for background after image loads (e.g. "fast" or 500)
		//
		speed : $el.attr('image-stretch-speed') || 0,        
		fullscreen : $el.attr('image-stretch-fullscreen') === 'true' || false,
		
		elPosition	: 'relative',  	// position of containing element when not being added to the body
	};
	
	var container = $el.children(".anystretch");
	var imgRatio;
	var bgImg;
	var bgWidth;
	var bgHeight;
	var bgOffset;
	var bgCSS;
	var img;

	$el.css({
		position	: settings.elPosition, 
		background	: "none"
	});

	//	If to be full screen, ensure we have the proper html/body settings,
	//	and ensure element is properly sized to full witdh and height.
	//
	if(settings.fullscreen) {
		$('html').add($('body')).css({
			'height' : '100%',
			'margin' : '0px'
		})	
		$el.css({
			position: 'absolute',
			top		: '0px',
			left	: '0px',
			width	: '100%',
			height	: '100%'
		})
	}

	// If this is the first time that anystretch is being called
	if(container.length === 0) {
		container = $("<div />")
			.attr("class", "anystretch")
			.css({
				left: 0,
				top: 0, 
				position: "absolute", 
				overflow: "hidden", 
				zIndex: -999998, 
				margin: 0, 
				padding: 0, 
				height: "100%",
				width: "100%"
			});
	} else {
		// Prepare to delete any old images
		//
		container
			.find("img")
			.addClass("deleteable");
	}

	img = $("<img />")
		.css({
			position: "absolute", 
			display: "none", 
			margin: 0, 
			padding: 0, 
			border: "none", 
			zIndex: -999999
		})
		.on("load", function(e) {  
		
		  var self = $(this),
			  imgWidth, imgHeight;
		
		  self.css({width: "auto", height: "auto"});
		  imgWidth = this.width || $(e.target).width();
		  imgHeight = this.height || $(e.target).height();
		  imgRatio = imgWidth / imgHeight;
		
		  _adjustBG(function() {
			  self.fadeIn(settings.speed, function(){
				  // Remove the old images, if necessary.
				  container.find('.deleteable').remove();
				  // Callback
				  if(typeof callback == "function") callback();
			  });
		  });
		})
	  	.appendTo(container);
	 
	// Append the container to the body, if it's not already there
	if($el.children(".anystretch").length == 0) {
		$el.append(container);
	}
	
	//	Fetch arguments
	//
	container.data("settings", settings);

	img.attr("src", src); // Hack for IE img onload event
	
	// Adjust the background size when the window is resized or orientation has changed (iOS)
	path
	.open('_/events')
	.resize(_adjustBG);


	function _adjustBG(fn) {

		bgCSS = {left: 0, top: 0};
		bgWidth = _width();
		bgHeight = bgWidth / imgRatio;

		//	Make adjustments based on image ratio
		// 	Note: Offset code provided by Peter Baker (http://ptrbkr.com/). Thanks, Peter!
		//
		if(bgHeight >= _height()) {
			bgOffset = (bgHeight - _height()) /2;
			if(settings.positionY == 'center' || settings.centeredY) { // 
				$.extend(bgCSS, {top: "-" + bgOffset + "px"});
			} else if(settings.positionY == 'bottom') {
				$.extend(bgCSS, {top: "auto", bottom: "0px"});
			}
		} else {
			bgHeight = _height();
			bgWidth = bgHeight * imgRatio;
			bgOffset = (bgWidth - _width()) / 2;
			if(settings.positionX == 'center' || settings.centeredX) {
				$.extend(bgCSS, {left: "-" + bgOffset + "px"});
			} else if(settings.positionX == 'right') {
				$.extend(bgCSS, {left: "auto", right: "0px"});
			}
		}

		container
		.children("img:not(.deleteable)")
		.width( bgWidth )
		.height( bgHeight )
		.filter("img").css(bgCSS);

		typeof fn === "function" && fn();
	}
	
	function _width() {
		return $el.innerWidth();
	}
	
	function _height() {
		return $el.innerHeight();
	}

});


  