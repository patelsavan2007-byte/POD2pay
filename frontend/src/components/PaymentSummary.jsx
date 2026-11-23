const fmt = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');

export default function PaymentSummary({
  agreedFreight,
  invoiceAmount,
  paymentReceived,
  outstandingAmount,
}) {
  const agreed = Number(agreedFreight || 0);
  const invoice = Number(invoiceAmount || 0);
  const paid = Number(paymentReceived || 0);
  const outstanding = Number(outstandingAmount || 0);

  const pct = agreed > 0 ? Math.min(100, Math.round((paid / agreed) * 100)) : 0;
  const invoiceDiffers = agreedFreight != null && invoiceAmount != null && invoice !== agreed;

  const stats = [
    {
      label: 'Agreed Freight',
      value: fmt(agreed),
      valueClass: 'text-gray-800',
      labelClass: 'text-gray-500',
      bgClass: 'bg-gray-50 border-gray-200',
      extra: null,
    },
    {
      label: 'Invoice Amount',
      value: fmt(invoice),
      valueClass: 'text-blue-700',
      labelClass: 'text-blue-500',
      bgClass: 'bg-blue-50 border-blue-200',
      extra: invoiceDiffers ? (
        <span
          title="Invoice amount differs from agreed freight"
          className="ml-1 text-yellow-500 text-sm"
        >
          ⚠
        </span>
      ) : null,
    },
    {
      label: 'Amount Paid',
      value: fmt(paid),
      valueClass: 'text-green-700',
      labelClass: 'text-green-500',
      bgClass: 'bg-green-50 border-green-200',
      extra: null,
    },
    {
      label: 'Outstanding',
      value: fmt(outstanding),
      valueClass: outstanding > 0 ? 'text-red-700' : 'text-green-700',
      labelClass: outstanding > 0 ? 'text-red-400' : 'text-green-400',
      bgClass: outstanding > 0
        ? 'bg-red-50 border-red-200'
        : 'bg-green-50 border-green-200',
      extra: null,
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 space-y-4">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
        Payment Summary
      </h3>

      {/* 4 stat boxes: 2x2 on mobile, 4-in-a-row on sm+ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`rounded-lg border p-3 ${s.bgClass}`}
          >
            <p className={`text-xs font-medium mb-1 ${s.labelClass}`}>
              {s.label}
            </p>
            <p className={`text-lg font-bold leading-tight ${s.valueClass} flex items-center`}>
              {s.value}
              {s.extra}
            </p>
          </div>
        ))}
      </div>

      {/* Recovery progress bar */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-500">Recovery progress</span>
          <span className="text-xs font-semibold text-green-700">{pct}% recovered</span>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-2 bg-green-500 rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
