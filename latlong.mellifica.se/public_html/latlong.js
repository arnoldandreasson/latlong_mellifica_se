// Author: Arnold Andreasson, info@mellifica.se
// Copyright (c) 2007-2016 Arnold Andreasson 
// License: MIT License as follows:
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

var latlong_init_finished = false;
var lat_dd = null;
var lat_dm = null;
var lat_dms = null;
var long_dd = null;
var long_dm = null;
var long_dms = null;
var proj_rt90 = null;
var x_rt90 = null;
var y_rt90 = null;
var proj_sweref99 = null;
var n_sweref99 = null;
var e_sweref99 = null;
// Decimal degrees. Type=float.
var latitude = null;
var longitude = null;
var url_arguments = null;

function latlong_init() {
	
	map_init();
	
	lat_dd = document.getElementById("lat_dd");
	lat_dm = document.getElementById("lat_dm");
	lat_dms = document.getElementById("lat_dms");
	long_dd = document.getElementById("long_dd");
	long_dm = document.getElementById("long_dm");
	long_dms = document.getElementById("long_dms");
	proj_rt90 = document.getElementById("proj_rt90");
	x_rt90 = document.getElementById("x_rt90");
	y_rt90 = document.getElementById("y_rt90");
	proj_sweref99 = document.getElementById("proj_sweref99");
	n_sweref99 = document.getElementById("n_sweref99");
	e_sweref99 = document.getElementById("e_sweref99");
	show_rt90_meridian(proj_rt90.value); // In map.js.
	show_sweref99_meridian(proj_sweref99.value); // In map.js.
	
	var url_args = location.search.substring(1);
	if (url_args.length > 0) {
		url_arguments = url_args 
		parse_url_arguments();
	}
	latlong_init_finished = true;
}

// Set and get functions for external use. Storage, map, etc.
function set_lat_long(lat, lon) {
	latitude = lat;
	longitude = lon;
	update_lat();
	update_long();
	show_map_marker(lat, lon);  // In map.js.
	update_rt90();
	update_sweref99();
}
function update_set_lat_long() {
	show_map_marker(latitude, longitude);  // In map.js.
}
function get_latitude() {
	return latitude;
}
function get_longitude() {
	return longitude;
}

// Should be called when a key goes up while the field has focus.
function keyup_lat_dd(event) {
	var value = lat_dd.value;
	latitude = convert_lat_from_dd(value);
	lat_dm.value = convert_lat_to_dm(latitude);
	lat_dms.value = convert_lat_to_dms(latitude);
	update_rt90();
	update_sweref99();
	show_map_marker(latitude, longitude); // In map.js.	
}
function keyup_long_dd(event) {
	var value = long_dd.value;
	longitude = convert_long_from_dd(value);
	long_dm.value = convert_long_to_dm(longitude);
	long_dms.value = convert_long_to_dms(longitude);
	update_rt90();
	update_sweref99();
	show_map_marker(latitude, longitude); // In map.js.	
}
function keyup_lat_dm(event) {
	var value = lat_dm.value;
	latitude = convert_lat_from_dm(value);
	lat_dd.value = convert_lat_to_dd(latitude);
	lat_dms.value = convert_lat_to_dms(latitude);
	update_rt90();
	update_sweref99();
	show_map_marker(latitude, longitude); // In map.js.	
}
function keyup_long_dm(event) {
	var value = long_dm.value;
	longitude = convert_long_from_dm(value);
	long_dd.value = convert_long_to_dd(longitude);
	long_dms.value = convert_long_to_dms(longitude);
	update_rt90();
	update_sweref99();
	show_map_marker(latitude, longitude); // In map.js.	
}
function keyup_lat_dms(event) {
	var value = lat_dms.value;
	latitude = convert_lat_from_dms(value);
	lat_dd.value = convert_lat_to_dd(latitude);
	lat_dm.value = convert_lat_to_dm(latitude);
	update_rt90();
	update_sweref99();
	show_map_marker(latitude, longitude); // In map.js.	
}
function keyup_long_dms(event) {
	var value = long_dms.value;
	longitude = convert_long_from_dms(value);
	long_dd.value = convert_long_to_dd(longitude);
	long_dm.value = convert_long_to_dm(longitude);
	update_rt90();
	update_sweref99();
	show_map_marker(latitude, longitude); // In map.js.	
}
function keyup_rt90(event) {
	if ((x_rt90.value == "") || (y_rt90.value == "")) {
		latitude = null;
		longitude = null;
	} else {
		var x = parseFloat(x_rt90.value.replace(",", "."));
		var y = parseFloat(y_rt90.value.replace(",", "."));
		swedish_params(proj_rt90.value);
		var lat_lon = grid_to_geodetic(x, y);
		latitude = lat_lon[0];
		longitude = lat_lon[1];
	}
	update_lat();
	update_long();
	update_sweref99();
	show_map_marker(latitude, longitude); // In map.js.	
}
function keyup_sweref99(event) {
	if ((n_sweref99.value == "") || (e_sweref99.value == "")) {
		latitude = null;
		longitude = null;
	} else {
		var n = parseFloat(n_sweref99.value.replace(",", "."));
		var e = parseFloat(e_sweref99.value.replace(",", "."));
		swedish_params(proj_sweref99.value);
		var lat_lon = grid_to_geodetic(n, e);
		latitude = lat_lon[0];
		longitude = lat_lon[1];
	}
	update_lat();
	update_long();
	update_rt90();
	show_map_marker(latitude, longitude); // In map.js.	
}

//  Should be called when the fields loses focus.  
function blur_lat(event) {
	update_lat();
}
function blur_long(event) {
	update_long();
}
function blur_rt90(event) {
//	update_rt90();
}
function blur_sweref99(event) {
//	update_rt90();
}

// Projection changes.
function select_proj_rt90(event) {
	show_rt90_meridian(proj_rt90.value); // In map.js.
	update_rt90();
}
function select_proj_sweref99(event) {
	show_sweref99_meridian(proj_sweref99.value); // In map.js.
	update_sweref99();
}

// Private functions.
function update_lat() {
	lat_dd.value = convert_lat_to_dd(latitude);
	lat_dm.value = convert_lat_to_dm(latitude);
	lat_dms.value = convert_lat_to_dms(latitude);
}
function update_long() {
	long_dd.value = convert_long_to_dd(longitude);
	long_dm.value = convert_long_to_dm(longitude);
	long_dms.value = convert_long_to_dms(longitude);
}
function update_rt90() {
	if ((latitude != null) && (longitude != null) &&
		(latitude >= -90) && (latitude <= 90) &&
		(longitude >= -180) && (longitude < 180)) {
		swedish_params(proj_rt90.value);
		var x_y = geodetic_to_grid(latitude, longitude);
		x_rt90.value = x_y[0];
		y_rt90.value = x_y[1];
	} else {
		x_rt90.value = "";
		y_rt90.value = "";
	}	
}
function update_sweref99() {
	if ((latitude != null) && (longitude != null) &&
		(latitude >= -90) && (latitude <= 90) &&
		(longitude >= -180) && (longitude < 180)) {
		swedish_params(proj_sweref99.value);
		var n_e = geodetic_to_grid(latitude, longitude);
		n_sweref99.value = n_e[0];
		e_sweref99.value = n_e[1];
	} else {
		n_sweref99.value = "";
		e_sweref99.value = "";
	}
}

// Hide/show infotext.
function toggle_info() {
	var info_button = document.getElementById("info_button");
	var wgs84_info = document.getElementById("wgs84_info");
	var rt90_info = document.getElementById("rt90_info");
	var sweref99_info = document.getElementById("sweref99_info");
	var map_info = document.getElementById("map_info");
	var about_info = document.getElementById("about_info");
	if (info_button.value == "info") {
		info_button.value = "dölj info";
		wgs84_info.style.display = "block";
		rt90_info.style.display = "block";
		sweref99_info.style.display = "block";
		map_info.style.display = "block";
		about_info.style.display = "block";
	} else {
		info_button.value = "info";
		wgs84_info.style.display = "none";
		rt90_info.style.display = "none";
		sweref99_info.style.display = "none";
		map_info.style.display = "none";
		about_info.style.display = "none";
	}
}

// Use position if url arguments are supplied.
function parse_url_arguments() {

	if (latlong_init_finished == false) {
		setTimeout(parse_url_arguments, 3000) // 3 sec.	
	}
	
	var url_args = url_arguments
	var result = url_args.split(/[=,]/);
	if ((result[0] != '') && (result[0] != null) &&
		(result[1] != '') && (result[1] != null) &&
		(result[2] != '') && (result[2] != null)) {
		if (result[0] == 'latlong') {
			set_lat_long(parseFloat(result[1]), parseFloat(result[2]));
		}
		else if (result[0] == 'rt90') {
			swedish_params(proj_rt90.value);
			var lat_lon = grid_to_geodetic(parseFloat(result[1]), 
									       parseFloat(result[2]));
			set_lat_long(lat_lon[0], lat_lon[1]);			
		}
		else if (result[0] == 'sweref99tm') {
			swedish_params(proj_sweref99.value);
			var lat_lon = grid_to_geodetic(parseFloat(result[1]), 
										   parseFloat(result[2]));
			set_lat_long(lat_lon[0], lat_lon[1]);
		}
	}
}
