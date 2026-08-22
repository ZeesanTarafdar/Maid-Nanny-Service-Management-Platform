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
    <div className="sticky top-0 z-50 bg-blue-600 text-white flex items-center justify-between px-6 py-2.5">
      <Link to="/" className="flex items-center gap-2 font-sora font-bold text-[15px] tracking-tight">
        Homehand
      </Link>
      <div className="flex items-center gap-3 text-sm">
        {user ? (
          <>
            <Link to={dashboardPath} className="ml-2 px-3 py-1 rounded-md text-white bg-purple-500 hover:bg-purple-600">
              {user.role === 'admin' ? 'Admin dashboard' : user.role === 'helper' ? 'Helper dashboard' : 'Browse helpers'}
            </Link>
            {user.role === 'household' && (
              <Link to="/bookings" className="ml-2 px-3 py-1 rounded-md text-white bg-green-500 hover:bg-green-600">My bookings</Link>
            )}
            {user.role === 'helper' && (
              <Link to="/helper/profile" className="ml-2 px-3 py-1 rounded-md text-white bg-green-500 hover:bg-green-600">Edit profile</Link>
            )}
            <span className="text-white"><i className="fa fa-user text-lg" aria-hidden="true"></i></span>
            <span className=" text-white">{user.full_name}</span>
            <button
              onClick={handleLogout}
              className="ml-2 px-3 py-1 rounded-md bg-white hover:bg-white transition text-red-600 font-medium text-sm"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-white px-3 py-1 rounded-md hover:bg-white * hover:text-black transition">
              Log in
            </Link>
            <Link to="/register" className="px-3 py-1 rounded-md bg-orange-500 hover:bg-white * hover:text-black transition">
              Sign up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
