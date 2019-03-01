function mapsTimeout() {
  setTimeout(showMaps, 4000);
}

function showMaps() {
  document.getElementById("loader-bg").style.display = "none";
  document.getElementById("loader").style.display = "none";
}

function disappearLoader() {
  document.getElementById("loader-bg").style.display = "block";
  document.getElementById("loader").style.display = "block";
}
