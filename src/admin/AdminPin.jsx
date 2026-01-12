import React, { useState } from 'react';
import { adminFetch, setAdminPin } from './adminApi';

export default function AdminPin() {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('');

    if (!newPin || newPin.trim().length < 4) {
      setStatus('New PIN must be at least 4 digits.');
      return;
    }

    if (newPin !== confirmPin) {
      setStatus('New PIN entries do not match.');
      return;
    }

    setSaving(true);
    try {
      await adminFetch('/api/admin/pin', {
        method: 'POST',
        body: JSON.stringify({
          currentPin,
          newPin,
        }),
      });
      setAdminPin(newPin);
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
      setStatus('PIN updated.');
    } catch (error) {
      console.error(error);
      setStatus('PIN update failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 dark:bg-white rounded-2xl p-6 border border-slate-700 dark:border-gray-200"
      >
        <h2 className="text-2xl font-bold mb-2">Change Admin PIN</h2>
        <p className="text-sm text-slate-400 dark:text-gray-500 mb-6">
          Update the PIN used to access admin tools.
        </p>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-bold">Current PIN</label>
            <input
              type="password"
              value={currentPin}
              onChange={(event) => setCurrentPin(event.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 dark:bg-gray-100 border border-slate-700 dark:border-gray-300"
            />
          </div>
          <div>
            <label className="text-sm font-bold">New PIN</label>
            <input
              type="password"
              value={newPin}
              onChange={(event) => setNewPin(event.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 dark:bg-gray-100 border border-slate-700 dark:border-gray-300"
            />
          </div>
          <div>
            <label className="text-sm font-bold">Confirm New PIN</label>
            <input
              type="password"
              value={confirmPin}
              onChange={(event) => setConfirmPin(event.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 dark:bg-gray-100 border border-slate-700 dark:border-gray-300"
            />
          </div>
        </div>
        {status && (
          <p className="mt-4 text-sm text-slate-400">{status}</p>
        )}
        <button
          type="submit"
          disabled={saving}
          className="mt-5 px-5 py-2 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:opacity-60"
        >
          {saving ? 'Updating...' : 'Update PIN'}
        </button>
      </form>
    </div>
  );
}
