
class MapPlot {
	constructor(svg_element_id) {
		this.svg = d3.select('#' + svg_element_id);

		// may be useful for calculating scales
		const svg_viewbox = this.svg.node().viewBox.animVal;
		this.svg_width = svg_viewbox.width;
		this.svg_height = svg_viewbox.height;


		const map_promise = d3.json("data/map_data/110m.json").then(topojson_raw => {
			const countries = topojson.feature(topojson_raw, topojson_raw.objects.countries);
			return countries.features;
		})

		const country_label_promise = d3.tsv("data/map_data/world-110m.v1.tsv").then(data => data)

		Promise.all([map_promise, country_label_promise]).then((results) => {
			let map_data = results[0];
			let country_label_data = results[1];  // not used yet TODO: implement function using this		  

			let center_lon = -71.03;
			let center_lat = 42.37;
			let center_x = 330;
			let center_y = 150;
			let scale = 380;
			let sense = 0.25;

			let projection = d3.geoOrthographic()
				.center([center_lon, center_lat])
				.rotate([0, 0])
				.scale(scale)
				.translate([center_x, center_y])

			let path = d3.geoPath(projection)		

			this.svg.selectAll("path")
				.data(map_data)
				.enter().append("path")
				.attr("d", path)

			this.svg.call(d3.drag()
				.on("drag", () => {
					let rotate = projection.rotate();
					projection.rotate([rotate[0] + d3.event.dx * sense, rotate[1] - d3.event.dy * sense]);
					this.svg.selectAll("path").attr("d", path);
				}))
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
});
