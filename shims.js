function isAndroid(){
    return navigator.userAgent.indexOf("Android") !== -1;
}

function isIOS(){
   return  !!(navigator.userAgent.match(/iPhone/i) ||
           navigator.userAgent.match(/iPod/i) ||
           navigator.userAgent.match(/iPad/i));
}

// Required when using PhoneGap
var nop = function() { };
if (window.navigator === undefined) {
    window.navigator = {};
}
if (window.navigator.notification === undefined) {
    window.navigator.notification = {};
}
if (window.navigator.notification.vibrate === undefined)   
    window.navigator.notification.vibrate = nop;
}

// iOS5 or less does not have .bind so add it if needed (iOS6 has it!)
function patchFnBind(){
   if (Function.prototype.bind === undefined){
      Function.prototype.bind = function (bind) {
           var self = this;
           return function () {
               var args = Array.prototype.slice.call(arguments);
               return self.apply(bind || null, args);
           };
       };
   }
}

// Accelerometer
if (window.navigator.accelerometer === undefined) {
 window.navigator.accelerometer = {};
}
if (window.navigator.accelerometer.watchAcceleration === undefined) {
 window.navigator.accelerometer.watchAcceleration = function(onAccelerometerUpdate) {
   function keyCheck(ev){
     var keyCode = typeof ev.which != "undefined" ? ev.which : event.keyCode;
     // 37=Left  38=Up  39=Right  40=Down
     if ([37,38,39,40].indexOf(keyCode) != -1) {
       var left = (keyCode == 37) ? 3 : 0; //velocity is 3
       var up = (keyCode == 38) ? 3 : 0;
       var right = (keyCode == 39) ? 3 : 0;
       var down = (keyCode == 40) ? 3 : 0;
       onAccelerometerUpdate({
         x: down*5 - up*5,
         y: right*5 - left*5,
         z: 0,
         timestamp: Date.now()
       });
     }
     ev.preventDefault();
     ev.stopPropagation();
   }
   window.addEventListener('keydown', keyCheck, false)
 }
}
   
// See http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
// Usage example:  isEventSupported("click") // works for any event
var isEventSupported = (function(){
   var TAGNAMES = {
     'select':'input','change':'input',
     'submit':'form','reset':'form',
     'error':'img','load':'img','abort':'img'
   }
   function isEventSupported(eventName) {
     var el = document.createElement(TAGNAMES[eventName] || 'div');
     eventName = 'on' + eventName;
     var isSupported = (eventName in el);
     if (!isSupported) {
       el.setAttribute(eventName, 'return;');
       isSupported = typeof el[eventName] == 'function';
     }
     el = null;
     return isSupported;
   }
   return isEventSupported;
 })();