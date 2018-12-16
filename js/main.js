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

