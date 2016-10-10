'use strict';
/**
 * Initialize firebase
 * @function initializeApp
 * @param {object} config firebase configuration values.
 * @return {object} service
 * @require firebase
 */
var config = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  storageBucket: ""
};
firebase.initializeApp(config);

/**
 * Hide/Show nav on mobile
 * @function toggleNav
 */
function toggleNav() {
  document.getElementsByClassName("topnav")[0].classList.toggle("responsive");
  document.getElementsByTagName("nav")[0].classList.toggle("responsive");
}

/**
 * @namespace app
 * @requires ngRoute
 * @requires app.home
 * @requires firebase
 */
angular.module('app', [
  'ngRoute',
  'app.home',
  'firebase'
])

.config([
    '$locationProvider', '$routeProvider',
  function($locationProvider, $routeProvider) {
    /**
     * @description ngRoute with html5 mode (no hashbang, but with fallback)
     * @memberOf home.home
     */
    $locationProvider.html5Mode(true)
      .hashPrefix('!');

    $routeProvider.otherwise({
      redirectTo: '/'
    });
    }
  ])

.factory("Auth", [
    "$firebaseAuth",
    /**
     * @function Auth
     * @memberOf app.app
     * @param {service} $firebaseAuth feed with auth state
     * @return {object} Return auth state
     * @require firebase
     */
      function($firebaseAuth) {
    return $firebaseAuth();
    }
  ])

.factory("Db",
  /**
   * @function Db
   * @memberOf app.app
   * @return {object} Return database
   * @require firebase
   */
  function() {
    return firebase.database()
      .ref();
  })

.run(function($location, $rootScope, Auth) {
  $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
    if (error === "AUTH_REQUIRED") {
      $location.path('/');
      $rootScope.Error(
        'You need to be signed in to access this page, please Sign In and try again.'
      );
    }
  });

  /**
   * @name $rootScope.signIn
   * @function
   * @memberOf app.app
   * @description function to sign In with provider
   */
  $rootScope.signIn = function(provider, email, password) {
    $rootScope.user = null;
    $rootScope.Error("", false);
    if (provider == "email") {
      Auth.$signInWithEmailAndPassword(email, password)
        .then(function(firebaseUser) {
          $rootScope.user = firebaseUser;
        })
        .catch(function(error) {
          $rootScope.Error(error);
        });
    } else
    if (provider == "anonymous") {
      Auth.$signInAnonymously()
        .then(function(firebaseUser) {
          $rootScope.user = firebaseUser;
        })
        .catch(function(error) {
          $rootScope.Error(error);
        });
    } else {
      Auth.$signInWithPopup(provider)
        .then(function(firebaseUser) {
          $rootScope.user = firebaseUser;
        })
        .catch(function(error) {
          $rootScope.Error(error);
        });
    }
  };

  /**
   * @name $rootScope.signOut
   * @function
   * @memberOf app.app
   * @description function to sign Out
   */
  $rootScope.signOut = function() {
    Auth.$signOut();
  };

  /**
   * @name $rootScope.goHome
   * @function
   * @memberOf app.app
   * @description function to go to /
   */
  $rootScope.goHome = function() {
    $location.path('/');
  };

  $rootScope.Error = function(e, bool) {
    $rootScope.error = {
      text: e,
      show: (bool == undefined ? true : bool)
    }
  }

  /**
   * any time auth status updates, add the user data to scope
   * @memberOf app.app
   */
  Auth.$onAuthStateChanged(function(firebaseUser) {
    $rootScope.user = firebaseUser;
  });

  ga('send', 'pageview');
})

.directive('ngConfirmClick', [
  function() {
    return {
      link: function(scope, element, attr) {
        var msg = attr.ngConfirmClick || "Are you sure?";
        var clickAction = attr.confirmedClick;
        element.bind('click', function(event) {
          if (window.confirm(msg)) {
            scope.$eval(clickAction)
          }
        });
      }
    }
  }
])
