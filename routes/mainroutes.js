const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('pages/home', { title: 'Mocho Health Platform' });
});

module.exports = router;
