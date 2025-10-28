```javascript
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('cpilotModal');
  const closeBtn = document.getElementById('closeCPilotModal');

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Optional: More interactive functions
  document.getElementById('launchBot').onclick = () => {
    alert("Launching CPilot bot...");
  };

  document.getElementById('viewInsights').onclick = () => {
    alert("Fetching AI trading insights...");
  };
});
```
