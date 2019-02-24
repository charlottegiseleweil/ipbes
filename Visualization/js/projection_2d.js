// All the initialization and magic for projection 2D
function projection2D() {
  checked2D = document.getElementById("checked2D").value;
  checked3D = document.getElementById("checked3D").value;
  if (checked2D === 'false') {

  	document.getElementsByClassName('menu-box-1')[0].style.display = "inline-block";
    document.getElementsByClassName("map-slider")[0].style.display = "none";
    document.getElementsByClassName("overlay")[0].style.display = "block";

    zoom_3D = null;
    BarGraphObject.updateBarGraph('dataset/ssp1_impacted.csv');
    changeProjection(true);
    updateLegendPosition(true);
    document.getElementsByClassName('box box-3')[0].style.display = "none";
    document.getElementsByClassName('box box-3')[1].style.display = "flex";
    document.getElementsByClassName('map-diff-line')[0].style.width = "85%";
    document.getElementById("container").style.display = "block";

    checked2D = "true";
    checked3D = "false";

    svg.call(zoom_2D);
    svg_map2.call(zoom_2D);

    let coordstoplot = initialize_2D(current_year, data_2D);

    // Change the size of the maps
    svg.attr("width", $(".map1").width())
      .attr("height", $(".map1").height())
      .attr("transform", "translate(0, -200) scale(0.85)");
    map1.setAttribute("style", "width: 100%; height: 47%;");

    map2.setAttribute("style", "width: 100%; height: 47%;");
    svg_map2.attr("width", $(".map1").width())
      .attr("height", $(".map1").height())
      .attr("transform", "translate(0, -170) scale(0.85)");

    map2.setAttribute(
      "style",
      "width: 100%; height: 46%; overflow-x:hidden; overflow-y:hidden;"
    );
    document.getElementById('svg_map2').style.overflow = "initial";


    map1.setAttribute(
      "style",
      "width: 100%; height: 46%; overflow-x:hidden; overflow-y:hidden;"
    );
    document.getElementById('svg_map1').style.overflow = "initial";

    // TODO: Need to change it
    make2015staticMap();
    // loadDifferentScenario("NC");

    // Making the name of the maps appear in 2D
    document.getElementById("map-name-1").style.display = "initial";

    document.getElementById("checked2D").disabled = true;
    document.getElementById("checked3D").disabled = false;
    d3.select(".map-slider").html("");

    // Plot points on the map
    runSegmentedSSPs("SSP1");
    showData(g, coordstoplot);
  }
}

let impact_btn = document.getElementsByClassName("impact-button")[0];
let hist_btn = document.getElementsByClassName("historical-button")[0];
let modeling_btn = document.getElementsByClassName("modeling-button")[0];
let future_btn = document.getElementsByClassName("future-button")[0];

function future_button() {
  future_btn.style.backgroundColor = "#000000";
  impact_btn.style.backgroundColor = "#9c9c9c";
  modeling_btn.style.backgroundColor = "#9c9c9c";
  hist_btn.style.backgroundColor = "#9c9c9c";
}

function historical_button() {
  hist_btn.style.backgroundColor = "#000000";
  impact_btn.style.backgroundColor = "#9c9c9c";
  modeling_btn.style.backgroundColor = "#9c9c9c";
  future_btn.style.backgroundColor = "#9c9c9c";
}

function modeling_button() {
  modeling_btn.style.backgroundColor = "#000000";
  impact_btn.style.backgroundColor = "#9c9c9c";
  future_btn.style.backgroundColor = "#9c9c9c";
  hist_btn.style.backgroundColor = "#9c9c9c";
}

function impact_button() {
  impact_btn.style.backgroundColor = "#000000";
  future_btn.style.backgroundColor = "#9c9c9c";
  modeling_btn.style.backgroundColor = "#9c9c9c";
  hist_btn.style.backgroundColor = "#9c9c9c";
}
