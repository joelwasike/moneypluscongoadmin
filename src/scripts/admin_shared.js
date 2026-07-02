window.AdminShared = (() => {
  const usersKey = 'usersList';
  const transactionsKey = 'transactions';
  const loginHistoryKey = 'loginHistory';
  const adminKey = 'isAdmin';
  const selectedReviewKey = 'selectedReviewEmail';

  function requireAdmin() {
    if (!localStorage.getItem(adminKey)) {
      window.location.href = 'index.html';
      return false;
    }
    return true;
  }

  function load(key, fallback = []) {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch (_) {
      return fallback;
    }
  }

  function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function users() {
    return load(usersKey);
  }

  function saveUsers(value) {
    save(usersKey, value);
  }

  function transactions() {
    return load(transactionsKey);
  }

  function saveTransactions(value) {
    save(transactionsKey, value);
  }

  function loginHistory() {
    return load(loginHistoryKey);
  }

  function saveLoginHistory(value) {
    save(loginHistoryKey, value);
  }

  function formatXAF(value) {
    const amount = Number(value || 0);
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  function normalizeStatus(value) {
    return String(value || 'pending').trim().toLowerCase();
  }

  function isApprovedStatus(value) {
    return ['approved', 'verified', 'active', 'completed'].includes(normalizeStatus(value));
  }

  function accountType(user) {
    return (user.accountType || user.account_type || user.type || 'personal').toString().toLowerCase();
  }

  function reviewMode(user) {
    return accountType(user) === 'business' ? 'kyb' : 'kyc';
  }

  function docStatus(user, mode, docId, fallback = 'pending') {
    const status = user.reviewStatus?.[mode]?.docs?.[docId];
    return normalizeStatus(status || fallback);
  }

  function setSelectedReviewEmail(email) {
    localStorage.setItem(selectedReviewKey, email);
  }

  function selectedReviewEmail() {
    return localStorage.getItem(selectedReviewKey) || '';
  }

  function openReview(email) {
    setSelectedReviewEmail(email);
    window.location.href = `kyc_review.html?email=${encodeURIComponent(email)}`;
  }

  function reviewBucket(user, mode) {
    user.reviewStatus = user.reviewStatus || {};
    user.reviewStatus[mode] = user.reviewStatus[mode] || { docs: {}, overall: 'pending' };
    return user.reviewStatus[mode];
  }

  function saveUser(user) {
    const list = users();
    const index = list.findIndex((item) => item.email === user.email);
    if (index !== -1) {
      list[index] = user;
      saveUsers(list);
    }
  }

  function sidebar(active) {
    const items = [
      ['dashboard.html', 'Dashboard'],
      ['all_users.html', 'Users'],
      ['kyc_review.html', 'KYC Review'],
      ['admin_transactions.html', 'Transactions'],
      ['logs_history.html', 'Logs History'],
    ];
    return `
      <aside class="hidden w-72 flex-col justify-between bg-slate-950 p-6 text-white lg:flex">
        <div>
          <div class="text-xl font-bold">Fast Transfer</div>
          <div class="mt-2 text-sm text-slate-300">Super Admin</div>
          <nav class="mt-8 space-y-3 text-sm">
            ${items.map(([href, label]) => `
              <a href="${href}" class="block rounded-xl px-4 py-3 ${active === label ? 'bg-white/10 font-semibold' : 'text-slate-200 hover:bg-white/10'}">${label}</a>
            `).join('')}
          </nav>
        </div>
        <button id="logoutBtn" class="rounded-xl border border-white/10 px-4 py-3 text-left text-sm text-red-300 hover:bg-red-500/10">Logout</button>
      </aside>
    `;
  }

  function shell(active, title, subtitle, content) {
    return `
      <div class="min-h-screen bg-slate-100 text-slate-900">
        <div class="mx-auto flex min-h-screen max-w-[1600px]">
          ${sidebar(active)}
          <main class="flex-1 p-4 lg:p-8">
            <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div class="flex flex-col gap-2 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">${subtitle || ''}</p>
                  <h1 class="mt-2 text-3xl font-black tracking-tight">${title}</h1>
                </div>
                <div class="text-sm text-slate-500">Main currency: XAF</div>
              </div>
              <div class="pt-6">${content}</div>
            </div>
          </main>
        </div>
      </div>
    `;
  }

  return {
    requireAdmin,
    load,
    save,
    users,
    saveUsers,
    transactions,
    saveTransactions,
    loginHistory,
    saveLoginHistory,
    formatXAF,
    normalizeStatus,
    isApprovedStatus,
    accountType,
    reviewMode,
    docStatus,
    selectedReviewEmail,
    setSelectedReviewEmail,
    openReview,
    reviewBucket,
    saveUser,
    shell,
  };
})();
