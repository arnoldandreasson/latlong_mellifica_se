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

var map;
var markers;
var rt90_meridian;
var sweref99_meridian;

function map_init() {
	map = new OpenLayers.Map('map', { 
		controls: []
	});

	var openstreetmap = new OpenLayers.Layer.OSM.Mapnik("OpenStreetMap");
	map.addLayer(openstreetmap);

	var ghyb = new OpenLayers.Layer.Google(
		"Google satellite and streets",
		{type: google.maps.MapTypeId.HYBRID,
		 numZoomLevels: 19});
	
	var gsat = new OpenLayers.Layer.Google(
		"Google satellite",
		{type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 19});

	var gmap = new OpenLayers.Layer.Google(
		"Google streets", // Google default map
		{numZoomLevels: 19});

	var gphy = new OpenLayers.Layer.Google(
		"Google terrain",
		{type: google.maps.MapTypeId.TERRAIN, 
		 numZoomLevels: 16});

	markers = new OpenLayers.Layer.Markers("Marker");
	rt90_meridian = new OpenLayers.Layer.Boxes("RT 90 Zone");
	rt90_meridian.setVisibility(false);
	sweref99_meridian = new OpenLayers.Layer.Boxes("SWEREF 99 Zone");
	sweref99_meridian.setVisibility(false);
	map.addLayers([markers, rt90_meridian, sweref99_meridian]);	
	map.setCenter(new OpenLayers.LonLat(15, 62.5).transform('EPSG:4326', 'EPSG:3857'), 4);

	map.addControl(new OpenLayers.Control.PanZoomBar());
	map.addControl(new OpenLayers.Control.LayerSwitcher());
	map.addControl(new OpenLayers.Control.ScaleLine());
	map.addControl(new OpenLayers.Control.MousePosition({
		prefix: "Long: ",
		separator: " Lat: ",
		numDigits: 4,
		displayProjection: new OpenLayers.Projection("EPSG:4326")
		}));

	map.events.register("click", map, function(e) { 
		var lonlat = map.getLonLatFromViewPortPx(e.xy).transform('EPSG:3857', 'EPSG:4326');
		set_lat_long(lonlat.lat, lonlat.lon);
	});
	
	map.events.register("zoomend", map, function() {
		// Recalculate center for better resolution.
		zoomlevel = map.getZoom();
		// longitude and latitude declared in latlong.js.
		map.setCenter(new OpenLayers.LonLat(longitude, latitude).transform('EPSG:4326', 'EPSG:3857'), zoomlevel);
	});

	map.addLayers([ghyb, gsat, gmap, gphy]);

}
function show_map_marker(lat, lon) {
	markers.clearMarkers();
	map.setCenter(new OpenLayers.LonLat(lon, lat).transform('EPSG:4326', 'EPSG:3857'));
	var url = './images/marker-gold.png';
	var sz = new OpenLayers.Size(21, 25);
	var calculateOffset = function(size) {
		return new OpenLayers.Pixel(-(size.w/2), -size.h);
	};           
	var icon = new OpenLayers.Icon(url, sz, null, calculateOffset);
	marker = new OpenLayers.Marker(new OpenLayers.LonLat(lon, lat).transform('EPSG:4326', 'EPSG:3857'), icon);
	markers.addMarker(marker);
}
function show_rt90_meridian(projection) {
	var meridian = null;
	var delta = null;
	var bounds = null; 
	if (projection == "rt90_7.5_gon_v") {
		meridian = 11.0 + 18.375/60.0;
		delta = 1.125;
		var bounds = new OpenLayers.Bounds(meridian-delta, 54.94, meridian+delta, 69.1); 
	}
	else if (projection == "rt90_5.0_gon_v") {
		meridian = 13.0 + 33.376/60.0;
		delta = 1.125;
		var bounds = new OpenLayers.Bounds(meridian-delta, 54.94, meridian+delta, 69.1); 
	}
	else if (projection == "rt90_2.5_gon_v") {
		meridian = 15.0 + 48.0/60.0 + 22.624306/3600.0;
		delta = 1.125;
		var bounds = new OpenLayers.Bounds(meridian-delta, 54.94, meridian+delta, 69.1); 
	}
	else if (projection == "rt90_0.0_gon_v") {
		meridian = 18.0 + 3.378/60.0;
		delta = 1.125;
		var bounds = new OpenLayers.Bounds(meridian-delta, 54.94, meridian+delta, 69.1); 
	}
	else if (projection == "rt90_2.5_gon_o") {
		meridian = 20.0 + 18.378/60.0;
		delta = 1.125;
		var bounds = new OpenLayers.Bounds(meridian-delta, 54.94, meridian+delta, 69.1); 
	}
	else if (projection == "rt90_5.0_gon_o") {
		meridian = 22.0 + 33.380/60.0;
		delta = 1.125;
		var bounds = new OpenLayers.Bounds(meridian-delta, 54.94, 24.35, 69.1); // Include Happaranda. 
	}
	
	rt90_meridian.clearMarkers();
	if (bounds != null) {
		var box = new OpenLayers.Marker.Box(bounds.transform('EPSG:4326', 'EPSG:3857'));
		box.setBorder("yellow");
		rt90_meridian.addMarker(box);
	}	
	if (projection == "rt90_2.5_gon_v") {
		bounds = new OpenLayers.Bounds(10.7, 54.84, 24.45, 69.2); 
		var box = new OpenLayers.Marker.Box(bounds.transform('EPSG:4326', 'EPSG:3857'));
		box.setBorder("yellow");
		rt90_meridian.addMarker(box);
	}

}
function show_sweref99_meridian(projection) {
	var meridian = null;
	var bounds = null; 
	if (projection == "sweref_99_tm") {
		bounds = new OpenLayers.Bounds(10.8, 54.94, 24.35, 69.1); 
	}
	else if (projection == "sweref_99_1200") {
		bounds = new OpenLayers.Bounds(12.00-1.10, 54.94, 12.00+0.75, 69.1); // Include Koster. 
	}
	else if (projection == "sweref_99_1330") {
		meridian = 13.50;
		delta = 0.75;
		bounds = new OpenLayers.Bounds(13.50-0.75, 54.94, 13.50+0.75, 69.1); 
	}
	else if (projection == "sweref_99_1500") {
		meridian = 15.00;
		delta = 0.75;
		bounds = new OpenLayers.Bounds(15.00-0.75, 54.94, 15.00+0.75, 69.1); 
	}
	else if (projection == "sweref_99_1630") {
		meridian = 16.50;
		delta = 0.75;
		bounds = new OpenLayers.Bounds(16.50-0.75, 54.94, 16.50+0.75, 69.1); 
	}
	else if (projection == "sweref_99_1800") {
		meridian = 18.00;
		delta = 0.75;
		bounds = new OpenLayers.Bounds(18.00-0.75, 54.94, 18.00+0.75, 69.1); 
	}
	else if (projection == "sweref_99_1415") {
		meridian = 14.25;
		delta = 0.75;
		bounds = new OpenLayers.Bounds(14.25-0.75, 54.94, 14.25+0.75, 69.1); 
	}
	else if (projection == "sweref_99_1545") {
		meridian = 15.75;
		delta = 0.75;
		bounds = new OpenLayers.Bounds(15.75-0.75, 54.94, 15.75+0.75, 69.1); 
	}
	else if (projection == "sweref_99_1715") {
		meridian = 17.25;
		delta = 0.75;
		bounds = new OpenLayers.Bounds(17.25-0.75, 54.94, 17.25+0.75, 69.1); 
	}
	else if (projection == "sweref_99_1845") {
		meridian = 18.75;
		delta = 0.75;
		bounds = new OpenLayers.Bounds(18.75-0.75, 54.94, 18.75+0.75, 69.1); 
	}
	else if (projection == "sweref_99_2015") {
		meridian = 20.25;
		delta = 0.75;
		bounds = new OpenLayers.Bounds(20.25-0.75, 54.94, 20.25+0.75, 69.1); 
	}
	else if (projection == "sweref_99_2145") {
		meridian = 21.75;
		delta = 0.75;
		bounds = new OpenLayers.Bounds(21.75-0.75, 54.94, 21.75+0.75, 69.1); 
	}
	else if (projection == "sweref_99_2315") {
		meridian = 23.25;
		delta = 0.75;
		bounds = new OpenLayers.Bounds(23.25-0.75, 54.94, 24.25, 69.1); // Include Happaranda.
	}
	
	sweref99_meridian.clearMarkers();
	if (bounds != null) {
		var box = new OpenLayers.Marker.Box(bounds.transform('EPSG:4326', 'EPSG:3857'));
		box.setBorder("red");
		sweref99_meridian.addMarker(box);
	}	
}
