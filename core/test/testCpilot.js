```js
// test/testCPilot.js
const { dispatchMission } = require('../core/cpilot/flightManager');
const mockUser = require('./mockUser'); // or use inline
const mockMission = require('./mockMission');

const result = dispatchMission(mockUser, mockMission);

```
✅ `test/testCPilot.js`

const mockUser = require('./mockUser');
const mockMission = require('./mockMission');
const { dispatchMission } = require('../core/cpilot/flightManager');

const result = dispatchMission(mockUser, mockMission);

console.log("Dispatch Result:", result);
```

---
