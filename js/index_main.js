whenDocumentLoaded(() => {
  addMenu(1);
});

function whenDocumentLoaded(action) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", action);
    } else {
      // `DOMContentLoaded` already fired
      action();
    }
  }