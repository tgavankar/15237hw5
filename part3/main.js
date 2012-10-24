$(document).ready(function() {
	var task = new TaskList();
});

var TaskList = function(){
	this.tasks = {};
	this.nextTaskId = 0;
    this.setup();
    return this;
}

TaskList.prototype.setup = function() {
	

	 this.eventType = "click";

	if(this.isEventSupported("touchend")) {
	 	this.eventType = "touchend";
	 }

	var ref = this;
	$('#taskform').submit(function(e) {
		e.preventDefault();
		ref.addTask($('#task').val());
		$('#task').val('');
		return false;
	});

	$('#submit').on(this.eventType, function(e) {
		e.preventDefault();
		$('#taskform').submit();
	})

	$('.removehandler').live(this.eventType, function(e) {
		var parent = $(e.target).parent();
		if(parent.hasClass('remove')) {
			parent = parent.parent();
		}
		ref.removeTask(parent.attr('id'));
	});
	
	if(typeof(localStorage) !== "undefined") {
		this.hasStorage = true;
	}
	else {
		this.hasStorage = false;
	}
	
	this.getLocalStorage();
	
	alert(this.eventType);
}

TaskList.prototype.setLocalStorage = function(tasks, nextId) {
	if(this.hasStorage) {
		var data = { 'tasks': tasks, 'nextId': nextId };
		window.localStorage['taskListData'] = JSON.stringify(data);
	}
}

TaskList.prototype.getLocalStorage = function() {
	if(this.hasStorage && window.localStorage['taskListData'] !== undefined) {
		console.log(window.localStorage['taskListData']);
		var data = JSON.parse(window.localStorage['taskListData']);
		this.tasks = data.tasks;
		this.nextTaskId = data.nextId;
		this.updateTasks();
	}	
}

TaskList.prototype.updateTasks = function() {
	$('#tasklist').empty();
	for(var id in this.tasks) {
		var n = $('<div></div>');
		n.attr('id', id)
		 .text(this.tasks[id])
		 .addClass('taskentry')
		 .addClass('animate')
		 .addClass('show')
		 .append($('<div class="removehandler"><div class="removehandler">X</div></div>').addClass('remove'));
		$('#tasklist').append(n);
	}
	
}

TaskList.prototype.addTask = function(task) {
	this.tasks['task' + this.nextTaskId] = task;
	var n = $('<div></div>');
	n.attr('id', 'task' + this.nextTaskId)
	 .text(task)
	 .addClass('taskentry')
	 .addClass('animate')
	 .append($('<div class="removehandler"><div class="removehandler">X</div></div>').addClass('remove'));
	$('#tasklist').append(n);

	this.nextTaskId++;
	
	setTimeout(function() {
		n.addClass('show');
	}, 10);
	
	this.setLocalStorage(this.tasks, this.nextTaskId);
}

TaskList.prototype.removeTask = function(id) {
	delete this.tasks[id];
	$('#' + id).removeClass('show')
	setTimeout(function() {
		$('#'+id).remove();
	}, 1000);
	this.setLocalStorage(this.tasks, this.nextTaskId);
}

TaskList.prototype.isEventSupported = (function(){
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