"use strict";angular.module("minibankFrontendApp",["ngCookies","ngResource","ngSanitize","ngRoute","ui.map"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MapCtrl"}).when("/about",{templateUrl:"views/about.html"}).otherwise({redirectTo:"/"})}]),angular.module("minibankFrontendApp").controller("MapCtrl",["$scope","$http",function(a,b){function c(b){var c=new google.maps.LatLng(b.coords.latitude,b.coords.longitude);(void 0===a.markerData||void 0!==a.lastPosition&&e(b.coords,a.lastPosition)>100)&&(a.myMap.setCenter(c),a.myMap.setZoom(15),a.loadMarkers(c),a.lastPosition=b.coords),d(c)}function d(b){void 0!==a.locationMarker&&a.locationMarker.setMap(null),a.locationMarker=new google.maps.Marker({map:a.myMap,position:b,icon:"images/gpsloc.png",zIndex:google.maps.Marker.MAX_ZINDEX+1})}function e(a,b){var c=6371,d=(b.latitude-a.latitude).toRad(),e=(b.longitude-a.longitude).toRad(),f=Math.sin(d/2)*Math.sin(d/2)+Math.cos(a.latitude.toRad())*Math.cos(b.latitude.toRad())*Math.sin(e/2)*Math.sin(e/2),g=2*Math.atan2(Math.sqrt(f),Math.sqrt(1-f)),h=c*g;return 1e3*h}function f(a){console.log(a),navigator.geolocation?navigator.geolocation.watchPosition(c):alert("Your browser does not support Geolocation.")}a.loadMarkers=function(c){var e="http://steras-minibank-beta.appspot.com/minibank",f=e+"?lat="+c.lat()+"&long="+c.lng()+"&callback=JSON_CALLBACK",g=b.jsonp(f);g.success(function(b){console.log(b),a.markerData=b,$.each(b,function(b,c){console.log(c);var d=new google.maps.LatLng(c.latitude,c.longitude);new google.maps.Marker({position:d,map:a.myMap,icon:"images/symbol_dollar.png"})}),d(c)}),g.error(function(){})},"undefined"==typeof Number.prototype.toRad&&(Number.prototype.toRad=function(){return this*Math.PI/180}),f(a),a.mapOptions={center:new google.maps.LatLng(59.92199,10.760078),zoom:12,mapTypeId:google.maps.MapTypeId.ROADMAP}}]);