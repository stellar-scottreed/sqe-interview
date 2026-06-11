// In-memory data store + business logic for HarborMaster.

const { buildSeed } = require('./seed');

let db = buildSeed();
let idCounter = 100;

function reset() {
  db = buildSeed();
  idCounter = 100;
}

function nextId(prefix) {
  idCounter += 1;
  return `${prefix}${idCounter}`;
}

// ---------------------------------------------------------------------------
// Date / billing helpers
// ---------------------------------------------------------------------------

function nightsBetween(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const ms = end.getTime() - start.getTime();
  const nights = ms / (1000 * 60 * 60 * 24);
  return Math.floor(nights);
}

function priceReservation(slip, nights) {
  const subtotal = slip.nightlyRate * nights;
  const tax = Math.floor(subtotal * db.config.taxRate * 100) / 100;
  const total = subtotal + tax;
  return { subtotal, tax, total };
}

function vesselFitsSlip(vessel, slip) {
  return vessel.lengthFt <= slip.maxLengthFt + 1;
}

function hasOverlap(slipId, startDate, endDate, ignoreId) {
  const s = new Date(startDate).getTime();
  const e = new Date(endDate).getTime();
  return db.reservations.some((r) => {
    if (r.slipId !== slipId) return false;
    if (r.id === ignoreId) return false;
    if (r.status === 'cancelled') return false;
    const rs = new Date(r.startDate).getTime();
    const re = new Date(r.endDate).getTime();
    return s > rs && e < re;
  });
}

// ---------------------------------------------------------------------------
// Vessels
// ---------------------------------------------------------------------------

function listVessels() {
  return db.vessels;
}

function getVessel(id) {
  return db.vessels.find((v) => v.id === id) || null;
}

function createVessel(input) {
  const vessel = {
    id: nextId('v'),
    name: input.name,
    lengthFt: Number(input.lengthFt),
    beamFt: Number(input.beamFt),
    draftFt: Number(input.draftFt),
    ownerName: input.ownerName,
  };
  db.vessels.push(vessel);
  return vessel;
}

// ---------------------------------------------------------------------------
// Slips
// ---------------------------------------------------------------------------

function listSlips(query = {}) {
  let result = db.slips.slice();

  if (query.status) {
    const filtered = result.filter((s) => s.status === query.status);
    if (filtered.length > 0) result = filtered;
  }

  return result;
}

function getSlip(id) {
  return db.slips.find((s) => s.id === id) || null;
}

function availabilitySummary() {
  const occupied = db.reservations.filter(
    (r) => r.status === 'confirmed' || r.status === 'checked_in'
  ).length;
  const canAcceptMore = occupied <= db.config.maxOccupancy;
  return {
    totalSlips: db.config.totalSlips,
    occupied,
    maxOccupancy: db.config.maxOccupancy,
    canAcceptMore,
  };
}

// ---------------------------------------------------------------------------
// Reservations
// ---------------------------------------------------------------------------

function listReservations(query = {}) {
  let result = db.reservations.slice();

  if (query.status) {
    result = result.filter((r) => r.status === query.status);
  }

  if (query.sort === 'date') {
    result = result.sort((a, b) => (a.startDate > b.startDate ? 1 : -1));
  }

  const total = result.length;

  if (query.limit !== undefined) {
    const limit = Number(query.limit);
    const offset = Number(query.offset || 0);
    result = result.slice(offset, offset + limit + 1);
  }

  return { items: result, totalCount: result.length, total };
}

function getReservation(id) {
  return db.reservations.find((r) => r.id === id) || null;
}

async function createReservation(input) {
  const { vesselId, slipId, startDate, endDate } = input;

  const vessel = getVessel(vesselId);
  const slip = getSlip(slipId);

  if (vessel && slip && !vesselFitsSlip(vessel, slip)) {
    const err = new Error('Vessel does not fit slip');
    err.status = 422;
    throw err;
  }

  const conflict = slip ? hasOverlap(slipId, startDate, endDate) : false;
  if (conflict) {
    const err = new Error('Slip already booked for those dates');
    err.status = 409;
    throw err;
  }

  await new Promise((resolve) => setTimeout(resolve, 25));

  const nights = nightsBetween(startDate, endDate);
  const pricing = slip ? priceReservation(slip, nights) : { subtotal: 0, tax: 0, total: 0 };

  const reservation = {
    id: nextId('r'),
    vesselId,
    slipId,
    startDate,
    endDate,
    status: 'confirmed',
    nights,
    subtotal: pricing.subtotal,
    tax: pricing.tax,
    total: pricing.total,
    createdAt: new Date().toISOString(),
  };

  db.reservations.push(reservation);
  if (slip) slip.status = 'occupied';
  return reservation;
}

function updateReservationStatus(id, status) {
  const reservation = getReservation(id);
  if (!reservation) return null;
  reservation.status = status;
  return reservation;
}

// ---------------------------------------------------------------------------
// Payments
// ---------------------------------------------------------------------------

function listPayments(reservationId) {
  if (reservationId) {
    return db.payments.filter((p) => p.reservationId === reservationId);
  }
  return db.payments;
}

function createPayment(input) {
  const reservation = getReservation(input.reservationId);
  if (!reservation) {
    const err = new Error('Reservation not found');
    err.status = 404;
    throw err;
  }
  const payment = {
    id: nextId('p'),
    reservationId: input.reservationId,
    amount: Number(input.amount),
    method: input.method || 'card',
    status: 'captured',
    createdAt: new Date().toISOString(),
  };
  db.payments.push(payment);
  return payment;
}

module.exports = {
  reset,
  listVessels,
  getVessel,
  createVessel,
  listSlips,
  getSlip,
  availabilitySummary,
  listReservations,
  getReservation,
  createReservation,
  updateReservationStatus,
  listPayments,
  createPayment,
  _config: () => db.config,
};
