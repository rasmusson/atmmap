'use strict';

angular.module('minibankFrontendApp')
 /* .controller('MapCtrl', function ($scope, $http) {
    $scope.loadMarkers = function (position) {
      var baseUrl = 'http://steras-minibank.appspot.com/minibank';
      var url = baseUrl + '?lat=' + position.lat() + '&long=' + position.lng() + '&callback=JSON_CALLBACK';
      var responsePromise = $http.jsonp(url);

      responsePromise.success(function (data) {
        console.log(data);
        $scope.markerData = data;
        $.each(data, function (key, val) {
          console.log(val);
          var ATMPosition = new google.maps.LatLng(val.latitude, val.longitude);
          new google.maps.Marker({position: ATMPosition, map: $scope.myMap, icon: 'images/symbol_dollar.png'});
        });
        setUserLocation(position);
      });


      responsePromise.error(function () {

      });
    };

    function newLocation (position) {
      var userPosition = new google.maps.LatLng(position.coords.latitude,
        position.coords.longitude);

      if ($scope.markerData === undefined || ($scope.lastPosition !== undefined && distance(position.coords, $scope.lastPosition) > 100)) {
        $scope.myMap.setCenter(userPosition);
        $scope.myMap.setZoom(15);

        $scope.loadMarkers(userPosition);
        $scope.lastPosition = position.coords;
      }

      setUserLocation(userPosition);
    }

    function setUserLocation(userPosition) {
      if ($scope.locationMarker !== undefined) {
        $scope.locationMarker.setMap(null);
      }

      $scope.locationMarker = new google.maps.Marker({
        map: $scope.myMap,
        position: userPosition,
        icon: 'images/gpsloc.png',
        zIndex: google.maps.Marker.MAX_ZINDEX + 1
      });
    }

    function distance(position1, position2) {
      var R = 6371; // Radius of the earth in km
      var dLat = (position2.latitude-position1.latitude).toRad();  // Javascript functions in radians
      var dLon = (position2.longitude-position1.longitude).toRad();
      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(position1.latitude.toRad()) * Math.cos(position2.latitude.toRad()) *
          Math.sin(dLon/2) * Math.sin(dLon/2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c; // Distance in km
      return d*1000;
    }

    // Converts numeric degrees to radians
    if (typeof(Number.prototype.toRad) === 'undefined') {
      Number.prototype.toRad = function() {
        return this * Math.PI / 180;
      };
    }

    function initUserLocation(scope) {
      console.log(scope);
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(newLocation);
      }
      else {
        alert('Your browser does not support Geolocation.');
      }
    }

    initUserLocation($scope);



  })*/

  .controller("MapCtrl", function($scope, uiGmapGoogleMapApi, $http) {
      // Do stuff with your $scope.
      // Note: Some of the directives require at least something to be defined originally!
      // e.g. $scope.markers = []

      // uiGmapGoogleMapApi is a promise.
      // The "then" callback function provides the google.maps object.
      uiGmapGoogleMapApi.then(function(maps) {
        console.log("loaded")
        $scope.map = {
        center:
          {
            latitude: 59.921990,
            longitude: 10.760078
          },
        zoom: 12,
        events: {dragend: mapDraged
        }
        }



      });

$scope.atms = [];
$scope.atmMap = [];

$scope.locationMarker = {
    id: 0,
    coords: {
      latitude: null,
      longitude: null,
    },
    options: {
      icon: 'images/gpsloc.png',
      zIndex: google.maps.Marker.MAX_ZINDEX + 1
    }
  };

  var mapDraged = function (map, eventName, originalEventArgs) {
                            var position = {latitude: map.center.lat(), longitude: map.center.lng()};
                            $scope.loadMarkers(position)
    };

      $scope.loadMarkers = function (position) {
            console.log("Getting atms");

            $scope.lastPosition = position.coords;
            var baseUrl = 'http://steras-minibank.appspot.com/minibank';
            var url = baseUrl + '?lat=' + position.latitude + '&long=' + position.longitude + '&callback=JSON_CALLBACK';
            var responsePromise = $http.jsonp(url);

            responsePromise.success(function (data) {

              $scope.markerData = data;

              //Create associative array of markers to remove duplicates
              $.each(data, function (key, val) {
                var markerId = String(val.latitude)+String(val.longitude);
                $scope.atmMap[markerId] = { id: markerId,
                                          coords: {
                                            latitude: val.latitude,
                                            longitude: val.longitude,
                                          },
                                          icon: 'images/symbol_dollar.png'
                                        }
              });

              //Copying assiciative array to a normal one which is needed by maps
              $scope.atms = [];
              for (var key in $scope.atmMap) {
                $scope.atms.push($scope.atmMap[key]);
              }

            });


            responsePromise.error(function () {

            });
          };


          function newLocation (position) {
            var userPosition = { latitude: position.coords.latitude, longitude: position.coords.longitude };

            /*console.log("lastknown")
            console.log($scope.lastPosition)
            console.log("distance")
            console.log(distance(position.coords, $scope.lastPosition))
*/

            if ($scope.lastPosition == undefined || distance(position.coords, $scope.lastPosition) > 100) {
              $scope.map.center = userPosition;
              $scope.map.zoom = 15;
              console.log("userpos");
              console.log(userPosition);

              $scope.loadMarkers(userPosition);
              $scope.lastPosition = position.coords;
            }

            setUserLocation(userPosition);
          }

          function setUserLocation(userPosition) {
            console.log('setting new user location')
            $scope.locationMarker.coords.latitude = userPosition.latitude;
            $scope.locationMarker.coords.longitude = userPosition.longitude;
            $scope.$apply();
            /*$scope.locationMarker = new google.maps.Marker({
              map: $scope.map,
              position: userPosition,
              icon: 'images/gpsloc.png',
              zIndex: google.maps.Marker.MAX_ZINDEX + 1
            });*/
          }

          function distance(position1, position2) {
            var R = 6371; // Radius of the earth in km
            var dLat = (position2.latitude-position1.latitude).toRad();  // Javascript functions in radians
            var dLon = (position2.longitude-position1.longitude).toRad();
            var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(position1.latitude.toRad()) * Math.cos(position2.latitude.toRad()) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            var d = R * c; // Distance in km
            return d*1000;
          }

          // Converts numeric degrees to radians
          if (typeof(Number.prototype.toRad) === 'undefined') {
            Number.prototype.toRad = function() {
              return this * Math.PI / 180;
            };
          }

          function initUserLocation(scope) {
            console.log(scope);
            if (navigator.geolocation) {
              navigator.geolocation.watchPosition(newLocation);
            }
            else {
              alert('Your browser does not support Geolocation.');
            }
          }

          initUserLocation($scope);

  });

