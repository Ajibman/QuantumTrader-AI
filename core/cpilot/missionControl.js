```js
// core/cpilot/missionControl.js
const { handleMission } = require('./cpilotCore');

function triggerMission(user, missionRequest) {
  const result = handleMission(user, missionRequest);
  return result;
}

module.exports = { triggerMission };
```


