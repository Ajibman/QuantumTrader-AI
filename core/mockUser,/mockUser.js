```js

✅ Mock user data (e.g. in `mockUser.js` or inline):*
const mockUser = {
  id: 'user123',
  name: 'Test Pilot',
  credentials: {
    token: 'abc123xyz'
  },
  location: {
    latitude: 6.5244,
    longitude: 3.3792 // Lagos, Nigeria
  }
};
```

✅ Mock mission request:*
```js
const mockMission = {
  id: 'mission001',
  type: 'market-analysis',
  parameters: {
    sector: 'crypto',
    timeframe: '24h'
  },
  requestedBy: 'user123',
  urgency: 'high'
};
```


✅ `test/mockUser.js`
```js
module.exports = {
  id: 'user123',
  name: 'Test Pilot',
  credentials: {
    token: 'abc123xyz'
  },
  location: {
    latitude: 6.5244,
    longitude: 3.3792 // Lagos, Nigeria
  }
};
```
