// Current dataset depending on what we visualize
// and also the initializations
let firstTime = true;
let dataset = '../Data/country_en.csv';
let dataset_2D = '../Data/ncp_2d_cur.csv';
let current_viz = "Food Energy";
let change_dataset = '../Data/ncp_2d_change.csv';
let country_data_2D;
let map_title = document.getElementById('map-name-1');

// plot points on the map for 2D and 3D map
function showData(the_g, coordinates) {
  // Add circles to the country which has been selected
  // Removing part is within
  if (checked2D == 'true') {
    console.log("harshd");
    // This is just for 2D, we are creating a raster by creating a rectangle
    the_g.selectAll(".plot-point")
      .data(coordinates.slice(1,3)).enter()
      .append("polygon")
      .classed('plot-point', true)
      .attr("points",function(d) {
            let x_1, y_1 = projection([d['lat1'], d['long1']]);
            let x_2, y_2 = projection([d['lat2'], d['long2']]);
            let x_3, y_3 = projection([d['lat3'], d['long3']]);
            let x_4, y_4 = projection([d['lat4'], d['long4']]);
            let x_5, y_5 = projection([d['lat5'], d['long5']]);
            console.log(x_1, y_1, x_2, y_2);
            // console.log(projection(d['lat1']) + ',' + projection(d['long1']) + ' ' +
            //     projection(d['lat2']) + ',' + projection(d['long2']) + ' ' +
            //     projection(d['lat3']) + ',' + projection(d['long3']) + ' ' +
            //     projection(d['lat4']) + ',' + projection(d['long4']) + ' ' +
            //     projection(d['lat5']) + ',' + projection(d['long5'])
            // )
        })
      .attr("fill", function(d) {
        color = d['2015'] || 0;
        return colorScaleDisplay(color);
      })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);
  }
}

// Update data loads the data depending upon the columns for Vitamin, Energy and Folate
// and changes the storytelling
function updateData(data_type) {
  switch (data_type) {
    case "Population":
      region_text = "Rural Population";
      // title.innerHTML = "Pollination Contribution to Nutrition (Vitamin A) in " + current_year;
      // contribution_text.innerHTML = "What is the percentage of pollination contribution to " +
      //   current_viz + " in " + current_year + "?";
      // colorScheme = d3.schemeGreens[6];
      // colorSchemeDisplay = d3.schemeGreens[9];
      // dataset = 'dataset/country_va.csv';
      // dataset_graph = 'dataset/plot_vitamin.csv';
      dataset_2D = '../Data/pop_2d_cur.csv';
      change_dataset = '../Data/pop_2d_change.csv';
      // color_graph = colorScale_vitamin;
      // lineGraphObject.updateGraph(previousCountryClicked);

      break;
    case "Nitrogen":
      // current_viz = "Food Energy";
      region_text = "Nitrogen Pollution Potential";
      // title.innerHTML = "Pollination Contribution to Nutrition (Food Energy) in " + current_year;
      // contribution_text.innerHTML = "What is the percentage of pollination contribution to " +
      //   current_viz + " in " + current_year + "?";
      // colorScheme = d3.schemeReds[6];
      // colorSchemeDisplay = d3.schemeReds[9];
      // dataset = 'dataset/country_en.csv';
      // dataset_graph = 'dataset/plot_energy.csv';
      dataset_2D = '../Data/ncp_2d_cur.csv';
      // color_graph = colorScale_energy;
      change_dataset = '../Data/ncp_2d_change.csv';
      // lineGraphObject.updateGraph(previousCountryClicked);
      break;
    case "Pollution":
      region_text = "Percent Nitrogen Pollution Avoided";
      // current_viz = "Folate";
      // title.innerHTML = "Pollination Contribution to Nutrition (Folate) in " + current_year;
      // colorScheme = d3.schemePurples[6];
      // colorSchemeDisplay = d3.schemePurples[9];
      // dataset = 'dataset/country_fo.csv';
      // dataset_graph = 'dataset/plot_folate.csv';
      // dataset_2D = 'dataset/pixel_folate.csv';
      // color_graph = colorScale_folate;
      // change_dataset = 'dataset/change_fo.csv';
      // lineGraphObject.updateGraph(previousCountryClicked)
      break;
    case "Export":
      region_text = "Nitrogen Export";
        // current_viz = "Folate";
        // title.innerHTML = "Pollination Contribution to Nutrition (Folate) in " + current_year;
        // colorScheme = d3.schemePurples[6];
        // colorSchemeDisplay = d3.schemePurples[9];
        // dataset = 'dataset/country_fo.csv';
        // dataset_graph = 'dataset/plot_folate.csv';
        // dataset_2D = 'dataset/pixel_folate.csv';
        // color_graph = colorScale_folate;
        // change_dataset = 'dataset/change_fo.csv';
        // lineGraphObject.updateGraph(previousCountryClicked)
      break;
  }
map_title.innerHTML = region_text;
colorScale = d3.scaleThreshold()
  .domain([20, 40, 60, 80, 99, 100])
  .range(colorScheme);

// The color scheme which displays more gradient
colorScaleDisplay = d3.scaleThreshold()
  .domain([11, 22, 33, 44, 55, 66, 77, 88, 100])
  .range(colorSchemeDisplay);

  //updateLegend(colorScale);
  let promise = new Promise(function(resolve, reject) {
    // loadGlobalData(dataset);
    data_2D = load(dataset_2D);
    change_data = load(change_dataset)
    setTimeout(() => resolve(1), 10);
  });
  promise.then(function(result) {
    update_percentages(current_year);
    change_pollination_contribution(current_year);
    accessData();
  });
}

// Access data loads the daa for 3D and 2D and depending upon that colors
function accessData() {
  g.selectAll("path").attr("fill", function(d) {
      // Pull data for particular iso and set color - Not able to fill it
      if (checked3D == 'true') {
        d.total = data_c[d.properties.iso3] || 0;
        return colorScaleDisplay(d.total);
      } else {
        return '#D3D3D3';
      }
    })
    .attr("d", path);
}

// Construct the static Map for 2D visualization by showData and initializing
// the 2D coordsplot
function make2015staticMap() {
  if (firstTime) {
    let coordstoplot = initialize_2D("2015", data_2D);
    showData(g_map2, coordstoplot);
    firstTime = false;
  }
}

// Loading the global data depending upon the dataset you give
// and make a data structure as a dictionary depending upon iso3 - this is more for 3D
// function loadGlobalData(dataset) {
//   global_data_c = load(dataset);
//   data_c = {};
//   d3.csv(dataset, function(error, data) {
//     data.forEach(function(d) {
//       data_c[d.iso3] = global_data_c[d.iso3][current_year];
//     });

//   });
// }

// Load the data from the dataset but construction a different kind of dictionary
// and does not take into account the current year into account - and is for 2D since
// the data is not aggregated
function load(dataset) {
  let result = {};
  d3.csv(dataset, function(error, data) {
    data.forEach(function(d) {
      result[d.iso3] = d;
    });
  });
  return result;
}

// Initialize the data for 2D by making a list
function initialize_2D(period, data_) {
  let coordstoplot = [];
  for (let key in data_) {
    coordstoplot.push([data_[key]['lat'], data_[key]['long'], data_[key][period]]);
  }
  return coordstoplot;
}

function doStuff(data) {
  //Data is usable here
  // console.log(data);
  showData(g_map2, data);
}

function parseData(url, callBack) {
  Papa.parse(url, {
    download: true,
    dynamicTyping: false, // Parse values as their true type (not as strings)
    header: true, // to parse the data as a dictionary
    complete: function(results) {
      callBack(results.data);
    }
  });
}
