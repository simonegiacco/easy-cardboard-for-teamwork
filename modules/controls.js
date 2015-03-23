(function() {
	var module = angular.module('controls', []);

	module.directive('collapsePanel', function() {
		return {
			restrict : 'E',
			replace : true,
			transclude : true,
			templateUrl : "templates/controls/collapse-panel.html",
			scope : {
				collapsedAttr : "=collapsed",
				accordionId : "@accordionId"
			},

			link : function(scope, element, attrs) {
				var detailPanel = $(element).find("[panel-item='details']")[0];
				var switcher = $(element).find("[panel-item='header']")[0];
				$(switcher).click(function() {
					// close others
					$(element).siblings().children("[panel-item='details']:visible").slideUp(100);

					if ($(detailPanel).is(":hidden")) {
						$(detailPanel).slideToggle(100);
						$(element).attr("collapsed", false);
						scope.collapsedAttr = false;
						scope.state = true;
					}
				});
			}
		};
	});

	
	module.directive('datepicker', function() {
		return {
			restrict : 'A',
			require : 'ngModel',
			link : function(scope, element, attrs, ngModelCtrl) {
				$(function() {
					element.datepicker({
						dateFormat : 'dd.mm.yy',
						onSelect : function(date) {
							scope.$apply(function() {
								ngModelCtrl.$setViewValue(date);
							});
						}
//					,
//						showOn: "button",
//		        buttonImage: "images/calendar.gif",
//		        buttonImageOnly: true
					});
				});
			}
		};
	});

	
	module.directive('selectPicker', [ '$timeout', function($timeout) {
		return {
			restrict : 'A',
			replace : true,
			require : 'ngModel',
			link : function(scope, element, attrs, ngModel) {
				// http://silviomoreto.github.io/bootstrap-select/
				// http://suhairhassan.com/2013/05/01/getting-started-with-angularjs-directive.html#.VPzJYfmsV1B
				$timeout(function() {
					$(element).selectpicker();
				});
				scope.$watch(function() {
					return ngModel.$modelValue;
				}, function(modelValue) {
					$(element).selectpicker('val', modelValue);
				});

			}
		};
	} ]);
	

})();