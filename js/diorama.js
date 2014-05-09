"use strict";

(function(window, document, $, _, undefined) {
    var defaults = {};

    $.Diorama = function($root, options) {
        this.$row = undefined;
        this.containerWidth = $root.width();

        this.init = function() {
            this.$row = $('.diorama__row', $root);

            this.$row.each(function() {
                var $this = $(this);
                $this.css('left', - $this.width() / 2);
            });

            $root.on('mousemove', _.throttle($.proxy(this.mouseHandler, this), 100));

            return this;
        };
        this.mouseHandler = function(e) {
            var frameWidth = this.containerWidth;

            this.$row.each(function() {
                var mouseX = e.clientX;
                var rowWidth = $(this).width();
                var rowDeltaX = (mouseX / frameWidth) * rowWidth - mouseX;

                $(this).animate({
                    left: -rowDeltaX
                }, {
                    queue: false,
                    duration: 2000,
                    easing: "easeOutExpo"
                });
            });
        };
    };

    $.fn.diorama = function(options) {
        return this.each(function() {
            var $item = $(this);
            var itemData = $item.data();
            var instanceOpts = $.extend(
                {},
                defaults,
                options,
                itemData
            );

            return new $.Diorama($item, instanceOpts).init();
        });
    };
})(window, document, jQuery, _, undefined);
