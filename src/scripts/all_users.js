(function () {
  const shared = window.AdminShared;
  shared.requireAdmin();

  const accountTypeLabel = (user) => {
    if (typeof shared.accountType === 'function') return shared.accountType(user);
    return user.accountType || user.type || 'personal';
  };

  const verificationLabel = (user) => {
    if (typeof shared.verificationStatus === 'function') return shared.verificationStatus(user);
    const verified = user.kycStatus === 'approved' || user.kybStatus === 'approved' || user.verificationStatus === 'approved';
    return {
      label: verified ? 'Approved' : 'Pending review',
      className: verified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700',
    };
  };

  const countDocs = (user) => {
    const files = [];
    const push = (value) => {
      if (Array.isArray(value)) {
        value.forEach(push);
      } else if (value && typeof value === 'object') {
        Object.values(value).forEach(push);
      } else if (typeof value === 'string' && value.trim()) {
        files.push(value);
      }
    };

    push(user.kycDocuments);
    push(user.kybDocuments);
    push(user.documents);

    [
      'idDocumentUrl',
      'idDocumentFrontUrl',
      'idDocumentBackUrl',
      'selfieUrl',
      'proofOfAddressUrl',
      'proofOfIncomeUrl',
      'rccmUrl',
      'bylawsUrl',
      'niuCertUrl',
      'proofOfficeUrl',
      'repIdUrl',
      'bankStatementUrl',
      'poaUrl',
    ].forEach((key) => {
      if (user[key]) files.push(user[key]);
    });

    return new Set(files).size;
  };

  const users = () => shared.loadUsers();

  const rows = (items, filter) => {
    return items
      .filter((user) => {
        if (!filter) return true;
        const blob = `${user.name || ''} ${user.email || ''} ${user.accountType || ''} ${user.verificationStatus || ''}`.toLowerCase();
        return blob.includes(filter.toLowerCase());
      })
      .map((user) => {
        const status = verificationLabel(user);
        const docs = countDocs(user);
        return `
          <tr class="border-t border-gray-100 hover:bg-blue-50 cursor-pointer" data-email="${user.email || ''}">
            <td class="px-4 py-4">
              <div class="font-semibold text-gray-900">${user.name || 'Unnamed user'}</div>
              <div class="text-sm text-gray-500">${user.email || '-'}</div>
            </td>
            <td class="px-4 py-4 capitalize">${accountTypeLabel(user)}</td>
            <td class="px-4 py-4">${shared.formatXAF(user.balance || 0)}</td>
            <td class="px-4 py-4">
              <span class="inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.className}">${status.label}</span>
            </td>
            <td class="px-4 py-4 text-sm text-gray-700">${docs}</td>
            <td class="px-4 py-4 text-right">
              <button type="button" class="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white">Open docs</button>
            </td>
          </tr>
        `;
      })
      .join('');
  };

  const render = (filter = '') => {
    const items = users();
    const content = `
      <section class="grid gap-6">
        <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 class="text-2xl font-semibold text-gray-900">Users</h2>
              <p class="mt-1 text-sm text-gray-500">Click any user to review KYC/KYB documents and approve them individually.</p>
            </div>
            <div class="w-full md:w-80">
              <label class="block text-sm font-medium text-gray-600">Search</label>
              <input id="userSearch" value="${filter}" type="search" placeholder="Name, email, type, status" class="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none ring-0 focus:border-blue-500" />
            </div>
          </div>
        </div>

        <div class="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-100">
              <thead class="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                <tr>
                  <th class="px-4 py-3">User</th>
                  <th class="px-4 py-3">Type</th>
                  <th class="px-4 py-3">Balance</th>
                  <th class="px-4 py-3">Verification</th>
                  <th class="px-4 py-3">Docs</th>
                  <th class="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                ${items.length ? rows(items, filter) : '<tr><td colspan="6" class="px-4 py-10 text-center text-sm text-gray-500">No users found.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    `;

    document.getElementById('app').innerHTML = shared.shell('Users', 'Users', 'Review and approve customer accounts', content);

    const input = document.getElementById('userSearch');
    if (input) {
      input.addEventListener('input', (event) => render(event.target.value));
    }

    document.querySelectorAll('[data-email]').forEach((row) => {
      row.addEventListener('click', () => {
        shared.openReview(row.getAttribute('data-email'));
      });
    });
  };

  render();
})();
