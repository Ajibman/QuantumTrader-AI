// Unified Practice Dashboard
// Displays TradingFloor, TraderLab, and CPilot outputs simultaneously

document.addEventListener("DOMContentLoaded", () => {

  const tfModule = document.getElementById("tradingfloor");
  const tlModule = document.getElementById("traderlab");
  const cpModule = document.getElementById("cpilot");

  if (!tfModule || !tlModule || !cpModule) return;

  // Create unified dashboard container at the top of body
  let dashboard = document.getElementById("practice-dashboard");
  if (!dashboard) {
    dashboard = document.createElement("div");
    dashboard.id = "practice-dashboard";
    dashboard.style.display = "flex";
    dashboard.style.justifyContent = "space-around";
    dashboard.style.margin = "20px auto";
    dashboard.style.padding = "10px";
    dashboard.style.border = "2px dashed #007acc";
    dashboard.style.borderRadius = "8px";
    dashboard.style.backgroundColor = "#f0f4f8";
    dashboard.style.maxWidth = "95%";
    dashboard.style.flexWrap = "wrap";
    document.body.insertBefore(dashboard, document.body.firstChild);
  }

  // Create individual panels
  function createPanel(title) {
    const panel = document.createElement("div");
    panel.style.flex = "1 1 250px";
    panel.style.margin = "5px";
    panel.style.padding = "10px";
    panel.style.border = "1px solid #ccc";
    panel.style.borderRadius = "6px";
    panel.style.backgroundColor = "#fff";
    panel.style.minHeight = "60px";
    const heading = document.createElement("h4");
    heading.textContent = title;
    heading.style.marginBottom = "6px";
    panel.appendChild(heading);
    return panel;
  }

  const tfPanel = createPanel("TradingFloor Feed");
  const tlPanel = createPanel("TraderLab Result");
  const cpPanel = createPanel("CPilot Hint");

  dashboard.appendChild(tfPanel);
  dashboard.appendChild(tlPanel);
  dashboard.appendChild(cpPanel);

  // Hooks into practice engines
  const tfFeedBox = tfModule.querySelector(".tf-feed") || (() => {
    const box = document.createElement("div");
    box.className = "tf-feed";
    tfModule.appendChild(box);
    return box;
  })();

  const tlResultBox = tlModule.querySelector(".trade-result");
  const cpHintBox = cpModule.querySelector(".cpilot-status");

  // Sync the dashboard panels with module content every 1s
  setInterval(() => {
    tfPanel.innerHTML = `<h4>TradingFloor Feed</h4>${tfFeedBox.textContent || "No data"}`;
    tlPanel.innerHTML = `<h4>TraderLab Result</h4>${tlResultBox.textContent || "No data"}`;
    cpPanel.innerHTML = `<h4>CPilot Hint</h4>${cpHintBox.textContent || "No data"}`;
  }, 1000);

});
