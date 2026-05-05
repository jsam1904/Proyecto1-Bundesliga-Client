let state = {
  page:       1,
  limit:      12,
  q:          '',
  sort:       'id',
  order:      'asc',
  editingId:  null,
  deletingId: null,
  allTeams:   [],
};

document.addEventListener('DOMContentLoaded', () => {
  loadTeams();
  bindEvents();
});

async function loadTeams() {
  renderSkeletons(state.limit);
  try {
    const result = await getTeams({
      q:     state.q     || undefined,
      page:  state.page,
      limit: state.limit,
      sort:  state.sort,
      order: state.order,
    });
    state.allTeams = result.data;
    renderTeams(result.data, handleEdit, handleDeleteRequest);
    renderPagination(result.page, result.total_pages, handlePageChange);
    updateStats(result.total, result.page, result.total_pages);
  } catch (err) {
    document.getElementById('teams-grid').innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⚠️</div>
        <h3>Connection error</h3>
        <p>Could not reach the API. Is the backend running?</p>
      </div>`;
  }
}

function bindEvents() {
  document.getElementById('btn-add-team').addEventListener('click', () => {
    state.editingId = null;
    openModal(null);
  });

  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('btn-cancel').addEventListener('click', closeModal);
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });

  document.getElementById('btn-save').addEventListener('click', handleSave);
  document.getElementById('btn-delete-cancel').addEventListener('click', closeDeleteModal);
  document.getElementById('btn-delete-confirm').addEventListener('click', handleDeleteConfirm);

  let searchTimer;
  document.getElementById('search-input').addEventListener('input', e => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      state.q = e.target.value.trim();
      state.page = 1;
      loadTeams();
    }, 350);
  });

  document.getElementById('sort-select').addEventListener('change', e => {
    state.sort = e.target.value;
    state.page = 1;
    loadTeams();
  });

  document.getElementById('order-select').addEventListener('change', e => {
    state.order = e.target.value;
    state.page = 1;
    loadTeams();
  });

  document.getElementById('btn-export-csv').addEventListener('click', handleExportCSV);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal(); closeDeleteModal(); }
  });
}

function handlePageChange(newPage) {
  state.page = newPage;
  loadTeams();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleEdit(team) {
  state.editingId = team.id;
  openModal(team);
}

async function handleSave() {
  clearFormErrors();
  const values = getFormValues();

  if (!values.name || !values.city || !values.stadium || !values.founded) {
    showFormErrors({ error: 'Please fill in all required fields.' });
    return;
  }

  const btn = document.getElementById('btn-save');
  btn.textContent = 'Saving...';
  btn.disabled = true;

  try {
    if (state.editingId) {
      await updateTeam(state.editingId, values);
    } else {
      await createTeam(values);
    }
    closeModal();
    loadTeams();
  } catch (err) {
    showFormErrors(err);
  } finally {
    btn.textContent = 'Save Team';
    btn.disabled = false;
  }
}

function handleDeleteRequest(id) {
  state.deletingId = id;
  openDeleteModal();
}

async function handleDeleteConfirm() {
  if (!state.deletingId) return;
  const btn = document.getElementById('btn-delete-confirm');
  btn.textContent = 'Deleting...';
  btn.disabled = true;
  try {
    await deleteTeam(state.deletingId);
    closeDeleteModal();
    if (state.allTeams.length === 1 && state.page > 1) state.page--;
    loadTeams();
  } catch (err) {
    console.error('Delete error:', err);
  } finally {
    btn.textContent = 'Delete';
    btn.disabled = false;
    state.deletingId = null;
  }
}

async function handleExportCSV() {
  const btn = document.getElementById('btn-export-csv');
  btn.textContent = 'Exporting...';
  btn.disabled = true;
  try {
    const result = await getTeams({ q: state.q, limit: 1000, sort: state.sort, order: state.order });
    exportCSV(result.data);
  } catch (err) {
    alert('Could not export. Is the backend running?');
  } finally {
    btn.textContent = 'Export CSV';
    btn.disabled = false;
  }
}