const AppRouter = {
  viewContainer: document.getElementById("app-view"),
  basePath: window.location.pathname.replace(/\/$/, ""),

  load(viewName) {
    fetch(`${this.basePath}/views/${viewName}.html`)
      .then(res => {
        if (!res.ok) throw new Error("View not found");
        return res.text();
      })
      .then(html => {
        this.viewContainer.innerHTML = html;
        window.dispatchEvent(new Event("view:loaded"));
      })
      .catch(err => {
        this.viewContainer.innerHTML =
          "<p style='padding:1rem'>Unable to load view.</p>";
        console.error(err);
      });
  }
};
