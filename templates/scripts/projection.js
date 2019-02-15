// Change projection and zoom based on checked2D and checked3D variables

// Variable used to initialize the gradient to white
let current_html = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);

let global_activated = true;


// If we are in index.html, then by default global is activated at the beginning
// Otherwise we initiate it to false;
if (current_html != "index.html") {
  global_activated = false;
}

function changeProjection(sliderChecked) {
  // Add background to the globe
  let planet_radius = d3.min([width / 2, height / 2]);

  // Changing the scale will change the size - height and width of globe
  if (sliderChecked) {

    zoom_2D = d3.zoom()
      .scaleExtent([0.8, 20])
      .translateExtent([
        [0, 0],
        [$(".map1").width(), $(".map1").height()]
      ])
      .extent([
        [0, 0],
        [$(".map1").width(), $(".map1").height()]
      ])
      .on("zoom", zoomed_2D);

    projection = d3.geoNaturalEarth()
      .scale(planet_radius * 0.45)
      .translate([width / 2, height / 2])
      .precision(.1);

      $('.box-container').css({
        'background': 'radial-gradient(circle at 37%, rgb(236, 246, 255) 36%, rgb(228, 255, 255) 42%, rgb(215, 254, 255) 49%, rgb(204, 245, 255) 56%, rgb(191, 234, 255) 63%, rgb(147, 193, 227) 70%, rgb(147, 193, 227) 77%, rgb(147, 193, 227) 84%, rgb(81, 119, 164) 91%)'
      });

    // Make the map grey
    g.selectAll('path').attr('fill', '#D3D3D3').on("click", null);
    g_map2.selectAll('path').attr('fill', '#D3D3D3').on("click", null);
  } else {

    zoom_3D = d3.zoom()
      .scaleExtent([1, 12])
      .on("zoom", zoomed);

    projection = d3.geoOrthographic()
      .scale(planet_radius * 0.844)
      .translate([width / 2, height / 2])
      .precision(.1);
      if (global_activated == false) {
    $('.box-container').css({
      'background': 'radial-gradient( circle at 37%, rgb(105, 190, 255) 29%, rgb(236, 246, 255) 36%, rgb(228, 255, 255) 42%, rgb(215, 254, 255) 49%, rgb(204, 245, 255) 56%, rgb(191, 234, 255) 63%, rgb(147, 193, 227) 70%, rgb(147, 193, 227) 77%, rgb(147, 193, 227) 84%, rgb(81, 119, 164) 91%)'
    });
  }
    // inertia versor dragging after everything has been rendered
    inertia = d3.geoInertiaDrag(svg, function() {
      render();
    }, projection);

    // Make the map coloful again
    g.selectAll('path').attr('fill', function(d) {
      let promise = new Promise(function(resolve, reject) {
        setTimeout(() => resolve(1), 10);
      });
      promise.then(function(result) {
        d.total = data_c[d.properties.iso3] || 0;
      });
      return colorScale(d.total);
    }).attr("d", path).on("click", clicked);
  }

  // Insantiate the path
  path = d3.geoPath()
    .projection(projection);

  // Redraw the all projections
  svg.selectAll('path').transition().duration(500).attr('d', path);
}
