```js
// core/data/userProfile.js

const userConsents = {
  // Example mock data
  'user001': { philanthropy: true, cooperative: false },
  'user002': { philanthropy: true, cooperative: true },
};

function getUserConsent(userId) {
  return Promise.resolve(userConsents[userId] || { philanthropy: false, cooperative: false });
}

module.exports = { getUserConsent };
```
