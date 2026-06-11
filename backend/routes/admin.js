const express = require('express');
const store = require('../store');

const router = express.Router();

// Re-seed the in-memory store. Used to restore clean state between candidates.
router.post('/reset', (req, res) => {
  store.reset();
  res.json({ ok: true, message: 'Data reset to seed state' });
});

module.exports = router;
