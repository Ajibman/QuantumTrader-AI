```js
// core/social/cooperativeManager.js

let cooperativeFund = 0;

function credit(amount) {
  if (amount > 0) {
    cooperativeFund += amount;
    return { status: 'credited', amount, total: cooperativeFund };
  }
  return { status: 'invalid amount' };
}

function getFundBalance() {
  return cooperativeFund;
}

function distributeFunds(members) {
  if (!Array.isArray(members) || members.length === 0 || cooperativeFund <= 0) {
    return { status: 'no distribution', reason: 'Invalid members or zero fund' };
  }

  const share = cooperativeFund / members.length;
  const distribution = members.map(member => ({
    memberId: member.id,
    amount: share
  }));

  cooperativeFund = 0; // Reset after distribution
  return {
    status: 'distributed',
    eachShare: share,
    totalMembers: members.length,
    distribution
  };
}

module.exports = { credit, getFundBalance, distributeFunds };
```

Let me know when to commit or if you want to populate `philanthropyManager.js` next.
