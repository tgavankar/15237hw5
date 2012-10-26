var ZoomSquareApp = function(){
    this.setup();
    window.util.deltaTimeRequestAnimationFrame(this.draw.bind(this));
    this.i = 0;
}

//==============================================
//SETUP
//==============================================

ZoomSquareApp.prototype.setup = function(){
    window.util.patchRequestAnimationFrame();
    window.util.patchFnBind();
    this.initValues();
    this.initCanvas();
    TouchHandler.init(this);
    this.initBall();
    this.initRandSquare();
    this.initButtons();
    this.initAccelerometer();
}

ZoomSquareApp.prototype.initValues = function() {
    this.isWon = false;
    this.bgColor = '#eee';
    this.tolerance = 15;

    if(typeof(localStorage) !== "undefined") {
        this.hasStorage = true;
    }
    else {
        this.hasStorage = false;
    }

    if(this.hasStorage) {
        this.score = this.getLocalStorage('score');
    }
    else {
        this.score = 0;
    }

}

ZoomSquareApp.prototype.setLocalStorage = function(key, value) {
    if(this.hasStorage) {
        window.localStorage['ballBounds' + key] = JSON.stringify(value);
    }
}

ZoomSquareApp.prototype.getLocalStorage = function(key) {
    var storeKey = 'ballBounds' + key;
    if(this.hasStorage && window.localStorage[storeKey] !== undefined) {
        return JSON.parse(window.localStorage[storeKey]);
    }
    return 0;
}

ZoomSquareApp.prototype.initCanvas = function(){
    this.body = $(document.body);
    this.body.width(document.body.offsetWidth);
    this.body.height(window.innerHeight - 20);
    this.width = 320;
    this.height = 430;
    this.canvas = window.util.makeAspectRatioCanvas(this.body, this.width/this.height);
    this.page = new ScaledPage(this.canvas, this.width);
};

ZoomSquareApp.prototype.initBall = function(){
    this.ball = new Ball({'x': this.width/2, 'y': this.height/2,
                            'radius': 25,
                            'maxX': this.width, 'maxY': this.height,
                            'minRad': 25, 'maxRad': 50});
    this.ball.velx = 5;
    this.ball.vely = 5;
}

ZoomSquareApp.prototype.initAccelerometer = function(){
    this.accelerometer = new Accelerometer();
    this.accelerometer.startListening();
}

ZoomSquareApp.prototype.initRandSquare = function(){
    var size = window.util.randInt(60, 110);
    var xcen = window.util.randInt(size/2, this.width - size/2);
    var ycen = window.util.randInt(size/2, this.height - size/2);
    this.square = new Square({'x': xcen, 
                              'y': ycen,
                            'side': size,
                            'minSide': 60, 'maxSide': 110});

    this.innerSquare = new Square({'x': xcen, 
                              'y': ycen,
                            'side': size - this.tolerance,
                            'minSide': 60 - this.tolerance, 'maxSide': 110 - this.tolerance,
                            'style': this.bgColor});
}

ZoomSquareApp.prototype.initButtons = function(){
    var ref = this;

    $('#winRound').click(function(e) {
        e.preventDefault();
        ref.winRound();
    });

    $('#randomize').click(function(e) {
        e.preventDefault();
        ref.initRandSquare();
    });


}

//==============================================
//DRAWING
//==============================================

ZoomSquareApp.prototype.draw = function(timeDiff){
    if(this.isWon) {
        return;
    }
    this.clearPage();
    this.drawSquare(timeDiff);
    this.drawBall(timeDiff);
    TouchHandler.drawBalls(timeDiff);
    this.updateBall();
    this.checkWin();
    this.drawHeader();
}

ZoomSquareApp.prototype.checkWin = function() {

    var diameter = 2 * this.ball.radius;
    var distX = Math.abs(this.ball.x - this.square.x);
    var distY = Math.abs(this.ball.y - this.square.y);
    if(    diameter >= this.innerSquare.side 
        && diameter <= this.square.side
        && distX <= this.tolerance/4
        && distY <= this.tolerance/4) {
        console.log(distX +"," +distY);
        this.winRound();
    }
}



ZoomSquareApp.prototype.winRound = function() {
    this.bgColor = 'green';
    this.innerSquare.style = this.bgColor;
    this.square.style = '#eee';
    
    window.navigator.notification.vibrate(1000);

    var ref = this;
    setTimeout(function() {
        ref.isWon = true;
    }, 10);

    setTimeout(function() {
        ref.bgColor = '#eee';
        ref.updateScore(10);
        ref.isWon = false;
        ref.initRandSquare();
    }, 1000);
}

ZoomSquareApp.prototype.drawHeader = function() {
    $('#target').text(this.innerSquare.side + " - " + this.square.side);
    $('#diameter').text(2 * this.ball.radius);
    $('#score').text(this.score);
}

ZoomSquareApp.prototype.updateScore = function(score) {
    this.score += 10;
    this.setLocalStorage('score', this.score);
}

ZoomSquareApp.prototype.clearPage = function(){
    this.page.fillRect(0, 0, this.width, this.height, this.bgColor);
}

ZoomSquareApp.prototype.drawSquare = function(timeDiff){
    this.square.draw(this.page);
    this.innerSquare.draw(this.page);
}

ZoomSquareApp.prototype.drawBall = function(timeDiff){
    this.ball.update(timeDiff);
    this.ball.draw(this.page);
}

ZoomSquareApp.prototype.updateBall = function(){
    var lastAcceleration = this.accelerometer.getLast();
    this.ball.velx += lastAcceleration.x/24;
    this.ball.vely += lastAcceleration.y/24;

}
