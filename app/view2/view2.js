'use strict';

angular.module('myApp.view2', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view2', {
            templateUrl: 'view2/view2.html',
            controller: 'View2Ctrl'
        });
    }])

    .controller('View2Ctrl', ['$scope', '$http', function ($scope, $http) {

        var appWebUrl = "http://localhost:8080/course-registration";
        $scope.selection = [];

        getAllStudentCourseData();

        function getAllStudentCourseData() {
            return $http({
                method: 'GET',
                url: appWebUrl + "/studentCourses",
                headers: {"Accept": "*/*"},
                withCredentials: true
            }).success(function (data, status, headers, config) {
                //console.log(data);
                $scope.studentCourses = data;
                //console.log($scope.courses);
            }).error(function (data, status, headers, config) {
                console.log(data);
            });
        }

        $scope.approve = function () {
            console.log($scope.selection);
            var data = {"studentCourseIds": $scope.selection, "status": 1};
            data = JSON.stringify(data);
            var myDataPromise = update(data);
            myDataPromise.then(function (result) {
                console.log(result);
            });
            $scope.selection = [];
        }

        function update(data) {
            return $http({
                method: 'PUT',
                url: appWebUrl + "/studentCourses/update",
                data: data,
                headers: {'Content-Type': 'application/json'},
                withCredentials: true
            }).success(function (data, status, headers, config) {
                console.log(data);
            }).error(function (data, status, headers, config) {
                console.log(data);
            });
        }

        $scope.reject = function () {
            console.log($scope.selection);
            var data = {"studentCourseIds": $scope.selection, "status": 2};
            data = JSON.stringify(data);
            var myDataPromise = update(data);
            myDataPromise.then(function (result) {
                console.log(result);
            });
            $scope.selection = [];
        }

        $scope.reload = function () {
            location.reload();
            alert("Task completed Successully");
        }

        $scope.toggleSelection = function (x) {
            //console.log(x);
            var idx = $scope.selection.indexOf(x.studentCourseId);
            // Is currently selected
            if (idx > -1) {
                $scope.selection.splice(idx, 1);
            }
            // Is newly selected
            else {
                $scope.selection.push(x.studentCourseId);
            }
            console.log($scope.selection);
        }

    }]);