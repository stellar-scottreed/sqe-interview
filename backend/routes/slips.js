const express = require('express');
const store = require('../store');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(store.listSlips(req.query));
});

router.get('/availability/summary', (req, res) => {
  res.json(store.availabilitySummary());
});

router.get('/:id', (req, res) => {
  const slip = store.getSlip(req.params.id);
  if (!slip) return res.status(404).json({ error: 'Slip not found' });
  res.json(slip);
});

module.exports = router;
