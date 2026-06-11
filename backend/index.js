const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/vessels', require('./routes/vessels'));
app.use('/api/slips', require('./routes/slips'));
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/admin', require('./routes/admin'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Serve the built React SPA (single-service deploy). The frontend build is
// copied to ../frontend/dist by the Docker build / `npm run build`.
const distPath = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(distPath));
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) res.status(200).send('HarborMaster API is running. Build the frontend to serve the UI.');
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`HarborMaster listening on port ${PORT}`);
});
