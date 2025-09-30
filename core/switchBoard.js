 ```js
import systemIdentity from "./identity.js";
import { isActivated, timeUntilActivation } from "./activationTimer.js";

function displayStatus() {
  console.log(`🔍 System: systemIdentity.name`);
  console.log(`🌍 Origin:{systemIdentity.origin}`);
  console.log(`⚡ Powered by: systemIdentity.poweredBy`);
  console.log(`🧠 Type:{systemIdentity.type}`);
  console.log(`🕊 Motto: ${systemIdentity.slogan}`);
  console.log("— — — — —");

  if (isActivated()) {
    console.log(`✅ System is ACTIVE.`);
  } else {
    const msLeft = timeUntilActivation();
