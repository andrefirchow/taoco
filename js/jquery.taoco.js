(function($) {

	$.fn.taoco = function( options ) {

		// the defaults
		var settings = $.extend( {
			selector : 'h2,h3',
			opt2 : 'slow',
			opt3: true
		}, options );


		console.log('selector = ' + settings.selector);

		var taocoNav = '<ul>';
		var el, title, id, line;

		$( settings.selector ).each( function() {

			el = $(this);
			title = el.text();

			id = el.attr('id');
			if(typeof(id)  === 'undefined') {
				id = title.replace(/[^a-zA-Z0-9]/g,'-').replace('---','-').replace('--','-');
				el.attr('id', id);
			}

			console.log('id = ' + id);

			line =
			"<li>" +
				"<a href='#" + id + "'>" +
					title +
				"</a>" +
			"</li>";

			taocoNav += line;

		});

		taocoNav +=	'</ul>';

		$(this).addClass('taoco').attr('role', 'navigation').prepend(taocoNav);



	};

}( jQuery ));
