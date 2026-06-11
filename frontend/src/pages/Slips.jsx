import { useEffect, useState } from 'react';
import { api } from '../api';
import { money } from '../format';

export default function Slips() {
  const [slips, setSlips] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.listSlips().then(setSlips);
    api.getAvailability().then(setSummary);
  }, []);

  return (
    <div>
      <h2>Slips & Availability</h2>
      {summary && (
        <div className="card">
          <strong>{summary.occupied}</strong> of {summary.maxOccupancy} max occupancy in use ·{' '}
          {summary.totalSlips} total slips ·{' '}
          {summary.canAcceptMore ? 'Accepting reservations' : 'Marina full'}
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Slip</th>
            <th>Max LOA (ft)</th>
            <th>Max Beam (ft)</th>
            <th>Nightly Rate</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {slips.map((s) => (
            <tr key={s.id}>
              <td>{s.label}</td>
              <td>{s.maxLengthFt}</td>
              <td>{s.maxBeamFt}</td>
              <td>{money(s.nightlyRate)}</td>
              <td>
                <span className={`badge ${s.status}`}>{s.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
