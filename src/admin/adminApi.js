export const getAdminPin = () => localStorage.getItem('admin_pin') || '';

export const setAdminPin = (pin) => {
  localStorage.setItem('admin_pin', String(pin));
};

export const clearAdminPin = () => {
  localStorage.removeItem('admin_pin');
};

export const adminFetch = async (url, options = {}) => {
  const pin = getAdminPin();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (pin) {
    headers['x-admin-pin'] = pin;
  }

  const response = await fetch(url, { ...options, headers });
  if (response.status === 401) {
    clearAdminPin();
    throw new Error('unauthorized');
  }
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'request_failed');
  }
  return response.json();
};
