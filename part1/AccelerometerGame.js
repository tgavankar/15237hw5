var AccelerometerGame = function(){
	this.obs = {
		x: 0,
		y: 0,
		z: 0,
	}

	this.targ = {
		x: 0,
		y: 0,
		z: 0,
	}

	this.invalidDim = 'z';

	this.score = 100;

    this.setup();
    window.util.deltaTimeRequestAnimationFrame(this.update.bind(this));	
    return this;
}

AccelerometerGame.prototype.setup = function() {
	window.util.patchRequestAnimationFrame();
    window.util.patchFnBind();
    this.randomize();
	this.initAccelerometer();
	this.initTimer();
}

AccelerometerGame.prototype.initAccelerometer = function(){
    this.accelerometer = new Accelerometer();
    this.accelerometer.startListening();
}

AccelerometerGame.prototype.initTimer = function() {
	var ref = this;
	this.timerTimeout = setInterval(function() {
		if(ref.score > 0) { 
			ref.score -= 1;
		}
	}, 1000);
}

AccelerometerGame.prototype.update = function(timeDiff){
	this.getUpdatedAccel();
	this.updateScreen();
}

AccelerometerGame.prototype.updateScreen = function(){
	$('#score').text(this.score);

	$('#xfields .obs').text(this.obs.x);
	$('#yfields .obs').text(this.obs.y);
	$('#zfields .obs').text(this.obs.z);

	$('#xfields .diff').text(Math.round((this.obs.x - this.targ.x) * 10) / 10);
	$('#yfields .diff').text(Math.round((this.obs.y - this.targ.y) * 10) / 10);
	$('#zfields .diff').text(Math.round((this.obs.z - this.targ.z) * 10) / 10);
}

AccelerometerGame.prototype.getUpdatedAccel = function(){
	var currPos = this.accelerometer.getLast();

    this.obs.x = Math.round(currPos.x * 10) / 10;
    this.obs.y = Math.round(currPos.y * 10) / 10;
    this.obs.z = Math.round(currPos.z * 10) / 1000;
}

AccelerometerGame.prototype.winRound = function(){
	this.score += 100;
}

AccelerometerGame.prototype.randomize = function(){
	// Randomize from -10.0 and 10.0
	this.targ = {
		x: Math.round((Math.random() * 200) - 100) / 10,
		y: Math.round((Math.random() * 200) - 100) / 10,
		z: Math.round((Math.random() * 200) - 100) / 10,
	}

	$('#' + this.invalidDim + 'fields .diff').removeClass('disabled');

	switch(Math.floor(3 * Math.random())) {
		case 1:
			this.invalidDim = 'x';
			break;
		case 2:
			this.invalidDim = 'y';
			break;
		default:
			this.invalidDim = 'z';
			break;
	}

	$('#xfields .targ').text(this.targ.x);
	$('#yfields .targ').text(this.targ.y);
	$('#zfields .targ').text(this.targ.z);

	$('#' + this.invalidDim + 'fields .diff').addClass('disabled');
}

AccelerometerGame.prototype.restart = function(){
	this.score = 100;
	this.randomize();
}