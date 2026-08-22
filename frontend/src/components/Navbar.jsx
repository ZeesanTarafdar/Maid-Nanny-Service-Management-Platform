import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  const dashboardPath =
    user?.role === 'admin' ? '/admin' : user?.role === 'helper' ? '/helper' : '/browse';

  return (
    <div className="sticky top-0 z-50 bg-ink text-white flex items-center justify-between px-6 py-2.5">
      <Link to="/" className="flex items-center gap-2 font-sora font-bold text-[15px] tracking-tight">
        <span className="inline-block w-2 h-2 rounded-full bg-nanny"></span>
        Homehand
      </Link>
      <div className="flex items-center gap-3 text-sm">
        {user ? (
          <>
            <Link to={dashboardPath} className="opacity-90 hover:opacity-100">
              {user.role === 'admin' ? 'Admin dashboard' : user.role === 'helper' ? 'Helper dashboard' : 'Browse helpers'}
            </Link>
            {user.role === 'household' && (
              <Link to="/bookings" className="opacity-90 hover:opacity-100">My bookings</Link>
            )}
            {user.role === 'helper' && (
              <Link to="/helper/profile" className="opacity-90 hover:opacity-100">Edit profile</Link>
            )}
            <span className="opacity-60">·</span>
            <span className="opacity-90">{user.full_name}</span>
            <button
              onClick={handleLogout}
              className="ml-2 px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 transition"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="opacity-90 hover:opacity-100">Log in</Link>
            <Link to="/register" className="px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 transition">
              Sign up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
