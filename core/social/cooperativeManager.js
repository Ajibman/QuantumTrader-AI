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

// core/social/philanthropyManager.js

let philanthropyFund = 0;
const TRIGGER_AMOUNT = 100_000_000;

function credit(amount) {
  if (amount > 0) {
    philanthropyFund += amount;
    return { status: 'credited', amount, total: philanthropyFund };
  }
  return { status: 'invalid amount' };
}

function getFundBalance() {
  return philanthropyFund;
}

function isEligibleForDisbursement() {
  return philanthropyFund >= TRIGGER_AMOUNT;
}

function prepareDisbursement(ngoList) {
  if (!isEligibleForDisbursement()) {
    return { status: 'not eligible', balance: philanthropyFund };
  }

  if (!Array.isArray(ngoList) || ngoList.length === 0) {
    return { status: 'no NGOs available' };
  }

  const share = philanthropyFund / ngoList.length;
  const distribution = ngoList.map(ngo => ({
    ngoId: ngo.id,
    amount: share,
  }));

  philanthropyFund = 0; // Reset after disbursement
  return {
    status: 'disbursed',
    totalDistributed: share * ngoList.length,
    eachShare: share,
    ngoCount: ngoList.length,
    distribution,
  };
}

module.exports = {
  credit,
  getFundBalance,

isEligibleForDisbursement,
  prepareDisbursement
};
``` 
