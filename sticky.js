angular.module("sticky", []).directive("sticky", function($window) {
    return {
        link: function(scope, element, attrs) {

            var $win = angular.element($window);

            if (scope._stickyElements === undefined) {
                scope._stickyElements = [];

                $win.bind("scroll.sticky", function(e) {
                    var pos = $win.scrollTop();
                    for (var i=0; i<scope._stickyElements.length; i++) {

                        var item = scope._stickyElements[i];
                        if(pos > item.start - item.offset){
                            item.element.css({'margin-top':pos-item.start+item.offset+'px'});
                            console.log(pos-item.start, item.offset);
                            item.isStuck = true;
                        }
                        if (item.isStuck && pos < item.start - item.offset) {
                            item.element.css({'margin-top':'0px'});
                            item.isStuck = false;
                        }
                    }
                });

                var recheckPositions = function() {
                    for (var i=0; i<scope._stickyElements.length; i++) {
                        var item = scope._stickyElements[i];
                        if (!item.isStuck) {
                            item.start = item.element.offset().top;
                        } else if (item.placeholder) {
                            item.start = item.placeholder.offset().top;
                        }
                    }
                };
                $win.bind("load", recheckPositions);
                $win.bind("resize", recheckPositions);
            }

            var item = {
                element: element,
                isStuck: false,
                start: element.offset().top,
                offset: parseFloat(attrs.sticky) || 0
            };

            scope._stickyElements.push(item);

        }
    };
});
