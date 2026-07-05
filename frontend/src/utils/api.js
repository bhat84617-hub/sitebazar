const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function request(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.message || 'Something went wrong');
    error.statusCode = res.status;
    error.payload = data;
    throw error;
  }
  return data;
}

export const api = {
  identify: (email) => request('/api/auth/identify', { method: 'POST', body: { email } }),
  generateWebsite: (payload, token) => request('/api/generate-website', { method: 'POST', body: payload, token }),
  downloadWebsite: (payload, token) => request('/api/download-website', { method: 'POST', body: payload, token }),
  getWebsite: (id, token) => request(`/api/website/${id}`, { token }),
  createOrder: (planType, token) => request('/api/create-order', { method: 'POST', body: { planType }, token }),
  verifyPayment: (payload, token) => request('/api/verify-payment', { method: 'POST', body: payload, token }),
  myDashboard: (token) => request('/api/my-dashboard', { token }),
  adminUsers: (token) => request('/api/admin/users', { token }),
  adminWebsites: (token) => request('/api/admin/websites', { token }),
  adminStats: (token) => request('/api/admin/stats', { token })
};

export { API_URL };
