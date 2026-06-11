import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { money, displayDate } from '../format';

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [vessels, setVessels] = useState([]);
  const [slips, setSlips] = useState([]);
  const [form, setForm] = useState({ vesselId: '', slipId: '', startDate: '', endDate: '' });
  const [error, setError] = useState(null);

  function load() {
    api.listReservations().then((r) => setReservations(r.items || r));
    api.listVessels().then(setVessels);
    api.listSlips().then(setSlips);
  }
  useEffect(load, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError(null);
    const result = await api.createReservation(form);
    if (result && result.error) {
      setError(result.error);
      return;
    }
    api.listReservations().then((r) => setReservations(r.items || r));
    setForm({ vesselId: '', slipId: '', startDate: '', endDate: '' });
  }

  return (
    <div>
      <h2>Reservations</h2>
      <form className="card" onSubmit={submit}>
        {error && <p className="error">{error}</p>}
        <div className="row">
          <div>
            <label>Vessel</label>
            <select value={form.vesselId} onChange={(e) => update('vesselId', e.target.value)}>
              <option value="">Select vessel…</option>
              {vessels.map((v) => (
                <option key={v.id} value={v.id}>{v.name} ({v.lengthFt}ft)</option>
              ))}
            </select>
          </div>
          <div>
            <label>Slip</label>
            <select value={form.slipId} onChange={(e) => update('slipId', e.target.value)}>
              <option value="">Select slip…</option>
              {slips.map((s) => (
                <option key={s.id} value={s.id}>{s.label} (max {s.maxLengthFt}ft)</option>
              ))}
            </select>
          </div>
        </div>
        <div className="row">
          <div>
            <label>Start date</label>
            <input type="date" value={form.startDate} onChange={(e) => update('startDate', e.target.value)} />
          </div>
          <div>
            <label>End date</label>
            <input type="date" value={form.endDate} onChange={(e) => update('endDate', e.target.value)} />
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <button type="submit">Create Reservation</button>
        </div>
      </form>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Slip</th>
            <th>Dates</th>
            <th>Nights</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((r) => (
            <tr key={r.id}>
              <td><Link to={`/reservations/${r.id}`}>{r.id}</Link></td>
              <td>{r.slipId}</td>
              <td>{displayDate(r.startDate)} → {displayDate(r.endDate)}</td>
              <td>{r.nights}</td>
              <td>{money(r.total)}</td>
              <td><span className="badge">{r.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
