let info_measurements = {
    UN: "A deficit in water quality regulation can be measured by nitrogen export, the amount not retained by vegetation that therefore enters waterways and drinking water supplies as pollution.",
    pop:  "We use rural populations (within 100 km watersheds) as the population exposed because they are presumably less likely to have water treatment options. ",
    NC: "Nature’s contribution to meeting potential human need is the proportion of total nitrogen pollutant load retained by ecosystems, the pollution avoided.",
    pn: "The human pressure that creates a potential need for it in a given region or watershed is the total amount of pollutant (i.e. nitrogen load) requiring retention by vegetation in that area.",
      
  };

whenDocumentLoaded(() => {
    // Initialize dashboard
    d3.selectAll("#landingpage").attr("class", "hidden");
});

function whenDocumentLoaded(action) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", action);
    } else {
      // `DOMContentLoaded` already fired
      action();
    }
}

function switchMode(mode){
    document.getElementById('info_about_measurments').innerText = info_measurements[mode];
}

