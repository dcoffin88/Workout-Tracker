import React, { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import { adminFetch, clearAdminPin, getAdminPin } from './adminApi';

export default function AdminLayout() {
  const [isVerified, setIsVerified] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [hasPin, setHasPin] = useState(!!getAdminPin());

  useEffect(() => {
    const verify = async () => {
      const pin = getAdminPin();
      if (!pin) {
        setIsVerified(false);
        setIsChecking(false);
        return;
      }

      setIsChecking(true);
      try {
        await adminFetch('/api/admin/verify');
        setIsVerified(true);
      } catch (error) {
        clearAdminPin();
        setIsVerified(false);
      } finally {
        setIsChecking(false);
      }
    };

    verify();
  }, [hasPin]);

  const handleLogout = () => {
    clearAdminPin();
    setHasPin(false);
    setIsVerified(false);
  };

  if (isChecking) {
    return <div className="p-6 text-slate-400">Checking admin access...</div>;
  }

  if (!isVerified) {
    return (
      <AdminLogin
        onSuccess={() => {
          setHasPin(true);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          <NavLink
            to="/admin/exercises"
            className={({ isActive }) =>
              [
                'px-4 py-2 rounded-lg font-bold',
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 dark:bg-white text-slate-200 dark:text-gray-900',
              ].join(' ')
            }
          >
            Exercises
          </NavLink>
          <NavLink
            to="/admin/workouts"
            className={({ isActive }) =>
              [
                'px-4 py-2 rounded-lg font-bold',
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 dark:bg-white text-slate-200 dark:text-gray-900',
              ].join(' ')
            }
          >
            Workouts
          </NavLink>
          <NavLink
            to="/admin/pin"
            className={({ isActive }) =>
              [
                'px-4 py-2 rounded-lg font-bold',
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 dark:bg-white text-slate-200 dark:text-gray-900',
              ].join(' ')
            }
          >
            PIN
          </NavLink>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg bg-slate-700 dark:bg-gray-200 text-white dark:text-gray-900 font-bold hover:bg-slate-600 dark:hover:bg-gray-300"
        >
          Sign Out
        </button>
      </div>
      <Outlet />
    </div>
  );
}
