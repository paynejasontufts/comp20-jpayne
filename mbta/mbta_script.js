/* MBTA JavaScript
 * Jason Payne
 * 10/21/18 */ 

var curr_lat = 0;
var curr_long = 0;
var loc = new google.maps.LatLng(curr_lat, curr_long);
var options = {
	zoom: 12,
	center: loc,
	mapTypeId: google.maps.MapTypeId.ROADMAP
};

var map;
var stations = [
	{position: new google.maps.LatLng(42.395428, -71.142483), 
		stop_id: "place-alfcl", s_name: "Alewife", arrivals: " "},
	{position: new google.maps.LatLng(42.39674, -71.121815), 
		stop_id: "place-davis", s_name: "Davis", arrivals: " "},
	{position: new google.maps.LatLng(42.3884, -71.119149),
		stop_id: "place-portr", s_name: "Porter Square", arrivals: " "},
	{position: new google.maps.LatLng(42.372262, -71.118956),
		stop_id: "place-harsq", s_name: "Harvard Square", arrivals: " "},
	{position: new google.maps.LatLng(42.365486, -71.103802),
		stop_id: "place-cntsq", s_name: "Central Square", arrivals: " "},
	{position: new google.maps.LatLng(42.36249079, -71.08617653),
		stop_id: "place-knncl", s_name: "Kendall/MIT", arrivals: " "},
	{position: new google.maps.LatLng(42.361166, -71.070628),
		stop_id: "place-chmnl", s_name: "Charles/MGH", arrivals: " "},
	{position: new google.maps.LatLng(42.35639457, -71.0624242),
		stop_id: "place-pktrm", s_name: "Park Street", arrivals: " "},
	{position: new google.maps.LatLng(42.355518, -71.060225),
		stop_id: "place-dwnxg", s_name: "Downtown Crossing", 
		arrivals: " "},
	{position: new google.maps.LatLng(42.352271, -71.055242), 
		stop_id: "place-sstat", s_name: "South Station", arrivals: " "},
	{position: new google.maps.LatLng(42.342622, -71.056967),
		stop_id: "place-brdwy", s_name: "Broadway", arrivals: " "},
	{position: new google.maps.LatLng(42.330154, -71.057655),
		stop_id: "place-andrw", s_name: "Andrew", arrivals: " "},
	{position: new google.maps.LatLng(42.320685, -71.052391),
		stop_id: "place-jfk", s_name: "JFK/UMass", arrivals: " "},
	{position: new google.maps.LatLng(42.31129, -71.053331),
		stop_id: "place-shmnl", s_name: "Savin Hill", arrivals: " "},
	{position: new google.maps.LatLng(42.300093, -71.061667),
		stop_id: "place-fldcr", s_name: "Fields Corner", arrivals: " "},
	{position: new google.maps.LatLng(42.29312583, -71.06573796),
		stop_id: "place-smmnl", s_name: "Shawmut", arrivals: " "},
	{position: new google.maps.LatLng(42.284652, -71.064489), 
		stop_id: "place-asmnl", s_name: "Ashmont", arrivals: " "},
	{position: new google.maps.LatLng(42.275275, -71.029583),
		stop_id: "place-nqncy", s_name: "North Quincy", arrivals: " "},
	{position: new google.maps.LatLng(42.2665139, -71.0203369),
		stop_id: "place-wlsta", s_name: "Wollaston", arrivals: " "},
	{position: new google.maps.LatLng(42.251809, -71.005409),
		stop_id: "place-qnctr", s_name: "Quincy Center", arrivals: " "},
	{position: new google.maps.LatLng(42.233391, -71.007153), 
		stop_id: "place-qamnl", s_name: "Quincy Adams", arrivals: " "},
	{position: new google.maps.LatLng(42.2078543, -71.0011385),
		stop_id: "place-brntn", s_name: "Braintree", arrivals: " "}
];

function initialize() {
	map = new google.maps.Map(document.getElementById("map"), options);
	stations.forEach(function(station) {
		station = requestData(station);
	});
	getMyLocation();
}

function requestData(station) {
	request = new XMLHttpRequest();
	request.open("GET", "https://api-v3.mbta.com/predictions?" 
		+ "filter[route]=Red&filter[stop]=" + station.stop_id + 
		"&page[limit]=10&page[offset]=0&sort=departure_time&" + 
		"api_key=1a013d8967314b49a2a238ef5c762427", true);
	request.onreadystatechange = function() {
		if (request.readyState == 4) {
			theData = JSON.parse(request.responseText);
			return getData(theData, station);
		}
	}
	request.send();
}

function getData(theData, station) {
	for (i = 0; i < 3; i++) {
		console.log(theData);
		var arrival = theData[attributes].arrival_time;
		console.log(arrival);
	}

	return station;
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
	makeMarkers(stations);
	makePolylines(stations);
	closestDistance(loc, stations);
}

function makeMarkers(stations) {
	stations.forEach(function(station) {
		var info_text = infoText(station);
		var infowindow = new google.maps.InfoWindow({
			content: info_text
		});
		var marker = new google.maps.Marker({
			position: station.position,
			icon: "t_symbol.jpg",
			map: map,
			title: station.s_name 
		});
		marker.addListener("click", function() {
			infowindow.open(map, marker);
		})
	});
}

function infoText(station) {
	var text = "<h1>Station: " + station.s_name + "</h1>";
	text += "<h2>Time of Arrival ~~~~~~~~~~ Direction</h2>";
	return text;
}

function makePolylines(stations) {
	for (i = 0; i < 21; i++) {
		if (i == 16) {
			var train_line = new google.maps.Polyline({
				path: [stations[12].position, stations[17].position],
				strokeColor: "#FF0000"
			});
		}
		else {
			var train_line = new google.maps.Polyline({
				path: [stations[i].position, stations[i + 1].position],
				strokeColor: "#FF0000"
			});
		}
		train_line.setMap(map);
	}
}

function closestDistance(loc, stations) {
	var my_marker = new google.maps.Marker({
		position: loc,
		map: map,
		title: "My Location"
	});

	var minimum = 25000;
	var min_loc = stations[1];
	stations.forEach(function(station) {
		var dist = haversineDistance(loc.lat, loc.lng, 
			(station.position).lat, (station.position).lng);
		if (dist < minimum) {
			minimum = dist;
			min_loc = station;
		}
	});
	var min_line = new google.maps.Polyline({
		path: [min_loc.position, loc],
		strokeColor: "#0000FF"
	});
	min_line.setMap(map);

	var my_infowindow = new google.maps.InfoWindow({
		content: "Current Location"
	});
	my_marker.addListener("click", function() {
		my_infowindow.open(map, my_marker);
	});
}

function haversineDistance(lat1, lon1, lat2, lon2) {
	Number.prototype.toRad = function() {
   		return this * Math.PI / 180;
	}

	var R = 6371; // km 
	//has a problem with the .toRad() method below.
	var x1 = lat2-lat1;
	var dLat = x1.toRad();  
	var x2 = lon2-lon1;
	var dLon = x2.toRad();  
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                Math.cos(radian(lat1)) * Math.cos(radian(lat2)) * 
                Math.sin(dLon/2) * Math.sin(dLon/2);  
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c;
	return d;
}

function radian(num) {
	return num * Math.PI / 180;
}