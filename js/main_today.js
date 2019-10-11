whenDocumentLoaded(() => {
  addMenu(1);
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

  function removeOverlay(){
    document.getElementById("new_user_overlay").remove();
  }