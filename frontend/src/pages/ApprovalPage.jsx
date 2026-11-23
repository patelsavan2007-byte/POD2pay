import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTrip, approveRecovery } from '../api/index';
import toast from 'react-hot-toast';
import { Download, CheckCircle, AlertTriangle, ArrowLeft, FileText } from 'lucide-react';

const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');

export default function ApprovalPage() {
  const { tripId } = useParams();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [letterText, setLetterText] = useState('');
  const [approving, setApproving] = useState(false);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    if (!tripId) return;
    getTrip(tripId)
      .then((data) => {
        setTrip(data);
        setLetterText(data?.agents?.recovery?.letter ?? '');
      })
      .catch((e) => setError(e?.response?.data?.detail ?? 'Failed to load trip.'))
      .finally(() => setLoading(false));
  }, [tripId]);

  const handleDownload = () => {
    const blob = new Blob([letterText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recovery-letter-${tripId ?? 'draft'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Letter downloaded as text file.');
  };

  const handleApprove = async () => {
    if (approving) return;
    setApproving(true);
    try {
      await approveRecovery(tripId, letterText);
      setApproved(true);
      toast.success('Letter approved and records updated!');
    } catch (e) {
      toast.error(e?.response?.data?.detail ?? 'Approval failed. Please try again.');
    } finally {
      setApproving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading recovery letter…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-gray-700 font-semibold text-lg">Could not load trip</p>
          <p className="text-sm text-gray-400 mt-1 mb-5">{error}</p>
          <Link to="/dashboard" className="text-indigo-600 hover:underline text-sm font-medium">← Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const docData = trip?.agents?.document?.data ?? {};
  const payData = trip?.agents?.payment?.data ?? {};
  const outstanding = trip?.outstanding_amount ?? payData?.outstanding_amount ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <Link
          to={`/trips/${tripId}`}
          className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Trip Details
        </Link>
        <span className="text-gray-300">|</span>
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-500" />
          <h1 className="text-sm font-bold text-gray-700">
            Review Recovery Letter
            <span className="ml-2 font-mono text-indigo-600 text-xs">{tripId}</span>
          </h1>
        </div>
      </div>

      {/* Warning banner */}
      <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-3 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
        <p className="text-sm text-yellow-800 font-medium">
          Review carefully before sending — this is a legal document.
        </p>
      </div>

      {/* Approval success banner */}
      {approved && (
        <div className="bg-green-50 border-b border-green-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-800 font-semibold">
              Letter marked as approved. Your records have been updated.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="text-sm text-green-700 hover:text-green-900 font-medium underline underline-offset-2"
          >
            ← Back to Dashboard
          </Link>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left panel — Letter editor (60%) */}
          <div className="flex-1 lg:w-3/5 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-indigo-500" />
              <h2 className="font-bold text-gray-800">Recovery Letter</h2>
            </div>

            <textarea
              value={letterText}
              onChange={(e) => setLetterText(e.target.value)}
              rows={22}
              className="w-full border border-gray-200 rounded-xl p-4 text-sm font-mono text-gray-800 leading-relaxed
                bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400
                resize-y min-h-96 transition"
              placeholder="Recovery letter will appear here…"
            />

            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-400">
                {letterText.length} characters · {letterText.split(/\s+/).filter(Boolean).length} words
              </p>
              <p className="text-xs text-gray-400 italic">You may edit the letter above before approving.</p>
            </div>
          </div>

          {/* Right panel — Summary + actions (40%) */}
          <div className="w-full lg:w-2/5 space-y-4">
            {/* Trip summary */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <h3 className="font-bold text-gray-800 mb-4 text-sm">Trip Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-medium">Customer</span>
                  <span className="text-sm font-semibold text-gray-800">{trip?.customer_name ?? '—'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-medium">Trip ID</span>
                  <span className="text-sm font-mono font-semibold text-indigo-700">{trip?.trip_id ?? '—'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-medium">Invoice No.</span>
                  <span className="text-sm font-semibold text-gray-800">{docData?.invoice_number ?? '—'}</span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-100 pt-3 mt-3">
                  <span className="text-xs text-gray-500 font-medium">Outstanding Amount</span>
                  <span className={`text-xl font-extrabold ${outstanding > 0 ? 'text-red-600' : 'text-gray-800'}`}>
                    {fmt(outstanding)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-3">
              <h3 className="font-bold text-gray-800 mb-1 text-sm">Actions</h3>

              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700
                  text-white font-semibold py-3 px-4 rounded-xl shadow transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                ⬇ Download as Text File
              </button>

              {!approved ? (
                <button
                  onClick={handleApprove}
                  disabled={approving}
                  className={`w-full flex items-center justify-center gap-2 font-semibold py-3 px-4 rounded-xl shadow
                    text-sm transition-colors
                    ${approving
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
                    }`}
                >
                  {approving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Approving…
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      ✅ Mark as Approved
                    </>
                  )}
                </button>
              ) : (
                <div className="w-full flex items-center justify-center gap-2 bg-green-50 border border-green-300
                  text-green-800 font-semibold py-3 px-4 rounded-xl text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Approved
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
              <h3 className="font-bold text-indigo-800 mb-3 text-sm">How to Use This Letter</h3>
              <ol className="space-y-2.5 text-sm text-indigo-700">
                <li className="flex gap-2">
                  <span className="flex-shrink-0 font-bold text-indigo-500">1.</span>
                  <span>Read through the full recovery letter carefully.</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex-shrink-0 font-bold text-indigo-500">2.</span>
                  <span>Edit the letter in the text area if any changes are needed (names, amounts, dates).</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex-shrink-0 font-bold text-indigo-500">3.</span>
                  <span>Download the letter as a text file and print or convert to PDF for official use.</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex-shrink-0 font-bold text-indigo-500">4.</span>
                  <span>Click "Mark as Approved" to record the approval in your POD2Pay account.</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
