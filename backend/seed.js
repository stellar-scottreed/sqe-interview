// Seed data for HarborMaster. Re-applied on boot and via POST /api/admin/reset.

function buildSeed() {
  const vessels = [
    { id: 'v1', name: 'Sea Breeze', lengthFt: 32, beamFt: 11, draftFt: 4, ownerName: 'Alice Marin' },
    { id: 'v2', name: 'Wanderlust', lengthFt: 41, beamFt: 13, draftFt: 5, ownerName: 'Bob Keel' },
    { id: 'v3', name: 'Salty Dog', lengthFt: 28, beamFt: 9, draftFt: 3, ownerName: 'Carla Reef' },
    { id: 'v4', name: 'Reel Therapy', lengthFt: 55, beamFt: 16, draftFt: 6, ownerName: 'Dan Wave' },
  ];

  const slips = [
    { id: 's1', label: 'A-01', maxLengthFt: 35, maxBeamFt: 12, nightlyRate: 45.0, status: 'available' },
    { id: 's2', label: 'A-02', maxLengthFt: 35, maxBeamFt: 12, nightlyRate: 45.0, status: 'available' },
    { id: 's3', label: 'B-01', maxLengthFt: 45, maxBeamFt: 14, nightlyRate: 62.5, status: 'available' },
    { id: 's4', label: 'B-02', maxLengthFt: 45, maxBeamFt: 14, nightlyRate: 62.5, status: 'available' },
    { id: 's5', label: 'C-01', maxLengthFt: 60, maxBeamFt: 18, nightlyRate: 89.99, status: 'available' },
    { id: 's6', label: 'C-02', maxLengthFt: 60, maxBeamFt: 18, nightlyRate: 89.99, status: 'occupied' },
  ];

  const reservations = [
    {
      id: 'r1',
      vesselId: 'v4',
      slipId: 's6',
      startDate: '2026-07-10',
      endDate: '2026-07-13',
      status: 'confirmed',
      nights: 3,
      subtotal: 269.97,
      tax: 22.27,
      total: 292.24,
      createdAt: '2026-06-01T12:00:00.000Z',
    },
  ];

  const payments = [];

  const config = { totalSlips: slips.length, maxOccupancy: 5, taxRate: 0.0825 };

  return { vessels, slips, reservations, payments, config };
}

module.exports = { buildSeed };
