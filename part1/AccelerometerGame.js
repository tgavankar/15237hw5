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
	
	this.isWinState = false;

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
		if(!ref.isWinState) {
			ref.changeScore(-1);
		}
	}, 1000);
}

AccelerometerGame.prototype.update = function(timeDiff){
	this.getUpdatedAccel();
	this.updateScreen();
}

AccelerometerGame.prototype.updateScreen = function(){
	$('#score').text(this.score);

	if(this.isWinState) { 
		return;
	}
	
	$('#xfields .obs').text(this.obs.x);
	$('#yfields .obs').text(this.obs.y);
	$('#zfields .obs').text(this.obs.z);

	var xdiff = Math.round((this.obs.x - this.targ.x) * 10) / 10;
	var ydiff = Math.round((this.obs.y - this.targ.y) * 10) / 10;
	var zdiff = Math.round((this.obs.z - this.targ.z) * 10) / 10;
	
	$('#xfields .diff').text(xdiff).css('background-color', scoreToColor(Math.abs(xdiff)));
	$('#yfields .diff').text(ydiff).css('background-color', scoreToColor(Math.abs(ydiff)));
	$('#zfields .diff').text(zdiff).css('background-color', scoreToColor(Math.abs(zdiff)));
	
	if(this.checkWin()) {
		this.winRound();
	}
}

AccelerometerGame.prototype.checkWin = function() {
	var xdiff = $('#xfields .diff:not(.disabled)').text();
	var ydiff = $('#yfields .diff:not(.disabled)').text();
	var zdiff = $('#zfields .diff:not(.disabled)').text();
	
	return (xdiff === '' || Math.abs(xdiff) < 0.5) && (ydiff === '' || Math.abs(ydiff) < 0.5) && (zdiff === '' || Math.abs(zdiff) < 0.5);
	
}

function scoreToColor(score) {
    if(score >= 3) {
	return 'red';
    }
    else if(score >= 1) {
	return 'orange';
    }
    else if(score >= 0.5) {
	return 'yellow';
    }
    return 'green';
}

AccelerometerGame.prototype.getUpdatedAccel = function(){
	var currPos = this.accelerometer.getLast();

    this.obs.x = Math.round(currPos.x * 10) / 10;
    this.obs.y = Math.round(currPos.y * 10) / 10;
    this.obs.z = Math.round(currPos.z * 10) / 10;
}

AccelerometerGame.prototype.winRound = function(){
	this.isWinState = true;
	$('body').css('background-color', 'green');
	var ref = this;
	setTimeout(function() {
		$('body').css('background-color', '#87ceeb');
		ref.changeScore(100);
		ref.randomize();
		ref.isWinState = false;
	}, 1000);
}

AccelerometerGame.prototype.changeScore = function(delta) {
	this.score += delta;
	if(this.score < 0) {
		this.score = 0;
	}
}

AccelerometerGame.prototype.randomizeButton = function() {
	this.changeScore(-20);
	this.randomize();
}

AccelerometerGame.prototype.randomize = function(){
	// Randomize from -10 and 10
	this.targ = {
		x: Math.round((Math.random() * 20) - 10),
		y: Math.round((Math.random() * 20) - 10),
		z: Math.round((Math.random() * 20) - 10),
	}

	$('#' + this.invalidDim + 'fields .diff').removeClass('disabled');

	switch(Math.floor(3 * Math.random())) {
		case 1:
			this.invalidDim = 'x';
			break;
		case 2:
			this.invalidDim = 'y';
			break;*
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