
```js
// test/testCPilot.js
const { dispatchMission } = require('../core/cpilot/flightManager');
const mockUser = require('./mockUser'); // or use inline
const mockMission = require('./mockMission');

const result = dispatchMission(mockUser, mockMission);
