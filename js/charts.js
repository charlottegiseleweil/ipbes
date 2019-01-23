class DistributionChart{
	
	constructor(){
		// Initialize the barchart
		const svgWidth = 230;
		const svgHeight = 170;
		this.margin = {top: 15, right:60, bottom: 10, left:20};

		this.width = svgWidth - this.margin.left - this.margin.right,
		this.height = svgHeight - this.margin.top - this.margin.bottom;

		this.svg = d3.select('#distribution')
			.attr("width", svgWidth)
			.attr("height", svgHeight);

		this.g = this.svg.append("g")
			.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
		this.labels = {ssp1: "Green Growth", ssp3: "Regional Rivalry", ssp5: "Fossil Fuels", cur: "2015"};	
		
	}
	/*Function to update the bar chart*/
	update(bins,color){
		// Change label on header
		document.getElementById('distri-chart-choosen-scenario').innerHTML = this.labels[`${plot_object.currentScenario}`];
		//Remove old data 
		this.remove();

		//Preprocess bins 
		const labels = bins.selected.map(x => (x.x0 + x.x1)/2);
		const data = bins.selected.map(x => (x.map(y => y.pop).reduce((a,b)=> a + b,0)));
		const data_current = bins.current.map(x => (x.map(y => y.pop).reduce((a,b)=> a + b,0)));

		//Scale axises
		const x = d3.scaleLinear().range([0, this.width]);
		const y = d3.scaleBand().range([this.height, 0]);
		x.domain([0, max(d3.max(data, d => d ),d3.max(data_current,d=>d))]);
		y.domain(data.map((d,i) => labels[i] )).padding(0);

		// Append x axis
		this.g.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + this.height + ")")
                .call(d3.axisBottom(x).ticks(2).tickSizeInner([-this.height]));
                
		// Add the bars	
		let bars = this.g.selectAll(".bar")
						.data(data)
		
		// Append bars for 2015 data
		if(is2050){
			bars.enter().append("rect")
				.attr("class", "bar")
				.attr("x", 0)
				.attr("height", y.bandwidth())
				.attr("y", (d,i) => y(labels[i]))
				.attr("width", (d,i) => x(data_current[i]))
				.attr("stroke-opacity","0.7")
				.style("fill","none")
				.style("stroke-width",2)
				.style("stroke","white");

			bars.enter().append("rect")
				.attr("class", "bar")
				.attr("x", this.width - 10)
				.attr("height", 10)
				.attr("y", - 13)
				.attr("width", 15)
				.attr("stroke-opacity","0.5")
				.style("fill","none")
				.style("stroke-width",1)
				.style("stroke","white");

			this.g.append("g")
				.attr("class", "labelText")
				.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
				.selectAll(".textlabel")
					.data(data)
					.enter()
					.append("text")
					.attr("class", "textlabel")
					.attr("x", this.width + 7)
					.attr("y", -18)
					.text("- 2015");
		}				
		
        // Append bars for selected data             
		bars.enter().append("rect")
			.attr("class", "bar")
			.attr("x", 0)
			.attr("height", y.bandwidth())
			.attr("y", function(d,i) { return y(labels[i]); })
			.attr("width", function(d) { return x(d); })
			.attr("fill-opacity","0.7")
			.style("stroke-opacity","0.9")
			.style("fill", (d,i) => color((bins.selected[i].x0 + bins.selected[i].x1) / 2))
			.style("stroke",(d,i) => color((bins.selected[i].x0 + bins.selected[i].x1) / 2))
			.style("stroke-width",1)

	}
	remove(){
		this.g.selectAll(".bar")
					.remove()
					.exit()
		this.g.selectAll("g")
					.remove()
					.exit()
	}
	show(focusedData, colorScale){
		let bins = this.calculateDistribution(focusedData, colorScale.quantiles());
		this.update(bins,colorScale);
		document.getElementById('distribution-chart').style.visibility = 'visible';
	}

	calculateDistribution(focusedData, thresholds){
		const distri_data_selceted = focusedData.map(x => ({UN: parseFloat(x[`UN_${plot_object.currentScenario}`]),
												   pop: parseFloat(x[`pop_${plot_object.currentScenario}`])}));
		const distri_data_current = focusedData.map(x => ({UN: parseFloat(x[`UN_cur`]),
												   pop: parseFloat(x[`pop_cur`])}));
	
		// Accessor function for the objects unmet need property.
		const getUN = d => d.UN;
	
		// Generate a histogram using twenty uniformly-spaced bins.
		return {"selected":d3.histogram()
				.domain(plot_object.dataExtent)
				.thresholds(thresholds)
				.value(getUN)      // Provide accessor function for histogram generation
				(distri_data_selceted),
				"current":d3.histogram()
				.domain(plot_object.dataExtent)
				.thresholds(thresholds)
				.value(getUN)      // Provide accessor function for histogram generation
				(distri_data_current) };
	}
}
class ScenarioChart{
	
	constructor(){
		// Initialize the barchart
		const svgWidth = 245;
		const svgHeight = 180;
		this.margin = {top: 20, right:2, bottom: 10, left:2};

		this.width = svgWidth - this.margin.left - this.margin.right,
		this.height = svgHeight - this.margin.top - this.margin.bottom;

		this.svg = d3.select('#scenario-comparison-svg')
			.attr("width", svgWidth)
			.attr("height", svgHeight);

		this.g = this.svg.append("g")
			.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
		
		this.labels = ["Green Growth","Regional Rivalry","Fossil Fuels"];
	}
	/*Function to update the bar chart*/
	update(focusedData){
		// Remove old data
		this.remove();

		// calculate changes
		const data = this.calculateChangeInUnmetNeed(focusedData)
		// Scale axis
		const y = d3.scaleLinear()
			.range([this.height, 0])
			.domain([min(d3.min(data, d => d ),0), max(0,d3.max(data, d => d ))]);
		const x = d3.scaleBand().range([0,this.width]);
		x.domain(data.map((d,i) => this.labels[i] )).padding(0.1);
		
		// Add new bars
		this.g.selectAll(".bar")
			.data(data)
			.enter().append("rect")
				.attr("class", d => d < 0 ? "bar negative" : "bar positive")
				.attr("y", d => d < 0 ? y(0) : y(d))
				.attr("x", (d,i) => x(this.labels[i]))
				.attr("width", d => x.bandwidth())
				.attr("height", d => Math.abs(y(d) - y(0)))

		const paddingTop = Math.abs(y(max(0,d3.max(data, d => d ))) - y(0))
		const xAxis = d3.axisBottom(d3.scaleLinear().range([0, this.width-1])).ticks(0)
		this.g.append("g")
			.attr("transform", "translate(" + this.margin.left + "," + paddingTop + ")")
			.attr("class", "X axis")
			.call(xAxis);
		
		// Append values 
		this.g.append("g")
			.attr("class", "labelText")
			.attr("transform", "translate(" + this.margin.left + ",0)")
			.selectAll(".textlabel")
			.data(data)
			.enter()
			.append("text")
			.attr("class", "textlabel")
			.attr("x", (d,i) => x(this.labels[i]) + x.bandwidth()/2)
			.attr("y", d => d > 0 ? y(d) + 13 : y(d) - 5)
			.text(d => d.toFixed(0) + "%");
		
		// Append scenario labels
		this.g.append("g")
			.attr("class", "labelText")
			.selectAll(".textlabel")
			.data(data)
			.enter()
			.append("text")
			.attr("class", "textlabel")
			.attr("x", (d,i) => x(this.labels[i]) + x.bandwidth()/2)
			.attr("y", -5)
			.style("width",x.bandwidth())
			.style("height",20)
			.text((d,i) => this.labels[i]);
	}
	remove(){
		this.g.selectAll(".bar.positive")
						.remove()
						.exit()
		this.g.selectAll(".bar.negative")
						.remove()
						.exit()
		this.g.selectAll("g")
						.remove()
						.exit()
	}

	calculateChangeInUnmetNeed(focusedData){
		const UN2015 = focusedData.map(x=> parseFloat(x['UN_cur'])).reduce((a, b) => a + b, 0);
		const UNssp1 = focusedData.map(x=> parseFloat(x['UN_ssp1'])).reduce((a, b) => a + b, 0);
		const UNssp3 = focusedData.map(x=> parseFloat(x['UN_ssp3'])).reduce((a, b) => a + b, 0);
		const UNssp5 = focusedData.map(x=> parseFloat(x['UN_ssp5'])).reduce((a, b) => a + b, 0);
		return [(UNssp1/UN2015 - 1)*100, (UNssp3/UN2015 -1)*100, (UNssp5/UN2015 -1)*100];
	}
}
class PopulationChart{
	constructor(){

	}
	update(data){
		let population = data.map(x => ({pop_cur: parseFloat(x.pop_cur),
			pop_ssp1: parseFloat(x.pop_ssp1), 
			pop_ssp3: parseFloat(x.pop_ssp3), 
			pop_ssp5: parseFloat(x.pop_ssp5), }));
		this.show(population);
	}
	
	show(population){
		let pop_cur = 0, 
			pop_ssp1 = 0, 
			pop_ssp3 = 0, 
			pop_ssp5 = 0;

		population.forEach( (d) => {
			pop_cur += d.pop_cur;
			pop_ssp1 += d.pop_ssp1 ;
			pop_ssp3 += d.pop_ssp3 ;
			pop_ssp5 += d.pop_ssp5 ;
		});

		document.getElementById("population-chart-value-cur").innerHTML = pop_cur ? round(pop_cur) : "0";
		document.getElementById("population-chart-value-ssp1").innerHTML = pop_ssp1 ? round(pop_ssp1) : "0";
		document.getElementById("population-chart-value-ssp3").innerHTML = pop_ssp3 ? round(pop_ssp3) : "0";
		document.getElementById("population-chart-value-ssp5").innerHTML = pop_ssp5 ? round(pop_ssp5): "0";

	}
}

function max(a,b){
	return a > b? a:b;
}
function min(a,b){
	return a > b? b:a;
}
function round(value){
	return numeral(value > 10000 ? Math.round(value/1000)*1000 : Math.round(value/100)*100).format('0,0');
}
