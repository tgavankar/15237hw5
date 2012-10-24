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
	var ref = this;
	$('#taskform').submit(function(e) {
		e.preventDefault();
		ref.addTask($('#task').val());
		$('#task').val('');
		return false;
	})

	$('.remove').live('click', function(e) {
		ref.removeTask($(e.target).parent().attr('id'));
	});
	
	if(typeof(localStorage) !== "undefined") {
		this.hasStorage = true;
	}
	else {
		this.hasStorage = false;
	}
	
	this.getLocalStorage();
	
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
		 .append($('<span>X</span>').addClass('remove'));
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
	 .append($('<span>X</span>').addClass('remove'));
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

