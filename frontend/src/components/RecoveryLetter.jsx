import { Link } from 'react-router-dom';
import { Mail, ChevronRight, CheckCircle } from 'lucide-react';

export default function RecoveryLetter({ letter, tripId, confidence }) {
  const PREVIEW_LEN = 300;
  const text = letter ?? '';
  const preview = text.length > PREVIEW_LEN ? text.slice(0, PREVIEW_LEN) + '...' : text;

  const pct =
    confidence != null
      ? Math.min(100, Math.max(0, Math.round(confidence * 100)))
      : null;

  const badgeClass =
    pct == null
      ? 'bg-gray-100 text-gray-600'
      : pct >= 90
      ? 'bg-green-100 text-green-700'
      : pct >= 75
      ? 'bg-yellow-100 text-yellow-700'
      : 'bg-red-100 text-red-700';

  return (
    <div className="rounded-xl border border-green-200 bg-green-50 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-green-200">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-green-600" />
          <span className="font-semibold text-gray-800 text-sm">
            Recovery Letter Ready
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Ready badge */}
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3" />
            Ready for Review
          </span>

          {/* Confidence badge */}
          {pct != null && (
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeClass}`}
            >
              {pct}% confident
            </span>
          )}
        </div>
      </div>

      {/* Letter preview */}
      <div className="px-4 py-3">
        {text ? (
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line font-mono bg-white border border-green-100 rounded-lg px-3 py-3 max-h-36 overflow-hidden">
            {preview}
          </p>
        ) : (
          <p className="text-sm text-gray-400 italic">Letter content not available.</p>
        )}

        <p className="mt-2 text-xs text-gray-500">
          This AI-drafted letter cites your documents and demands payment within 7 days.
        </p>
      </div>

      {/* CTA button */}
      <div className="px-4 pb-4">
        {tripId ? (
          <Link
            to={`/trips/${tripId}/approve`}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold text-sm transition-colors duration-150"
          >
            Review &amp; Edit Full Letter
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <button
            disabled
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg bg-gray-300 text-gray-500 font-semibold text-sm cursor-not-allowed"
          >
            Review &amp; Edit Full Letter
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
