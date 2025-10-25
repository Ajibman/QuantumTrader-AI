```js
// claimData.js

const users = new Map();

function isEligible(user) {
  const today = new Date().toDateString();
  const lastClaim = users.get(user)?.lastClaim;

  return !lastClaim || lastClaim !== today;
}

function claimData(user) {
  if (isEligible(user)) {
    users.set(user, { lastClaim: new Date().toDateString() });
    return {
      success: true,
      message: "500MB data granted. Valid until midnight.",
    };
  } else {
    return {
      success: false,
      message: "You’ve already claimed your 500MB for today.",
    };
  }
}

// Sample test
const user = "user@example.com";
console.log(claimData(user)); // First claim
console.log(claimData(user)); // Second claim
```

This is a *mock version*. For production, we’d:
- Store user records in a database.
- Use phone/email verification.
- Integrate with mobile carriers or data API providers.
