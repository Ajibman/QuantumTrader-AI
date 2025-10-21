,,,jsll
name: 🧪 QuantumTrader Module Integrity Test

on:
  push:
    paths:
      - 'src/core/modules/**'
      - '.github/workflows/module-check.yml'
  workflow_dispatch:

jobs:
  module-check:
    runs-on: ubuntu-latest

    steps:
      - name: 📥 Checkout Repository
        uses: actions/checkout@v3

      - name: 🧰 Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: 📦 Install Dependencies
        run: npm install

      - name: 🧪 Run Module Activation Test
        run: node test/moduleTest.js

      - name: 📧 Send Test Result Email
        env:
          APP_EMAIL: ${{ secrets.APP_EMAIL }}
          APP_PASSWORD: ${{ secrets.APP_PASSWORD }}
        run: node test/sendTestResultEmail.js

  limport {  
  Module01, Module02, Module03, Module04, Module05,  
  Module06, Module07, Module08, Module09, Module10,  
  Module11, Module12, Module13, Module14, Module15  
} from "../src/core/modules/index.js";  
  
const QTModules = [  
  Module01, Module02, Module03, Module04, Module05,

  Module06, Module07, Module08, Module09, Module10,
  Module11, Module12, Module13, Module14, Module15
];

// Function to test module activation
function testModules() {
  console.log("🔹 QuantumTrader Module Activation Test 🔹");
  QTModules.forEach((module, index) => {
    try {
      if (typeof module.activate === "function") {
        module.activate();
        console.log(`✅ Module${String(index + 1).padStart(2, '0')} activated successfully.`);
      } else {
        console.warn(`⚠️ Module${String(index + 1).padStart(2, '0')} has no activate() method.`);
      }
    } catch (err) {
      console.error(`❌ Module${String(index + 1).padStart(2, '0')} failed activation:`, err.message);
    }
  });
  console.log("🔹 Module Activation Test Complete 🔹");
}

// Run test
testModules();
