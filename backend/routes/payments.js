const express = require('express');
const store = require('../store');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(store.listPayments(req.query.reservationId));
});

router.post('/', (req, res) => {
  try {
    const payment = store.createPayment(req.body || {});
    res.status(201).json(payment);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

module.exports = router;
