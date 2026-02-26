```javascript
document.getElementById('autotrade-btn').addEventListener('click', () => {
  const duration = parseInt(document.getElementById('trade-duration').value, 10);
  
  if (!duration || duration <= 0) {
    return alert('Select a valid trade duration via CPilot before activating AutoTrader.');
  }

  const timestamp = new Date().toISOString();
  const statusBox = document.getElementById('trade-status');
  
  statusBox.innerText = `Trade initiated at timestamp for{duration} seconds. Awaiting execution...`;

  setTimeout(() => {
    const profit = (Math.random() * 100).toFixed(2);
    const completeTime = new Date().toISOString();
    statusBox.innerText = `✅ Trade completed at completeTime. Profit:${profit} routed to wallet.`;

    // Future: Wallet → Bank integration
  }, duration * 1000);
});

