let dataset_global = 'dataset/pixel_energy.csv';
let dataset_2D_folate = 'dataset/pixel_folate.csv';
let colorSchemeX1 = [255,205,155,105,55];
let colorSchemeY1 = [255,205,155,105,55];
let colorSchemeX = ["#FFFFFF", "#C6F4BC", "#74DE4C"];
let colorSchemeY = ["#FFFFFF", "#F4C8FF", "#C615F2"];
let gradient_blue = 'radial-gradient( circle at 37%, rgb(105, 190, 255) 29%, rgb(236, 246, 255) 36%, rgb(228, 255, 255) 42%, rgb(215, 254, 255) 49%, rgb(204, 245, 255) 56%, rgb(191, 234, 255) 63%, rgb(147, 193, 227) 70%, rgb(147, 193, 227) 77%, rgb(147, 193, 227) 84%, rgb(81, 119, 164) 91%)';
let gradient_white = 'radial-gradient(circle at 37%, rgb(236, 246, 255) 36%, rgb(228, 255, 255) 42%, rgb(215, 254, 255) 49%, rgb(204, 245, 255) 56%, rgb(191, 234, 255) 63%, rgb(147, 193, 227) 70%, rgb(147, 193, 227) 77%, rgb(147, 193, 227) 84%, rgb(81, 119, 164) 91%)';

var zoom_2D_global = get_global_zoom();

let colorScale2DGlobalX = d3.scaleLinear()
  .domain([1, 50, 99])
  .range(colorSchemeX);
let colorScale2DGlobalY = d3.scaleLinear()
  .domain([1, 50, 99])
  .range(colorSchemeY);

if (global_activated == true) {
  document.getElementsByClassName("box-container")[0].style.background = gradient_white;
}

d3.scaleBivariate = function() {
  function scaleBivariate(value) {
    var r = colorScale2DGlobalX1(value[0]);
    var b = colorScale2DGlobalY1(value[1]);
    return "rgb("+((r+b)/1.7)+","+r+","+(b+50)+")";
  }

  let colorScale2DGlobalX1 = d3.scaleThreshold()
    .domain([1, 25, 50, 75, 99])
    .range(colorSchemeX1);
  let colorScale2DGlobalY1 = d3.scaleThreshold()
    .domain([1, 25, 50, 75, 99])
    .range(colorSchemeY1);

  var red = function(d) { return d[0]; }

  var blue = function(d) { return d[1];}

  // Accessors:
  scaleBivariate.red = function(_) {
    return arguments.length ? (red = _, scaleBivariate): red;
  }

  scaleBivariate.blue = function(_) {
    return arguments.length ? (blue = _, scaleBivariate): blue;
  }
  return scaleBivariate;
}

var colorScaleBiv = d3.scaleBivariate();

// Function to load the pollination visualization
function load_pollination() {
  global_activated = false;
  zoom_2D_global = null;
  document.getElementsByClassName("box box-3-global")[0].style.display = "none";
  document.getElementsByClassName("box box-2-global")[0].style.display = "none"
  document.getElementsByClassName("box box-1-global")[0].style.display = "none";
  if (checked3D == "true") {
    document.getElementsByClassName("box-container")[0].style.background = gradient_blue;
    document.getElementsByClassName("box box-3")[0].style.display = "flex";
  }
  if (checked2D == "true") {
    document.getElementsByClassName("box-container")[0].style.background = gradient_white;
    document.getElementsByClassName("box box-3")[1].style.display = "flex";
  }
  document.getElementsByClassName("info-button")[0].style.display = "block";
  document.getElementsByClassName("back-button")[0].style.display = "block";
  document.getElementsByClassName("switch-proj")[0].style.display = "flex";
  document.getElementsByClassName("parent-button-div")[0].style.display = "block";
  document.getElementsByClassName("box box-1")[0].style.visibility = "visible";
  document.getElementsByClassName("box box-2")[0].style.display = "flex";
}

// Function for the back button in pollination
function load_global() {
  global_activated = true;
  zoom_2D_global = get_global_zoom();
  if (current_html == "index.html") {
  document.getElementsByClassName("box-container")[0].style.background = gradient_white;
  document.getElementsByClassName("box box-3-global")[0].style.display = "flex";
  document.getElementsByClassName("box box-2-global")[0].style.display = "flex"
  document.getElementsByClassName("box box-1-global")[0].style.display = "flex";
  document.getElementsByClassName("box box-3")[0].style.display = "none";
  document.getElementsByClassName("box box-3")[1].style.display = "none";
  document.getElementsByClassName("info-button")[0].style.display = "none";
  document.getElementsByClassName("switch-proj")[0].style.display = "none";
  document.getElementsByClassName("parent-button-div")[0].style.display = "none";
  document.getElementsByClassName("box box-1")[0].style.visibility = "collapse";
  document.getElementsByClassName("box box-2")[0].style.display = "none";
  } else {
    location.href='index.html';
    return false;
  }
}

let width_global = $(".box.box-2-global").width(),
  height_global = $(".box.box-2-global").height();

let svg_global = d3.select(".map-global").append("svg")
  .attr("id", "svg_map_global")
  .attr("width", width_global)
  .attr("height", height_global)
  .on("click", stopped, true);

let g_global = svg_global.append('g');

let projection_global = d3.geoNaturalEarth().scale(d3.min([width_global / 2, height_global / 2]) * 0.49).translate([width_global / 2 - 52, height_global / 2]).precision(.1);
let path_global = d3.geoPath().projection(projection_global);
let map_global = document.getElementsByClassName('map-global')[0];

map_global.setAttribute("style", "width: 95%; height: 100%;");

svg_global.call(zoom_2D_global);

ready_global(g_global, path_global);

let pollination_box = document.getElementById("pollination-box");
let water_box = document.getElementById("water-quality-box");
let coastal_box = document.getElementById("coastal-risk-box");

function load_pollination_data() {
  if (pollination_box.checked == true) {
    console.log("pollination checked")
  }
}

function load_waterquality_data() {
  if (water_box.checked == true) {
    console.log("waterquality checked")
  }
}

function load_coastalrisk_data() {
  if (coastal_box.checked == true) {
    console.log("coastal risk checked")
  }
}

// Load pollination data 2D
function ready_global(g, path) {
  d3.json("world/countries.json", function(error, data) {
    if (error) throw error;

    let features = topojson.feature(data, data.objects.units).features;
    g.selectAll("path")
      .data(features)
      .enter().append("path")
      .attr("d", path)
      .attr("fill", "#D3D3D3")
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

let data_2D_global = load(dataset_2D);
let data_2D_global_folate = load(dataset_2D_folate);
let promise_global = new Promise(function(resolve, reject) {
  setTimeout(() => resolve(1), 100);
});
promise_global.then(() => {
  let coordstoplot_global = initialize_2D("2015", data_2D_global);
  let coordstoplot_global_folate = initialize_2D("2015", data_2D_global_folate);
  showDataGlobal(g_global, coordstoplot_global, colorScaleBiv);
  showDataGlobal(g_global, coordstoplot_global_folate, colorScaleBiv);
});

// plot points on the map for 2D global map
function showDataGlobal(the_g, coordinates, ColorScaleSelect) {
    // This is just for 2D, we are creating a raster by creating a rectangle
    the_g.selectAll(".plot-point")
      .data(coordinates).enter()
      .append("rect")
      .classed('plot-point', true)
      .attr("x", function(d) {
        return projection_global(d)[0];
      })
      .attr("y", function(d) {
        return projection_global(d)[1];
      })
      .attr("width", "3")
      .attr("height", "3")
      .attr("fill", function(d) {
        color = d[2] || 0;
        return ColorScaleSelect(color);
      })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);
}

function click_about() {
  console.log("About button clicked");
}

function get_global_zoom() {
    return d3.zoom()
      .scaleExtent([1, 15])
      .translateExtent([
        [0, 0],
        [$(".map-global").width(), $(".map-global").height()]
      ])
      .extent([
        [0, 0],
        [$(".map-global").width(), $(".map-global").height()]
      ])
      .on("zoom", zoomed_2D_global);
}


// Changes both groups in 2D
function zoomed_2D_global() {
  g_global.attr("transform", d3.event.transform);
}
