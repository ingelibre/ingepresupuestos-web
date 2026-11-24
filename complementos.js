// Buscador y filtros de /complementos. Las tarjetas ya están en el HTML.
(function () {
  'use strict';
  const cards = [...document.querySelectorAll('#comp-grid .ext-card')];
  const q = document.getElementById('comp-q');
  const chips = [...document.querySelectorAll('#comp-cats .ext-chip')];
  const count = document.getElementById('comp-count');
  if (!cards.length || !q) return;
  let cat = '';
  const llano = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

  function filtrar() {
    const palabras = llano(q.value).split(/\s+/).filter(Boolean);
    let n = 0;
    cards.forEach(c => {
      const ok = (!cat || c.dataset.cats.split(' ').includes(cat)) &&
        palabras.every(p => c.dataset.q.includes(p));
      c.hidden = !ok;
      if (ok) n++;
    });
    count.textContent = n === 0 ? 'Ningún complemento coincide con la búsqueda.'
      : n === cards.length ? `${n} complementos` : `${n} de ${cards.length} complementos`;
  }
  q.addEventListener('input', filtrar);
  chips.forEach(b => b.addEventListener('click', () => {
    cat = b.dataset.cat;
    chips.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    filtrar();
  }));
})();
