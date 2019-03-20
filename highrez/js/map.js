// Map
var minZoom = 3;
var maxZoom = 10;

var pollination_fo_def_legend_label = {
  0: '#ffffd4',
  125000: '#fed98e',
  250000: '#fe9929',
  500000: '#d95f0e',
  1000000: '#993404'
};

var pollination_va_def_legend_label = {
  0: '#ffffd4',
  5000000: '#fed98e',
  10000000: '#fe9929',
  20000000: '#d95f0e',
  40000000: '#993404'
};

var pollination_en_def_legend_label = {
  0: '#ffffd4',
  2000000: '#fed98e',
  4000000: '#fe9929',
  8000000: '#d95f0e',
  16000000: '#993404'
};

var pollination_nc_legend_label = {
  0: '#f7cf5',
  25: '#caeac3',
  50: '#7bc87c',
  75: '#2a924a',
  100: '#00441b'
};

var map = L.map('mapid', {
  center: [0, 0],
  zoom: 2,
  minZoom: minZoom,
  maxZoom: maxZoom
});
$('.leaflet-container').css('cursor', 'crosshair');

var esri_minimap_layer = L.esri.basemapLayer('DarkGray');
var miniMap = new L.Control.MiniMap(
  esri_minimap_layer, {
    width: 100,
    height: 100,
    zoomLevelFixed: 0,
    position: 'bottomleft',
    aimingRectOptions: {
      weight: 1,
      stroke: true,
      color: 'red',
      interactive: false
    },
  }).addTo(map);

var clicked = false;
var bounding_box = false;
var first_click_lat_lng = false;
var movedlatlng = false;

function bounding_box_move(ev) {
  movedlatlng = map.mouseEventToLatLng(ev.originalEvent);
  bounding_box.setBounds([first_click_lat_lng, movedlatlng]);
  var diag_dist = first_click_lat_lng.distanceTo(movedlatlng);
  $('#mouse_tip').text(
    "Bounding box diagonal length " + diag_dist.toFixed(1) + "m");
};

map.on('click', function(ev) {
  clicked = !clicked;
  first_click_lat_lng = map.mouseEventToLatLng(ev.originalEvent);
  var bounds = [first_click_lat_lng, first_click_lat_lng];
  // create an orange rectangle
  if (clicked) {
    if (bounding_box) {
      map.removeLayer(bounding_box);
    }
    bounding_box = L.rectangle(bounds, {
      color: "#CCAAAA",
      weight: 1
    });
    map.on('mousemove', bounding_box_move);
    bounding_box.addTo(map);
  } else {
    map.off('mousemove', bounding_box_move);
    bounding_box.setStyle({
      color: "#22ff22",
      weight: 3
    });
    map.panTo(bounding_box.getCenter());
    map.fitBounds(bounding_box.getBounds());
  }
});

$(document).bind('mousemove', function(e) {
  $('#mouse_tip').css({
    'left': e.pageX + 5,
    'top': e.pageY - 55,
  });
});


var legend = L.control({position: 'bottomright'});

makeLegend(pollination_fo_def_legend_label);

function makeLegend(labels) {
  legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend');

      div.innerHTML = "<strong style=color:white>Legend</strong>"
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var key in labels) {
          div.innerHTML +=
              "<li style=color:white; float:left; margin-right:10px;><span style=background-color:"+ labels[key]  +";></span>" + key + "</li>";
      }

      return div;
  };

  legend.addTo(map);
}

function updateMap(ecoshard) {
  // Here must remove previous layer!!

  map.eachLayer(function(layer) {
    if (layer._url != "http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png") {
      console.log(layer);
      map.removeLayer(layer);
    }
  });

  var lyr = L.tileLayer(
    'http://ipbes.ecoshard.org:8080/workspace/tiles/' + ecoshard + '/{z}/{x}/{y}.png', {
      tms: true,
      opacity: 0.9,
      attribution: ""
    }).addTo(map);
}

var initialEcoshard = 'prod_poll_dep_unrealized_fo_10s_cur_md5_857aa9c09357ad6614e33f23710ea380';

let promise_layer = new Promise(function(resolve, reject) {
  var toner = L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
  }).addTo(map);
  setTimeout(() => resolve(1), 10);
});
promise_layer.then(function(result) {
  updateMap(initialEcoshard);
});
