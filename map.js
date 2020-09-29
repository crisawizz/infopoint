var map;
function initMap() {
    map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
          source: new ol.source.Stamen({
            layer: 'watercolor',
          }),
        }),
        new ol.layer.Tile({
          source: new ol.source.Stamen({
            layer: 'terrain-labels',
          }),
        }) ],
    view: new ol.View({
      center: ol.proj.fromLonLat([8.49,47.40]),
      zoom: 12
    })
});
}