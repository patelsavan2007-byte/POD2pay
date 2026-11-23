import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getTrip } from '../api/index';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileSearch,
  Shield,
  Calculator,
  Banknote,
  Mail,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';

const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');

function StatusBadge({ status }) {
  const map = {
    paid: { label: 'Paid ✅', cls: 'bg-green-100 text-green-700' },
    recovery_pending: { label: 'Recovery Pending ⚠️', cls: 'bg-yellow-100 text-yellow-700' },
    processing: { label: 'Processing 🔄', cls: 'bg-blue-100 text-blue-700' },
  };
  const s = map[status] ?? { label: status, cls: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${s.cls}`}>
      {s.label}
    </span>
  );
}

function ConfidenceBar({ confidence }) {
  const pct = Math.round((confidence ?? 0) * 100);
  const color = pct >= 90 ? 'bg-green-500' : pct >= 75 ? 'bg-yellow-400' : 'bg-red-500';
  const textColor = pct >= 90 ? 'text-green-700' : pct >= 75 ? 'text-yellow-700' : 'text-red-600';
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex-1 bg-gray-100 rounded-full h-2">
        <div className={`h-2 rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-xs font-bold ${textColor}`}>{pct}%</span>
    </div>
  );
}

function BoolIcon({ value }) {
  return value ? (
    <CheckCircle className="w-5 h-5 text-green-500 inline" />
  ) : (
    <XCircle className="w-5 h-5 text-red-500 inline" />
  );
}

function AgentCard({ title, icon: Icon, iconColor, confidence, children, border = 'border-gray-200' }) {
  return (
    <div className={`bg-white rounded-2xl border ${border} shadow-sm p-5 mb-4`}>
      <div className="flex items-center gap-3 mb-1">
        <div className={`p-2 rounded-xl bg-gray-50`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-800 text-sm">{title}</h3>
          <ConfidenceBar confidence={confidence} />
        </div>
        <span className="text-xs text-gray-400 font-medium">Confidence</span>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function FieldRow({ label, value }) {
  return (
    <tr className="border-b border-gray-50 last:border-0">
      <td className="py-1.5 pr-4 text-xs text-gray-500 font-medium whitespace-nowrap w-40">{label}</td>
      <td className="py-1.5 text-sm font-semibold text-gray-800">{value ?? '—'}</td>
    </tr>
  );
}

export default function TripDetailPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tripId) return;
    getTrip(tripId)
      .then(setTrip)
      .catch((e) => setError(e?.response?.data?.detail ?? 'Failed to load trip.'))
      .finally(() => setLoading(false));
  }, [tripId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading trip analysis…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-gray-700 font-semibold text-lg">Error loading trip</p>
          <p className="text-sm text-gray-400 mt-1 mb-5">{error}</p>
          <Link to="/dashboard" className="text-indigo-600 hover:underline text-sm font-medium">← Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const agents = trip?.agents ?? {};
  const doc = agents?.document?.data ?? {};
  const ver = agents?.verification?.data ?? {};
  const bil = agents?.billing?.data ?? {};
  const pay = agents?.payment?.data ?? {};
  const rec = agents?.recovery ?? {};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All Trips
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Trip header */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Trip ID</p>
              <h2 className="text-2xl font-extrabold text-gray-900 font-mono">{trip?.trip_id}</h2>
              <p className="text-gray-600 mt-1 font-medium">{trip?.customer_name}</p>
              {trip?.trip_date && (
                <p className="text-sm text-gray-400 mt-0.5">
                  {new Date(trip.trip_date).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              )}
            </div>
            <StatusBadge status={trip?.status} />
          </div>

          {/* Payment summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[
              { label: 'Agreed Freight', value: fmt(trip?.agreed_freight), color: 'text-gray-800' },
              { label: 'Invoice Amount', value: fmt(trip?.invoice_amount), color: 'text-gray-800' },
              { label: 'Amount Paid', value: fmt(trip?.payment_received), color: 'text-green-700' },
              {
                label: 'Outstanding',
                value: fmt(trip?.outstanding_amount),
                color: (trip?.outstanding_amount ?? 0) > 0 ? 'text-red-600' : 'text-gray-800',
              },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 font-medium mb-1">{item.label}</p>
                <p className={`text-lg font-extrabold ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <h3 className="text-base font-bold text-gray-700 mb-4">🤖 AI Agent Analysis</h3>

        {/* Document Agent */}
        <AgentCard
          title="Document Agent — Extracted Data"
          icon={FileSearch}
          iconColor="text-indigo-500"
          confidence={agents?.document?.confidence}
          border="border-indigo-100"
        >
          <table className="w-full">
            <tbody>
              <FieldRow label="Trip ID" value={doc?.trip_id} />
              <FieldRow label="Customer" value={doc?.customer_name} />
              <FieldRow label="Goods" value={doc?.goods_description} />
              <FieldRow label="Route" value={doc?.origin && doc?.destination ? `${doc.origin} → ${doc.destination}` : null} />
              <FieldRow label="Agreed Freight" value={doc?.agreed_freight != null ? fmt(doc.agreed_freight) : null} />
              <FieldRow label="Delivery Date" value={doc?.delivery_date} />
              <FieldRow label="Invoice No." value={doc?.invoice_number} />
              <FieldRow label="Invoice Amount" value={doc?.invoice_amount != null ? fmt(doc.invoice_amount) : null} />
              <FieldRow label="Payment Received" value={doc?.payment_received != null ? fmt(doc.payment_received) : null} />
            </tbody>
          </table>
        </AgentCard>

        {/* Verification Agent */}
        <AgentCard
          title="Verification Agent — Delivery Checks"
          icon={Shield}
          iconColor="text-blue-500"
          confidence={agents?.verification?.confidence}
          border={ver?.delivery_confirmed ? 'border-green-200' : 'border-red-200'}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            {[
              { label: 'Delivery Confirmed', value: ver?.delivery_confirmed },
              { label: 'Date Matches', value: ver?.date_matches },
              { label: 'Goods Match', value: ver?.goods_match },
            ].map((check) => (
              <div key={check.label} className="bg-gray-50 rounded-xl p-3 text-center">
                <BoolIcon value={check.value} />
                <p className="text-xs text-gray-500 mt-1 font-medium">{check.label}</p>
              </div>
            ))}
          </div>
          {(ver?.issues_found?.length ?? 0) > 0 ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-xs font-semibold text-red-700 mb-1">Issues found:</p>
              <ul className="list-disc list-inside text-sm text-red-600 space-y-0.5">
                {ver.issues_found.map((issue, i) => <li key={i}>{issue}</li>)}
              </ul>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700 font-medium">
              ✓ No issues found — all checks passed
            </div>
          )}
        </AgentCard>

        {/* Billing Agent */}
        <AgentCard
          title="Billing Agent — Invoice vs Freight"
          icon={Calculator}
          iconColor="text-violet-500"
          confidence={agents?.billing?.confidence}
          border={(bil?.discrepancy ?? 0) !== 0 ? 'border-yellow-200' : 'border-green-200'}
        >
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-500">Agreed Freight</p>
              <p className="text-lg font-bold text-gray-800">{bil?.agreed_freight != null ? fmt(bil.agreed_freight) : '—'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-500">Invoice Amount</p>
              <p className="text-lg font-bold text-gray-800">{bil?.invoice_amount != null ? fmt(bil.invoice_amount) : '—'}</p>
            </div>
          </div>
          {(bil?.discrepancy ?? 0) !== 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
              <p className="text-sm font-semibold text-yellow-800">
                Discrepancy: <span className="text-red-600">{fmt(bil.discrepancy)}</span>
              </p>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700 font-medium">
              ✓ Invoice matches agreed freight — no discrepancy
            </div>
          )}
          {bil?.notes && (
            <p className="text-xs text-gray-400 mt-2 italic">{bil.notes}</p>
          )}
        </AgentCard>

        {/* Payment Agent */}
        <AgentCard
          title="Payment Agent — Outstanding Analysis"
          icon={Banknote}
          iconColor="text-red-500"
          confidence={agents?.payment?.confidence}
          border={(pay?.outstanding_amount ?? 0) > 0 ? 'border-red-200' : 'border-green-200'}
        >
          {(pay?.outstanding_amount ?? 0) > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-center">
              <p className="text-xs text-red-500 font-medium">Outstanding Amount</p>
              <p className="text-4xl font-extrabold text-red-600 mt-1">{fmt(pay.outstanding_amount)}</p>
            </div>
          )}
          <div className="space-y-2 text-sm">
            {pay?.deduction_reason && (
              <div>
                <span className="text-gray-500 font-medium text-xs">Deduction Reason: </span>
                <span className="text-gray-800">{pay.deduction_reason}</span>
              </div>
            )}
            <div>
              <span className="text-gray-500 font-medium text-xs">Deduction Justified: </span>
              <span className={pay?.deduction_justified ? 'text-yellow-700 font-semibold' : 'text-green-700 font-semibold'}>
                {pay?.deduction_justified != null ? (pay.deduction_justified ? 'Yes' : 'No — Deduction not justified') : '—'}
              </span>
            </div>
            {pay?.evidence_against_deduction && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 mt-2">
                <p className="text-xs text-green-600 font-semibold mb-1">Evidence Against Deduction:</p>
                <p className="text-sm text-green-800">{pay.evidence_against_deduction}</p>
              </div>
            )}
          </div>
        </AgentCard>

        {/* Recovery Agent */}
        <AgentCard
          title="Recovery Agent — Legal Letter"
          icon={Mail}
          iconColor="text-amber-600"
          confidence={rec?.confidence}
          border="border-amber-200"
        >
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-amber-900">Recovery letter is ready</p>
              <p className="text-xs text-amber-700 mt-0.5">
                AI has drafted a legal recovery letter. Review and approve before sending.
              </p>
            </div>
            <button
              onClick={() => navigate(`/trips/${tripId}/approve`)}
              className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow transition-colors whitespace-nowrap"
            >
              Review & Approve
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </AgentCard>
      </div>
    </div>
  );
}
