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
    this.initCanvas();
    TouchHandler.init(this);
    this.initSquare();
}

ZoomSquareApp.prototype.initCanvas = function(){
    this.body = $(document.body);
    this.body.width(document.body.offsetWidth);
    this.body.height(window.innerHeight - 20);
    this.width = 320;
    this.height = 480;
    this.canvas = window.util.makeAspectRatioCanvas(this.body, this.width/this.height);
    this.page = new ScaledPage(this.canvas, this.width);
};

ZoomSquareApp.prototype.initSquare = function(){
    this.square = new Square({'x': this.width/2, 'y': this.height/2,
                            'side': Math.min(this.width/2, this.height/2),
                            'minSide': 5, 'maxSide': Math.min(this.width, this.height)});
}

//==============================================
//DRAWING
//==============================================

ZoomSquareApp.prototype.draw = function(timeDiff){
    this.clearPage();
    this.drawSquare(timeDiff);
    TouchHandler.drawBalls(timeDiff);
}

ZoomSquareApp.prototype.clearPage = function(){
    this.page.fillRect(0, 0, this.width, this.height, '#eee');
}

ZoomSquareApp.prototype.drawSquare = function(timeDiff){
    this.square.draw(this.page);
}
