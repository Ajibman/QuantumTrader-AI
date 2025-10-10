```js
function calculateDistance(loc1, loc2) {
  const toRad = (value) => (value * Math.PI) / 180;

  const R = 6371e3; // Earth's radius in meters
  const lat1 = toRad(loc1.latitude);
  const lat2 = toRad(loc2.latitude);
  const deltaLat = toRad(loc2.latitude - loc1.latitude);
  const deltaLon = toRad(loc2.longitude - loc1.longitude);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance; // in meters
}
```
