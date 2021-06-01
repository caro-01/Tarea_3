// Mapa Leaflet
var mapa = L.map('mapid').setView([9.9, -84.20], 10);


// Definición de capas base
var capa_osm = L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?', 
  {
    maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
).addTo(mapa);	

// Conjunto de capas base
var capas_base = {
  "OSM": capa_osm
};	    

// Otra capa base
    var Stamen_Terrain = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 18,
	ext: 'png'
    }).addTo(mapa);
	
// Otra capa base
    var esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
	}
	).addTo(mapa);	
	

// Conjunto de capas base
var capas_base = {
  "Stamen Terrain": Stamen_Terrain,
  "ESRI": esri,
  "OSM": capa_osm,
};	    
	    
// Control de capas
control_capas = L.control.layers(capas_base).addTo(mapa);	

// Control de escala
L.control.scale().addTo(mapa);

// Agregar capa WMS
var capa_enfrespiratoria = L.tileLayer.wms('http://geovision.uned.ac.cr/geoserver/vigilanciasalud/wms?', {
  layers: 'respiratoria2015_2017',
  format: 'image/png',
  transparent: true
}).addTo(mapa);

// Se agrega al control de capas como de tipo "overlay"
control_capas.addOverlay(capa_enfrespiratoria, 'Enfermedades respiratorias');


// Capa de coropletas de % Enfermedades cerebro vasculares
$.getJSON('https://caro-01.github.io/Tarea_3/capas/cerebro_vascular.geojson', function (geojson) {
  var capa_cerebro_vascular = L.choropleth(geojson, {
	  valueProperty: 'inc',
	  scale: ['turquoise', 'blue'],
	  steps: 6,
	  mode: 'q',
	  style: {
	    color: '#000',
	    weight: 1,
	    fillOpacity: 0.5
	  },
	  onEachFeature: function (feature, layer) {
	    layer.bindPopup('Cantón: ' + feature.properties.ncanton + '<br>' + 'Indice: ' + feature.properties.inc.toLocaleString() + '%')
	  }
  }).addTo(mapa);
  control_capas.addOverlay(capa_cerebro_vascular, 'Enfermedadades cerebro vasculares');	
  
  // Leyenda de la capa de coropletas
  var leyenda = L.control({ position: 'bottomleft' })
  leyenda.onAdd = function (mapa) {
    var div = L.DomUtil.create('div', 'info legend')
    var limits = capa_cerebro_vascular.options.limits
    var colors = capa_cerebro_vascular.options.colors
    var labels = []

    // Add min & max
    div.innerHTML = '<div class="labels"><div class="min">' + limits[0] + '</div> \
			<div class="max">' + limits[limits.length - 1] + '</div></div>'

    limits.forEach(function (limit, index) {
      labels.push('<li style="background-color: ' + colors[index] + '"></li>')
    })

    div.innerHTML += '<ul>' + labels.join('') + '</ul>'
    return div
  }
  leyenda.addTo(mapa)
});

// Capa raster cancer pulmonar
var capa_pulmonar = L.imageOverlay("https://caro-01.github.io/Tarea_3/capas/cancer_pulmonar.png", 
	[[11.2180399023489876, -87.1003722490865471], 
	[5.4992395357559918, -82.5541965633406960]], 
	{opacity:0.5}
).addTo(mapa);
control_capas.addOverlay(capa_pulmonar, 'Cancer pulmonar');

function updateOpacity() {
  document.getElementById("span-opacity").innerHTML = document.getElementById("sld-opacity").value;
  capa_pulmonar.setOpacity(document.getElementById("sld-opacity").value);
}

