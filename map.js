var map;
function initMap() {
  var url =
  'https://gdi.ktzh.ch/server/rest/services/Geb%C3%A4udealter_dunkel/MapServer';

var hilshadeLayer = new ol.layer.Image ({
    source: new ol.source.ImageWMS({
      url: 'https://web.maps.zh.ch/wms/LidarZH',
      params: {'LAYERS': 'dtm2014hillshade'},
      ratio: 1,
      serverType: 'mapserver'
    })
});

var layers = [
  hilshadeLayer,

  new ol.layer.Image({
    source: new ol.source.ImageArcGISRest({
      ratio: 1,
      params: {},
      url: url 
    })
  })
 ];
map = new ol.Map({
  layers: layers,
  target: 'map',
  view: new ol.View({
    center: ol.proj.fromLonLat([8.54, 47.37]),
    zoom: 17,
  }),
});
// INFO-ABFRGE

var tolerance = "2";


map.on('singleclick', function (evt) {
  var clickKoord = evt.coordinate.join(','); // "2700000, 1277777";
  var mapExtent = map.getView().calculateExtent(); // "2654500,1222400,2720000,1300000";
  var imageDisplay= [map.getViewport().clientWidth, map.getViewport().clientHeight, 96].join(',') // "6000,5500,96";
  var infoUrl = url +
    "/identify?geometry=" + clickKoord +
    "&geometryType=esriGeometryPoint" +
    "&sr=3857" +
    "&layers=visible:0,1,2,3,4,5,6,7,8,9" +
    "&layerDefs=" +
    "&time=" +
    "&layerTimeOptions=" +
    "&tolerance=" + tolerance + 
    "&mapExtent=" + mapExtent + 
    "&imageDisplay=" + imageDisplay +
    "&returnGeometry=false" +
    "&maxAllowableOffset=" +
    "&geometryPrecision=2" +
    "&dynamicLayers=" +
    "&returnZ=false" +
    "&returnM=false" +
    "&gdbVersion=" +
    "&historicMoment=" +
    "&returnUnformattedValues=false" +
    "&returnFieldName=false" +
    "&datumTransformations=" +
    "&layerParameterValues=" +
    "&mapRangeValues=" +
    "&layerRangeValues=" +
    "&clipping=" +
    "&spatialFilter=" +
    "&f=json";
  document.getElementById('info').innerHTML = '';

  if (infoUrl) {
    fetch(infoUrl)
      .then(function (response) { return response.json(); })
      .then(function (json) {
        showInfos(json);
      });
  }
  setPinOnMap(evt);
});

var html="";
function showInfos(json) {
  var results = json.results;
  html = '<h2>Informationen</h2>';
  for (var i in results) {
    html += '<br><strong>' + results[i].layerName + ' (' + results[i].layerId + ')</strong><table border=1 padding=2>';
    for(var j in results[i].attributes) {
      html += '<tr><th>' + j + '</th><td>' + results[i].attributes[j] + '</td></tr>';
    }
    html += '</table>';
    html += ''
  }
   html += '';
  document.getElementById('info').innerHTML = html;
};

function setPinOnMap(evt) {
  var self = this;
  var latLong = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
  var lat     = latLong[1];
  var long    = latLong[0];

  // self.params.options.mapClick({lat: lat, long: long});

  if(self.dinamicPinLayer !== undefined){
      console.log("moove")
      self.iconGeometry.setCoordinates(evt.coordinate);
        //or create another pin  
  } else {
      self.iconGeometry = new ol.geom.Point(evt.coordinate);
      var iconFeature = new ol.Feature({
          geometry: self.iconGeometry
          // name: 'Null Island',
          // population: 4000,
          // rainfall: 500
      });
      var iconStyle = new ol.style.Style({
          image: new ol.style.Icon(({
              anchor: [0.5, 120],
              anchorXUnits: 'fraction',
              anchorYUnits: 'pixels',
              size: [120, 120],
              scale: 0.3,
              opacity: 1,
              src: 'marker.gif'
          }))
      });

      iconFeature.setStyle(iconStyle);

      var vectorSource = new ol.source.Vector({
          features: [iconFeature]
      });
      self.dinamicPinLayer = new ol.layer.Vector({
          source: vectorSource
      });
      self.map.addLayer(self.dinamicPinLayer); 
  }
};

// LEGENDE

var legendurl= url+"/legend?f=pjson";
fetch(legendurl)
  .then(response => response.json())
  .then(data => getLegend(data));

function getLegend(legend) {
  html = '<h2>Legende</h2> <br/><ul>';
  for (var i = 0, len = legend.layers.length; i < len; i++) {
    html += '<li><strong>' + legend.layers[i].layerName + ' (' + legend.layers[i].layerId + ')</strong><ul>';
    for(var j = 0, jj = legend.layers[i].legend.length; j < jj; j++) {
        html +='<li><img width="'+legend.layers[i].legend[j].width+'" height="'+ legend.layers[i].legend[j].height+'" src="data:'+legend.layers[i].legend[j].contentType+';base64,'+legend.layers[i].legend[j].imageData+'"><span>'+legend.layers[i].legend[j].label+'</span></li>';
    }
    html += '</ul></li>';
  }
  html+='</ul>';
  try {
    document.getElementById('legend').innerHTML = html;
  } catch (error) {}
  
}

var serviceDirectoryUrl = "https://gdi.ktzh.ch/server/rest/services/?f=pjson";
fetch(serviceDirectoryUrl)
  .then(response => response.json())
  .then(data => getServiceList(data));

function getServiceList(directory) {
  let html = '<h2>Liste der Services</h2>';
  let results = directory.services

  html += '<table>'
  for (var i in results) {
      html += '<tr><td>' + results[i].name + '</td><td>' + results[i].type + '</td></tr>'

  }
  html += '</table>'

  try {
    document.getElementById('directory').innerHTML = html;
  } catch (error) {}
  
}

//     map = new ol.Map({
//     target: 'map',
//     layers: [
//         new ol.layer.Tile({
//           source: new ol.source.Stamen({
//             layer: 'watercolor',
//           }),
//         }),
//         new ol.layer.Tile({
//           source: new ol.source.Stamen({
//             layer: 'terrain-labels',
//           }),
//         }) ],
//     view: new ol.View({
//       center: ol.proj.fromLonLat([8.49,47.40]),
//       zoom: 12
//     })
// });
}