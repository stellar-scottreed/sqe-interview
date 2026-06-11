import { useEffect, useState } from 'react';
import { api } from '../api';

const EMPTY = { name: '', lengthFt: '', beamFt: '', draftFt: '', ownerName: '' };

export default function Vessels() {
  const [vessels, setVessels] = useState([]);
  const [form, setForm] = useState(EMPTY);

  function load() {
    api.listVessels().then(setVessels);
  }
  useEffect(load, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    await api.createVessel(form);
    setForm(EMPTY);
    load();
  }

  return (
    <div>
      <h2>Vessels</h2>
      <form className="card" onSubmit={submit}>
        <div className="row">
          <div>
            <label>Name</label>
            <input value={form.name} onChange={(e) => update('name', e.target.value)} />
          </div>
          <div>
            <label>Owner</label>
            <input value={form.ownerName} onChange={(e) => update('ownerName', e.target.value)} />
          </div>
        </div>
        <div className="row">
          <div>
            <label>Length (ft)</label>
            <input value={form.lengthFt} onChange={(e) => update('lengthFt', e.target.value)} />
          </div>
          <div>
            <label>Beam (ft)</label>
            <input value={form.beamFt} onChange={(e) => update('beamFt', e.target.value)} />
          </div>
          <div>
            <label>Draft (ft)</label>
            <input value={form.draftFt} onChange={(e) => update('draftFt', e.target.value)} />
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <button type="submit">Add Vessel</button>
        </div>
      </form>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Owner</th>
            <th>Length</th>
            <th>Beam</th>
            <th>Draft</th>
          </tr>
        </thead>
        <tbody>
          {vessels.map((v) => (
            <tr key={v.id}>
              <td>{v.name}</td>
              <td>{v.ownerName}</td>
              <td>{v.lengthFt}</td>
              <td>{v.beamFt}</td>
              <td>{v.draftFt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
