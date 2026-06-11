const express = require('express');
const store = require('../store');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(store.listVessels());
});

router.get('/:id', (req, res) => {
  const vessel = store.getVessel(req.params.id);
  res.json(vessel);
});

router.post('/', (req, res) => {
  const vessel = store.createVessel(req.body || {});
  res.status(201).json(vessel);
});

module.exports = router;
