(function () {
  const shared = window.AdminShared;
  shared.requireAdmin();

  const saveTransactions =
    typeof shared.saveTransactions === 'function'
      ? shared.saveTransactions
      : (items) => localStorage.setItem('transactions', JSON.stringify(items));

  const userByEmail = (email) => shared.loadUsers().find((user) => user.email === email);

  const refund = (transaction) => {
    if (!confirm(`Refund ${shared.formatXAF(transaction.amount)} for ${transaction.email || transaction.receiver || 'this transaction'}?`)) return;
    const transactions = shared.loadTransactions().map((item) => {
      if ((item.id && item.id === transaction.id) || item.createdAt === transaction.createdAt) {
        return { ...item, status: 'refunded', refundedAt: new Date().toISOString() };
      }
      return item;
    });
    saveTransactions(transactions);
    render();
  };

  const rows = (items) =>
    items
      .map((transaction) => {
        const user = userByEmail(transaction.email || transaction.senderEmail || transaction.from || '');
        const status = transaction.status || 'completed';
        return `
          <tr class="border-t border-gray-100">
            <td class="px-4 py-4">
              <div class="font-semibold text-gray-900">${transaction.type || 'Transfer'}</div>
              <div class="text-sm text-gray-500">${transaction.email || transaction.senderEmail || transaction.from || '-'}</div>
            </td>
            <td class="px-4 py-4">${user ? user.name : '-'}</td>
            <td class="px-4 py-4">${shared.formatXAF(transaction.amount || 0)}</td>
            <td class="px-4 py-4 capitalize">${status}</td>
            <td class="px-4 py-4 text-sm text-gray-500">${transaction.createdAt ? new Date(transaction.createdAt).toLocaleString() : '-'}</td>
            <td class="px-4 py-4 text-right">
              <button type="button" data-refund="${transaction.id || transaction.createdAt || ''}" class="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">Refund</button>
            </td>
          </tr>
        `;
      })
      .join('');

  const render = () => {
    const transactions = shared.loadTransactions().slice().reverse();
    const content = `
      <section class="grid gap-6">
        <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 class="text-2xl font-semibold text-gray-900">Transactions</h2>
          <p class="mt-1 text-sm text-gray-500">All values are shown in XAF.</p>
        </div>

        <div class="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-100">
              <thead class="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                <tr>
                  <th class="px-4 py-3">Transaction</th>
                  <th class="px-4 py-3">User</th>
                  <th class="px-4 py-3">Amount</th>
                  <th class="px-4 py-3">Status</th>
                  <th class="px-4 py-3">Date</th>
                  <th class="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                ${transactions.length ? rows(transactions) : '<tr><td colspan="6" class="px-4 py-10 text-center text-sm text-gray-500">No transactions found.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    `;
    document.getElementById('app').innerHTML = shared.shell('Transactions', 'Transactions', 'Refund and track money movement', content);
    document.querySelectorAll('[data-refund]').forEach((button) => {
      button.addEventListener('click', () => {
        const id = button.getAttribute('data-refund');
        const transaction = shared.loadTransactions().find((item) => (item.id && item.id === id) || item.createdAt === id);
        if (transaction) refund(transaction);
      });
    });
  };

  render();
})();
