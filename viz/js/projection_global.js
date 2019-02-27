let dataset_global = 'Data/2d_poll_global.csv';
let risk_button = document.getElementsByClassName("risk-button")[0];
let nature_button = document.getElementsByClassName("nature-help-button")[0];
let legendTitle = document.getElementsByClassName("title2DLegend")[0];
let gradient_blue = 'radial-gradient( circle at 37%, rgb(105, 190, 255) 29%, rgb(236, 246, 255) 36%, rgb(228, 255, 255) 42%, rgb(215, 254, 255) 49%, rgb(204, 245, 255) 56%, rgb(191, 234, 255) 63%, rgb(147, 193, 227) 70%, rgb(147, 193, 227) 77%, rgb(147, 193, 227) 84%, rgb(81, 119, 164) 91%)';
let gradient_white = 'radial-gradient(circle at 37%, rgb(236, 246, 255) 36%, rgb(228, 255, 255) 42%, rgb(215, 254, 255) 49%, rgb(204, 245, 255) 56%, rgb(191, 234, 255) 63%, rgb(147, 193, 227) 70%, rgb(147, 193, 227) 77%, rgb(147, 193, 227) 84%, rgb(81, 119, 164) 91%)';
let counter = 0;
var zoom_2D_global = get_global_zoom();

function initialize_2D_global(data_) {
  let coordstoplot = [];
  for (let key in data_) {
    coordstoplot.push([data_[key]['long'], data_[key]['lat'], data_[key]['UN_cur_perc'],data_[key]['NCP_cur']]);
  }
  return coordstoplot;
}

// Function to load the pollination visualization
function load_pollination() {
  location.href='viz/Pollination.html';
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
      .attr("fill", "#FFFFFF")
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

let data_2D_global = load_2d_global(dataset_global);
let promise_global = new Promise(function(resolve, reject) {
  setTimeout(() => resolve(1), 100);
});
promise_global.then(() => {
  let coordstoplot_global = initialize_2D_global(data_2D_global);
  showDataGlobal(g_global, coordstoplot_global);
});

// plot points on the map for 2D global map
function showDataGlobal(the_g, coordinates) {
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
        //d[2] is the demand (unmet need, y-axis)
        let red = Number(d[2])*255;
        //d[3] is the NCP (x-axis)
        let green = Number(d[3])*255;
        let blue = 0;
        return "rgb("+red+","+green+","+blue+")"
      })
      // .on('mouseover', tip.show)
      // .on('mouseout', tip.hide);
}

function click_about() {
  console.log("About button clicked");
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

function activate_nature_button() {
  document.getElementsByTagName('li')[3].style.background = "#c0c0c0";
  document.getElementsByTagName('li')[4].style.background = "black";
  //Load our HTML file
}

function activate_risk_button() {
  document.getElementsByTagName('li')[3].style.background = "black";
  document.getElementsByTagName('li')[4].style.background = "#c0c0c0";
  //Load HTML file of the other group
}

activate_nature_button();
