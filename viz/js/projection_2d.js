// All the initialization and magic for projection 2D
function projection2D() {
  checked2D = document.getElementById("checked2D").value;
  checked3D = document.getElementById("checked3D").value;
  if (checked2D === 'false') {


    disappearLoader();
    parseData("../Data/nc_degree.csv", doStuff, true);

    // let promise = new Promise(function(resolve, reject) {
    //   // loadGlobalData(dataset);
    //   setTimeout(() => resolve(1), 100);
    // });
    // promise.then(function(result) {
    //   parseData("../Data/ncwp.csv", doStuff);
    // });

    document.getElementsByTagName('li')[0].style.backgroundColor = "black";
    document.getElementsByTagName('li')[1].style.background = "#c0c0c0";
    document.getElementsByTagName('li')[2].style.backgroundColor = "black";
    document.getElementsByTagName('li')[3].style.backgroundColor = "black";
    document.getElementsByTagName('li')[4].style.backgroundColor = "black";
    document.getElementsByClassName("map-slider")[0].style.display = "none";
    document.getElementsByClassName("overlay")[0].style.display = "block";

    zoom_3D = null;
    BarGraphObject.updateBarGraph('../Data/ssp1_impacted.csv');
    changeProjection(true);
    updateLegendPosition(true);

    document.getElementsByClassName('box box-1')[0].style.display = "none";
    document.getElementsByClassName('box box-2')[0].style.width = "77%";

    document.getElementsByClassName('box box-3')[0].style.display = "none";
    document.getElementsByClassName('box box-3')[1].style.display = "flex";
    document.getElementsByClassName('map-diff-line')[0].style.width = "85%";
    document.getElementById("container").style.display = "block";
    document.getElementsByClassName("year-text-2015")[0].style.display = "block";
    document.getElementsByClassName("year-text-2050")[0].style.display = "block";

    checked2D = "true";
    checked3D = "false";

    svg.call(zoom_2D);
    svg_map2.call(zoom_2D);

    //let coordstoplot = initialize_2D(current_year, data_2D);

    // Change the size of the maps
    svg.attr("width", $(".box.box-1").width())
      .attr("height", $(".map1").height())
      .attr("transform", "translate(-530, -180) scale(1.02)");
    map1.setAttribute("style", "width: 100%; height: 47%;");

    map2.setAttribute("style", "width: 100%; height: 47%;");
    svg_map2.attr("width", $(".box.box-1").width())
      .attr("height", $(".map1").height())
      .attr("transform", "translate(-530, -170) scale(1.02)");

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
    // loadDifferentScenario("NC");

    // Making the name of the maps appear in 2D
    document.getElementById("map-name-1").style.display = "initial";

    document.getElementById("checked2D").disabled = true;
    document.getElementById("checked3D").disabled = false;
    d3.select(".map-slider").html("");

    // Plot points on the map
    runSegmentedSSPs("SSP1");
    // showData(g_map2, '2015', colorScaleDisplay);
  }
}
