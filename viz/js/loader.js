function mapsTimeout(seconds) {
  setTimeout(showMaps, seconds);
}

function showMaps() {
  document.getElementsByClassName('loader')[0].style.display = "none";
  document.getElementsByClassName('loader')[1].style.display = "none";

  document.getElementsByClassName('d3-tip')[0].style.display = "block";

  document.getElementById('svg_map1').style.visibility = "visible";
  document.getElementById('svg_map2').style.visibility = "visible";
}

function disappearMaps() {
  document.getElementsByClassName('loader')[0].style.display = "block";
  document.getElementsByClassName('loader')[1].style.display = "block";

  document.getElementsByClassName('d3-tip')[0].style.display = "none";

  document.getElementById('svg_map1').style.visibility = "hidden";
  document.getElementById('svg_map2').style.visibility = "hidden";
}

function disappearSSPMap() {
  document.getElementsByClassName('loader')[1].style.display = "block";
  document.getElementsByClassName('d3-tip')[0].style.display = "none";
  document.getElementById('svg_map1').style.visibility = "hidden";
}
