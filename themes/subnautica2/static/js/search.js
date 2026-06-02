// Client-side search for Hugo site
(function() {
  const searchData = [];
  let loaded = false;

  async function loadSearchData() {
    if (loaded) return;
    try {
      const resp = await fetch('/index.json');
      if (resp.ok) {
        const data = await resp.json();
        searchData.push(...data);
        loaded = true;
      }
    } catch(e) {}
  }

  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  if (!input || !results) return;

  input.addEventListener('focus', loadSearchData);
  input.addEventListener('input', function() {
    const q = this.value.toLowerCase().trim();
    if (q.length < 2) { results.style.display = 'none'; return; }
    if (!loaded) { loadSearchData().then(() => doSearch(q)); return; }
    doSearch(q);
  });

  function doSearch(q) {
    const matches = searchData.filter(item =>
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(q))) ||
      (item.description && item.description.toLowerCase().includes(q))
    ).slice(0, 15);

    if (matches.length === 0) { results.style.display = 'none'; return; }
    results.innerHTML = matches.map(m =>
      `<a href="${m.url}" class="sr-item"><span class="sr-type">${m.type||'page'}</span><br><span class="sr-name">${m.title}</span></a>`
    ).join('');
    results.style.display = 'block';
  }

  document.addEventListener('click', function(e) {
    if (!e.target.closest('.search-box')) results.style.display = 'none';
  });
})();
