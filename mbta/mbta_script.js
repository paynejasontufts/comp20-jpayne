/* MBTA JavaScript
 * Jason Payne
 * 10/21/18 */ 

var curr_lat = 0;
var curr_long = 0;
var loc = new google.maps.LatLng(curr_lat, curr_long);

var map;
var south, andrew, porter, harvard, jfk, savin, park, broadway;
var q_north, shawmut, davis, alewife, kendall, charles, downtown;
var q_center, q_adams, ashmont, wollaston, fields, central, braintree;

function Station(long, lat, stop_id) {
	this.long = long;
	this.lat = lat;
	this.stop_id = stop_id;
}

function initialize() {
	map = new google.maps.Map(document.getElementbyId("map"));
	getMyLocation();
}

function getMyLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			curr_lat = position.coords.latitude;
			curr_long = position.coords.longitude;
			makeMap();
		});
	}
	else {
		alert("Geolocation is not supported by your web browser");
	}
}

function makeMap() {
	loc = new google.maps.LatLng(curr_lat, curr_long);
	map.panTo(loc);
}