const API_BASE = 'https://proyecto1-tracker-api-production.up.railway.app';

async function getTeams(params = {}) {
  const url = new URL(`${API_BASE}/teams`);
  if (params.q)     url.searchParams.set('q',     params.q);
  if (params.page)  url.searchParams.set('page',  params.page);
  if (params.limit) url.searchParams.set('limit', params.limit);
  if (params.sort)  url.searchParams.set('sort',  params.sort);
  if (params.order) url.searchParams.set('order', params.order);

  const res = await fetch(url.toString());
  if (!res.ok) throw await res.json();
  return res.json();
}

async function getTeam(id) {
  const res = await fetch(`${API_BASE}/teams/${id}`);
  if (!res.ok) throw await res.json();
  return res.json();
}

async function createTeam(data) {
  const res = await fetch(`${API_BASE}/teams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

async function updateTeam(id, data) {
  const res = await fetch(`${API_BASE}/teams/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

async function deleteTeam(id) {
  const res = await fetch(`${API_BASE}/teams/${id}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) throw await res.json();
}