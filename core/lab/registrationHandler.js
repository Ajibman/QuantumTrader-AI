```js
// core/lab/registrationHandler.js

const fs = require('fs');
const path = require('path');

const USERS_DB = path.join(__dirname, '../../db/users.json');

function saveUser(userData) {
  const { name, phone, idType, idNumber } = userData;

  if (!name || !phone || !idType || !idNumber) {
    return { success: false, message: 'Incomplete registration data.' };
  }

  let users = [];

  if (fs.existsSync(USERS_DB)) {
    users = JSON.parse(fs.readFileSync(USERS_DB, 'utf-8'));
  }

  const exists = users.find(
    u => u.phone === phone || u.idNumber === idNumber
  );

  if (exists) {
    return { success: false, message: 'User already registered.' };
  }

  const newUser = {
    id: users.length + 1,
    name,
    phone,
    idType,
    idNumber,
    registeredAt: new Date().toISOString()
  };

  users.push(newUser);
  fs.writeFileSync(USERS_DB, JSON.stringify(users, null, 2));

  return { success: true, message: 'Registration successful.', user: newUser };
}

module.exports = { saveUser };
```
