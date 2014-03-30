/*
	The MIT License (MIT)

	Copyright (c) <2013> <Ren Aysha>

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
	
	@spasquali 	: 	Based on https://github.com/renettarenula/anchorific.js
					Has been fully rewritten, while maintaining the original
					great idea. 'scroll to top' feature, and reverse
					linking from headers are original features now removed.
*/	
//
var defaults = {
	navigation: '.affix', // position of navigation
	spy: true // scroll spy
}

	var Affix = {

		init: function( options, $elem ) {

			var _this 		= this;
			var navigations = $.noop;
			var i 			= 0;
			var obj;

			this.opt = $.extend( {},  defaults, options );

			this.headers = $elem.find( 'h1, h2, h3, h4, h5, h6' );
			this.previous = 0;

			// Fix bug #1
			if(this.headers.length !== 0 ) {
				this.first = parseInt(this.headers.prop('nodeName').substring(1), null);
			}
			
			if(this.opt.navigation) {
			
				$(this.opt.navigation).append( '<ul />' );
				
				this.previous = $(this.opt.navigation).find('ul').last();
				
				navigations = function(obj) {
					return _this.navigations(obj);
				};
			}

			for(; i < this.headers.length; i++) {
				obj = this.headers.eq(i);
				navigations(obj);
				
				if(!obj.attr('id')) {
					obj.attr('id', this.name(obj));
				}
			}

			this.opt.spy && this.spy();
		},
		
		navigations: function( obj ) {
			var self = this, link, list, which, name = self.name( obj );

			if ( obj.attr( 'id' ) !== undefined )
				name = obj.attr( 'id' );

			link = $( '<a />' ).attr( 'href', '#' + name ).text( obj.text() );
			list = $( '<li />' ).append( link ); 

			which = parseInt( obj.prop( 'nodeName' ).substring( 1 ), null );
			list.attr( 'data-tag', which );

			self.subheadings( which, list );

			self.first = which;
		},

		subheadings: function( which, a ) {
			var self = this, ul = $( self.opt.navigation ).find( 'ul' ),
				li = $( self.opt.navigation ).find( 'li' );

			if ( which === self.first ) {
				self.previous.append( a );
			} else if ( which > self.first ) {
				li.last().append( '<ul />' );
				// can't use cache ul; need to find ul once more
				$( self.opt.navigation ).find( 'ul' ).last().append( a );
				self.previous = a.parent();
			} else {
				$( 'li[data-tag=' + which + ']' ).last().parent().append( a );
				self.previous = a.parent();
			}
		},

		name: function( obj ) {
			var name = obj.text().replace( /[^\w\s]/gi, '' )
								.replace( /\s+/g, '-' )
								.toLowerCase();

			return name;
		},

		spy: function() {
			var self = this, previous, current, list, top, prev;

			$( window ).scroll( function( e ) {

				// get all the header on top of the viewport
				current = self.headers.map( function( e ) {
					if ( ( $( this ).offset().top - $( window ).scrollTop() ) < 10 ) {
						return this;
					}
				});
				// get only the latest header on the viewport
				current = $( current ).eq( current.length - 1 );

				if ( current && current.length ) {
					// get all li tag that contains href of # ( all the parents )
					list = $( 'li:has("a[href="#' + current.attr( 'id' ) + '"]")' );

					if ( prev !== undefined ) {
						prev.removeClass( 'active' );
					}

					list.addClass( 'active' );
					prev = list;
				}
			});
		}
	};
//


Affix.init( {}, this.$view );



