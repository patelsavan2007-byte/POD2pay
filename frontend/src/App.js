import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import UploadPage from './pages/UploadPage';
import DashboardPage from './pages/DashboardPage';
import TripDetailPage from './pages/TripDetailPage';
import ApprovalPage from './pages/ApprovalPage';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/trips/:tripId" element={<TripDetailPage />} />
        <Route path="/trips/:tripId/approve" element={<ApprovalPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
