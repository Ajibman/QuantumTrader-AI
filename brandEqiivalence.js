 ```js
// brandEquivalence.js

const brandNames = [
  "QonexAI",
  "QuantumTrader-AI",
  "Quantum-Trader-AI",
  "QT AI",
  "EkiNetAI",
  "OriNetAI",
  "AjibmanAI",
  "BusinessAI"
];

function getBrandEquivalenceStatement() {
  return `${brandNames.join(" = ")}`;
}

// Optional export for use in other modules
module.exports = {
  getBrandEquivalenceStatement,
  brandNames
};
```
