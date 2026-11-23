export default function AgentStatusCard({
  agentName,
  icon,
  confidence,
  status = 'ok',
  children,
}) {
  const statusColors = {
    ok: {
      border: 'border-l-green-500',
      bg: 'bg-green-50',
      text: 'text-green-700',
      iconColor: 'text-green-500',
    },
    warning: {
      border: 'border-l-yellow-500',
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      iconColor: 'text-yellow-500',
    },
    error: {
      border: 'border-l-red-500',
      bg: 'bg-red-50',
      text: 'text-red-700',
      iconColor: 'text-red-500',
    },
    loading: {
      border: 'border-l-blue-500',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      iconColor: 'text-blue-500',
    },
  };

  const colors = statusColors[status] || statusColors.ok;

  const pct = Math.min(100, Math.max(0, Math.round((confidence ?? 0) * 100)));

  const badgeClasses =
    pct >= 90
      ? 'bg-green-100 text-green-700'
      : pct >= 75
      ? 'bg-yellow-100 text-yellow-700'
      : 'bg-red-100 text-red-700';

  const barColor =
    pct >= 90
      ? 'bg-green-500'
      : pct >= 75
      ? 'bg-yellow-500'
      : 'bg-red-500';

  return (
    <div
      className={`rounded-xl border border-gray-200 border-l-4 ${colors.border} bg-white shadow-sm overflow-hidden`}
    >
      {/* Header */}
      <div className={`px-4 pt-4 pb-2 ${colors.bg}`}>
        <div className="flex items-center gap-3">
          {/* Icon */}
          <span className={`flex-shrink-0 ${colors.iconColor}`}>
            {icon}
          </span>

          {/* Agent name */}
          <span className="font-semibold text-gray-800 flex-1 text-sm">
            {agentName ?? 'Agent'}
          </span>

          {/* Confidence badge */}
          {confidence != null && (
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeClasses}`}
            >
              {pct}% confident
            </span>
          )}
        </div>

        {/* Confidence bar */}
        {confidence != null && (
          <div className="mt-2 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-1 rounded-full transition-all duration-500 ${barColor}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        {status === 'loading' ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-5/6" />
            <div className="h-3 bg-gray-200 rounded w-4/6" />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
