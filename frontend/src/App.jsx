import { NavLink, Route, Routes } from 'react-router-dom';
import Slips from './pages/Slips.jsx';
import Vessels from './pages/Vessels.jsx';
import Reservations from './pages/Reservations.jsx';
import ReservationDetail from './pages/ReservationDetail.jsx';

export default function App() {
  return (
    <div>
      <nav>
        <span className="brand">⚓ HarborMaster</span>
        <NavLink to="/" end>Slips</NavLink>
        <NavLink to="/vessels">Vessels</NavLink>
        <NavLink to="/reservations">Reservations</NavLink>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Slips />} />
          <Route path="/vessels" element={<Vessels />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/reservations/:id" element={<ReservationDetail />} />
        </Routes>
      </main>
    </div>
  );
}
