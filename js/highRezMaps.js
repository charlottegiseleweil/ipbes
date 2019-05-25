// Global variables
// Map
let minZoom = 3;
let maxZoom = 10;

let map2015 = L.map('map_2015', {
    center: [0, 0],
    zoom: 2,
    minZoom: minZoom,
    maxZoom: maxZoom
  });
 
let map2050 = L.map('map_2050', {
    center: [0, 0],
    zoom: 2,
    minZoom: minZoom,
    maxZoom: maxZoom
  });
map2015.sync(map2050);
map2050.sync(map2015);

let current_scenario = "ssp1";
let current_mode = "UN";

let colors = {
  UN:{
    0: '#f7cf5',
    1: '#caeac3',
    2: '#7bc87c',
    3: '#2a924a',
    4: '#00441b'},
  pop:{
    0: '#f7cf5',
    1: '#caeac3',
    2: '#7bc87c',
    3: '#2a924a',
    4: '#00441b'
  },
  NC:{
    0: '#f7cf5',
    1: '#caeac3',
    2: '#7bc87c',
    3: '#2a924a',
    4: '#00441b'
  },
  PN:{
    0: '#f7cf5',
    1: '#caeac3',
    2: '#7bc87c',
    3: '#2a924a',
    4: '#00441b'
  }
};


let promise_layer = new Promise(function(resolve, reject) {
    L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
    }).addTo(map2015);

    L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
    }).addTo(map2050);
    
    setTimeout(() => resolve(1), 10);
  });
  promise_layer.then(function(result) {
    updateMap(current_mode, current_scenario, true);
  });

function switchMode(mode){
    document.getElementById('info_about_measurments').innerText = info_measurements[mode];
    current_mode = mode;
    updateMap(current_mode, current_scenario, true);
}

function switchScenario(scenario){
    current_scenario = scenario;
    updateMap(current_mode, current_scenario);
}

var legend = L.control({position: 'bottomleft'});


function makeLegend() {
  legend.onAdd = function (map2015) {

      var div = L.DomUtil.create('div', 'info legend');

      //div.innerHTML = "<strong style=color:white>Legend</strong>"
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var key in colors[current_mode]) {
        div.innerHTML +=
            "<li class='legendList' style=color:"+colors[current_mode][key]+"; float:left; margin-right:10px;><span> " + values[current_mode][key]+" </span></li>";
      }
      return div;
  };

  legend.addTo(map2015);
}

function updateMap(mode, scenario, changeMode = false) {
    if(changeMode) {
        map2015.eachLayer(function(layer) {
            if (layer._url != "http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png") {
              map2015.removeLayer(layer);
            }
          });
          tileLayers['cur'][mode].addTo(map2015);
    }
   
    map2050.eachLayer(function(layer) {
        if (layer._url != "http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png") {
          map2050.removeLayer(layer);
        }
      });
      tileLayers[scenario][mode].addTo(map2050);

      makeLegend()
}



