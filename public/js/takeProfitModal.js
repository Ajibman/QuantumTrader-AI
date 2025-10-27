// /public/js/takeProfitModal.js

function openTakeProfitModal(profitAmount) {
  window.profitAmount = profitAmount;
  document.getElementById('takeProfitModal').style.display = 'block';
  updateBreakdown();
}

function closeModal() {
  document.getElementById('takeProfitModal').style.display = 'none';
}

function updateBreakdown() {
  const p = document.getElementById('philanthropyToggle').checked;
  const c = document.getElementById('cooperativeToggle').checked;
  const total = (p ? 2.5 : 0) + (c ? 2.5 : 0);
  const donation = (window.profitAmount * total) / 100;
  const final = window.profitAmount - donation;

  document.getElementById('breakdown').innerHTML = `
    <p>Profit: 
    window.profitAmount</p>
        <p>Philanthropy:
{p ? (window.profitAmount * 0.025).toFixed(2) : '0.00'}</p>
    <p>Cooperatives: 
    c ? (window.profitAmount * 0.025).toFixed(2) : '0.00'</p>
        <p><strong>Final Payout:
{final.toFixed(2)}</strong></p>
  `;
}
```

function confirmTakeProfit() {
  const p = document.getElementById('philanthropyToggle').checked;

   const c = document.getElementById('cooperativeToggle').checked;

  fetch('/api/social-responsibility/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: window.profitAmount,
      donateToPhilanthropy: p,
      donateToCooperative: c
    })
  }).then(res => res.json())
    .then(data => {
      alert('Take profit processed!');
      closeModal();
    }).catch(err => {
      console.error(err);
      alert('Error submitting.');
    });
}

// Simulated frontend modal interaction
document.getElementById('confirmProfitBtn').addEventListener('click', async () => {
  const userId = 'user001'; // simulate active user
  const profitAmount = 12000;

  // Send to backend route
  await fetch('/api/profit/share', {

method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, profitAmount })
  });

  alert("Profit shared successfully (based on your consent).");
});
```
