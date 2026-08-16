/* ─────────────────────────────────────────────────────────────────────────
   IngePresupuestos — Landing JS
   ──────────────────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  const VERSION_URL = 'https://downloads.ingepresupuestos.com/version.json';

  // Ojo: estas funciones también corren en /apoyar, que no tiene #latest-version
  // ni tarjetas de descarga. De ahí los accesos opcionales.
  function setFallback() {
    const v = document.getElementById('latest-version');
    if (v) v.textContent = '— no disponible';
    const fallback = 'https://ingepresupuestos.com/#descargar';
    document.querySelectorAll('#dl-win, #dl-linux')
      .forEach(el => el.setAttribute('href', fallback));
  }

  fetch(`${VERSION_URL}?t=${Date.now()}`, { headers: { 'Accept': 'application/json' } })
    .then(resp => {
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      return resp.json();
    })
    .then(data => {
      const version = data.version || '';
      let label = version ? `v${version}` : '—';
      if (version && data.release_date) {
        const d = new Date(`${data.release_date}T00:00:00`);
        if (!isNaN(d)) {
          label += ` · ${d.toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })}`;
        }
      }
      const elVer = document.getElementById('latest-version');
      if (elVer) elVer.textContent = label;
      const dl = data.downloads || {};
      // IngePresupuestos se entrega en 4 canales: instalador .exe y Microsoft
      // Store en Windows; AppImage y Flatpak en Linux. Los dos últimos no
      // salen de version.json (la Store y el repo Flatpak se actualizan solos).
      [
        ['dl-win',   'windows_installer'],
        ['dl-linux', 'linux_appimage'],
      ].forEach(([id, key]) => {
        const el = document.getElementById(id);
        if (el) el.setAttribute('href', dl[key] || '#descargar');
      });
      const ic = (data.ingeconverter || {}).downloads || {};
      [
        ['dl-ic-win',     'windows_installer'],
        ['dl-ic-linux',   'linux_portable'],
        ['dl-ic-win-zip', 'windows_portable'],
      ].forEach(([id, key]) => {
        const el = document.getElementById(id);
        if (el) el.setAttribute('href', ic[key] || '#descargar');
      });
    })
    .catch(() => setFallback());

  // Precios según ubicación: soles en Perú (default), dólares fuera.
  // /cdn-cgi/trace es de Cloudflare, mismo origen, sin cookies. Fallback: zona horaria.
  function applyCurrency(curr) {
    document.querySelectorAll('[data-pen]').forEach(el => {
      el.textContent = curr === 'PEN' ? el.dataset.pen : el.dataset.usd;
    });
  }
  fetch('/cdn-cgi/trace')
    .then(resp => {
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      return resp.text();
    })
    .then(text => {
      const loc = (text.match(/^loc=(\w+)$/m) || [])[1];
      applyCurrency(loc === 'PE' ? 'PEN' : 'USD');
    })
    .catch(() => {
      const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || '');
      applyCurrency(tz === 'America/Lima' ? 'PEN' : 'USD');
    });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', id);
      document.querySelector('.nav-links')?.classList.remove('open');
    });
  });

  // Mobile toggle
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  }

  // Scroll reveal (IntersectionObserver)
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(function (el) { obs.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  // Mini-carousels (prev/next horizontal scroll, infinite wrap-around)
  document.querySelectorAll('.mini-carousel').forEach(root => {
    const track = root.querySelector('.mini-track');
    const prev = root.querySelector('.mini-prev');
    const next = root.querySelector('.mini-next');
    if (!track) return;

    function go(dir) {
      const slides = track.querySelectorAll('.mini-slide');
      const count = slides.length;
      if (!count) return;
      const slideW = slides[0].offsetWidth;
      let idx = Math.round(track.scrollLeft / slideW);
      idx = (idx + dir + count) % count;           // wrap around → infinito
      track.scrollTo({ left: idx * slideW, behavior: 'smooth' });
    }

    if (prev) prev.addEventListener('click', () => go(-1));
    if (next) next.addEventListener('click', () => go(1));
  });

  // ── Lightbox (ampliar imágenes) ───────────────────────────────────────
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.setAttribute('aria-hidden', 'true');
  lb.innerHTML =
    '<button class="lightbox-close" type="button" aria-label="Cerrar">×</button>' +
    '<img alt="">';
  document.body.appendChild(lb);
  const lbImg = lb.querySelector('img');

  function openLightbox(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || '';
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  // Cualquier captura dentro de carruseles o feat-img es ampliable
  document.querySelectorAll('.mini-slide img, .feat-img img').forEach(img => {
    img.classList.add('zoomable');
    img.addEventListener('click', () => openLightbox(img.currentSrc || img.src, img.alt));
  });

  lb.addEventListener('click', e => {
    if (e.target === lb || e.target.classList.contains('lightbox-close')) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lb.classList.contains('open')) closeLightbox();
  });

  // Copiar comando de instalación (hoy solo Flatpak)
  document.querySelectorAll('.dl-winget-copy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      navigator.clipboard.writeText(btn.dataset.copy).then(function () {
        var prev = btn.textContent;
        btn.textContent = '¡Copiado!';
        btn.classList.add('copied');
        setTimeout(function () { btn.textContent = prev; btn.classList.remove('copied'); }, 1600);
      });
    });
  });

  // ── Aporte ────────────────────────────────────────────────────────────
  // Sin montos sugeridos (decisión de Marco): los medios de pago se muestran
  // siempre, no hay nada que elegir antes. Mismo marcado en el modal de
  // index.html y en /apoyar; initAporte() los maneja a los dos.
  function initAporte(root) {
    root.querySelectorAll('.aporte-copiar').forEach(btn => {
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(btn.dataset.copy).then(() => {
          const prev = btn.textContent;
          btn.textContent = '¡Copiado!';
          btn.classList.add('copied');
          setTimeout(() => { btn.textContent = prev; btn.classList.remove('copied'); }, 1600);
        });
      });
    });
  }
  document.querySelectorAll('.aporte-widget').forEach(initAporte);

  // ── Modal de aporte tras la descarga ──────────────────────────────────
  (function modalAporte() {
    const modal = document.getElementById('aporte-modal');
    if (!modal) return;
    const caja = modal.querySelector('.aporte-modal-box');
    let ultimoFoco = null;

    const plataforma = document.getElementById('aporte-modal-plataforma');
    const btnDl      = document.getElementById('aporte-modal-descargar');
    const btnDlTexto = document.getElementById('aporte-descargar-texto');

    function abrir() {
      ultimoFoco = document.activeElement;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      modal.querySelector('.aporte-modal-close')?.focus();
    }
    function cerrar() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      ultimoFoco?.focus();
    }

    modal.addEventListener('click', e => {
      if (e.target === modal) cerrar();                      // clic fuera de la caja
    });
    caja?.querySelector('.aporte-modal-close')?.addEventListener('click', cerrar);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('open')) cerrar();
    });

    // Al bajar de verdad desde el modal, cerramos: el navegador ya se lo lleva.
    btnDl?.addEventListener('click', () => setTimeout(cerrar, 400));

    // Cada origen de descarga: etiqueta que se muestra y texto del botón.
    const ORIGENES = {
      'dl-win':        ['Windows · Instalador .exe'],
      'dl-linux':      ['Linux · AppImage'],
      'dl-ic-win':     ['IngeConverter · Windows .exe'],
      'dl-ic-win-zip': ['IngeConverter · Windows portable .zip'],
      'dl-ic-linux':   ['IngeConverter · Linux .tar.gz'],
      'dl-msstore':    ['Windows 10/11 · Microsoft Store', 'Ir a la Microsoft Store', true],
    };

    Object.keys(ORIGENES).forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const [etiqueta, textoBoton, nuevaPestana] = ORIGENES[id];

      el.addEventListener('click', e => {
        const href = el.getAttribute('href') || '';
        // Si version.json no cargó, el enlace apunta al ancla de respaldo:
        // no interceptamos nada y que el navegador haga lo suyo.
        if (!href || href === '#' || href.startsWith('#')) return;

        e.preventDefault();
        if (plataforma) plataforma.textContent = etiqueta;
        if (btnDlTexto) btnDlTexto.textContent = textoBoton || 'Descargar ahora';
        if (btnDl) {
          btnDl.setAttribute('href', href);
          if (nuevaPestana) {
            btnDl.setAttribute('target', '_blank');
            btnDl.setAttribute('rel', 'noopener');
          } else {
            btnDl.removeAttribute('target');
            btnDl.removeAttribute('rel');
          }
        }
        abrir();
      });
    });
  })();

})();
