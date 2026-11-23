import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FileText,
  Package,
  Receipt,
  CreditCard,
  Upload,
  Loader2,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';
import { uploadDocuments } from '../api/index';

const SLOTS = [
  {
    key: 'lr',
    label: 'LR Document',
    sub: 'Lorry Receipt',
    icon: FileText,
    color: 'indigo',
  },
  {
    key: 'pod',
    label: 'POD Document',
    sub: 'Proof of Delivery',
    icon: Package,
    color: 'blue',
  },
  {
    key: 'invoice',
    label: 'Invoice',
    sub: 'Tax Invoice',
    icon: Receipt,
    color: 'violet',
  },
  {
    key: 'payment',
    label: 'Payment Record',
    sub: 'Bank / UPI Statement',
    icon: CreditCard,
    color: 'sky',
  },
];

const colorMap = {
  indigo: {
    ring: 'ring-indigo-400',
    bg: 'bg-indigo-50',
    icon: 'text-indigo-500',
    border: 'border-indigo-300',
    activeBorder: 'border-green-400',
    activeBg: 'bg-green-50',
  },
  blue: {
    ring: 'ring-blue-400',
    bg: 'bg-blue-50',
    icon: 'text-blue-500',
    border: 'border-blue-300',
    activeBorder: 'border-green-400',
    activeBg: 'bg-green-50',
  },
  violet: {
    ring: 'ring-violet-400',
    bg: 'bg-violet-50',
    icon: 'text-violet-500',
    border: 'border-violet-300',
    activeBorder: 'border-green-400',
    activeBg: 'bg-green-50',
  },
  sky: {
    ring: 'ring-sky-400',
    bg: 'bg-sky-50',
    icon: 'text-sky-500',
    border: 'border-sky-300',
    activeBorder: 'border-green-400',
    activeBg: 'bg-green-50',
  },
};

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function FileSlot({ slot, file, onDrop }) {
  const { key, label, sub, icon: Icon, color } = slot;
  const c = colorMap[color];
  const hasFile = !!file;

  const onDropCb = useCallback(
    (accepted) => {
      if (accepted && accepted.length > 0) onDrop(key, accepted[0]);
    },
    [key, onDrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropCb,
    accept: { 'application/pdf': ['.pdf'], 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed
        cursor-pointer transition-all duration-200 select-none
        ${hasFile ? `${c.activeBorder} ${c.activeBg}` : `${c.border} ${c.bg} hover:${c.ring} hover:ring-2`}
        ${isDragActive ? `${c.ring} ring-2` : ''}
      `}
    >
      <input {...getInputProps()} />

      {hasFile ? (
        <>
          <CheckCircle className="w-10 h-10 text-green-500" />
          <div className="text-center">
            <p className="font-semibold text-gray-800 text-sm truncate max-w-[180px]">{file.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{formatSize(file.size)}</p>
          </div>
          <p className="text-xs text-green-600 font-medium">✓ Ready</p>
        </>
      ) : (
        <>
          <div className={`p-3 rounded-full ${c.bg}`}>
            <Icon className={`w-7 h-7 ${c.icon}`} />
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-700 text-sm">{label}</p>
            <p className="text-xs text-gray-400">{sub}</p>
          </div>
          <p className="text-xs text-gray-400 text-center">
            {isDragActive ? 'Drop it here…' : 'Drag & drop or click to browse'}
          </p>
          <p className="text-xs text-gray-300">.pdf · .jpg · .png</p>
        </>
      )}
    </div>
  );
}

export default function UploadPage() {
  const navigate = useNavigate();
  const [files, setFiles] = useState({ lr: null, pod: null, invoice: null, payment: null });
  const [loading, setLoading] = useState(false);

  const handleDrop = useCallback((key, file) => {
    setFiles((prev) => ({ ...prev, [key]: file }));
  }, []);

  const allReady = SLOTS.every((s) => files[s.key] !== null);

  const handleAnalyse = async () => {
    if (!allReady || loading) return;
    setLoading(true);
    try {
      const result = await uploadDocuments(files.lr, files.pod, files.invoice, files.payment);
      toast.success('Documents uploaded successfully!');
      navigate(`/trips/${result.trip_id}`);
    } catch (err) {
      toast.error(err?.response?.data?.detail ?? 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <span className="text-sm text-gray-400">Homingo Hack Days 2026 · Track A2</span>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            POD2Pay 🚛
          </h1>
          <p className="mt-2 text-lg text-indigo-600 font-medium">AI-Powered Freight Recovery</p>
          <p className="mt-1 text-sm text-gray-500">
            Upload your 4 documents and let our AI agents analyse the trip instantly.
          </p>
        </div>

        {/* Drop slots */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {SLOTS.map((slot) => (
            <FileSlot key={slot.key} slot={slot} file={files[slot.key]} onDrop={handleDrop} />
          ))}
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-6">
          {SLOTS.map((slot) => (
            <div
              key={slot.key}
              className={`flex-1 h-1.5 rounded-full transition-colors duration-300 ${
                files[slot.key] ? 'bg-green-400' : 'bg-gray-200'
              }`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1 whitespace-nowrap">
            {SLOTS.filter((s) => files[s.key]).length} / 4
          </span>
        </div>

        {/* Analyse button */}
        <button
          onClick={handleAnalyse}
          disabled={!allReady || loading}
          className={`
            w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl text-white text-lg font-bold
            transition-all duration-200 shadow-lg
            ${
              allReady && !loading
                ? 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] cursor-pointer'
                : 'bg-gray-300 cursor-not-allowed'
            }
          `}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              AI agents are analysing your documents…
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              🔍 Analyse Documents
            </>
          )}
        </button>

        {!allReady && !loading && (
          <p className="text-center text-xs text-gray-400 mt-3">
            Please upload all 4 documents to continue.
          </p>
        )}
      </div>
    </div>
  );
}
