```js
// ripo2/core/cosmicAlignment.js

const corePrinciples = [
  'peace',
  'truth',
  'dignity',
  'well-being',
  'equity',
  'intelligence',
  'life-respect'
];

export function alignWithCosmos(actionPayload) {
  const alignmentScore = evaluateAlignment(actionPayload);

  if (alignmentScore < 0.5) {
    return {
      status: 'rejected',
      reason: 'Misaligned with core principles',
      alignmentScore
    };
  }

  return {
    status: 'approved',
    alignmentScore,
    action: actionPayload
  };
}

function evaluateAlignment(payload) {
  let score = 0;
  const values = JSON.stringify(payload).toLowerCase();

  corePrinciples.forEach((principle) => {
    if (values.includes(principle)) score += 1;
  });

  return score / corePrinciples.length;
}
```

---
