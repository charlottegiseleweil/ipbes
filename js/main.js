class MapPlot {
	constructor(svg_element_id) {
		let svg = d3.select('#' + svg_element_id);

		// may be useful for calculating scales
		const svg_viewbox = svg.node().viewBox.animVal;
		let svgWidth = svg_viewbox.width;
		let svgHeight = svg_viewbox.height;


		// FIXME: better load function for both maps
		const map_promise_110 = d3.json("data/map_data/110m.json").then(topojson_raw => {
			const country_features = topojson.feature(topojson_raw, topojson_raw.objects.countries).features;
			// remove leading zeros for the id:s
			country_features.forEach(x => x.id = x.id.replace(/^0+/, ''));
			return country_features;
		})

		const map_promise_50 = d3.json("data/map_data/50m.json").then(topojson_raw => {
			const country_features = topojson.feature(topojson_raw, topojson_raw.objects.countries).features;
			// remove leading zeros for the id:s
			country_features.forEach(x => x.id = x.id.replace(/^0+/, ''));
			return country_features;
		})

		const country_label_promise = d3.tsv("data/map_data/world-110m-country-names.tsv").then(data => data)

		Promise.all([map_promise_110, map_promise_50, country_label_promise]).then((results) => {
			// 110map
			const map_data = results[0];
			// 50map
			const map_data_50 = results[1]
			console.log
			// country label names
			const country_label_data = results[2];
			
			// add country name labels to map_data objects
			map_data.forEach(x => Object.assign(x, country_label_data.find(country_label => country_label['id'] == x['id'])))
			map_data_50.forEach(x => Object.assign(x, country_label_data.find(country_label => country_label['id'] == x['id'])))

			let center_x = svgWidth/2;
			let center_y = svgHeight/2;	
			let scale = 380;
			let scaleExtent = [0.8, 5];
			let resetScale = scale;
			let resetRotate = [0, 0];
			let activeClick = d3.select(null)
			let clickedRotate; 
			let clickedScale;

			let projection = d3.geoOrthographic()
				.rotate([0, 0])
				.scale(scale)
				.translate([center_x, center_y])

			let path = d3.geoPath(projection)

			let countryTooltip = d3.select("body").append("div").attr("class", "countryTooltip")

			const render = () => {
				// Update paths
				svg.selectAll("path").attr('d', path);
			};

			// the main globe object
			 svg.selectAll("path")
			 	.data(map_data)
			 	.enter().append("path")
				.attr("fill", "grey")
				.attr("d", path)
				.on("click", clicked)
				.on("mouseover", function(d){
					countryTooltip.text(d.name)
						.style("left", (d3.event.pageX + 7) + "px")
						.style("top", (d3.event.pageY - 15) + "px")
						.style("display", "block")
						.style("opacity", 1);
					d3.select(this).classed("selected", true)
				})
				.on("mouseout", function(d){
					countryTooltip.style("opacity", 0)
						.style("display", "none");
					d3.select(this).classed("selected", false)	
				})
				
			initializeZoom();
			render();

			
			svg.selectAll("path").enter()
				.append("circle")
					.attr("transform", "translate([400,400])")
					.attr('r', scale+10)
					.attr("fill", "yellow")


			var v0, r0, q0;

			function initializeZoom() {
				// Call the zoom on the svg instead of the path elements to make sure that it is possible to drag 
				// everywhere on the globe (and not just on land)
				svg.call(d3.zoom()  
					.on("start", zoomstarted)
					.on('zoom', zoomed)
					.scaleExtent(scaleExtent));
			}
			
			function zoomstarted() {
				v0 = versor.cartesian(projection.invert(d3.mouse(this)));
				r0 = projection.rotate();
				q0 = versor(r0);
			}
			
			function zoomed() {
				projection.scale(d3.event.transform.k * (svgHeight - 10) / 2);
			
				var v1 = versor.cartesian(projection.rotate(r0).invert(d3.mouse(this))),
					q1 = versor.multiply(q0, versor.delta(v0, v1)),
					r1 = versor.rotation(q1);
				r1[2] = 0;  // Don't rotate Z axis
				projection.rotate(r1);
				render()
			}

			function clicked(d){
				if (activeClick.node() === this) return resetClick();  // zoom out again if click on the same country
				else if (activeClick.node() != null) return null;  // else if we are already zoomed in, do nothing
				activeClick.classed("active", false);
				activeClick = d3.select(this).classed("active", true);
				
				svg.on('.zoom', null).on('.start', null);  // disable zoom and drag while focused on a country

				let currentRotate = projection.rotate();
				let currentScale = projection.scale();
				resetRotate = currentRotate;
				resetScale = currentScale

				let p_center = d3.geoCentroid(d)
				
				projection.rotate([-p_center[0], -p_center[1]]);
				path.projection(projection);
				
				// calculate the scale and translate required:
				var b = path.bounds(d);
				clickedScale = currentScale * 1.5 / Math.max((b[1][0] - b[0][0]) / (svgWidth/2), (b[1][1] - b[0][1]) / (svgHeight/2));
				clickedRotate = projection.rotate();

				let already_triggered = false
				// Update the map:
				d3.selectAll("path")
					.transition()
					.attrTween("d", zoomRotateFactory(currentRotate, currentScale, clickedRotate, clickedScale))
					.duration(1000)
					.on("end", function() {
						if (!already_triggered) {
							console.log(d.name)
							init_50map(d)
							already_triggered = true
						}
					})
			}

			// initializing HD map after zooming in
			function init_50map(country_sel) {
				console.log(country_sel)

				svg.selectAll("path").remove().enter()
					.data(map_data_50)
					.enter().append("path")
					.attr("fill", function (d){
						if (d.name == country_sel.name) {
							console.log("yoyoyo")
							return "yellow"
						}
						// Pull data for this country
						//d.total = data.get(d.id) || 0;
						// Set the color
						return "grey";
					})
					.attr("d", path)
					.on("click", resetClick)
					.attr()
			}

			// initializing LOW RES map after zooming in
			function init_110map() {
				svg.selectAll("path").remove().enter()

				svg.selectAll("path")
					.data(map_data)
					.enter().append("path")
					.attr("fill", "grey")
					.attr("d", path)
					.on("click", clicked)
					.on("mouseover", function(d){
						countryTooltip.text(d.name)
							.style("left", (d3.event.pageX + 7) + "px")
							.style("top", (d3.event.pageY - 15) + "px")
							.style("display", "block")
							.style("opacity", 1);
						d3.select(this).classed("selected", true)
					})
					.on("mouseout", function(d){
						countryTooltip.style("opacity", 0)
							.style("display", "none");
						d3.select(this).classed("selected", false)
						
					})
			}

			function resetClick() {
				activeClick.classed("active", false);
				activeClick = d3.select(null);
				init_110map()
				
				let already_triggered = false
				d3.selectAll("path")
					.transition()
					.attrTween("d", zoomRotateFactory(clickedRotate, clickedScale, resetRotate, resetScale))
					.duration(1000)
					.on("end", function() {
						if (!already_triggered) {
							initializeZoom()
							already_triggered = true
						}
					})
			}

			function zoomRotateFactory(currRot, currScale, nexRot, nexScale) {
				return function(d) {
					var r = d3.interpolate(currRot, nexRot);
					var s = d3.interpolate(currScale, nexScale);
						return function(t) {
							projection
								.rotate(r(t))
								.scale(s(t));
						path.projection(projection);
						if (path(d) == null) return ""; else return path(d);
						}
					}
			}
		});

	}
}
			
function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", action);
	} else {
		// `DOMContentLoaded` already fired
		action();
	}
}

whenDocumentLoaded(() => {
	plot_object = new MapPlot('globe-plot');
	// plot object is global, you can inspect it in the dev-console

	// Initialize dashboard
	is2050 = false;
	slideIndex = 0;
	showStory(slideIndex);
});


// Year toggle
document.getElementById('toggle').addEventListener('click', function() {
	is2050 = !is2050;
	switchYear(is2050); 
});

function switchYear(toggle) {
	let toggleContainer = document.getElementById('toggle-container');
	let scenarioRow = document.getElementById('scenario');
	if (toggle) {
		toggleContainer.style.clipPath = 'inset(0 0 0 50%)';
		scenarioRow.style.opacity = '1';
		scenarioRow.style.transition = 'opacity 0.5s linear';
		scenarioRow.style.visibility = 'visible';
    } else {
		toggleContainer.style.clipPath = 'inset(0 50% 0 0)';
		scenarioRow.style.visibility = 'collapse';
		scenarioRow.style.opacity = '0';
		scenarioRow.style.transition = 'opacity 0.5s linear';
		scenarioRow.style.transition = 'visibility 0.15s linear';	
    }
};

// Test stories
const stories = [ {header: "Water OMG", 
					text: "klsd jkdsf jkd fkjds fkjds kjeewwedsjfsdkfdjskfkdsjfd fkjdsf kjdsf dskjfdsfjk kdoapadf",
					field: "a_radio-1",
					scenario: "b_radio-1",
					toggleState: false},
				{header: "The year was 2050", 
					text: "klsd jkdsf jkd fkjds fkjds fkdsjfd fkjdsf kjdsf dskjfdsfjk kdoapadf",
					field: "a_radio-2",
					scenario: "b_radio-3",
					toggleState: true},
				{header: "YEEAH", 
					text: "klsd jkdsf jkd fkjds fkjds kjeewwedsjfsdkfdjskfkdsjfd fkjds skjfdsfjk kdoapadf",
					field: "a_radio-3",
					scenario: "b_radio-1",
					toggleState: true},
				];


// Functions to display stories
function plusStory(n) {
  showStory(slideIndex += n);
}

function showStory(n) {
	if (n > stories.length-1) {slideIndex = 0 }; 
	if (n < 0) {slideIndex = stories.length-1}

	const story = stories[slideIndex];
	document.getElementById("story-header").innerHTML = story.header;
	document.getElementById("story-text").innerHTML = story.text;
	document.getElementById(story.field).checked = true;
	document.getElementById(story.scenario).checked = true;
	switchYear(story.toggleState);
}
