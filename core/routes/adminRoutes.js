```js
const express = require('express');
const router = express.Router();
const dashboardController = require('../core/admin/dashboardController');

router.get('/admin/dashboard', (req, res) => {
  const data = dashboardController.getDashboardData();
  res.render('admin/dashboard', data);
});

router.post('/admin/update-status', (req, res) => {
  const { ngoId, status } = req.body;
  const result = dashboardController.updateNGOStatus(ngoId, status);
  res.json(result);
});
