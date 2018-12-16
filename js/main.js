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

		const country_mapping_ndr_promise = d3.json("data/preprocessed_data/ndr_countries.json")
		const country_mapping_poll_promise = d3.json("data/preprocessed_data/poll_countries.json")
		const country_mapping_cv_promise = d3.json("data/preprocessed_data/cv_countries.json")

		const ndr_promise = d3.csv("data/preprocessed_data/ndr_table_preprocessed.csv").then(data => data)
		const poll_promise = d3.csv("data/preprocessed_data/poll_table_preprocessed.csv").then(data => data)
		const cv_promise = d3.csv("data/preprocessed_data/cv_table_preprocessed.csv").then(data => data)

		const country_label_promise = d3.tsv("data/map_data/world-110m-country-names.tsv").then(data => data)

		Promise.all([map_promise_110, map_promise_50, country_label_promise, ndr_promise, 
					poll_promise, cv_promise, country_mapping_ndr_promise, country_mapping_poll_promise, country_mapping_cv_promise]).then((results) => {

			const map_data = results[0];  // 110m map
			const map_data_50 = results[1];  // 50m map
			const country_label_data = results[2];  // country label names

			const ndr_data = results[3];  // data
			const poll_data = results[4];
			const cv_data = results[5];

			const ndr_country_mapping = results[6];  // mapping between country name and data points
			const poll_country_mapping = results[7];  
			const cv_country_mapping = results[8]; 
			
			let currentData = ndr_data;
			let currentCountryMapping = ndr_country_mapping
			
			// add country name labels to map_data objects  TODO: add this to preprocessing instead
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
			let focused = false;
			let focusedCountry = "";
			let currentDatasetName = "ndr";
			// the current scenario, either 'cur', 'ssp1', 'ssp3' or 'ssp5'
			this.currentScenario = "cur";
			this.update_all = update_all;
			this.setDataset = setDataset;

			// color scale for the data points in the focused mode
			// TODO: VERY IMPORTANT; we need a scale for the zoomed 
			// in mode to be able to compare the colors to the extreme values of the whole 
			// world, to see if they are bad or not, (in addition to the comparison within
			// a country)
			let focused_color_scale = d3.scaleLinear()
				.range(["green", "red"])
				.interpolate(d3.interpolateHcl);
			this.world_color_scale = d3.scaleLinear()
				.range(["green", "red"])
				.interpolate(d3.interpolateHcl);

			const render = () => {
				// Update country borders
				svg.selectAll("path").attr('d', path)

				if (!focused) {
					let dataSelection = worldDataSelection();
					dataSelection.exit().remove();
					initWorldMapData(dataSelection);
				}

				// Update positions of circles (both data points and story markers)
				svg.selectAll("circle")
					.attr("transform", (d) => `translate(${projection([d.lng, d.lat])})`)

				svg.selectAll("circle.story-markers")
					// make the data dots disappear when they are on the other side of the globe.
					.style("display", (d) => {  
						var globeDistance = d3.geoDistance([d.lng, d.lat], projection.invert([svgWidth/2, svgHeight/2]));
						return (globeDistance > 1.57) ? 'none' : 'inline';
					})
				
			};

			let projection = d3.geoOrthographic()
				.rotate([0, 0])
				.scale(scale)
				.translate([center_x, center_y])

			let path = d3.geoPath(projection)

			let countryTooltip = d3.select("body").append("div").attr("class", "countryTooltip")

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
				.on("click", clicked)
				
			let quadtree = setupQuadtree();
			updateNodes(quadtree);

			initializeZoom();
			drawMarkers();
			showStory(0, true);
			
			
			// TODO: CIRCLE AROUND WORLD 
			// svg.selectAll("path").enter()
			// 	.append("circle")
			// 		.attr("transform", "translate([400,400])")
			// 		.attr('r', scale+10)
			// 		.attr("fill", "yellow")

			function setupQuadtree() {
				let quadtree = d3.quadtree()
					.x((d) => d.lng)
					.y((d) => d.lat)
					.addAll(currentData);
				return quadtree;
			}

			function updateNodes(quadtree) {
                quadtree.visit(function (node, x1, y1, x2, y2) {
					node.width = x2 - x1;
                });
			}
			

			// Find the nodes within the specified rectangle.
            function search(quadtree, x0, y0, x3, y3) {
                let pts = [];
                let subPixel = false;
                let subPts = [];
                let nodeScale = projection.scale() * 0.0005;  // måste ändras
				let counter = 0;
				let counter2 = 0; 
				
				let mapCenter = projection.invert([svgWidth/2, svgHeight/2]);

                quadtree.visit(function (node, x1, y1, x2, y2) {
					let p = node.data;
                    let pwidth = node.width * nodeScale;

                    // -- if this is too small rectangle only count the branch and set opacity
                    if ((pwidth * pwidth) <= 1) {
                        // start collecting sub Pixel points
                        subPixel = true;
                    }
                        // -- jumped to super node large than 1 pixel
                    else {
                        // end collecting sub Pixel points
                        if (subPixel && subPts && subPts.length > 0) {

							subPts[0].group = subPts.length;
							let indexOfMax = d3.scan(subPts, (a, b) => parseInt(b[`UN_${plot_object.currentScenario}`])- parseInt(a[`UN_${plot_object.currentScenario}`]));
                            pts.push(subPts[indexOfMax]); // add only the point with the highest data value
                            counter += subPts.length - 1;
							subPts = [];
                        }
                        subPixel = false;
					}

                    if ((p) && d3.geoDistance([p.lng, p.lat], mapCenter) < 1.57) {  // kanske ändra denna för att se vinklingen mer
						counter2 += 1;
                        if (subPixel) {
                            subPts.push(p);
                        }
                        else {
                            if (p.group) {
                                delete (p.group);
                            }
                            pts.push(p);
                        }
					}

					// if the quad tree visit rectangle is outside of the search rectangle then we don't want to visit the sub nodes
					// the rather complex logic here is because of the -180/180 longitude border
					if (y2 < y3 - 10 || y1 > y0 + 10) return true;  // The added and subtracted 10s are to make sure points are rendered at top and bottom properly
					if (x3 > x0 && x2 > x1)  // if none of the areas are over the longitude 180/-180
						return x1 > x3 || x2 < x0;  // if true, don't search over this area (because it does not overlap)
					else if (x3 > x0 || x2 > x1)  // if one of the areas are over the longitude 180/-180 
						return x1 > x3 && x2 < x0;
					else return false  // else both areas are over the longitude 180/-180 ==> they are overlapping ==> return false
                });
				console.log(" Number of removed  points: " + counter);
				console.log(" Number of kept points: " + pts.length)
				console.log(" currentScale: " + projection.scale());
				console.log("counter2: " + counter2);
				if (counter2 == 0) {
					console.log("uasid")
				}
                return pts;

            }

			function setDataset(dataset) {  //TODO: disable switches during transition
				currentDatasetName = dataset;
				switch (currentDatasetName) {
					case 'ndr': 
						currentData = ndr_data;
						currentCountryMapping = ndr_country_mapping;
						break;
					case 'poll':
						currentData = poll_data;
						currentCountryMapping = poll_country_mapping;
						break;
					case 'cv':  
						currentData = cv_data;
						currentCountryMapping = cv_country_mapping;
					 	break; 
					
				}
				update_all();
			}

			// updates all data using the currentData variable
			function update_all() {
				if (focused) {
					let dataSelection = focusedDataSelection();
					dataSelection.exit().remove();
					initFocusedMapData(dataSelection);
				} else {
					quadtree = setupQuadtree();
					updateNodes(quadtree);
					setWorldColorScale();
					render();
				}
			}

			function worldDataSelection() {
				// let threshold;
				// switch(currentDatasetName) {
				// 	case 'ndr':
				// 		threshold = 30000000;
				// 		break;
				// 	case 'poll':
				// 		threshold = 30000;
				// 		break;
				// 	case 'cv':
				// 		threshold = 3.4;
				// 		break;
				// 
				// return svg.selectAll("circle.datapoints")
				// 	.data(currentData.filter((d) => d[`UN_${plot_object.currentScenario}`] > threshold), (d) => d);
				let topLeft = projection.invert([0, 0]);
				let topRight = projection.invert([svgWidth, 0]);
				let top = projection.invert([svgWidth/2, 0])[1];
				let bottom = projection.invert([svgWidth/2, svgHeight])[1];
				let bottomLeft = projection.invert([0, svgHeight]);
				let bottomRight = projection.invert([svgWidth, svgHeight]);

				return svg.selectAll("circle.datapoints")
					.data(search(quadtree, Math.min(bottomLeft[0], topLeft[0]), top, Math.max(bottomRight[0], topRight[0]), bottom), (d) => d);
			}

			function setWorldColorScale() {
				plot_object.world_color_scale.domain(d3.extent(currentData, x => parseInt(x[`UN_${plot_object.currentScenario}`])));
			}

			// TODO: Högra sidan försvinner när man har zoomat in lite.
			function initWorldMapData(worldDataSelection) {
				worldDataSelection.enter().append("circle")
					.attr("r", 3)
					.attr("class", "datapoints")
					.style("fill", (d) => plot_object.world_color_scale(parseInt(d[`UN_${plot_object.currentScenario}`])))
			}

			function focusedDataSelection() {
				// Get data for just the country that is focused (all data available)
				let focusedCountryData = currentCountryMapping[`${focusedCountry}`].reduce((acc, cur) => {
					acc.push(currentData[cur]);
					return acc;
				}, []);

				focused_color_scale.domain(d3.extent(focusedCountryData, x => parseInt(x[`UN_${plot_object.currentScenario}`])));
				return svg.selectAll("circle.datapoints").data(focusedCountryData, (d) => d);
			}

			function initFocusedMapData(focusedDataSelection) {
				// Add focused country data
				focusedDataSelection.enter().append("circle")
					.attr("r", "3")
					.attr("class", "datapoints")
					.attr("transform", (d) => `translate(${projection([d.lng, d.lat])})`)
					.style("fill", (d) => plot_object.world_color_scale(d[`UN_${plot_object.currentScenario}`]))
					.style("display", "inline")
			}

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

			//FIXME:
			// find country object in json
			function getCountryByCode(code) {
				return map_data.filter(
					function(map_data){ return map_data.name == code }
				);
			}
			
			// save the latest zoom before story - after reset set this value again to 0 - kin of a story mode variable
			let scaleBeforeStory = 0;
			// after user clicked any story arrow find country object and navigate to country from story
			function clicked_Story(country){
				if(scaleBeforeStory == 0) {
					scaleBeforeStory=projection.scale()
				}

				// low res map before transition
				init_110map()

				// find country element
				let found = getCountryByCode(country)[0];

				//let p_center = d3.geoCentroid(found)

				// transition
				clicked(found)
			}
			this.clicked_Story = clicked_Story

			function clicked(d, fromStory=false){
				// hide story points before transition
				svg.selectAll("circle").remove()
				// hide story btns if discovery mode
				if (fromStory) {document.getElementById("story-btn-section").style.display = "none";}

				if (activeClick.node() === this) return resetClick();  // zoom out again if click on the same country
				else if (activeClick.node() != null) return null;  // else if we are already zoomed in, do nothing

				focusedCountry = d.name;
				if (focusedCountry == undefined) return null;

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
				
				let end_callback_triggered = false;
				
				let dataSelection = focusedDataSelection();
				
				// Update the map:
				d3.selectAll("path")
					.transition()
					.attrTween("d", zoomRotateFactory(currentRotate, currentScale, clickedRotate, clickedScale))
					.duration(1000)
					.on("end", () => {
						if (!end_callback_triggered) {
							if (fromStory) {
								init_50map(d)
							} else {
								init_50map(d, true)
								
							}							
							end_callback_triggered = true
							d3.select(this).classed("selected", false)
							initFocusedMapData(dataSelection);
							}
						});
						
				// Remove the world map data
				focused = true;
				dataSelection.exit().remove()
			}
				
				
			function resetClick(fromStory=false) {
				activeClick.classed("active", false);
				activeClick = d3.select(null);
				
				init_110map()
				showStory(1, true)
				svg.selectAll("circle").remove()

				let dataSelection = worldDataSelection();
				focused = false;

				let already_triggered = false

				// if reset comes explore mode
				if (!fromStory) {
					d3.selectAll("path")
					.transition()
					.attrTween("d", zoomRotateFactory(clickedRotate, clickedScale, resetRotate, resetScale))
					.duration(1000)
					.on("end", function() {
						if (!already_triggered) {
							initWorldMapData(dataSelection);
							initializeZoom()
							
							already_triggered = true
							document.getElementById("story-btn-section").style.display = "block";
							render()	
						}
					})
				} else {
				// if reset comes from story
					d3.selectAll("path")
					.transition()
					.attrTween("d", zoomRotateFactory(clickedRotate, clickedScale, clickedRotate, scaleBeforeStory))
					.duration(1000)
					.on("end", function() {
						if (!already_triggered) {
							initWorldMapData(dataSelection);
							initializeZoom()
							
							already_triggered = true
							render()	
							scaleBeforeStory = 0
						}
					})
				}
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

			// initializing HD map after zooming in
			function init_50map(country_sel, fromStory=false) {
				// hide tooltip
				countryTooltip.style("opacity", 0)
						.style("display", "none");

				// if zoom comes from story mode or explore mode
				if (!fromStory) {
					svg.selectAll("path").remove().enter()
					.data(map_data_50)
					.enter().append("path")
					.attr("fill-opacity","0.5")
					.attr("fill", function (d){
						if (d.name == country_sel.name) {
							let story = { 
								header: d.name, 
								text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy \
									eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua."}
							showStory_for_country_without_data(story)
							return "grey"
						}
						return "white";
					})
					.attr("d", path)
					.on("click", function() {
						resetClick(false)
					})
				} else {
					svg.selectAll("path").remove().enter()
					.data(map_data_50)
					.enter().append("path")
					.attr("fill", function (d){
						if (d.name == country_sel.name) { 
							return "dimgray"
						}
						return "grey";
					})
					.attr("d", path)
					.on("click", function() {
						resetClick(true)
					})
				}
				drawMarkers()
				render()
			}

			// initializing LOW RES map after zooming out
			function init_110map() {
				svg.selectAll("path").remove().enter()
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
				drawMarkers()

			}

			// Story Markers
			function drawMarkers() {
				const center = [svgWidth/2, svgHeight/2];
				let locations = stories;
                var markers = svg.selectAll("circle.story-markers")
                    .data(locations);

				markers.enter()
					.append('circle')
					.attr("class", "story-markers")
                	.merge(markers)
                    // .attr('cx', d => projection([d.lat, d.lng])[0])
					// .attr('cy', d => projection([d.lat, d.lng])[1])
					.attr('fill', d => {
						const coordinate = [d.lat, d.lng];
                        let gdistance = d3.geoDistance(coordinate, projection.invert(center));
						return gdistance > 1.58 ? 'none' : 'Peru';
                    })
                    .attr('r', 9);

					
				// set them to the front layer
                markers.each(function () {
                    this.parentNode.appendChild(this);
				});
			}
		});

	}
	setScenario(scenario) {
		this.currentScenario = scenario;
		this.update_all();
	}
	switchStory(story) {
		let c = story.country
		this.clicked_Story(story.country)
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
	
	// When the dataset radio buttons are changed: change the dataset
	d3.selectAll(("input[name='radio1']")).on("change", function(){
		plot_object.setDataset(this.value)
	});
	
	d3.selectAll(("input[name='radio2']")).on("change", function(){
		plot_object.setScenario(this.value)
	});

	// Initialize dashboard
	is2050 = false;
	slideIndex = 0;

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
		document.querySelector("input[name='radio2']:checked").dispatchEvent(new Event('change'))  // toggle change event on checked radio button
    } else {
		toggleContainer.style.clipPath = 'inset(0 50% 0 0)';
		scenarioRow.style.visibility = 'collapse';
		scenarioRow.style.opacity = '0';
		scenarioRow.style.transition = 'opacity 0.5s linear';
		scenarioRow.style.transition = 'visibility 0.15s linear';
		plot_object.setScenario("cur");

    }
};





// Functions to display stories
function plusStory(n) {
  showStory(slideIndex += n);
}

function showStory(n, reset=false) {
	if (n > stories.length-1) {slideIndex = 0 }; 
	if (n < 0) {slideIndex = stories.length-1}

	const story = stories[slideIndex];

	document.getElementById("story-header").innerHTML = story.header;
	document.getElementById("story-text").innerHTML = story.text;
	document.getElementById(story.field).checked = true;
	document.getElementById(story.field).dispatchEvent(new Event('change'))  // Trigger the change event on the radio button to make sure that the dataset shifts accordingly
	document.getElementById(story.scenario).checked = true;
	switchYear(story.toggleState);
	
	
	if(!reset) {
		plot_object.switchStory(story)
	}
	else {
		
	}
}

function showStory_for_country_without_data(story) {
	document.getElementById("story-header").innerHTML = story.header;
	document.getElementById("story-text").innerHTML = story.text;
}

