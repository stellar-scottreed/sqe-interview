const express = require('express');
const store = require('../store');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(store.listReservations(req.query));
});

router.get('/:id', (req, res) => {
  const reservation = store.getReservation(req.params.id);
  res.json(reservation);
});

router.post('/', async (req, res) => {
  try {
    const reservation = await store.createReservation(req.body || {});
    res.status(201).json(reservation);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.patch('/:id/status', (req, res) => {
  const updated = store.updateReservationStatus(req.params.id, (req.body || {}).status);
  if (!updated) return res.status(404).json({ error: 'Reservation not found' });
  res.json(updated);
});

module.exports = router;
