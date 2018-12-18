class BarChart{
	
	constructor(){
		// Initialize the barchart
		const svgWidth = 230;
		const svgHeight = 200;
		this.margin = {top: 10, right:30, bottom: 20, left:20};

		this.width = svgWidth - this.margin.left - this.margin.right,
		this.height = svgHeight - this.margin.top - this.margin.bottom;


		this.svg = d3.select('#distribution')
			.attr("width", svgWidth)
			.attr("height", svgHeight);

		this.g = this.svg.append("g")
			.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");	
		

		// Filter to make the bars glow
		//Container for the gradients
		let defs = this.svg.append("defs");

		//Filter for the outside glow
		this.filter = defs.append("filter")
			.attr("id","glow");
		this.filter.append("feGaussianBlur")
			.attr("stdDeviation","1.5")
			.attr("result","coloredBlur");
		let feMerge = this.filter.append("feMerge");
		feMerge.append("feMergeNode")
			.attr("in","coloredBlur");
		feMerge.append("feMergeNode")
			.attr("in","SourceGraphic");
	}
	createBarchart(bins,color){
		const labels = bins.map(x => (x.x0 + x.x1)/2);
		const data = bins.map(x => (x.map(y => y.pop).reduce((a,b)=> a + b,0)));

		const x = d3.scaleLinear().range([0, this.width]);
		const y = d3.scaleBand().range([this.height, 0]);
		x.domain([0, d3.max(data, d => d )]);
		y.domain(data.map((d,i) => labels[i] )).padding(0);

		this.g.selectAll("g")
						.remove()
						.exit()
		// Append x axis
		this.g.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + this.height + ")")
                .call(d3.axisBottom(x).ticks(2).tickSizeInner([-this.height]));
                
		// Tooltip
		let tooltip = d3.select("body").append("div").attr("class", "toolTip");	

		// Add the bars	
		let bars = this.g.selectAll(".bar")
						.remove()
						.exit()
                        .data(data)
                        
		bars.enter().append("rect")
			.attr("class", "bar")
			.attr("x", 0)
			.attr("height", y.bandwidth())
			.attr("y", function(d,i) { return y(labels[i]); })
			.attr("width", function(d) { return x(d); })
			.style("fill", (d,i) => color((bins[i].x0 + bins[i].x1) / 2))
			.style("this.svg.defs.filter", "url(#glow)")	
			.on("mousemove", function(d){
				tooltip
				  .style("left", d3.event.pageX + 10  + "px")
				  .style("top", d3.event.pageY - 20 + "px")
				  .style("display", "inline-block")
				  .html(numeral(parseInt(d)).format('0,0'));
			})
			.on("mouseout",  d => tooltip.style("display", "none"));
    }
}