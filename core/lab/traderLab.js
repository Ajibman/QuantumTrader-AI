```js

module.exports = {
  init(app) {
    app.get('/lab/test', (req, res) => {
      res.json({ status: 'TraderLab is active.' });
    });
  }
};
```
