"use strict";

(function(window, document, $, _, undefined) {
    var defaults = {
        duration: 2000,
        easing: "easeOutExpo",
        throttleTime: 100
    };

    $.Diorama = function($root, options) {
        this.$row = undefined;
        this.containerWidth = $root.width();
        this.touchInterface = false;
        this.poiterCoords = {
            x: undefined,
            y: undefined
        };
        this.touchEvents = {
            started: false,
            detecting: true
        };

        this.init = function() {
            var containerWidth = this.containerWidth;
            this.$row = $('.diorama__row', $root);

            this.$row.each(function() {
                var $this = $(this);
                var left = containerWidth / 2 - $this.width() / 2;
                $this.css('left', left);
            });

            $root.on('mousemove', _.throttle($.proxy(this.mouseHandler, this), options.throttleTime));
            $root.on('touchstart', $.proxy(this.touchStartHandler, this));
            $root.on('touchend', $.proxy(this.touchEndHandler, this));
            $root.on('touchmove', _.throttle($.proxy(this.touchMoveHandler, this), options.throttleTime));

            return this;
        };

        this.mouseHandler = function(e) {
            var frameWidth = this.containerWidth;
            if (this.touchInterface) {
                return;
            }

            this.$row.each(function() {
                var mouseX = e.clientX;
                var rowWidth = $(this).width();
                var rowDeltaX = (mouseX / frameWidth) * rowWidth - mouseX;

                $(this).animate({
                    left: -rowDeltaX
                }, {
                    queue: false,
                    duration: options.duration,
                    easing: options.easing
                });
            });
        };

        this.touchStartHandler = function(e) {
            this.touchInterface  = true;

            this.touchEvents.detecting = true;

            this.poiterCoords.x = e.originalEvent.changedTouches[0].pageX;
            this.poiterCoords.y = e.originalEvent.changedTouches[0].pageY;
        };

        this.touchEndHandler = function(e) {
            this.touchEvents.started = false;
            var containerWidth = this.containerWidth;

            this.$row.each(function() {
                var $this = $(this);
                var _$width = $this.width();
                var left = parseInt($this.css('left'));


                if (left > 0) {
                    console.log(left);
                    $this.clearQueue().finish().animate({
                        left: 0,
                        duration: options.duration
                    });
                }

                if (left + _$width < containerWidth) {
                    $this.clearQueue().finish().animate({
                        left: containerWidth - _$width,
                        duration: options.duration
                    });
                }
            });
        };

        this.touchMoveHandler = function(e) {
            if (!this.touchEvents.started && !this.touchEvents.detecting){
                return;
            }

            var newCoords = {
                x: e.originalEvent.changedTouches[0].pageX,
                y: e.originalEvent.changedTouches[0].pageY
            };

            if (this.touchEvents.detecting){
                this._detect(newCoords);
            }

            if (this.touchEvents.started){
                this._draw(newCoords);
            }

            if (this.touchEvents.started) {
                e.preventDefault();
            }
        };

        this._detect = function(coords) {
            if (Math.abs(coords.x - this.poiterCoords.x) >= Math.abs(coords.y - this.poiterCoords.y)) {
                this.touchEvents.started = true;
            }

            this.touchEvents.detecting = true;
        };

        this._draw = function(coords) {
            var delta = coords.x - this.poiterCoords.x;

            this._moveTo(delta);

            this.poiterCoords = coords;
        };

        this._moveTo = function(delta) {
            var direction = (delta > 0) ? '+=' : '-=';
            var containerWidth = this.containerWidth;

            this.$row.each(function() {
                var $this = $(this);
                var _$width = $this.width();
                var factor = _$width / containerWidth;
                var step = Math.abs(delta) * factor;

                $(this).stop().animate({
                    left: direction + step
                }, {
                    duration: options.duration,
                    easing: options.easing
                });
            })
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
