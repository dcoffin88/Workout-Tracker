import React, { useState } from 'react';
import { setAdminPin } from './adminApi';

export default function AdminLogin({ onSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      if (!response.ok) {
        throw new Error('Invalid PIN');
      }

      setAdminPin(pin);
      onSuccess?.();
    } catch (err) {
      setError('Invalid PIN. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-slate-800 dark:bg-white rounded-2xl shadow-xl p-6 border border-slate-700 dark:border-gray-200"
      >
        <h2 className="text-2xl font-bold mb-2">Admin Access</h2>
        <p className="text-sm text-slate-400 dark:text-gray-500 mb-6">
          Enter your PIN to manage workouts and exercises.
        </p>
        <input
          type="password"
          value={pin}
          onChange={(event) => setPin(event.target.value)}
          placeholder="PIN"
          className="w-full px-4 py-2 rounded-lg bg-slate-900 dark:bg-gray-100 border border-slate-700 dark:border-gray-300 text-white dark:text-gray-900 focus:outline-none focus:border-indigo-500"
        />
        {error && (
          <p className="mt-3 text-sm text-red-400">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? 'Checking...' : 'Unlock'}
        </button>
      </form>
    </div>
  );
}
