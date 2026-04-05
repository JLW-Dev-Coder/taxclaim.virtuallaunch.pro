/**
 * TaxClaim VLP API Client
 * All API calls route through api.virtuallaunch.pro with vlp_session cookie auth.
 */
const API_BASE = 'https://api.virtuallaunch.pro';

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function generateForm843(data) {
  return apiFetch('/v1/tcvlp/forms/843/generate', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

async function downloadForm843(formId) {
  const res = await fetch(`${API_BASE}/v1/tcvlp/forms/843/${formId}/download`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Download failed');
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Form-843.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

async function getSession() {
  return apiFetch('/v1/auth/session');
}

async function uploadTranscript(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/v1/tcvlp/transcript/upload`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}

async function getReviews() {
  return apiFetch('/v1/tcvlp/reviews');
}

async function submitReviewAPI(review) {
  return apiFetch('/v1/tcvlp/reviews', {
    method: 'POST',
    body: JSON.stringify(review),
  });
}
