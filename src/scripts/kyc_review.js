(() => {
  const adminKey = 'isAdmin';
  const usersKey = 'usersList';
  const selectedKey = 'selectedReviewEmail';

  const state = {
    query: new URLSearchParams(window.location.search),
    users: [],
    mode: 'kyc',
  };

  function isAdmin() {
    return Boolean(localStorage.getItem(adminKey));
  }

  function loadUsers() {
    return JSON.parse(localStorage.getItem(usersKey)) || [];
  }

  function saveUsers(users) {
    localStorage.setItem(usersKey, JSON.stringify(users));
  }

  function xaf(value) {
    const amount = Number(value || 0);
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, (ch) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    })[ch]);
  }

  function truthy(value) {
    if (value === true || value === 1) return true;
    return String(value || '').toLowerCase() === 'true';
  }

  function accountType(user) {
    return (user.accountType || user.account_type || user.type || 'personal').toString().toLowerCase();
  }

  function reviewMode(user) {
    return accountType(user) === 'business' ? 'kyb' : 'kyc';
  }

  function normalizeStatus(value) {
    return String(value || 'not_submitted').trim().toLowerCase();
  }

  function isApproved(status) {
    return ['approved', 'verified', 'active', 'completed'].includes(normalizeStatus(status));
  }

  function reviewBucket(user, mode) {
    user.reviewStatus = user.reviewStatus || {};
    user.reviewStatus[mode] = user.reviewStatus[mode] || { docs: {}, overall: 'pending' };
    return user.reviewStatus[mode];
  }

  function docStatus(user, mode, docId, fallbackStatus) {
    const bucket = user.reviewStatus?.[mode];
    const byReview = bucket?.docs?.[docId];
    return normalizeStatus(byReview || fallbackStatus || 'pending');
  }

  function isImageUrl(url) {
    return /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(url) || String(url).startsWith('data:image/');
  }

  function pushDoc(list, user, id, label, url, extra = {}) {
    if (!url) return;
    list.push({
      id,
      label,
      url,
      status: docStatus(user, state.mode, id, extra.status),
      note: extra.note || '',
    });
  }

  function collectDocs(user) {
    const docs = [];
    const mode = reviewMode(user);
    state.mode = mode;

    if (Array.isArray(user.kycDocuments) || Array.isArray(user.kybDocuments)) {
      const source = mode === 'kyb' ? user.kybDocuments : user.kycDocuments;
      source?.forEach((doc, index) => {
        if (!doc) return;
        const id = String(doc.id || doc.key || doc.label || doc.name || index);
        const url = doc.url || doc.value || doc.file || doc.document || doc.preview || '';
        if (!url) return;
        docs.push({
          id,
          label: doc.label || doc.title || doc.name || `Document ${index + 1}`,
          url,
          status: docStatus(user, mode, id, doc.status),
          note: doc.note || '',
        });
      });
    }

    const known = mode === 'kyb'
      ? [
          ['rccmUrl', 'RCCM extract'],
          ['bylawsUrl', 'Company bylaws'],
          ['niuCertUrl', 'NIU certificate'],
          ['proofOfficeUrl', 'Proof of office'],
          ['repIdUrl', 'Representative ID'],
          ['bankStatementUrl', 'Bank statement'],
          ['poaUrl', 'Power of attorney'],
          ['selfieUrl', 'Representative selfie'],
        ]
      : [
          ['idDocumentUrl', 'ID document'],
          ['idDocumentFrontUrl', 'ID front'],
          ['idDocumentBackUrl', 'ID back'],
          ['selfieUrl', 'Selfie'],
          ['proofOfAddressUrl', 'Proof of address'],
          ['proofOfIncomeUrl', 'Proof of income'],
        ];

    known.forEach(([key, label]) => pushDoc(docs, user, key, label, user[key]));

    if (Array.isArray(user.documents)) {
      user.documents.forEach((doc, index) => {
        if (!doc) return;
        const id = String(doc.id || doc.key || doc.label || doc.name || index);
        const url = doc.url || doc.value || doc.file || doc.document || doc.preview || '';
        if (!url) return;
        const docMode = String(doc.mode || doc.kind || doc.type || '').toLowerCase();
        if (docMode && docMode !== mode) return;
        docs.push({
          id,
          label: doc.label || doc.title || doc.name || `Document ${index + 1}`,
          url,
          status: docStatus(user, mode, id, doc.status),
          note: doc.note || '',
        });
      });
    }

    return docs;
  }

  function userLabel(user) {
    return [user.name, user.email].filter(Boolean).join(' • ');
  }

  function statusChip(status) {
    const normalized = normalizeStatus(status);
    const style = normalized === 'approved'
      ? 'bg-green-100 text-green-700'
      : normalized === 'rejected'
        ? 'bg-red-100 text-red-700'
        : normalized === 'needs_more_info'
          ? 'bg-amber-100 text-amber-700'
          : 'bg-gray-100 text-gray-700';
    const label = normalized.replaceAll('_', ' ');
    return `<span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${style}">${esc(label)}</span>`;
  }

  function approvedAll(docs) {
    return docs.length > 0 && docs.every((doc) => normalizeStatus(doc.status) === 'approved');
  }

  function persistUser(updated) {
    const users = loadUsers();
    const index = users.findIndex((user) => user.email === updated.email);
    if (index !== -1) {
      users[index] = updated;
      saveUsers(users);
      state.users = users;
    }
  }

  function openDetail(email) {
    localStorage.setItem(selectedKey, email);
    window.location.href = `kyc_review.html?email=${encodeURIComponent(email)}`;
  }

  function resolveUser(email) {
    const users = state.users.length ? state.users : loadUsers();
    return users.find((user) => user.email === email) || null;
  }

  function renderShell(title, subtitle, content) {
    document.getElementById('app').innerHTML = `
      <div class="min-h-screen bg-slate-100 text-slate-900">
        <div class="mx-auto flex min-h-screen max-w-[1600px]">
          <aside class="hidden w-72 flex-col justify-between bg-slate-950 p-6 text-white lg:flex">
            <div>
              <div class="text-xl font-bold">Fast Transfer</div>
              <div class="mt-2 text-sm text-slate-300">Super Admin</div>
              <nav class="mt-8 space-y-3 text-sm">
                <a href="dashboard.html" class="block rounded-xl px-4 py-3 text-slate-200 hover:bg-white/10">Dashboard</a>
                <a href="all_users.html" class="block rounded-xl px-4 py-3 text-slate-200 hover:bg-white/10">Users</a>
                <a href="kyc_review.html" class="block rounded-xl bg-white/10 px-4 py-3 font-semibold">KYC Review</a>
                <a href="admin_transactions.html" class="block rounded-xl px-4 py-3 text-slate-200 hover:bg-white/10">Transactions</a>
                <a href="logs_history.html" class="block rounded-xl px-4 py-3 text-slate-200 hover:bg-white/10">Logs History</a>
              </nav>
            </div>
            <button id="logoutBtn" class="rounded-xl border border-white/10 px-4 py-3 text-left text-sm text-red-300 hover:bg-red-500/10">Logout</button>
          </aside>
          <main class="flex-1 p-4 lg:p-8">
            <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div class="flex flex-col gap-2 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">${esc(subtitle)}</p>
                  <h1 class="mt-2 text-3xl font-black tracking-tight">${esc(title)}</h1>
                </div>
                <div class="text-sm text-slate-500">Main currency: XAF</div>
              </div>
              <div class="pt-6">${content}</div>
            </div>
          </main>
        </div>
      </div>
    `;

    document.getElementById('logoutBtn')?.addEventListener('click', () => {
      localStorage.removeItem(adminKey);
      window.location.href = 'index.html';
    });
  }

  function renderList() {
    const pendingUsers = state.users.filter((user) => {
      const mode = reviewMode(user);
      const status = normalizeStatus(user[mode === 'kyb' ? 'kybStatus' : 'kycStatus'] || user.verificationStatus || user.status);
      return !isApproved(status);
    });
    const rows = pendingUsers.map((user) => {
      const mode = reviewMode(user);
      const docs = collectDocs(user);
      const status = normalizeStatus(user[mode === 'kyb' ? 'kybStatus' : 'kycStatus'] || user.verificationStatus || user.status);
      return `
        <tr class="cursor-pointer border-b border-slate-100 hover:bg-slate-50" data-email="${esc(user.email)}">
          <td class="px-4 py-4">
            <div class="font-semibold">${esc(user.name || 'Unnamed user')}</div>
            <div class="text-xs text-slate-500">${esc(user.email || '')}</div>
          </td>
          <td class="px-4 py-4">${esc(accountType(user))}</td>
          <td class="px-4 py-4">${statusChip(status)}</td>
          <td class="px-4 py-4">${docs.length}</td>
          <td class="px-4 py-4 text-right">
            <button class="view-btn rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Review</button>
          </td>
        </tr>
      `;
    }).join('');

    renderShell(
      'KYC Review',
      'Admin review queue',
      `
        <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input id="searchInput" type="text" placeholder="Search users"
            class="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-0 placeholder:text-slate-400 focus:border-slate-400 sm:max-w-md" />
          <div class="text-sm text-slate-500">${pendingUsers.length} user${pendingUsers.length === 1 ? '' : 's'} awaiting review</div>
        </div>
        <div class="overflow-hidden rounded-2xl border border-slate-200">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              <tr>
                <th class="px-4 py-3">User</th>
                <th class="px-4 py-3">Type</th>
                <th class="px-4 py-3">Status</th>
                <th class="px-4 py-3">Docs</th>
                <th class="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody id="reviewRows" class="divide-y divide-slate-100 bg-white">
              ${rows || '<tr><td colspan="5" class="px-4 py-10 text-center text-slate-500">No users pending review.</td></tr>'}
            </tbody>
          </table>
        </div>
      `
    );

    const searchInput = document.getElementById('searchInput');
    const reviewRows = document.getElementById('reviewRows');

    searchInput?.addEventListener('input', () => {
      const value = searchInput.value.trim().toLowerCase();
      reviewRows.querySelectorAll('tr').forEach((row) => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(value) ? '' : 'none';
      });
    });

    reviewRows?.addEventListener('click', (event) => {
      const row = event.target.closest('tr[data-email]');
      if (!row) return;
      openDetail(row.dataset.email);
    });
  }

  function renderModal() {
    const modal = document.getElementById('docModal');
    const img = document.getElementById('docPreview');
    modal?.classList.add('hidden');
    img.src = '';
  }

  function saveDocApproval(user, mode, docId, status) {
    const bucket = reviewBucket(user, mode);
    bucket.docs[docId] = status;
    const docs = collectDocs(user).map((doc) => ({
      ...doc,
      status: doc.id === docId ? status : doc.status,
    }));
    const allApproved = approvedAll(docs);
    bucket.overall = allApproved ? 'approved' : 'pending';
    user[mode === 'kyb' ? 'kybStatus' : 'kycStatus'] = bucket.overall;
    user[mode === 'kyb' ? 'kyb_verified' : 'kyc_verified'] = allApproved;
    user.verificationStatus = allApproved ? 'approved' : 'pending_review';
    if (allApproved && mode === 'kyb') {
      user.kyc_verified = true;
    }
    persistUser(user);
    openDetail(user.email);
  }

  function approveAll(user, mode, docs) {
    const bucket = reviewBucket(user, mode);
    docs.forEach((doc) => {
      bucket.docs[doc.id] = 'approved';
    });
    bucket.overall = 'approved';
    user[mode === 'kyb' ? 'kybStatus' : 'kycStatus'] = 'approved';
    user[mode === 'kyb' ? 'kyb_verified' : 'kyc_verified'] = true;
    user.verificationStatus = 'approved';
    if (mode === 'kyb') user.kyc_verified = true;
    persistUser(user);
    openDetail(user.email);
  }

  function renderDetail(user) {
    const mode = reviewMode(user);
    const docs = collectDocs(user);
    const allApproved = approvedAll(docs);
    const overallStatus = normalizeStatus(user[mode === 'kyb' ? 'kybStatus' : 'kycStatus'] || user.verificationStatus || user.status);
    const title = mode === 'kyb' ? 'KYB Review' : 'KYC Review';
    const subtitle = user.email || 'Selected user';
    const docCards = docs.length
      ? docs.map((doc) => {
          const approved = normalizeStatus(doc.status) === 'approved';
          const preview = isImageUrl(doc.url)
            ? `<img src="${esc(doc.url)}" alt="${esc(doc.label)}" class="h-44 w-full rounded-2xl object-cover" />`
            : `<div class="flex h-44 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 text-center text-sm text-slate-500">Open document</div>`;
          return `
            <article class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <button class="doc-open w-full text-left" data-url="${esc(doc.url)}" data-label="${esc(doc.label)}">
                <div class="p-4">
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <div class="text-sm font-semibold text-slate-900">${esc(doc.label)}</div>
                      <div class="mt-1 text-xs text-slate-500">${esc(doc.note || 'Tap to preview document')}</div>
                    </div>
                    ${statusChip(doc.status)}
                  </div>
                </div>
                <div class="px-4 pb-4">${preview}</div>
              </button>
              <div class="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-4 py-3">
                <span class="text-xs text-slate-500">${approved ? 'Approved' : 'Awaiting review'}</span>
                <button class="approve-doc rounded-xl ${approved ? 'bg-emerald-600' : 'bg-slate-950'} px-4 py-2 text-sm font-semibold text-white" data-id="${esc(doc.id)}" data-status="${approved ? 'approved' : 'pending'}">
                  ${approved ? 'Approved' : 'Approve document'}
                </button>
              </div>
            </article>
          `;
        }).join('')
      : '<div class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">No submitted documents were found on this user record.</div>';

    renderShell(
      title,
      `${userLabel(user)} • ${mode.toUpperCase()}`,
      `
        <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div class="text-sm text-slate-500">Account type</div>
            <div class="text-lg font-semibold">${esc(accountType(user))}</div>
          </div>
          <div>
            <div class="text-sm text-slate-500">Current status</div>
            <div class="mt-1">${statusChip(overallStatus)}</div>
          </div>
          <div class="flex gap-3">
            <a href="kyc_review.html" class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Back to list</a>
            <button id="approveAllBtn" class="rounded-xl ${allApproved ? 'bg-emerald-600' : 'bg-slate-950'} px-4 py-2 text-sm font-semibold text-white" ${allApproved ? '' : docs.length === 0 ? 'disabled' : ''}>
              ${mode === 'kyb' ? 'Mark KYB approved' : 'Mark KYC approved'}
            </button>
          </div>
        </div>
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          ${docCards}
        </div>
        <div id="docModal" class="hidden fixed inset-0 z-50 bg-slate-950/80 p-4">
          <div class="mx-auto flex h-full max-w-5xl items-center justify-center">
            <div class="w-full rounded-3xl bg-white p-4 shadow-2xl">
              <div class="mb-3 flex items-center justify-between gap-3">
                <div class="text-lg font-semibold" id="docModalTitle">Document preview</div>
                <button id="closeModal" class="rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">Close</button>
              </div>
              <div class="max-h-[75vh] overflow-auto rounded-2xl bg-slate-50 p-3">
                <img id="docPreview" alt="Document preview" class="mx-auto max-h-[70vh] w-auto rounded-2xl object-contain" />
              </div>
            </div>
          </div>
        </div>
      `
    );

    document.getElementById('approveAllBtn')?.addEventListener('click', () => {
      if (!docs.length) return;
      approveAll(user, mode, docs);
    });

    document.querySelectorAll('.approve-doc').forEach((button) => {
      button.addEventListener('click', () => {
        const docId = button.getAttribute('data-id');
        if (!docId) return;
        saveDocApproval(user, mode, docId, 'approved');
      });
    });

    document.querySelectorAll('.doc-open').forEach((button) => {
      button.addEventListener('click', () => {
        const url = button.getAttribute('data-url');
        const label = button.getAttribute('data-label');
        const modal = document.getElementById('docModal');
        const preview = document.getElementById('docPreview');
        const title = document.getElementById('docModalTitle');
        if (!url || !modal || !preview || !title) return;
        preview.src = url;
        title.textContent = label || 'Document preview';
        modal.classList.remove('hidden');
      });
    });

    document.getElementById('closeModal')?.addEventListener('click', renderModal);
    document.getElementById('docModal')?.addEventListener('click', (event) => {
      if (event.target.id === 'docModal') renderModal();
    });
  }

  function init() {
    if (!isAdmin()) {
      window.location.href = 'index.html';
      return;
    }

    state.users = loadUsers();
    const email = state.query.get('email') || localStorage.getItem(selectedKey);
    if (email) {
      const user = resolveUser(email);
      if (user) {
        renderDetail(user);
        return;
      }
    }
    renderList();
  }

  window.addEventListener('DOMContentLoaded', init);
})();
