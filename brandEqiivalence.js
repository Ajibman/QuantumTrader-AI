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

*Commit message:*
```
Add brandEquivalence.js for unified name reference across all brand variants of QonexAI
```

Let me know where you'd like it referenced (README, UI, logs, etc).
