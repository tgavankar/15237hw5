// This code uses the "exports" pattern to keep its namespace clean.
// This pattern is used widely in node.
// Contrast it, for example, with any of the prototypical objects like Ball.js.

var TouchHandler = (function() {
    var exports = {};
    var touchBalls = {};
    var page;
    var zoomTouches = [];
    exports.init = function(app) {
        var radius = 20;
        var canvas = app.canvas[0];
        page = app.page;

        function onTouchStart(e) {
            var i, ballConfig, touch, ballLocation;
            e.preventDefault();
            for (i = 0; i < e.changedTouches.length; i++) {
                touch = e.changedTouches[i];
                ballLocation = page.pageToCanvas(touch.pageX, touch.pageY);
                ballConfig = {'x': ballLocation.x,
                              'y': ballLocation.y,
                              'radius': radius,
                              'maxX': app.width,
                              'maxY': app.height,
                              'style': 'red'};
                touchBalls[touch.identifier] = new Ball(ballConfig);
            }
        }

        function onTouchMove(e) {
            var i, touch, ballLocation, entryCount;
            var touchEntry = {};
            e.preventDefault();
            entryCount = 0;
            for (i = 0; i < e.changedTouches.length; i++) {
                touch = e.changedTouches[i];
                ballLocation = page.pageToCanvas(touch.pageX, touch.pageY);
                if (touchBalls[touch.identifier] !== undefined) {
                  touchBalls[touch.identifier].x = ballLocation.x;
                  touchBalls[touch.identifier].y = ballLocation.y;
                }

                if(touch.identifier === 0 || touch.identifier === 1) {
                    entryCount++;
                }
            }

            if(entryCount === 2) {
                zoomTouches.push([
                    {'x': touchBalls[0].x, 'y': touchBalls[0].y}, 
                    {'x': touchBalls[1].x, 'y': touchBalls[1].y}]);
            }

            if(zoomTouches.length >= 5 && zoomTouches.length % 2 === 0) {
                detectGesture();
            }
        }

        function detectGesture() {
            function dist(p1, p2) {
                return Math.sqrt(Math.pow((p1.x-p2.x), 2) + Math.pow((p1.y-p2.y), 2));
            }

            var first = zoomTouches[0];
            var last = zoomTouches[zoomTouches.length-1];
            var diff = (dist(last[0], last[1]) - dist(first[0], first[1]));
            var sizeDelta = 0;

            if(diff < -1) {
                sizeDelta = -1;
            }
            else if(diff > 1) {
                sizeDelta = 1;
            }

            if(sizeDelta !== 0) {
                app.ball.radius += sizeDelta;
                zoomTouches = zoomTouches.slice(zoomTouches.length - 5, zoomTouches.length);
            }
        }

        function onTouchCancel(e) {
            // called when browser loses focus (eg, on iOS when it recognizes a gesture)
            touchBalls = [ ];
            zoomTouches = [];
        }
        
        function onTouchEnd(e) {
            for (i = 0; i < e.changedTouches.length; i++) {
                touch = e.changedTouches[i];
                delete touchBalls[touch.identifier];
            }
            zoomTouches = [];
        }

        canvas.addEventListener('touchstart', onTouchStart);
        canvas.addEventListener('touchmove', onTouchMove);
        canvas.addEventListener('touchend', onTouchEnd);
        canvas.addEventListener('touchcancel', onTouchCancel);
    }

    exports.drawBalls = function() {
      for (id in touchBalls) {
        ball = touchBalls[id];
        ball.draw.bind(ball)(page)
      }
    };

    return exports;
})();
