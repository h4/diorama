"use strict";

window.addEventListener('DOMContentLoaded', function() {
    var diorama = document.querySelectorAll('.diorama');
    function Diorama($root) {
        this.prevX = undefined;
        this.row = undefined;
        this.init = function() {
            this.row = $root.querySelectorAll('.diorama__row');
            Array.prototype.forEach.call(this.row, function($row) {
                $row.style.left = -parseInt(getComputedStyle($row).width) / 2 + "px";
            });
            $root.addEventListener('mousemove', this.mouseHandler.bind(this));
        };
        this.mouseHandler = function(e) {
            if (this.prevX == undefined) {
                this.prevX = e.x;
                return;
            }
            var width = window.innerWidth;
            Array.prototype.forEach.call(this.row, function($row) {
                var rowWidth = parseInt(getComputedStyle($row).width);
                var rowDeltaX = (e.x / width) * rowWidth - e.x;
                $($row).animate({
                    left: -rowDeltaX
                }, {
                    queue: false,
                    duration: 2000,
                    easing: "easeOutExpo"
                })
            });

        };
    }
    Array.prototype.forEach.call(diorama, function($el) {
        (new Diorama($el)).init();
    });
});
