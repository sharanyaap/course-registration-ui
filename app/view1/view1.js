'use strict';

angular.module('myApp.view1', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
        });
    }])

    .controller('View1Ctrl', ['$scope', '$http', function ($scope, $http, $route) {
        var appWebUrl = "http://localhost:8080/course-registration";

        $scope.selection = [];
        $scope.showTable = false;
        //$scope.message = ""

        getStudents();

        function getStudents() {
            return $http({
                method: 'GET',
                url: appWebUrl + "/students",
                headers: {"Accept": "*/*"},
                withCredentials: true
            }).success(function (data, status, headers, config) {
                //console.log(data);
                $scope.students = data;
            }).error(function (data, status, headers, config) {
                console.log(data);
            });
        }

        $scope.getStudentCourseStatus = function () {
            angular.forEach($scope.studentCourses, function (value, key) {
                //console.log(key);
                //console.log(value);
                angular.forEach($scope.courses, function (cvalue, ckey) {
                    if (value.courseId == cvalue.courseId) {
                        //console.log(value);
                        if (value.status == 1) {
                            cvalue.status = 'Approved';
                        } else if (value.status == 0) {
                            cvalue.status = 'Submitted';
                        } else if (value.status == 2) {
                            cvalue.status = 'Rejected';
                        }
                    }
                })
            })
        }

        $scope.onChangeUser = function () {
            //console.log($scope.selectedName);
            //getStudentCourseData($scope.selectedName.studentId);
            var myDataPromise = getStudentCourseData($scope.selectedName.studentId);
            myDataPromise.then(function (result) {
                // this is only run after getData() resolves
                //console.log($scope.courses);
                var myCourseDataPromise = getCourseData();
                myCourseDataPromise.then(function (result) {
                    $scope.getStudentCourseStatus();
                    angular.forEach($scope.courses, function (cvalue, ckey) {
                        if (cvalue.status == undefined) {
                            cvalue.status = '';
                        }
                        //console.log(cvalue.courseName + " "+ cvalue.status);
                    })
                    $scope.showTable = true;
                });
            });
            //$scope.selection = [];
        }

        function getCourseData() {
            return $http({
                method: 'GET',
                url: appWebUrl + "/courses",
                headers: {"Accept": "*/*"},
                withCredentials: true
            }).success(function (data, status, headers, config) {
                //console.log(data);
                $scope.courses = data;
            }).error(function (data, status, headers, config) {
                console.log(data);
            });
        }

        function getStudentCourseData(studentCourseId) {
            return $http({
                method: 'GET',
                url: appWebUrl + "/studentCourses/" + studentCourseId,
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


        $scope.submit = function () {
            console.log($scope.selection);
            angular.forEach($scope.selection, function (value, key) {
                    var data = {"studentId": $scope.selectedName.studentId, "semester": 2, "courseId": value};
                    data = JSON.stringify(data);
                    console.log(data);
                    var myDataPromise = submitRequest(data);
                    myDataPromise.then(function (result) {
                        console.log(result);
                    });
                }
            )
            $scope.selection = [];
        }

        $scope.reload = function(){
            location.reload();
            alert("Submitted Successully. Reload the drop down to reflect the changes");
        }

        function submitRequest(data) {
            return $http({
                method: 'POST',
                url: appWebUrl + "/studentCourses",
                data: data,
                headers: {'Content-Type': 'application/json'},
                withCredentials: true
            }).success(function (data, status, headers, config) {
                console.log(data);
            }).error(function (data, status, headers, config) {
                console.log(data);
            });
        }

        $scope.toggleSelection = function (x) {
            //console.log(x);
            var idx = $scope.selection.indexOf(x.courseId);
            // Is currently selected
            if (idx > -1) {
                $scope.selection.splice(idx, 1);
            }
            // Is newly selected
            else {
                $scope.selection.push(x.courseId);
            }
            console.log($scope.selection);
        }

    }]);