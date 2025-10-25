```js
function monitorActivity(userData) {
  // Simulate rule or ML based detection
  if (userData.tradesPerMinute > 10) {
    return {
      alert: true,
      message: "Unusual trading rate detected.",
      recommendation: "Please slow down. System may flag for review."
    };
  }

  return {
    alert: false,
    recommendation: "You're trading within normal range. Keep going!"
  };
}

module.exports = { monitorActivity };
```
