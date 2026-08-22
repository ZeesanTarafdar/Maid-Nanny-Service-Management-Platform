import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

import BrowseHelpers from './pages/household/BrowseHelpers';
import HelperProfile from './pages/household/HelperProfile';
import Bookings from './pages/household/Bookings';

import HelperDashboard from './pages/helper/HelperDashboard';
import HelperProfileEdit from './pages/helper/HelperProfileEdit';

import AdminDashboard from './pages/admin/AdminDashboard';
import VerifyHelpers from './pages/admin/VerifyHelpers';
import ManageBookings from './pages/admin/ManageBookings';

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/browse" element={<BrowseHelpers />} />
        <Route path="/helpers/:id" element={<HelperProfile />} />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute roles={['household']}>
              <Bookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/helper"
          element={
            <ProtectedRoute roles={['helper']}>
              <HelperDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/helper/profile"
          element={
            <ProtectedRoute roles={['helper']}>
              <HelperProfileEdit />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/verify"
          element={
            <ProtectedRoute roles={['admin']}>
              <VerifyHelpers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute roles={['admin']}>
              <ManageBookings />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Landing />} />
      </Routes>
    </div>
  );
}
