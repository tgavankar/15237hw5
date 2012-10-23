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
	    maximumAge: 30000,
	    timeout: 27000
	};
    
	
	navigator.geolocation.getCurrentPosition(successCallback, errCallback);
	
    var watchId;
    
	$('#locationNow').click(function () {
	   if(this.hasClass('watching')) {
		    watchId = navigator.geolocation.getCurrentPosition(successCallback, errCallback);
	   }
	   else {
            navigator.geolocation.clearWatch(watchId);
	   }
	   this.toggleClass('watching');
	});

	function successCallback(position) {
	    console.log(position);
	}

	function errCallback(err) {
	    var message = err.message;
	    var code = err.code;
	    alert("Erorr: " + code + ", " + err.message);
	    //code = 0 => UNKNOWN_ERROR, 1 => PERMISSION_DENIED, 2 => POSITION_UNAVAILABLE, 3 => TIMEOUT
	}


});