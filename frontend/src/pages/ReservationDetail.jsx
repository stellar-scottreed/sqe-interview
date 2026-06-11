import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';
import { money, displayDate } from '../format';

export default function ReservationDetail() {
  const { id } = useParams();
  const [reservation, setReservation] = useState(null);
  const [payments, setPayments] = useState([]);
  const [amount, setAmount] = useState('');

  function load() {
    api.getReservation(id).then(setReservation);
    api.listPayments(id).then(setPayments);
  }
  useEffect(load, [id]);

  async function pay(e) {
    e.preventDefault();
    await api.createPayment({ reservationId: id, amount: Number(amount), method: 'card' });
    setAmount('');
    api.listPayments(id).then(setPayments);
  }

  async function setStatus(status) {
    await api.setReservationStatus(id, status);
    load();
  }

  if (!reservation) return <p className="muted">Loading reservation…</p>;

  const paid = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div>
      <h2>Reservation {reservation.id}</h2>
      <div className="card">
        <div className="row">
          <div><label>Slip</label>{reservation.slipId}</div>
          <div><label>Vessel</label>{reservation.vesselId}</div>
          <div><label>Status</label>{reservation.status}</div>
        </div>
        <div className="row">
          <div><label>Dates</label>{displayDate(reservation.startDate)} → {displayDate(reservation.endDate)}</div>
          <div><label>Nights</label>{reservation.nights}</div>
        </div>
        <div className="row">
          <div><label>Subtotal</label>{money(reservation.subtotal)}</div>
          <div><label>Tax</label>{money(reservation.tax)}</div>
          <div><label>Total</label>{money(reservation.total)}</div>
        </div>
        <div style={{ marginTop: 12 }} className="row">
          <div><button onClick={() => setStatus('checked_in')}>Check in</button></div>
          <div><button onClick={() => setStatus('checked_out')}>Check out</button></div>
          <div><button onClick={() => setStatus('cancelled')}>Cancel</button></div>
        </div>
      </div>

      <div className="card">
        <h3>Payments</h3>
        <p className="muted">Paid so far: {money(paid)} of {money(reservation.total)}</p>
        <form className="row" onSubmit={pay}>
          <div>
            <label>Amount</label>
            <input value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div style={{ alignSelf: 'flex-end' }}>
            <button type="submit">Take Payment</button>
          </div>
        </form>
        <table style={{ marginTop: 12 }}>
          <thead>
            <tr><th>ID</th><th>Amount</th><th>Method</th><th>Status</th></tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{money(p.amount)}</td>
                <td>{p.method}</td>
                <td>{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
