```js
function grantAccess(user) {
  const { isVerified, subscriptionStatus } = user;

  if (!isVerified) {
    return { allowed: false, reason: 'User not verified' };
  }

  if (subscriptionStatus !== 'active') {
    return { allowed: false, reason: 'Inactive subscription' };
  }

  // All clear
  return { allowed: true, message: 'Access granted to TraderLab™' };
}

module.exports = { grantAccess };
```
