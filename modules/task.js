(function() {
	var module = angular.module('task', []);

	module.service('TaskDialogService', [ '$http', 'RestService', function($http, RestService) {
		var self = this;

		this.calculateProgress = function(subTasks, $scope){
			if(subTasks==null || subTasks==""){
				return;
			}
			var completed = 0;
			var total = subTasks.length;
			for (var i = 0; i < subTasks.length; i++) {
				if(subTasks[i].state){
					completed ++;
				}
			}
			if(total>0){
				$scope.dialogTask.progress = (completed/total)*100;
			}
		};
		
		this.loadTask = function(taskId, success) {
			$http({
				method : 'GET',
				url : RestService.getUrl('tasks/' + taskId + '.json?nestSubTasks=yes&includeCompletedSubtasks=yes'),
				headers : RestService.getHeaders(),
				data : {}
			}).success(function(data, status, headers, cfg) {
				var subtasks = data['todo-item'].subTasks;
				if (subtasks != null && subtasks != '') {
					for (var i = 0; i < subtasks.length; i++) {
						if (subtasks[i].status == "completed") {
							subtasks[i].state = true;
						} else {
							subtasks[i].state = false;
						}
					}
				}
				success(data);
			}).error(function(data, status, headers, cfg) {
			});
		};
		


		this.show = function($scope, task) {
			$scope.dialogTask = {};
			var calculator = this.calculateProgress;
			this.loadTask(task.id, function(data) {
				$scope.dialogTask = data['todo-item'];
				calculator($scope.dialogTask.subTasks, $scope);
				console.log(this);
				$('#taskModal').modal('show');
			});			
			
			

		};
		this.hide = function() {
			$('#taskModal').modal('hide');
		};
	} ]);


})();