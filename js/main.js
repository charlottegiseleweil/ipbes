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


function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", action);
	} else {
		// `DOMContentLoaded` already fired
		action();
	}
}

whenDocumentLoaded(() => {
	// Initialize dashboard
	is2050 = false;
	slideIndex = 0;
	
	plot_object = new MapPlot('globe-plot');
	// plot object is global, you can inspect it in the dev-console
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


// Functions to display stories
function plusStory(n) {
	slideIndex += n;
	if (slideIndex > stories.length-1){slideIndex = 0;} 
	if (slideIndex < 0) {slideIndex = stories.length-1;}
  showStory(slideIndex);
}

function showStory(slideIndex, welcomeStory=false) {
	
	if(welcomeStory){
		showWelcomeStory();
	}else{
		const story = stories[slideIndex];
		document.getElementById(story.field).checked = true;
		document.getElementById(story.field).dispatchEvent(new Event('change'))  // Trigger the change event on the radio button to make sure that the dataset shifts accordingly
		document.getElementById(story.scenario).checked = true;
		switchYear(story.toggleState);
		plot_object.switchStory(story);
	}
}

function showWelcomeStory(){
    document.getElementById("story-header").innerHTML = "The Earth Won't Scale";
    document.getElementById("story-text").innerHTML = "Discover the map by yourself or follow the &#x2605; to see interesting places and scenarios. You can also use the arrows below.";
}


function showCountryName(name) {
	document.getElementById("story-header").innerHTML = name;
}

function showImpactedPop(population) {
	let pop_cur = 0;
	let pop_ssp1 = 0;
	let pop_ssp3 = 0;
	let pop_ssp5 = 0;

	population.forEach( (d) => {
		
		pop_cur += d.pop_cur;
		pop_ssp1 += d.pop_ssp1 ;
		pop_ssp3 += d.pop_ssp3 ;
		pop_ssp5 += d.pop_ssp5 ;
	});

	document.getElementById("story-text").innerHTML = "<b>Total amount of <br> negatively impacted population: <b> <br> <br>"+
														"<p class=impactedPop id=pop_cur>2015 <br>Current: " + (pop_cur ? numeral(parseInt(pop_cur)).format('0,0') : "0") + "</p><br>"
														+ "<p class=impactedPop id=is2050>2050</p>" 
														+ "<p class=impactedPop id=pop_ssp1>Green Growth: " + (pop_ssp1 ? numeral(parseInt(pop_ssp1)).format('0,0') : "0") + "</p>"
														+ "<p class=impactedPop id=pop_ssp3>Regional Rivalry: " + (pop_ssp3 ? numeral(parseInt(pop_ssp3)).format('0,0') : "0") + "</p>"
														+ "<p class=impactedPop id=pop_ssp5>Fossil Fuel: " + (pop_ssp5 ? numeral(parseInt(pop_ssp5)).format('0,0') : "0") + "</p>";
	
	let selected = document.getElementById(`pop_${plot_object.currentScenario}`).style
	selected.fontWeight = 'bold';
	selected.fontSize = '15px';
	selected.opacity = '1';
	if(`${plot_object.currentScenario}` != 'cur'){
		let selected = document.getElementById('is2050').style
		selected.fontWeight = 'bold';
		selected.fontSize = '15px';
		selected.opacity = '1';
	}
}

function showBarChart(barChart,bins,color){
	document.getElementById('distribution-chart').style.visibility = 'visible';
	barChart.createBarchart(bins,color);
}

function hideBarChart(){
	document.getElementById('distribution-chart').style.visibility = 'hidden';
}

function calculateDistribution(focusedData, thresholds){
	if(focusedData.length == 0){
		return null;
	}
	const distri_data = focusedData.map(x => ({UN: parseFloat(x[`UN_${plot_object.currentScenario}`]),
											   pop: parseFloat(x[`pop_${plot_object.currentScenario}`])}));

	// Accessor function for the objects unmet need property.
	const getUN = d => d.UN;

	
	// Generate a histogram using twenty uniformly-spaced bins.
	return d3.histogram()
		.domain(plot_object.dataExtent)
		.thresholds(thresholds)
		.value(getUN)      // Provide accessor function for histogram generation
		(distri_data);
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
}

			
function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", action);
	} else {
		// `DOMContentLoaded` already fired
		action();
	}
}