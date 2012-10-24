$(document).ready(function() {
	var nop = function () {};

	if (!navigator.geolocation) {
	    navigator.geolocation = {};
	}
	if (!navigator.geolocation.getCurrentPosition) {
	    navigator.geolocation.getCurrentPosition = nop;
	}

    
	// optional for geolocation.watchPosition
	var options = {
	    enableHighAccuracy: true,
	    maximumAge: 250,
	    timeout: 10000
	};
    
	
	navigator.geolocation.getCurrentPosition(successCallback, errCallback, options);
	
    var watchId;
    
	$('#locationNow').click(function(e) {
	   if(!$(this).hasClass('watching')) {
		    watchId = navigator.geolocation.watchPosition(successCallback, errCallback, options);
		    $(this).attr('value', 'Stop watching position');
	   }
	   else {
            navigator.geolocation.clearWatch(watchId);
            $(this).attr('value', 'Start watching position');
	   }
	   $(this).toggleClass('watching');
	});

	function successCallback(position) {
		console.log(position);
		var index = $('#locTable tr').length - 1;
		var lat = position.coords.latitude;
		var lng = position.coords.longitude;
		var acc = position.coords.accuracy;
		var spd = position.coords.speed;
		var alt = position.coords.altitude;
		var altacc = position.coords.altitudeAccuracy;

	    $('#locTable tr:last').after(
	    	'<tr><td>' + 
	    	index + 
	    	'</td><td>' + 
	    	lat + 
	    	'</td><td>' +
	    	lng +
	    	'</td><td>' + 
	    	acc + 
	    	'</td><td>' +
	    	spd +
	    	'</td><td>' +
	    	alt +
	    	'</td><td>' +
	    	altacc +
	    	'</td></tr>');
	}

	function errCallback(err) {
	    var message = err.message;
	    var code = err.code;
	    alert("Erorr: " + code + ", " + err.message);
	    //code = 0 => UNKNOWN_ERROR, 1 => PERMISSION_DENIED, 2 => POSITION_UNAVAILABLE, 3 => TIMEOUT
	}


});