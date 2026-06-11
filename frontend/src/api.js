const BASE = '/api';

async function req(path, options) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  return data;
}

export const api = {
  listSlips: (status) => req(`/slips${status ? `?status=${status}` : ''}`),
  getAvailability: () => req('/slips/availability/summary'),
  listVessels: () => req('/vessels'),
  createVessel: (body) => req('/vessels', { method: 'POST', body: JSON.stringify(body) }),
  listReservations: (query = '') => req(`/reservations${query}`),
  getReservation: (id) => req(`/reservations/${id}`),
  createReservation: (body) =>
    req('/reservations', { method: 'POST', body: JSON.stringify(body) }),
  setReservationStatus: (id, status) =>
    req(`/reservations/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  listPayments: (reservationId) => req(`/payments?reservationId=${reservationId}`),
  createPayment: (body) => req('/payments', { method: 'POST', body: JSON.stringify(body) }),
};
