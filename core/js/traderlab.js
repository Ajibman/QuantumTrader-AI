// core/js/traderlab.js

function initTraderLab() {
  const userId = AppState.user.id;

  // Wallet sync
  const balance = Wallet.getBalance(userId);
  document.getElementById("wallet-balance").textContent = balance;

  const accessDiv = document.getElementById("access-status");
  const startBtn = document.getElementById("start-training");

  if (!AppState.user.traderLab.paid) {
    accessDiv.innerHTML = `<p>Access inactive. Fund wallet to begin.</p>`;
    startBtn.disabled = true;
    return;
  }

  if (!AppState.hasValidTraderLabAccess()) {
    accessDiv.innerHTML = `<p>TraderLab access expired.</p>`;
    startBtn.disabled = true;
    return;
  }

  accessDiv.innerHTML = `<p>TraderLab access active.</p>`;
  startBtn.disabled = false;

  startBtn.onclick = () => {
    alert("TraderLab session started");
    // training flow continues here
  };
}
