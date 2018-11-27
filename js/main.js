// python -m http.server

class MapPlot {
	constructor(svg_element_id) {
		this.svg = d3.select('#' + svg_element_id);

		// may be useful for calculating scales
		const svg_viewbox = this.svg.node().viewBox.animVal;
		this.svg_width = svg_viewbox.width;
		this.svg_height = svg_viewbox.height;


		const map_promise = d3.json("data/map_data/110m.json").then(topojson_raw => {
			const country_features = topojson.feature(topojson_raw, topojson_raw.objects.countries).features;
			// remove leading zeros for the id:s
			country_features.forEach(x => x.id = x.id.replace(/^0+/, ''));
			return country_features;
		})

		const country_label_promise = d3.tsv("data/map_data/world-110m-country-names.tsv").then(data => data)

		Promise.all([map_promise, country_label_promise]).then((results) => {
			let map_data = results[0];
			let country_label_data = results[1];
			
			map_data.forEach(x => Object.assign(x, country_label_data.find(country_label => country_label['id'] == x['id'])))

			let center_x = this.svg_width/2;
			let center_y = this.svg_height/2;	
			let scale = 380;
			let active = d3.select(null)

			let projection = d3.geoOrthographic()
				.rotate([0, 0])
				.scale(scale)
				.translate([center_x, center_y])

			let path = d3.geoPath(projection)		

			var countryTooltip = d3.select("body").append("div").attr("class", "countryTooltip")

			this.svg.selectAll("path")
				.data(map_data)
				.enter().append("path")
				.attr("d", path)
				.attr("fill", function(d){
					return "grey"
				})
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
				.on("click", clicked)

				function clicked(d){
					console.log(d.name)
					if (active.node() === this) return reset();
					active.classed("active", false);
					active = d3.select(this).classed("active", true);

					var currentRotate = projection.rotate();
					var currentScale = projection.scale();
					var p_center = d3.geoCentroid(d)

					projection.rotate([-p_center[0], -p_center[1]]);
					path.projection(projection);

					// calculate the scale and translate required:
					var b = path.bounds(d);
					var nextScale = scale * 4;
					var nextRotate = projection.rotate();

					// Update the map:
					d3.selectAll("path")
						.transition()
						.attrTween("d", function(d) {
							var r = d3.interpolate(currentRotate, nextRotate);
							var s = d3.interpolate(currentScale, nextScale);
								return function(t) {
									projection
										.rotate(r(t))
										.scale(s(t));
								path.projection(projection);
								return path(d);
								}
						})
						.duration(1000);
				}

				function reset() {
					active.classed("active", false);
					active = d3.select(null);

					d3.selectAll("path")
					.transition()
						.attrTween("d", function(d) {
						var s = d3.interpolate(projection.scale(), scale);
						return function(t) {
							projection.scale(s(t));
							path.projection(projection);
							return path(d);
						}
					})
					.duration(1000);
				}

			// plot centroid
			d3.geoZoom()
				.projection(projection)
				.scaleExtent([0.8, 5])
				.northUp(true)
				.onMove(() => this.svg.selectAll("path").attr('d', path))
				(this.svg.node());
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
