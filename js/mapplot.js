class MapPlot {
	constructor(svg_element_id) {
        this.svg = d3.select('#' + svg_element_id);
        
		// may be useful for calculating scales
		const svg_viewbox = this.svg.node().viewBox.animVal;
		this.svgWidth = svg_viewbox.width;
        this.svgHeight = svg_viewbox.height;
        
        // initialize canvas layer and heatmap
        this.canvasLayer = d3.select('#map-content').append('canvas').attr('id', 'heatmap')
            .attr('width', this.svgWidth).attr('height', this.svgHeight);
        this.canvas = this.canvasLayer.node();
        this.context = this.canvas.getContext("2d");
        this.heat = simpleheat(this.canvas);
        this.heat.radius(5, 5);
        
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

		const country_mapping_ndr_promise = d3.json("data/preprocessed_data/updated_data/ndr_countries.json")
		const country_mapping_poll_promise = d3.json("data/preprocessed_data/updated_data/poll_countries.json")
		const country_mapping_cv_promise = d3.json("data/preprocessed_data/updated_data/cv_countries.json")

		const ndr_promise = d3.csv("data/preprocessed_data/updated_data/ndr_table_preprocessed.csv").then(data => data)
		const poll_promise = d3.csv("data/preprocessed_data/updated_data/poll_table_preprocessed.csv").then(data => data)
		const cv_promise = d3.csv("data/preprocessed_data/updated_data/cv_table_preprocessed.csv").then(data => data)

		const country_label_promise = d3.tsv("data/map_data/world-110m-country-names.tsv").then(data => data)

		Promise.all([map_promise_110, map_promise_50, country_label_promise, ndr_promise, 
					poll_promise, cv_promise, country_mapping_ndr_promise, country_mapping_poll_promise, country_mapping_cv_promise]).then((results) => {

			this.map_data = results[0];  // 110m map
			this.map_data_50 = results[1];  // 50m map
			const country_label_data = results[2];  // country label names

			this.ndr_data = results[3];  // data
			this.poll_data = results[4];
			this.cv_data = results[5];

			this.ndr_country_mapping = results[6];  // mapping between country name and data points
			this.poll_country_mapping = results[7];  
			this.cv_country_mapping = results[8]; 
			
			this.currentData = this.cv_data;
            this.currentCountryMapping = this.cv_country_mapping

			
			// add country name labels to map_data objects
			this.map_data.forEach(x => Object.assign(x, country_label_data.find(country_label => country_label['id'] == x['id'])))
			this.map_data_50.forEach(x => Object.assign(x, country_label_data.find(country_label => country_label['id'] == x['id'])))

			const center_x = this.svgWidth/2;
			const center_y = this.svgHeight/2;	
			const scale = 380;
			this.scaleExtent = [0.8, 5];
			this.resetScale = scale;
			this.resetRotate = [0, 0];
			this.activeClick = d3.select(null)
			this.clickedRotate;
			this.clickedScale;
			this.focused = false;
			this.focusedCountry = "";
            this.currentDatasetName = "cv";
            this.modes = ["UN", "NC", "pop"]
            this.currentModeName = "UN";
			// the current scenario, either 'c', '1', '3' or '5'
            this.scenarios = ["c", "1", "3", "5"];
            this.currentScenario = "c";

            // set current max and min for the data
			this.dataExtent;

            
            // initialize versor vectors
            this.v0; 
            this.r0; 
            this.q0;
            
            this.setCurrentColorScale();
            
            // let r = this.currentColorScale.range();
            // this.heatGradientDict = {0: r}

			this.projection = d3.geoOrthographic()
				.rotate([0, 0])
				.scale(scale)
				.translate([center_x, center_y]);

			this.path = d3.geoPath(this.projection);

			this.countryTooltip = d3.select("body").append("div").attr("class", "countryTooltip");

            // the main globe object
            let that = this;
			this.svg.selectAll("path")
			 	.data(this.map_data)
                .enter().append("path")
                .attr("class", "globe")
				.attr("fill", "grey")
				.attr("d", this.path)
				.on("mouseover", function(d) {
					that.countryTooltip.text(d.name)
						.style("left", (d3.event.pageX + 7) + "px")
						.style("top", (d3.event.pageY - 15) + "px")
						.style("display", "block")
						.style("opacity", 1);
					d3.select(this).classed("selected", true)
				})
				.on("mouseout", function(d) {
					that.countryTooltip.style("opacity", 0)
						.style("display", "none");
					d3.select(this).classed("selected", false)	
				})
				.on("click", this.clicked())
            
			this.initializeZoom();
            this.update_all();

            d3.selectAll("#landingpage").attr("class", "hidden");           
            d3.select("#map-content").style("display","block")
		});

    }
    
    render() {
        // Update country borders
        this.svg.selectAll("path.globe").attr('d', this.path)

        if (!this.focused) {
            let data = this.worldDataSelection();

            if (this.currentDatasetName === "cv") {  // render regular dots for cv data, removing (if existing) heatmap
                // remove the heatmap (if it exists)
                this.heat.clear();
                this.heat.draw();

                let dataSelection = this.svg.selectAll("circle.datapoints").data(data, (d) => d);
                dataSelection.exit().remove();
                this.initWorldMapData(dataSelection);
            } else {  // render heatmap for ndr and poll, removing (if existing) cv dots
                this.svg.selectAll("circle.datapoints").remove()

                this.heat.data(this.formatDataIntoHeatList(data))

                // draw into canvas, with minimum opacity threshold
                this.heat.draw(0.05);
            }            
        }

        // Update positions of circles 
        this.svg.selectAll("circle")
            .attr("transform", (d) => `translate(${this.projection([d.lng, d.lat])})`)
            // make the data dots disappear when they are on the other side of the globe.
            .style("display", (d) => {  
                let globeDistance = d3.geoDistance([d.lng, d.lat], this.projection.invert([this.svgWidth/2, this.svgHeight/2]));
                return (globeDistance > 1.42) ? 'none' : 'inline';
            })
    }
    
    initializeZoom() {
        // Call the zoom on the svg instead of the path elements to make sure that it is possible to drag 
        // everywhere on the globe (and not just on land)
        let that = this;
        this.svg.call(d3.zoom()  
            .on("start", function() {
                that.v0 = versor.cartesian(that.projection.invert(d3.mouse(this)));
                that.r0 = that.projection.rotate();
                that.q0 = versor(that.r0);
            })
            .on('zoom', function() {
                let scaleFactor = d3.event.transform.k * (that.svgHeight - 10) / 2;
                that.projection.scale(scaleFactor);

                // Adjust the scale of the blurred points
                let heatScale = scaleFactor / 40;
                //heatScale = 10;
                that.heat.radius(heatScale - 5, heatScale - 5)
            
                let v1 = versor.cartesian(that.projection.rotate(that.r0).invert(d3.mouse(this)));
                let q1 = versor.multiply(that.q0, versor.delta(that.v0, v1));
                let r1 = versor.rotation(q1);
                r1[2] = 0;  // Don't rotate Z axis
                that.projection.rotate(r1);
                that.render()
            })
            .scaleExtent(this.scaleExtent));
    }
    
        
    setupQuadtree() {
        let quadtree = d3.quadtree()
            .x((d) => d.lng)
            .y((d) => d.lat)
            .addAll(this.currentData);
        return quadtree;
    }

    updateNodes(quadtree) {
        quadtree.visit(function (node, x1, y1, x2, y2) {
            node.width = x2 - x1;
        });
    }
    
    // Find the nodes within the specified rectangle.
    search(quadtree, x0, y0, x3, y3) {
        let pts = [];
        let subPixel = false;
        let subPts = [];
        let scaleFactor;
        switch (this.currentDatasetName) {
            case 'ndr': 
                scaleFactor = 1;  // let scalefactor be 1 in ndr and poll case, since we want to show every point here
                break;
            case 'poll':
                scaleFactor = 1;
                break;
            case 'cv':
                scaleFactor = 0.0008;
        }

        let nodeScale = this.projection.scale() * scaleFactor;
        let counter = 0;
        let counter2 = 0; 
        
        let mapCenter = this.projection.invert([this.svgWidth/2, this.svgHeight/2]);

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
                    let indexOfMax = d3.scan(subPts, (a, b) => parseFloat(b[`${plot_object.currentModeName}_${plot_object.currentScenario}`])- parseFloat(a[`${plot_object.currentModeName}_${plot_object.currentScenario}`]));
                    pts.push(subPts[indexOfMax]); // add only the point with the highest data value
                    counter += subPts.length - 1;
                    subPts = [];
                }
                subPixel = false;
            }

            if ((p) && d3.geoDistance([p.lng, p.lat], mapCenter) < 1.57) {  
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
        return pts;

    }

    // Updates all data using the currentData variable
    update_all(scenario_change=false) {
        this.quadtree = this.setupQuadtree();
        this.updateNodes(this.quadtree);
        if (this.focused) {
            let focusedData = this.focusedData();
            this.svg.selectAll("circle").remove();
            this.heat.clear();
            this.heat.draw();
            if (!scenario_change) this.setCurrentColorScale();
            this.initFocusedMapData(focusedData);
            updateCharts(focusedData,this.currentColorScale)

        } else {
            if (!scenario_change) this.setCurrentColorScale();
            this.render();
        }
    }

    worldDataSelection() {
        let topLeft = this.projection.invert([0, 0]);
        let topRight = this.projection.invert([this.svgWidth, 0]);
        let top = this.projection.invert([this.svgWidth/2, 0])[1];
        let bottom = this.projection.invert([this.svgWidth/2, this.svgHeight])[1];
        let bottomLeft = this.projection.invert([0, this.svgHeight]);
        let bottomRight =this. projection.invert([this.svgWidth, this.svgHeight]);

        return this.search(this.quadtree, Math.min(bottomLeft[0], topLeft[0]), top, Math.max(bottomRight[0], topRight[0]), bottom);
    }

    setCurrentColorScale() {
        let hcl = d3.interpolateHcl(colorSchema[this.currentModeName][0], colorSchema[this.currentModeName][1]);
        this.currentColorScale = d3.scaleQuantile()
            .range(d3.quantize(hcl, 7));

        // get the extents for the data of the 4 different scenarios
        let extents = this.scenarios.flatMap((scenario) => d3.extent(this.currentData, x => parseFloat(x[`${this.currentModeName}_${scenario}`])))
        // set the domain to the extent (min and max) of the 4 extents
        this.dataExtent = d3.extent(extents);
        // Use the ${this.currentModeName}_cur scenario as the domain, but add the dataExtent points as well to include the outliers
        this.currentColorScale.domain(this.currentData.map(x => parseFloat(x[`${this.currentModeName}_cur`])).concat(this.dataExtent));

        // Adjust the colors for the heatmap gradient
        let r = this.currentColorScale.range();

        // Use the last element in the quantiles as the heat max instead of the max of the whole data, to avoid
        // letting outliers have to big influence
        this.heat.max(this.currentColorScale.quantiles().slice(-1)[0]);

        this.heatGradDict = {};
        r.forEach((color, i) => this.heatGradDict[(i)/6] = color)
        this.heat.gradient(this.heatGradDict)


    }

    initWorldMapData(worldDataSelection) {
        let that = this;
        worldDataSelection.enter().append("circle")
            .attr("r", 3)
            .attr("class", "datapoints")
            .style("fill", (d) => this.currentColorScale(parseFloat(d[`${this.currentModeName}_${this.currentScenario}`])))
    }

    focusedData() {
        // Get data for just the country that is focused (all data available)
        return this.currentCountryMapping[`${this.focusedCountry}`].reduce((acc, cur) => {
            acc.push(this.currentData[cur]);
            return acc;
        }, [])
    }


    initFocusedMapData(focusedData) {
        if (this.currentDatasetName === "cv") {
            // Add focused country data
            let focusedDataSelection = this.svg.selectAll("circle.datapoints").data(focusedData, (d) => d);
            focusedDataSelection.enter().append("circle")
                .attr("r", "3")
                .attr("class", "datapoints")
                .attr("transform", (d) => `translate(${this.projection([d.lng, d.lat])})`)
                .style("fill", (d) => this.currentColorScale(d[`${this.currentModeName}_${this.currentScenario}`]))
                .style("display", "inline")
        } else {
            this.heat.data(this.formatDataIntoHeatList(focusedData));
            this.heat.draw();
        }
    }

    formatDataIntoHeatList(data) {
        return data.map(d => {let list = this.projection([d.lng, d.lat]);
            list.push(parseFloat(d[`${this.currentModeName}_${this.currentScenario}`]));
            return list;
        })
    }

    clicked(that=this) {
        return function(d) {
            // hide points or heat map before transition
            that.svg.selectAll("circle").remove();
            that.heat.clear();
            that.heat.draw();

            if (that.activeClick.node() === this) return that.resetClick();  // zoom out again if click on the same country
            else if (that.activeClick.node() != null) return null;  // else if we are already zoomed in, do nothing

            that.focusedCountry = d.name;
            if (that.focusedCountry == undefined) return null;
            
            // Don't allow clicks during transition
            d3.select(".wrapper").style("pointer-events", "none")

            that.activeClick.classed("active", false);
            that.activeClick = d3.select(this).classed("active", true);
            
            that.svg.on('.zoom', null).on('.start', null);  // disable zoom and drag while focused on a country

            let currentRotate = that.projection.rotate();
            let currentScale = that.projection.scale();
            that.resetRotate = currentRotate;
            that.resetScale = currentScale

            let p_center = d3.geoCentroid(d)
            
            that.projection.rotate([-p_center[0], -p_center[1]]);
            that.path.projection(that.projection);
            
            // calculate the scale and translate required:
            let b = that.path.bounds(d);
            that.clickedScale = currentScale * 1.5 / Math.max((b[1][0] - b[0][0]) / (that.svgWidth/2), (b[1][1] - b[0][1]) / (that.svgHeight/2));
            that.clickedRotate = that.projection.rotate();
            
            let end_callback_triggered = false;
            
            let focusedData = that.focusedData();
            

            // Update the map:
            d3.selectAll("path.globe")
                .transition()
                .attrTween("d", that.zoomRotateFactory(currentRotate, currentScale, that.clickedRotate, that.clickedScale))
                .duration(1000)
                .on("end", () => {
                    if (!end_callback_triggered) {
                        // Adjust the scale of the blurred points
                        let heatScale = that.clickedScale / 40;
                        that.heat.radius(heatScale - 5, heatScale - 5)

                        that.init_50map(d)						
                        end_callback_triggered = true
                        d3.select(this).classed("selected", false)
                        that.initFocusedMapData(focusedData);
                        // Allow clicks after transition is done
                        d3.select(".wrapper").style("pointer-events", "all")
                        }
                    });
                    
            // Remove the world map data
            that.focused = true;
            // dataSelection.exit().remove()

            // update charts
            updateCharts(that.focusedData(),that.currentColorScale)
        
            // change country name
            updateCountryName(d.name);

            // display reset button and country name
            document.getElementById('resetText').style.visibility = 'visible';
            document.getElementById("countryLabel").style.visibility = 'visible';
        }
    }

    resetClick() {
        this.activeClick.classed("active", false);
        this.activeClick = d3.select(null);

        // Don't allow clicks during transition
        d3.select(".wrapper").style("pointer-events", "none")
        
        this.init_110map();
        
        hideCharts();
        this.focused = false;

        let already_triggered = false;
        this.svg.selectAll("circle").remove();
        this.heat.clear();
        this.heat.draw();
        
        d3.selectAll("path.globe")
        .transition()
        .attrTween("d", this.zoomRotateFactory(this.clickedRotate, this.clickedScale, this.resetRotate, this.resetScale))
        .duration(1000)
        .on("end", () => {
            if (!already_triggered) {
                // Adjust the scale of the blurred points
                let heatScale = this.resetScale / 40;
                this.heat.radius(heatScale - 5, heatScale - 5)
                this.initializeZoom();
                
                already_triggered = true;
                this.render()	
                // Allow clicks after transition is done
                d3.select(".wrapper").style("pointer-events", "all")
            }
        })
        
        // Remove reset button and country label
        document.getElementById('resetText').style.visibility = 'hidden';
        document.getElementById("countryLabel").style.visibility = 'hidden';
        
    }

    zoomRotateFactory(currRot, currScale, nexRot, nexScale, that=this) {
        return (d) => {
            let r = d3.interpolate(currRot, nexRot);
            let s = d3.interpolate(currScale, nexScale);
                return function(t) {
                    that.projection
                        .rotate(r(t))
                        .scale(s(t));
                that.path.projection(that.projection);
                if (that.path(d) == null) return ""; else return that.path(d);
                }
            }
    }
    
    // initializing HD map after zooming in
    init_50map(country_sel) {
        // hide tooltip
        this.countryTooltip.style("opacity", 0)
                .style("display", "none");

        
        this.svg.selectAll("path.globe").remove().enter()
            .data(this.map_data_50)
            .enter().append("path")
            .attr("class", "globe")
            .attr("fill-opacity","0.5")
            .attr("fill", function (d){
                if (d.name == country_sel.name) {
                    return "grey"
                }
                return "white";
            })
            .attr("d", this.path)
            .on("click", () => {
                this.resetClick(false)
            })
    
        this.render()
    }

    // initializing LOW RES map after zooming out
    init_110map() {
        let that = this;
        this.svg.selectAll("path.globe").remove().enter()
            .data(this.map_data)
            .enter().append("path")
            .attr("class", "globe")
            .attr("fill", "grey")
            .attr("d", this.path)
            .on("click", this.clicked())
            .on("mouseover", function(d){
                that.countryTooltip.text(d.name)
                    .style("left", (d3.event.pageX + 7) + "px")
                    .style("top", (d3.event.pageY - 15) + "px")
                    .style("display", "block")
                    .style("opacity", 1);
                d3.select(this).classed("selected", true)
            })
            .on("mouseout", function(d){
                that.countryTooltip.style("opacity", 0)
                    .style("display", "none");
                d3.select(this).classed("selected", false)
            })
    }

    // find country object in json
    getCountryByCode(code) {
        return this.map_data.filter(
            function(map_data){ return map_data.name == code }
        );
    }
    
    setDataset(dataset) {
        this.currentDatasetName = dataset;
        switch (this.currentDatasetName) {
            case 'ndr': 
                this.currentData = this.ndr_data;
                this.currentCountryMapping = this.ndr_country_mapping;
                break;
            case 'poll':
                this.currentData = this.poll_data;
                this.currentCountryMapping = this.poll_country_mapping;
                break;
            case 'cv':  
                this.currentData = this.cv_data;
                this.currentCountryMapping = this.cv_country_mapping;
                break; 
            
        }
        this.update_all();
        // change labels depending on dataset
        updateLabels(`${this.currentDatasetName}`,`${this.currentModeName}`);
    }
    
    setScenario(scenario) {
        this.currentScenario = scenario;
        this.update_all(true);
    }

    setMode(mode) {
        this.currentModeName = mode;
        this.update_all();
    }
    
}