document.getElementById("checked3D").disabled = true;
document.getElementById("checked2D").disabled = false;

let region_text = "Nature's contribution to Water Purification";

// We instantiate the bar chart object for the 2D section
let BarGraphObject = new BarGraph();
let lineGraphObject = new lineGraph();

// Initializing the line graph at the world level
lineGraphObject.updateGraph('WLD');

let checked3D = "true";
let checked2D = "false";

let width = $(".box.box-2").width(),
  height = $(".box.box-2").height(),
  active = d3.select(null);

let previousCountryClicked = 'WLD';
let path, projection = null;
let inertia;

let svg = d3.select(".map1").append("svg")
  .attr("id", "svg_map1")
  .attr("width", width)
  .attr("height", height)
  .on("click", stopped, true);

let svg_map2 = d3.select(".map2").append("svg")
  .attr("id", "svg_map2")
  .attr("width", 0)
  .attr("height", 0)
  .on("click", stopped, true);

let g = svg.append('g');
let g_map2 = svg_map2.append('g');

let projection_new = d3.geoNaturalEarth().scale(d3.min([width / 2, height / 2]) * 0.45).translate([width / 2, height / 2]).precision(.1);
let path_new = d3.geoPath().projection(projection_new);

let map1 = document.getElementsByClassName('map1')[0];
let map2 = document.getElementsByClassName('map2')[0];

map1.setAttribute("style", "width: 100%; height: 94%;");
map2.setAttribute("style", "width: 0; height: 0;");

// let data_2D_water;

// Add projection to the viz
changeProjection(true);

// Adding tip for hover
let tip = d3.tip()
  .attr('class', 'd3-tip')

  .offset([50, 80])
  // Here d -> is basically the data which is given to the circle -> right now it is just lat long
  .html(function(d) {
    console.log(d['2015']);
    return "<strong>" + region_text + ": <span>" + Number(d['2015']).toFixed(2) + "</span></strong>";
  })
// Adding tip to the svg
svg_map2.call(tip);

let tip2 = d3.tip()
  .attr('class', 'd3-tip')

  .offset([50, 80])
  // Here d -> is basically the data which is given to the circle -> right now it is just lat long
  .html(function(d) {
    return "<strong>" + region_text + ": <span>" + Number(d[current_SSP]).toFixed(2) + "</span></strong>" + "%";
  })
// Adding tip to the svg
svg.call(tip2)

// Makes the legend
makeLegendInitializations(false);
makeLegend(colorScale);

// loadGlobalData(dataset);
var data_c = {}; // DELETE this!
// let data_2D = load(dataset_2D);
// let change_data = load(change_dataset);

let data_2D, change_data;

document.getElementsByClassName('loader')[0].style.display = "none";
document.getElementsByClassName('loader')[1].style.display = "none";

// Calling the ready function to render everything even chloropleth
ready(g, path);
ready(g_map2, path_new);

let countryName = document.getElementById("box-3-header-2").firstElementChild;
let title = document.getElementById("box-3-header").firstElementChild;
let current_nature_contribution = 35;
let current_unmet_need = 65;

createSlider();
change_percentage_animation(current_nature_contribution, current_unmet_need);

let contribution_text = document.getElementsByClassName("small-title")[0];
let colorScale_energy = d3.scaleOrdinal()
  .domain(["contribution", "unmet"])
  .range(["#d73027", "#4fb1fe"]);
let colorScale_vitamin = d3.scaleOrdinal()
  .domain(["contribution", "unmet"])
  .range(["#91cf60", "#4fb1fe"]);
let colorScale_folate = d3.scaleOrdinal()
  .domain(["contribution", "unmet"])
  .range(["#41037e", "#4fb1fe"]);

// set the colour scale
let color_graph = colorScale_energy;

// We define the function
function load_file() {

  // disappearMaps();
  // mapsTimeout(4000);
  projection2D();
}

$(document).ready(function() {
  load_file();
});

function load_global() {
  location.href = '../index.html';
}

//projection2D();