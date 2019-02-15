// All the initialization and magic for projection 2D
function projection2D() {
  checked2D = document.getElementById("checked2D").value;
  checked3D = document.getElementById("checked3D").value;
  if (checked2D === 'false') {

    document.getElementsByClassName("map-slider")[0].style.display = "none";
    document.getElementById("radios").style.display = "block";
    document.getElementById("radios2").style.display = "block";

    zoom_3D = null;
    BarGraphObject.updateBarGraph('dataset/ssp1_impacted.csv');
    title_map.innerHTML = "Pollination Contribution to " + current_viz + " in 2015 (Bottom) vs SSP1 (Top)";
    changeProjection(true);
    updateLegendPosition(true);
    document.getElementsByClassName('box box-3')[0].style.display = "none";
    document.getElementsByClassName('box box-3')[1].style.display = "flex";
    document.getElementsByClassName('map-diff-line')[0].style.width = "85%";

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
      .attr("transform", "translate(0, -130) scale(0.85)");

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

    make2015staticMap();

    // Making the name of the maps appear in 2D
    document.getElementById("map-name-1").style.display = "initial";
    document.getElementById("map-name-2").style.display = "initial";

    document.getElementById("checked2D").disabled = true;
    document.getElementById("checked3D").disabled = false;
    d3.select(".map-slider").html("");

    // Plot points on the map
    runSegmentedSSPs("SSP1");
    showData(g, coordstoplot);
  }
}
