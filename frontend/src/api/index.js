import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 120000, // 2 min — agents take time
});

// Upload 4 documents and start the AI pipeline
export async function uploadDocuments(lr, pod, invoice, payment) {
  const form = new FormData();
  form.append('lr_file', lr);
  form.append('pod_file', pod);
  form.append('invoice_file', invoice);
  form.append('payment_file', payment);
  const { data } = await api.post('/api/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data; // { trip_id, status, ... }
}

// Get all trips for dashboard
export async function getTrips() {
  const { data } = await api.get('/api/trips');
  return data; // array of trip summaries
}

// Get one trip's full AI analysis
export async function getTrip(tripId) {
  const { data } = await api.get(`/api/trips/${tripId}`);
  return data;
}

// Approve recovery letter (optionally with edited text)
export async function approveRecovery(tripId, editedLetter) {
  const { data } = await api.post(`/api/approve/${tripId}`, {
    letter_text: editedLetter,
  });
  return data;
}
