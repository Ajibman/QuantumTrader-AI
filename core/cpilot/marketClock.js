```js
// core/cpilot/marketClock.js

function isForexMarketOpen() {
  const now = new Date();
  const day = now.getUTCDay(); // 0 = Sunday, 6 = Saturday
  const hour = now.getUTCHours();

  if (day === 5 && hour >= 22) return false; // Friday 10PM UTC onwards
  if (day === 6) return false;               // Saturday
  if (day === 0 && hour < 22) return false;  // Sunday before 10PM UTC
  return true;
}

module.exports = { isForexMarketOpen };
```
