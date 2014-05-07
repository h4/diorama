"use strict";

window.addEventListener('DOMContentLoaded', function() {
    var diarama = document.querySelectorAll('.diarama');
    function Diarama($root) {
        this.prevX = undefined;
        this.items = undefined;
        this.row = undefined;
        this.init = function() {
            this.items = $root.querySelectorAll('.diarama__item');
            this.row = $root.querySelectorAll('.diarama__row');
            $root.addEventListener('mousemove', this.mouseHandler.bind(this));
            console.log(this.items);
        };
        this.mouseHandler = function(e) {
            if (this.prevX == undefined) {
                this.prevX = e.x;
                return;
            }
            var deltaX = this.prevX - e.x;
            Array.prototype.forEach.call(this.row, function($row) {

            });
            this.row[0].style.left = deltaX + 'px';
        };
    }
    Array.prototype.forEach.call(diarama, function($el) {
        (new Diarama($el)).init();
    });
});
