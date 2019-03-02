let dataset_global = 'Data/data_water_2d.csv'; // Dataset for pollination
let risk_button = document.getElementsByClassName("risk-button")[0];
let nature_button = document.getElementsByClassName("nature-help-button")[0];
let legendTitle = document.getElementsByClassName("title2DLegend")[0];
let gradient_blue = 'radial-gradient( circle at 37%, rgb(105, 190, 255) 29%, rgb(236, 246, 255) 36%, rgb(228, 255, 255) 42%, rgb(215, 254, 255) 49%, rgb(204, 245, 255) 56%, rgb(191, 234, 255) 63%, rgb(147, 193, 227) 70%, rgb(147, 193, 227) 77%, rgb(147, 193, 227) 84%, rgb(81, 119, 164) 91%)';
let gradient_white = '#696969 radial-gradient(circle at 37% center, #494949 36%, #3A3A3A 42%, black 61%,black 91%) repeat scroll 0% 0%';
let counter = 0;
var zoom_2D_global = get_global_zoom();



// Function to load the pollination visualization
function load_pollination() {
  location.href = 'viz/Pollination.html';
}


if (global_activated == true) {
  document.getElementsByClassName("box-container")[0].style.background = gradient_white;
}

let width_global = $(".box.box-2-global").width(),
  height_global = $(".box.box-2-global").height();

let svg_global = d3.select(".map-global").append("svg")
  .attr("id", "svg_map_global")
  .attr("width", width_global)
  .attr("height", height_global)
  .on("click", stopped, true);

svg_global.attr('transform', 'translate(0,-135) scale(1.25)');

let g_global = svg_global.append('g');

let projection_global = d3.geoNaturalEarth().scale(d3.min([width_global / 2, height_global / 2]) * 0.49).translate([width_global / 2 - 52, (height_global + 150) / 2]).precision(.1);
let path_global = d3.geoPath().projection(projection_global);
let map_global = document.getElementsByClassName('map-global')[0];

map_global.setAttribute("style", "height: 80%;");

svg_global.call(zoom_2D_global);

ready_global(g_global, path_global);

let pollination_box = document.getElementById("pollination-box");
let water_box = document.getElementById("water-quality-box");
let coastal_box = document.getElementById("coastal-risk-box");

function load_pollination_data() {
  if (pollination_box.checked == true) {
    if (water_box.checked == false && coastal_box.checked == false) {
      legendTitle.innerHTML = "Pollination Key Areas"

      dataset_global = 'Data/data_water_2d.csv' // dataset for pollination
      parseDataGlobal(dataset_global, draw_points);
    } else {
      legendTitle.innerHTML = "Hotspots";
    }
  } else {
    if (water_box.checked == true) {
      load_waterquality_data();
    }
  }
}

function load_waterquality_data() {
  if (water_box.checked == true) {
    if (pollination_box.checked == false && coastal_box.checked == false) {
      legendTitle.innerHTML = "WQ Key Areas";

      dataset_global = 'Data/data_water_2d.csv'
      parseDataGlobal(dataset_global, draw_points);

    } else {
      legendTitle.innerHTML = "Hotspots";
    }


  } else {
    if (pollination_box.checked == true) {
      load_pollination_data();
    }
  }
}

function load_coastalrisk_data() {
  if (coastal_box.checked == true) {
    if (pollination_box.checked == false && water_box.checked == false) {
      legendTitle.innerHTML = "CR Key Areas";

      dataset_global = 'Data/data_coastal_2d.csv'
      parseDataGlobal(dataset_global, draw_points);
    } else {
      legendTitle.innerHTML = "Hotspots";
    }
  }
}

// Load pollination data 2D
function ready_global(g, path) {
  d3.json("viz/world/countries.json", function(error, data) {
    if (error) throw error;

    let features = topojson.feature(data, data.objects.units).features;
    g.selectAll("path")
      .data(features)
      .enter().append("path")
      .attr("d", path)
      .attr("fill", "rgb(115,115,115)")
      .attr("class", "feature");
    // Creates a mesh around the border
    g.append("path")
      .datum(topojson.mesh(data, data.objects.units, function(a, b) {
        return a !== b;
      }))
      .attr("class", "mesh")
      .attr("d", path);
  });
}

function load_2d_global(dataset) {
  let result = {};
  d3.csv(dataset, function(error, data) {
    data.forEach(function(d) {
      result[d.fid] = d;
    });
  });
  return result;
}

let data_2D_global;
let promise_global;

parseDataGlobal(dataset_global, draw_points);

function getColor(UN_value, pop_value, NCP_value, UN_mid_q, pop_mid_q, NCP_third_q, NCP_2_third_q) {
  let colors = [
    ["rgb(232,232,244)", "rgb(211,244,215)", "rgb(89,202,93)"],
    ["rgb(248,226,252)", "rgb(137,143,143)", "rgb(33,112,55)"],
    ["rgb(249,95,250)", "rgb(174,38,168)", "rgb(33,38,38)"]
  ];
  var un = 0;
  var pop = 0;
  var ncp = 0;
  if (UN_value > UN_mid_q) {
    un = 1;
  }
  if (pop_value > pop_mid_q) {
    pop = 1;
  }
  if (NCP_value > NCP_third_q && NCP_value < NCP_2_third_q) {
    ncp = 1;
  } else if (NCP_value >= NCP_2_third_q) {
    ncp = 2;
  }
  return colors[un + pop][ncp];
}

// plot points on the map for 2D global map
function showDataGlobal(the_g, data, UN_mid_q, pop_mid_q, NCP_third_q, NCP_2_third_q) {

  // This is just for 2D, we are creating a raster by creating a rectangle
  the_g.selectAll(".plot-point")
    .data(data).enter()
    .append("polygon")
    .classed('plot-point', true)
    .attr("points", function(d) {
      let x_1 = projection_global([d['lat1'], d['long1']])[0];
      let y_1 = projection_global([d['lat1'], d['long1']])[1];
      let x_2 = projection_global([d['lat2'], d['long2']])[0];
      let y_2 = projection_global([d['lat2'], d['long2']])[1];
      let x_3 = projection_global([d['lat3'], d['long3']])[0];
      let y_3 = projection_global([d['lat3'], d['long3']])[1];
      let x_4 = projection_global([d['lat4'], d['long4']])[0];
      let y_4 = projection_global([d['lat4'], d['long4']])[1];
      let x_5 = projection_global([d['lat5'], d['long5']])[0];
      let y_5 = projection_global([d['lat5'], d['long5']])[1];

      return (x_1 + ',' + y_1 + ' ' +
        x_2 + ',' + y_2 + ' ' +
        x_3 + ',' + y_3 + ' ' +
        x_4 + ',' + y_4 + ' ' +
        x_5 + ',' + y_5);
    })
    .attr("fill", function(d) {
      return getColor(d['UN_cur'], d['population'], d['NCP_cur'], UN_mid_q, pop_mid_q, NCP_third_q, NCP_2_third_q)
    })
  // .on('mouseover', tip.show)
  // .on('mouseout', tip.hide);

}


function click_about() {
  //console.log("About button clicked");
}

function get_global_zoom() {
  return d3.zoom()
    .scaleExtent([0.95, 15])
    .on("zoom", zoomed_2D_global);
}

// Changes both groups in 2D
function zoomed_2D_global() {
  g_global.attr("transform", d3.event.transform);
}

function draw_points(data) {
  //Data is usable here
  g_global.selectAll('.plot-point').remove();
  array_UN_cur = [];
  array_NCP_cur = [];
  array_pop_cur = [];
  for (i = 0; i < data.length; i++) {
    array_UN_cur[i] = Number(data[i]['UN_cur']);
    array_NCP_cur[i] = Number(data[i]['NCP_cur']);
    array_pop_cur[i] = Number(data[i]['population']);
  }
  showDataGlobal(g_global, data, Quartile_50(array_UN_cur),
    Quartile_50(array_pop_cur), Quartile_33(array_NCP_cur), Quartile_66(array_NCP_cur));


}

function parseDataGlobal(url, callBack) {
  Papa.parse(url, {
    download: true,
    dynamicTyping: false, // Parse values as their true type (not as strings)
    header: true, // to parse the data as a dictionary
    complete: function(results) {
      callBack(results.data);
    }
  });
}

function activate_nature_button() {
  document.getElementsByTagName('a')[2].style.background = "#9d9d9d";
  document.getElementsByTagName('a')[2].style.textDecoration = "underline";
  document.getElementsByTagName('a')[2].style.color = "black";
  //Load our HTML file
}

function activate_risk_button() {
  //Load HTML file of the other group
  location.href = 'viz_risk/index.html';
}

activate_nature_button();