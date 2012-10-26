
var Square = function(config){
    this.style = config.style || 'green';
    this.side = config.side;

    this.x = config.x;
    this.y = config.y;
    
    this.maxSide = config.maxSide;
    this.minSide = config.minSide;

} 

Square.prototype.draw = function(scaledPage){
    if(this.side < this.minSide) {
        this.side = this.minSide;
    }
    if(this.side > this.maxSide) {
        this.side = this.maxSide;
    }
    scaledPage.fillRect(this.x - this.side/2, this.y - this.side/2, this.side, this.side, this.style);
}

