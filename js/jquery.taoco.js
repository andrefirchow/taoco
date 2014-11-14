/**
*
* taoco - 'Table of Contents' jQuery plugin
*
* @author Andre Firchow (http://firchow.net)
* @url https://github.com/andrefirchow/taoco
*
*/

(function($) {

    $.fn.taoco = function( options ) {


        // get/set ID to the container to use taoco
        // independently and multiple times per page
        var containerID = this.attr('id');
        if(typeof(containerID)  === 'undefined') {
            containerID = Math.floor(Math.random() * 10000000000000001);
            this.attr('id', containerID);
        }


        // set the defaults settings
        var settings = $.extend( {
            debug                   : false,
            scope                   : 'body',
            headings                : ['h2','h3'],
            title                   : 'Table of contents',
            listType                : 'ul',
            exclude                 : ['.exclude'],
            highlight               : true,
            smoothScroll            : true,
            smoothScrollDuration    : 500,
            headingOffset           : 50,
            additionalClass         : '' // add an additional class to the nav container
        }, options );


        // debug outputs
        if(settings.debug) {
            console.log('taoco settings');
            console.log('------------------');
            console.log('debug = ' + settings.debug);
            console.log('scope = ' + settings.scope);
            console.log('headings = ' + settings.headings);
            console.log('title = ' + settings.title);
            console.log('listType = ' + settings.listType);
            console.log('exclude = ' + settings.exclude);
            console.log('highlight = ' + settings.highlight);
            console.log('smoothScroll = ' + settings.smoothScroll);
            console.log('smoothScrollDuration = ' + settings.smoothScrollDuration);
            console.log('additionalClass = ' + settings.additionalClass);
            console.log('------------------');
        }


        // Set variables
        var el          = $(this), // Cache this
            depth       = null,     // Keeps track of heading depth
            line        = '',       // list item
            label       = '',       // Contains the label of toc element
            taocoNav    = '',       // the list
            counter     = 0,        // the list
            allHeadings = settings.headings.join(', '),
            exclusions  = settings.exclude.join(', '),
            clickJump   = false,
            $headings   = $( settings.scope ).find( allHeadings ).not( exclusions );


        // set optional title element first before list starts
        if( settings.title.length >= 1) {
            taocoNav = '<h2>' + settings.title + '</h2>';
        }


        // create the nav list
        $headings.each( function() {

            var item        = $(this),
                label       = item.text();
                tag         = this.tagName,
                level       = tag.substr(1, 1),
                id          = item.attr('id'),
                listClass   = '';

            if(depth === null) {
                listClass = ' class="taoco-list"';
            }

            item.addClass('item-' + counter);

            // create and set id if it's 'undefined' on this item
            if(typeof(id)  === 'undefined') {
                id = label.replace(/[^a-zA-Z0-9]/g,'-').replace('---','-').replace('--','-');
                item.attr('id', id);
            }


            // close list and item(s) when difference is more than one level
            if((depth - level) > 1) {
                for ( var i = 1; i < (depth - level); i++ ) {
                    taocoNav += "</" + settings.listType + "></li>";
                }
            }


            // open list element
            if (depth < level) {
                taocoNav += "<" + settings.listType + listClass + ">";
            }


            // If the current depth is greater than the heading
            // level, close the list that was previously opened
            else if (depth > level) {
                taocoNav += "</" + settings.listType + "></li>";
            }


            // close the list item if the current depth equals the heading level,
            else if (depth == level) {
                taocoNav += "</li>";
            }


            // Set the current depth equal to this heading level
            depth = level;


            // Build the text for this item in the table of contents
            // and leave the list item open
            taocoNav += '<li class="list-item-' + counter + '"><a href="#' + id + '">' + label + '</a>';

            counter++;

        });


        // prepend the taoco list to container
        el.addClass('taoco ' + settings.additionalClass).attr('role', 'navigation').prepend($(taocoNav));


        // enable smooth scrolling if enabled
        if( settings.smoothScroll ) {

            el.on('click', 'a', function(e) {
                var target = $(this.hash);
                clickJump = true;

                $('html, body').animate( {
                    scrollTop: target.offset().top
                }, settings.smoothScrollDuration, function() {
                    clickJump = false;
                });

                return false;
            });

        }


        // handle highlighting of active list-item at scrolling if enabled
        if( settings.highlight ) {

            var userScrolled = false;

            $(window).scroll(function() {
              userScrolled = true;
            });

            setInterval(function() {
              if (userScrolled && !clickJump) {

                var scrollTop = $(window).scrollTop();
                var windowHeight = $(window).height();

                $headings.each( function() {
                    var offset = $(this).offset();
                    if ((scrollTop - settings.headingOffset) <= offset.top && ($(this).height() + offset.top) < (scrollTop + windowHeight)) {
                        setActive( $(this).attr('class').slice(-1) );
                        return false;
                    }
                });

                userScrolled = false;
              }
            }, 100);

        }


        // function to set 'active' to  selected nav item
        function setActive(num) {
            $('#' + containerID + ' .taoco-list li').removeClass('active');
            $('#' + containerID + ' .taoco-list li.list-item-' + num).addClass('active');
        }



    };

}( jQuery ));
