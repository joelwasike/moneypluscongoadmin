(function () {
  const shared = window.AdminShared;
  shared.requireAdmin();

  const logs = () => shared.loadLoginHistory().slice().reverse();

  const render = () => {
    const items = logs();
    const content = `
      <section class="grid gap-6">
        <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 class="text-2xl font-semibold text-gray-900">Logs History</h2>
          <p class="mt-1 text-sm text-gray-500">Recent sessions and login events.</p>
        </div>

        <div class="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-100">
              <thead class="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                <tr>
                  <th class="px-4 py-3">User</th>
                  <th class="px-4 py-3">Email</th>
                  <th class="px-4 py-3">Time</th>
                  <th class="px-4 py-3">Device</th>
                  <th class="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                ${
                  items.length
                    ? items
                        .map((log) => `
                          <tr class="border-t border-gray-100">
                            <td class="px-4 py-4 font-semibold text-gray-900">${log.name || log.user || '-'}</td>
                            <td class="px-4 py-4 text-sm text-gray-600">${log.email || '-'}</td>
                            <td class="px-4 py-4 text-sm text-gray-600">${log.createdAt ? new Date(log.createdAt).toLocaleString() : '-'}</td>
                            <td class="px-4 py-4 text-sm text-gray-600">${log.device || log.platform || '-'}</td>
                            <td class="px-4 py-4 text-sm text-gray-600">${log.status || 'success'}</td>
                          </tr>
                        `)
                        .join('')
                    : '<tr><td colspan="5" class="px-4 py-10 text-center text-sm text-gray-500">No logs found.</td></tr>'
                }
              </tbody>
            </table>
          </div>
        </div>
      </section>
    `;

    document.getElementById('app').innerHTML = shared.shell('Logs History', 'Logs History', 'Audit sign-ins and access history', content);
  };

  render();
})();
