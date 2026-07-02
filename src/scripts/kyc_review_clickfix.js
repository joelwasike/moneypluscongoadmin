(function () {
  const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;

  function openReviewFromElement(element) {
    if (!element) return;
    const email =
      element.getAttribute('data-review-email') ||
      element.getAttribute('data-email') ||
      element.getAttribute('data-user-email') ||
      element.getAttribute('data-open-email');
    if (!email) return;
    const url = new URL(window.location.href);
    url.searchParams.set('email', email);
    window.location.href = url.pathname + url.search;
  }

  function emailFromText(element) {
    if (!element) return '';
    const text = element.textContent || '';
    const match = text.match(emailPattern);
    return match ? match[0] : '';
  }

  function shouldIgnoreTarget(target) {
    return Boolean(target.closest('button, input, select, textarea, label, a, [role="button"]'));
  }

  function findReviewRow(target) {
    return target.closest(
      '[data-review-email], [data-email], [data-user-email], [data-open-email], table tr, tbody tr, li, .review-item, .review-card, .user-item, .user-row'
    );
  }

  document.addEventListener('click', (event) => {
    if (shouldIgnoreTarget(event.target)) return;
    const row = findReviewRow(event.target);
    if (!row) return;
    const explicit = row.getAttribute('data-review-email') || row.getAttribute('data-email') || row.getAttribute('data-user-email') || row.getAttribute('data-open-email');
    const email = explicit || emailFromText(row);
    if (!email) return;
    const url = new URL(window.location.href);
    url.searchParams.set('email', email);
    window.location.href = url.pathname + url.search;
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    if (shouldIgnoreTarget(event.target)) return;
    const row = findReviewRow(event.target);
    if (!row) return;
    event.preventDefault();
    const explicit = row.getAttribute('data-review-email') || row.getAttribute('data-email') || row.getAttribute('data-user-email') || row.getAttribute('data-open-email');
    const email = explicit || emailFromText(row);
    if (!email) return;
    const url = new URL(window.location.href);
    url.searchParams.set('email', email);
    window.location.href = url.pathname + url.search;
  });

  const markRows = () => {
    document
      .querySelectorAll(
        '[data-review-email], [data-email], [data-user-email], [data-open-email], table tr, tbody tr, li, .review-item, .review-card, .user-item, .user-row'
      )
      .forEach((el) => {
        el.style.cursor = 'pointer';
        if (!el.getAttribute('role')) el.setAttribute('role', 'button');
        if (!el.getAttribute('tabindex')) el.setAttribute('tabindex', '0');
      });
  };

  const observer = new MutationObserver(markRows);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  markRows();
})();
