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
		return false;
	})

	$('.remove').live('click', function(e) {
		ref.removeTask($(e.target).parent().attr('id'));
	});
}

TaskList.prototype.addTask = function(task) {
	this.tasks['task' + this.nextTaskId] = task;
	$('body').data('asdf', 'fdsa');
	var n = $('<div></div>');
	n.attr('id', 'task' + this.nextTaskId)
	 .text(task)
	 .addClass('taskentry')
	 .append($('<span>X</span>').addClass('remove'));
	$('#tasklist').append(n);

	this.nextTaskId++;
}

TaskList.prototype.removeTask = function(id) {
	delete this.tasks[id];
	$('#' + id).remove();
}

