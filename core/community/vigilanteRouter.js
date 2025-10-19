```js
const express = require('express');
const app = express();

// Community Intelligence Modules
const coopsRouter = require('./core/community/coopsRouter');
const vigilanteRouter = require('./core/community/vigilanteRouter');

// Mounting Routes
app.use('/cooperatives', coopsRouter); // Backbone
app.use('/vigilante', vigilanteRouter); // Dependents
```
