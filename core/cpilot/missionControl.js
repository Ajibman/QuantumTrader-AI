```js
// core/cpilot/missionControl.js
const { handleMission } = require('./cpilotCore');

function triggerMission(user, missionRequest) {
  const result = handleMission(user, missionRequest);
  return result;
}

module.exports = { triggerMission };
```

// core/cpilot/missionControl.js
const flightManager = require('./flightManager');

function receiveMission(missionData) {
  if (!missionData || !missionData.userId || !missionData.task) {
    return { accepted: false, reason: "Invalid mission data." };
  }

  const missionId = generateMissionId();
  const status = flightManager.assignMission({ ...missionData, missionId });

  return { accepted: true, missionId, status };
}

function generateMissionId() {
  return 'MSS-' + Math.random().toString(36).substring(2, 10).toUpperCase();
}

module.exports = { receiveMission };
```
