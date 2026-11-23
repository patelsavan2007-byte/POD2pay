import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTrips } from '../api/index';
import { TrendingUp, TrendingDown, AlertCircle, PlusCircle, Truck } from 'lucide-react';

const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');

function StatusBadge({ status }) {
  const map = {
    paid: {
      label: 'Paid ✅',
      cls: 'bg-green-100 text-green-700',
    },
    recovery_pending: {
      label: 'Recovery Pending ⚠️',
      cls: 'bg-yellow-100 text-yellow-700',
    },
    processing: {
      label: 'Processing 🔄',
      cls: 'bg-blue-100 text-blue-700',
    },
  };
  const s = map[status] ?? { label: status, cls: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.cls}`}>
      {s.label}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[...Array(7)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

function StatCard({ icon: Icon, label, value, valueClass = 'text-gray-900', iconBg }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-5 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${iconBg}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
        <p className={`text-2xl font-extrabold mt-0.5 ${valueClass}`}>{value}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTrips()
      .then(setTrips)
      .catch((e) => setError(e?.response?.data?.detail ?? 'Failed to load trips.'))
      .finally(() => setLoading(false));
  }, []);

  const totalBilled = trips.reduce((s, t) => s + (t.invoice_amount ?? 0), 0);
  const totalReceived = trips.reduce((s, t) => s + (t.payment_received ?? 0), 0);
  const totalOutstanding = trips.reduce((s, t) => s + (t.outstanding_amount ?? 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Truck className="w-7 h-7 text-indigo-600" />
          <h1 className="text-xl font-extrabold text-gray-900">POD2Pay Dashboard 🚛</h1>
        </div>
        <Link
          to="/upload"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Upload New Trip
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={TrendingUp}
            label="Total Billed"
            value={fmt(totalBilled)}
            iconBg="bg-indigo-500"
          />
          <StatCard
            icon={TrendingDown}
            label="Total Received"
            value={fmt(totalReceived)}
            valueClass="text-green-700"
            iconBg="bg-green-500"
          />
          <StatCard
            icon={AlertCircle}
            label="Total Outstanding"
            value={fmt(totalOutstanding)}
            valueClass={totalOutstanding > 0 ? 'text-red-600' : 'text-gray-900'}
            iconBg={totalOutstanding > 0 ? 'bg-red-500' : 'bg-gray-400'}
          />
        </div>

        {/* Table card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-800">All Trips</h2>
            <span className="text-xs text-gray-400">{loading ? '…' : `${trips.length} records`}</span>
          </div>

          {error && (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
              <p className="text-gray-700 font-semibold">Could not load trips</p>
              <p className="text-sm text-gray-400 mt-1">{error}</p>
            </div>
          )}

          {!error && !loading && trips.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <Truck className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-gray-600 font-semibold text-lg">No trips yet</p>
              <p className="text-sm text-gray-400 mt-1 mb-5">Upload your first trip to get started.</p>
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                Upload your first trip →
              </Link>
            </div>
          )}

          {!error && (trips.length > 0 || loading) && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Trip ID', 'Customer', 'Date', 'Invoice', 'Paid', 'Outstanding', 'Status'].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading
                    ? [...Array(4)].map((_, i) => <SkeletonRow key={i} />)
                    : trips.map((trip) => (
                        <tr
                          key={trip.trip_id}
                          onClick={() => navigate(`/trips/${trip.trip_id}`)}
                          className="cursor-pointer hover:bg-indigo-50 transition-colors"
                        >
                          <td className="px-4 py-3 font-mono font-semibold text-indigo-700 text-xs">
                            {trip.trip_id}
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-800">{trip.customer_name}</td>
                          <td className="px-4 py-3 text-gray-500">
                            {trip.trip_date
                              ? new Date(trip.trip_date).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })
                              : '—'}
                          </td>
                          <td className="px-4 py-3 text-gray-700">{fmt(trip.invoice_amount)}</td>
                          <td className="px-4 py-3 text-green-700 font-medium">{fmt(trip.payment_received)}</td>
                          <td className={`px-4 py-3 font-bold ${trip.outstanding_amount > 0 ? 'text-red-600' : 'text-gray-500'}`}>
                            {fmt(trip.outstanding_amount)}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={trip.status} />
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
