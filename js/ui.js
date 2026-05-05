const grid       = document.getElementById('teams-grid');
const pagination = document.getElementById('pagination');
const statsText  = document.getElementById('stats-text');

function renderSkeletons(count = 6) {
  grid.innerHTML = Array.from({ length: count })
    .map(() => `<div class="skeleton-card"></div>`)
    .join('');
}

function renderTeams(teams, onEdit, onDelete) {
  if (!teams.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="12" y2="17"/></svg></div>
        <h3>No teams found</h3>
        <p>Try a different search or add a new team.</p>
      </div>`;
    return;
  }

  grid.innerHTML = teams.map((team, i) => buildCard(team, i)).join('');

  teams.forEach(team => {
    document.getElementById(`edit-${team.id}`)
      .addEventListener('click', () => onEdit(team));
    document.getElementById(`delete-${team.id}`)
      .addEventListener('click', () => onDelete(team.id));
  });
}

function buildCard(team, index) {
  const imageHTML = team.image_url
    ? `<img src="${escapeHTML(team.image_url)}" alt="${escapeHTML(team.name)}" onerror="this.parentElement.innerHTML='<span class=no-image></span>'" />`
    : `<span class="no-image"></span>`;

  return `
    <article class="team-card" style="animation-delay:${index * 35}ms">
      <div class="card-crest">${imageHTML}</div>
      <div class="card-info">
        <h2 class="card-name">${escapeHTML(team.name)}</h2>
        <p class="card-city">${escapeHTML(team.city)}</p>
        <span class="card-year">Est. ${team.founded}</span>
      </div>
      <div class="card-footer">
        <span class="card-stadium">${escapeHTML(team.stadium)}</span>
        <div class="card-actions">
          <button type="button" class="card-btn edit" id="edit-${team.id}" title="Edit team">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button type="button" class="card-btn delete" id="delete-${team.id}" title="Delete team">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          </button>
        </div>
      </div>
    </article>`;
}

function renderPagination(currentPage, totalPages, onPageChange) {
  if (totalPages <= 1) { pagination.innerHTML = ''; return; }

  let html = `<button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">← Prev</button>`;

  getPageRange(currentPage, totalPages).forEach(p => {
    if (p === '...') {
      html += `<span class="page-btn" style="pointer-events:none;opacity:.4">…</span>`;
    } else {
      html += `<button class="page-btn ${p === currentPage ? 'active' : ''}" data-page="${p}">${p}</button>`;
    }
  });

  html += `<button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">Next →</button>`;
  pagination.innerHTML = html;

  pagination.querySelectorAll('[data-page]').forEach(btn => {
    btn.addEventListener('click', () => onPageChange(Number(btn.dataset.page)));
  });
}

function getPageRange(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
  if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '...', current - 1, current, current + 1, '...', total];
}

function updateStats(total, page, totalPages) {
  statsText.textContent = `${total} team${total !== 1 ? 's' : ''} — Page ${page} of ${totalPages}`;
}

function openModal(team = null) {
  document.getElementById('modal-title').textContent = team ? 'Edit Team' : 'Add Team';
  document.getElementById('field-name').value    = team?.name      ?? '';
  document.getElementById('field-city').value    = team?.city      ?? '';
  document.getElementById('field-stadium').value = team?.stadium   ?? '';
  document.getElementById('field-founded').value = team?.founded   ?? '';
  document.getElementById('field-image').value   = team?.image_url ?? '';
  clearFormErrors();
  document.getElementById('modal-overlay').classList.add('open');
  document.getElementById('field-name').focus();
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}

function openDeleteModal() {
  document.getElementById('delete-overlay').classList.add('open');
}

function closeDeleteModal() {
  document.getElementById('delete-overlay').classList.remove('open');
}

function getFormValues() {
  return {
    name:      document.getElementById('field-name').value.trim(),
    city:      document.getElementById('field-city').value.trim(),
    stadium:   document.getElementById('field-stadium').value.trim(),
    founded:   parseInt(document.getElementById('field-founded').value, 10),
    image_url: document.getElementById('field-image').value.trim() || null,
  };
}

function showFormErrors(error) {
  const el = document.getElementById('form-error');
  el.textContent = error.error || 'Something went wrong';
  el.classList.add('visible');
  if (error.details) {
    Object.entries(error.details).forEach(([field, msg]) => {
      const errEl   = document.getElementById(`err-${field}`);
      const inputEl = document.getElementById(`field-${field}`);
      if (errEl)   { errEl.textContent = msg; errEl.classList.add('visible'); }
      if (inputEl) inputEl.classList.add('error');
    });
  }
}

function clearFormErrors() {
  document.getElementById('form-error').classList.remove('visible');
  ['name', 'city', 'stadium', 'founded'].forEach(f => {
    const errEl   = document.getElementById(`err-${f}`);
    const inputEl = document.getElementById(`field-${f}`);
    if (errEl)   { errEl.textContent = ''; errEl.classList.remove('visible'); }
    if (inputEl) inputEl.classList.remove('error');
  });
}

function exportCSV(teams) {
  const headers = ['ID', 'Name', 'City', 'Stadium', 'Founded', 'Image URL'];
  const rows = teams.map(t => [
    t.id,
    csvEscape(t.name),
    csvEscape(t.city),
    csvEscape(t.stadium),
    t.founded,
    csvEscape(t.image_url ?? ''),
  ]);
  const csv  = [headers, ...rows].map(row => row.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = 'bundesliga-teams.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function csvEscape(value) {
  const str = String(value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function escapeHTML(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}