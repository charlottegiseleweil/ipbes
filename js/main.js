// loader settings
let opts = {
	lines: 5, // The number of lines to draw
	length: 10, // The length of each line
	width: 10, // The line thickness
	radius: 14, // The radius of the inner circle
	color: 'lime', // #rgb or #rrggbb or array of colors
	speed: 1.9, // Rounds per second
	trail: 40, // Afterglow percentage
	className: 'spinner', // The CSS class to assign to the spinner
  };

whenDocumentLoaded(() => {
	// Initialize dashboard
	is2050 = false;
	slideIndex = 0;
	
	plot_object = new MapPlot('globe-plot');
	charts = {distribution: new DistributionChart(), scenario: new ScenarioChart(), population: new PopulationChart()};
	
	showledgend();
	
	// When the dataset radio buttons are changed: change the dataset
	d3.selectAll(("input[name='radio1']")).on("change", function(){
		plot_object.setDataset(this.value)
	});
	
	d3.selectAll(("input[name='radio2']")).on("change", function(){
		plot_object.setScenario(this.value)
	});

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
		document.getElementById('compare-scenarios').style.visibility = 'hidden';

    }
};

function showledgend(){
	const w = 150, h = 55;
	const pink = d3.hcl(15, 90, 60);
	const yellow = d3.hcl(100, 90, 100);

	let key = d3.select("#legendBar")
		.attr("width", w)
		.attr("height", h);

	let legend = key.append("defs")
		.append("svg:linearGradient")
		.attr("id", "gradient")
		.attr("x1", "0%")
		.attr("y1", "100%")
		.attr("x2", "100%")
		.attr("y2", "100%")
		.attr("spreadMethod", "pad");

	legend.append("stop")
		.attr("offset", "0%")
		.attr("stop-color", yellow)
		.attr("stop-opacity", 1);


	legend.append("stop")
		.attr("offset", "100%")
		.attr("stop-color", pink)
		.attr("stop-opacity", 1);

	key.append("rect")
		.attr("width", w)
		.attr("height", h - 30)
		.style("fill", "url(#gradient)")
		.attr("transform", "translate(0,10)");	
}

function updateCountryName(name) {
	document.getElementById("countryLabel").innerHTML = name;
}

function updateCharts(focusedData,colorScale){
	if(focusedData == 0){
		hideCharts();
	}
	else{
		charts.distribution.show(focusedData, colorScale);
		if(is2050){
			charts.scenario.update(focusedData);
			charts.population.update(focusedData);
			document.getElementById('compare-scenarios').style.visibility = 'visible';
		}
	}
}

function hideCharts(){
	document.getElementById('distribution-chart').style.visibility = 'hidden';
	document.getElementById('compare-scenarios').style.visibility = 'hidden';
}

function showInfo(){
	document.getElementById('greyOut').style.visibility = 'visible';
	document.getElementById('infoBox').style.visibility = 'visible';
}
function closeInfo(){
	document.getElementById('greyOut').style.visibility = 'hidden';
	document.getElementById('infoBox').style.visibility = 'hidden';
}

function backToGlobe(){
	plot_object.resetClick();
	document.getElementById('resetText').style.visibility = 'hidden';
	document.getElementById("countryLabel").style.visibility = 'hidden';
}

			
function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", action);
	} else {
		// `DOMContentLoaded` already fired
		action();
	}
}
