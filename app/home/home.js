'use strict';
/**
 * @class app.home
 * @memberOf app
 * @requires ngRoute
 */
angular.module('app.home', ['ngRoute'])

.config([
    '$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: '/home/home.html',
      controller: 'HomeCtrl'
    });
    }
  ])

/**
 * @class app.home.HomeCtrl
 * @param {service} $scope
 * @param {service} $anchorScroll
 * @param {service} $location
 */
.controller('DashCtrl', function($scope, $anchorScroll, $location) {
  /**
   * @name $scope.anchor
   * @function
   * @memberOf app.home.HomeCtrl
   * @description Store URL's anchor value (`#disclaimer` for example) in the scope
   */
  $scope.anchor = $location.hash();
  /** Configure $anchorScroll to take the navbar into consideration*/
  $anchorScroll.yOffset = 90;
  /** Scroll To anchor */
  $anchorScroll();
});
