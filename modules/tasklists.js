(function() {
	var module = angular.module('tasklists', [ 'rest', 'view' ]);

	module.controller('TasklistsCtrl', [ '$scope', 'ViewService', 'RestService', '$http', '$routeParams', 'TaskDialogService',
			function($scope, ViewService, RestService, $http, $routeParams, TaskDialogService) {
				$scope.projectId = $routeParams.projectId;
				$scope.tasklists = [];
				$scope.listNew = {};

				$scope.loadProject = function() {
					$scope.newListName = '';
					$scope.newTaskName = '';
					$scope.newTaskList = -1;
					$scope.editList = -1;
					$http({
						method : 'GET',
						url : RestService.getUrl('projects/' + $scope.projectId + '.json'),
						headers : RestService.getHeaders(),
						data : {}
					}).success(function(data, status, headers, cfg) {
						$scope.project = data.project;
					}).error(function(data, status, headers, cfg) {
					});
				};

				$scope.loadLists = function() {
					$scope.loading = true;
					$http({
						method : 'GET',
						url : RestService.getUrl('projects/' + $scope.projectId + '/todo_lists.json?getSubTasks=no'),
						headers : RestService.getHeaders(),
						data : {getSubTasks:'yes', nestSubTasks:'yes'}
					}).success(function(data, status, headers, cfg) {
						$scope.tasklists = data["todo-lists"];
						$scope.loading = false;
					}).error(function(data, status, headers, cfg) {
						$scope.loading = false;
					});
				};

				$scope.loadProject();
				$scope.loadLists();

				$scope.showNewList = function() {
					$scope.newListShown = true;
					$scope.editList = -1;
				};

				$scope.hideNewList = function() {
					$scope.newListShown = false;
					$scope.newListName = '';
					$scope.editList = -1;
				};

				$scope.saveNewList = function() {
					$http({
						method : 'POST',
						url : RestService.getUrl('projects/' + $scope.projectId + '/todo_lists.json'),
						headers : RestService.getHeaders(),
						data : {
							'todo-list' : {
								name : $scope.newListName
							}
						}
					}).success(function(data, status, headers, cfg) {
						$scope.loadLists();
						$scope.hideNewList();
					}).error(function(data, status, headers, cfg) {
					});
				};

				$scope.updateList = function(taskList) {
					$http({
						method : 'PUT',
						url : RestService.getUrl('todo_lists/' + taskList.id + '.json'),
						headers : RestService.getHeaders(),
						data : {
							'todo-list' : taskList
						}
					}).success(function(data, status, headers, cfg) {
						$scope.loadLists();
						$scope.loading = false;
						$scope.closeEdit();
					}).error(function(data, status, headers, cfg) {
					});
				};

				$scope.remove = function(taskList) {
					bootbox.confirm("Do you want to delete list <strong>" + taskList.name + "</strong>?", function(result) {
						if (result) {
							$http({
								method : 'DELETE',
								url : RestService.getUrl('todo_lists/' + taskList.id + '.json'),
								headers : RestService.getHeaders(),
								data : {}
							}).success(function(data, status, headers, cfg) {
								$scope.loadLists();
							}).error(function(data, status, headers, cfg) {
							});
						}
					});
				};

				$scope.isEditShown = function(index) {
					return $scope.editList == index;
				}

				$scope.openEdit = function(index) {
					$scope.editList = index;
				};
				$scope.closeEdit = function() {
					$scope.editList = -1;
				};

				$scope.addTask = function(taskList, listIndex) {
					$scope.addingTask = true;
				};
				
				$scope.removeTask = function(task, listIndex) {
					bootbox.confirm("Do you want to delete task <strong>" + task.content + "</strong>?", function(result) {
						if (result) {
							$scope.removingTaskId = task.id;
							$http({
								method : 'DELETE',
								url : RestService.getUrl('tasks/' + task.id + '.json'),
								headers : RestService.getHeaders(),
								data : {}
							}).success(function(data, status, headers, cfg) {
								$scope.loadSingleList(task['todo-list-id'], listIndex, function(){$scope.removingTaskId = -1;});
							}).error(function(data, status, headers, cfg) {
								$scope.removingTaskId = -1;
							});
						}
					});
				};

				$scope.showNewTaskDialog = function(index) {
				};

				$scope.closeNewTaskDialog = function() {
					$scope.newTaskList = -1;
					$scope.newTaskName = '';
					$scope.addingTask = false;
				};

				$scope.loadSingleList = function(listId, listIndex, success) {					
					$http({
						method : 'GET',
						url : RestService.getUrl('todo_lists/' + listId + '.json'),
						headers : RestService.getHeaders(),
						data : {}
					}).success(function(data, status, headers, cfg) {
							$scope.tasklists[listIndex] = data["todo-list"];
							success();
					}).error(function(data, status, headers, cfg) {
					});
				};
				
				$scope.showTaskDialog = function(task) {
					TaskDialogService.show($scope, task);
				};

			} ]);

	
	
})();