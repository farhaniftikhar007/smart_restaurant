import { API_BASE_URL } from "../../../config/api";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Reservation {
  id: number;
  user_id: number | null;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  special_requests: string | null;
  status: string;
  created_at: string;
}

const Reservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/reservations/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservations(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch reservations');
      console.error('Error fetching reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (reservationId: number, newStatus: string) => {
    try {
      let tableNumber = null;

      // If confirming, ask for table number
      if (newStatus === 'confirmed') {
        const input = window.prompt("Assign a Table Number (Optional): e.g. 'Table 5' or 'No. 2'");
        if (input === null) return; // Cancelled
        tableNumber = input;
      }

      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_BASE_URL}/api/reservations/${reservationId}/status`,
        { status: newStatus, table_number: tableNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchReservations(); // Refresh the list
    } catch (err) {
      console.error('Error updating reservation status:', err);
      alert('Failed to update reservation status');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading reservations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
        <p className="text-red-800">Error: {error}</p>
        <button
          onClick={fetchReservations}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Reservations Management</h1>
        <button
          onClick={fetchReservations}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {reservations.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600 text-lg">No reservations found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{reservation.name}</h3>
                  <div className="space-y-1 text-gray-600">
                    <p>📧 {reservation.email}</p>
                    <p>📱 {reservation.phone}</p>
                    <p>👥 {reservation.guests} guests</p>
                    {/* Show assigned table */}
                    {(reservation as any).table_number && (
                      <p className="text-orange-600 font-bold">📍 Assigned Table: {(reservation as any).table_number}</p>
                    )}
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-lg font-semibold">📅 {formatDate(reservation.date)}</p>
                  <p className="text-lg font-semibold">🕐 {reservation.time}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusColor(reservation.status)}`}>
                    {reservation.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {reservation.special_requests && (
                <div className="mb-4 p-3 bg-blue-50 rounded">
                  <p className="text-sm font-semibold text-blue-800">Special Requests:</p>
                  <p className="text-sm text-blue-700">{reservation.special_requests}</p>
                </div>
              )}

              <div className="flex gap-2 flex-wrap border-t pt-4">
                <button
                  onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                  className="bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600 disabled:opacity-50"
                  disabled={reservation.status === 'confirmed'}
                >
                  ✓ Confirm
                </button>
                <button
                  onClick={() => updateReservationStatus(reservation.id, 'completed')}
                  className="bg-gray-500 text-white px-4 py-2 rounded text-sm hover:bg-gray-600 disabled:opacity-50"
                  disabled={reservation.status === 'completed'}
                >
                  ✓ Complete
                </button>
                <button
                  onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                  className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600 disabled:opacity-50"
                  disabled={reservation.status === 'cancelled'}
                >
                  ✗ Cancel
                </button>
              </div>

              <p className="text-xs text-gray-400 mt-4">
                Created: {new Date(reservation.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reservations;
