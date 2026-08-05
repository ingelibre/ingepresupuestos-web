# IngePresupuestos · Landing Page

Sitio web público de **IngePresupuestos** — software desktop de presupuestos
de obra desarrollado por Ing. Marco Sumari.

URL en producción: **https://ingepresupuestos.com**

Repo del **producto** (código fuente): `~/Proyectos/ingepresupuestos/app/`
→ `github.com/tuxiasumari/ingepresupuestos-pyside6`

Este repo es **independiente** del producto a propósito. Cambios acá no
disparan builds del producto y viceversa.

---

## Stack (intencionalmente simple)

- **HTML + CSS + JS vanilla** — sin React, Vue, Astro, ni nada que requiera
  build step. Cada edición a `index.html` o `style.css` queda live con un
  `npx wrangler deploy` (ver «Cómo deployar»: el `git push` NO publica).
- **Tipografía**: Inter (Google Fonts vía CDN con preconnect). Misma que la
  app desktop para coherencia visual.
- **`script.js`** (~170 líneas): consulta `version.json` en Cloudflare R2 para
  versión + fecha de release + URLs de descarga. Precios geo (soles/dólares,
  ver tabla de conexiones). Smooth scroll. Mobile hamburger toggle.
  Scroll reveal (IntersectionObserver). Mini-carousels infinitos con prev/next.
  Lightbox para ampliar capturas.
- **Hosting**: Cloudflare Workers, assets estáticos (worker `ingepresupuestos-web`,
  config en `wrangler.jsonc`). Se despliega a mano con `npx wrangler deploy`.
- **CDN + SSL**: Cloudflare (gratis, automático).
- **SEO**: JSON-LD (SoftwareApplication + FAQPage) en el `<head>`, canonical,
  OG + Twitter Cards (`images/og-banner.jpg`), `sitemap.xml`, `robots.txt`.
  Registrado en Google Search Console (2026-06-11).
- **Security headers** (`_headers` de Cloudflare Pages): CSP, HSTS, nosniff,
  X-Frame-Options. ⚠️ La CSP es una lista blanca: si se agrega un script/CSS
  externo nuevo, hay que sumar su dominio en `_headers` o quedará bloqueado.
  Ya permitidos: Google Fonts, R2 (`downloads.`) y Cloudflare Insights.

**No agregar build steps** (webpack, vite, etc.) salvo justificación muy
fuerte. La simplicidad de "HTML que se sirve directo" es lo que mantiene
la velocidad y la facilidad de mantenimiento.

---

## Estructura

```
ingepresupuestos-web/
├── index.html              ← página única
├── style.css               ← variables CSS centralizadas, paleta elementary
├── script.js               ← fetch R2, precios geo, reveal, carousels, lightbox
├── _headers                ← security headers Cloudflare Pages (CSP, HSTS…)
├── robots.txt
├── sitemap.xml
├── captura/                ← gitignored: capturas crudas (fuente)
├── blog/
│   ├── index.html          ← listado de posts (tarjetas post-card)
│   ├── blog.css            ← estilos del blog (artículo, lightbox, share-bar)
│   ├── blog.js             ← menú móvil + lightbox/zoom + botón «Copiar enlace»
│   ├── articulo-template.html ← plantilla para nuevos posts
│   └── que-es-ingepresupuestos.html ← 1er post (historia de origen)
├── images/
│   ├── favicon.ico         ← multi-res 16–256
│   ├── favicon-16.png / favicon-32.png / apple-touch-icon.png (180)
│   ├── og-banner.jpg       ← 1200×630, preview social (og:image / twitter:image)
│   ├── logo.png            ← 256×256
│   ├── logo.svg
│   ├── tuxia-icon.png      ← 620×783, ícono Tuxia (pingüino morado con casco AI)
│   ├── ingeconverter-icon.png ← 256×256, ícono IngeConverter (pingüino S10)
│   └── screenshots/
│       ├── principal.jpeg          ← 1600×966, hero (partidas + ACU + Tuxia)
│       ├── dashboard-windows.jpeg  ← 1600×1000, dashboard mosaico Windows
│       ├── dashboard-linux.jpeg    ← 1600×1000, dashboard mosaico Linux
│       ├── centro-reportes.jpeg    ← 1600×966, resumen ejecutivo
│       ├── tuxia.jpeg              ← 1600×964, revisor de proyecto con IA
│       ├── cronograma-gantt.jpeg   ← 1600×966, diagrama Gantt CPM
│       ├── importar-powercost.jpeg ← 1600×964, importar desde PowerCost
│       ├── data-formato-abierto.jpeg ← 1600×966, pantalla Exportar
│       ├── principal.png           ← (legacy, reemplazada por .jpeg)
│       ├── dashboard-windows.jpg   ← (legacy)
│       ├── dashboard-linux.jpg     ← (legacy)
│       ├── cronograma-gantt.jpg    ← (legacy)
│       ├── proyecto-resumen.jpg    ← (legacy, reemplazada por data-formato-abierto)
│       ├── tuxia.png               ← (legacy)
│       ├── especificaciones.png    ← (legacy)
│       ├── centro-reportes.jpg     ← (legacy)
│       ├── importar-powercost.jpg  ← (legacy)
│       ├── proyecto-acu.jpg        ← (no usada aún)
│       ├── proyecto-insumos.jpg    ← (no usada aún)
│       ├── proyecto-metrados-tuxia.jpg ← (no usada aún)
│       ├── proyecto-especificaciones.jpg ← (no usada aún)
│       └── config-ia-linux.jpg     ← (no usada aún)
│   └── blog/                ← imágenes del blog
│       ├── laptop-linux-2016.jpg   ← portada 1er post (Toshiba con stickers Linux + casco)
│       ├── maqueta-2016.jpg        ← maqueta dibujada en 2016
│       ├── ingepresupuestos-2026.png ← captura del software real (comparación)
│       └── og-que-es-ingepresupuestos.jpg ← 1200×630 social del 1er post
├── README.md
└── CLAUDE.md               ← este archivo
```

### Paleta (espejo de elementary OS + app)

```css
--orange:      #F37329    /* acento principal (CTAs, badges, línea animada) */
--orange-dk:   #C0621A
--orange-soft: #FEF5EB
--purple:      #7A36B1    /* sección Tuxia IA (Grape de elementary) */
--purple-dk:   #5B2387
--banana-soft: #FDF8E8    /* sección importadores (Banana de elementary) */
--banana:      #F9C440
--slate-900:   #1A2434    /* fondo footer + sección impact */
--slate-700:   #273445    /* header nav + topbar app */
--slate-500:   #485A6C    /* texto secundario */
--slate-300:   #667885    /* texto tenue */
--silver-100:  #F8F9FA    /* fondo sections alternas */
```

**NO hardcodear colores** — usar las CSS variables.

---

## Diseño actual (sesión 2026-05-26, actualizado 2026-06-11)

Inspirado en **elementary.io**: secciones alternadas con screenshot grande
a un lado y texto al otro, mucho aire, tipografía grande.

```
┌─ Header sticky dark (slate-700, espejo del topbar de la app)
│  Logo + nav links + hamburger mobile (sin botón CTA en header)
│
├─ Hero (centrado)
│  "El software de presupuestos de obra para que lo lleves a todos lados"
│  Sub: "Multiplataforma. Offline. Formato abierto. Compatible con S10, Delphin y PowerCost."
│  CTA: "Descargar IngePresupuestos" + versión y fecha de release
│
├─ Feature 1: Multiplataforma (blanco)
│  Texto izq │ Mini-carrusel Win/Linux der (prev/next buttons)
│  "Otras plataformas próximamente" (visión: Android, iOS, Mac)
│
├─ Feature 2: Centro de Reportes (gris, reverso)
│  Screenshot izq │ Texto der
│  11 tipos: presupuestos, ACU, metrados, insumos, specs, cronogramas
│  Exporta a Excel, Word, MS Project, ODS, ODT
│
├─ Feature 3: Tuxia IA (morado #7A36B1, con ícono Tuxia)
│  Texto izq │ Screenshot der
│
├─ Feature 4: Gantt y Cronogramas (gris, reverso)
│  Screenshot izq │ Texto der
│
├─ Feature 5: Importadores (banana #FDF8E8, con ícono IngeConverter)
│  Texto izq │ Screenshot der
│
├─ Feature 6: Formato abierto SQLite (gris, reverso)
│  Screenshot izq │ Texto der
│
├─ Impact: "Trabaja offline si quieres" (slate-900, texto centrado)
│
├─ Descargar (gradiente naranja, cards Win/Linux)
│  "Prueba completa por 30 días."
│
├─ Comparativa (blanco, tabla "Compara y decide" vs S10/Delphin/PowerCost)
│  Columna IngePresupuestos resaltada en naranja. Nota legal de marcas.
│
├─ Licenciamiento (gris, 3 cards: Gratis / Perpetua S/300≈$100 / Anual S/80≈$20, geo-swap)
│  "Licenciamiento como debería ser — Elección sin compromiso"
│  Botones "Comprar" → WhatsApp directo con mensaje pre-llenado
│
├─ FAQ (blanco, 8 preguntas, acordeón <details>; espejadas en JSON-LD FAQPage —
│  si se edita una pregunta, actualizar también el JSON-LD del <head>)
│
└─ Footer (slate-900, 4 cols: brand, producto, recursos, contacto)
```

### Animaciones
- **Hero**: fade-up escalonado (título → subtítulo → CTAs → screenshot)
- **Scroll reveal**: cada sección `.feat` aparece con fade + translateY al entrar en viewport (IntersectionObserver, threshold 0.15)
- **Línea naranja animada**: `h2::after` crece de 0 a 48px cuando la sección se hace `.visible` (blanca en sección morada de Tuxia)
- **Hero screenshot**: sombra pronunciada, sin efectos de rotación/brillo

### Responsivo
- `≤ 860px`: feat-row apila en columna (texto arriba, imagen abajo)
- `≤ 760px`: nav-links se ocultan, hamburger visible, menú desplegable
- Mini-carrusel: prev/next botones siempre visibles, scroll-snap nativo

---

## Cómo deployar

### Production — DOS pasos, el push NO publica

```bash
git add . && git commit -m "feat: ..."
git push origin main      # solo guarda el historial
npx wrangler deploy       # ESTO es lo que publica
```

⚠️ **El `git push` por sí solo no cambia nada en ingepresupuestos.com.** Ya no
hay conexión Pages→git (GitHub no reporta ningún deployment): el sitio se sirve
desde el Worker `ingepresupuestos-web`, y solo `npx wrangler deploy` lo
actualiza. Comprobado el 2026-08-04: tras el push el sitio siguió sirviendo la
versión anterior indefinidamente, y solo cambió al desplegar.

Verificar siempre después, porque la CDN cachea (`cf-cache-status: HIT`):

```bash
curl -sL https://ingepresupuestos.com/blog/ | grep -o 'tu-archivo-nuevo'
```

### Local (testing)

```bash
cd ~/Proyectos/ingepresupuestos/web
python3 -m http.server 8765
# Abrir http://localhost:8765
```

---

## Conexión con el repo del producto

| Conexión | Cómo se mantiene |
|----------|------------------|
| **URL de descarga** | `script.js` consulta `downloads.ingepresupuestos.com/version.json` (Cloudflare R2). |
| **Versión en hero** | Misma API de R2. Fallback: "— no disponible". |
| **Precios** | Hardcoded en `index.html` (sección `#precios`) con atributos `data-pen`/`data-usd`: Perú ve soles (S/ 300 perpetua, S/ 80 anual), el resto dólares ($100, $20). Geodetección en `script.js` vía `/cdn-cgi/trace` de Cloudflare (mismo origen, sin cookies); fallback por zona horaria `America/Lima`. Botones "Comprar" → WhatsApp directo (`wa.me/51998839090`) con mensaje pre-llenado por tipo de licencia. |
| **Íconos** | `tuxia-icon.png` copiado de `resources/icons/elementary/24/tuxia.png` del producto. `ingeconverter-icon.png` copiado de `~/ingeconverter/resources/icons/ingeconverter_256.png`. Si se actualizan, sincronizar manualmente. |

---

## Pendientes (priorizados)

### 🔴 Alta prioridad

1. ~~**Screenshots dedicados por sección**~~ — ✅ Completado 2026-05-26. 8 capturas frescas de v2.3 reemplazan las genéricas.
2. ~~**OG banner 1200×630**~~ — ✅ Completado 2026-06-11. `images/og-banner.jpg` (112 KB), compuesto con HTML + Chromium headless: fondo slate, logo, titular, línea naranja, captura principal.
3. ~~**Subir binarios a R2**~~ — ✅ Funcionando. R2 sirve los binarios de cada release (verificado con v2.4.14, 2026-06-11).

### 🟡 Media prioridad

4. ~~**Favicons en distintos tamaños**~~ — ✅ Completado 2026-06-11. `favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png` (180). El `favicon.ico` original ya era multi-res (16–256), se conservó.
5. **Video demo corto** (1-2 min) embebido en la landing o YouTube.

### 🟢 Cuando llegue el momento

6. **Testimoniales** de beta testers — 2-3 frases con nombre y ciudad. El mayor hueco de confianza de la página (no hay prueba social).
6b. **Sección "Quién lo hace"** — foto + 2 líneas de Marco. Humaniza la compra por WhatsApp.
7. ~~**Analytics privacy-friendly**~~ — ✅ Completado 2026-06-11. Cloudflare Web Analytics activado por Marco (inyección automática, sin cookies). La CSP ya permite el beacon.
8. ~~**`sitemap.xml`**~~ — ✅ Completado 2026-06-11 junto con robots.txt, canonical, Twitter Cards y JSON-LD (SoftwareApplication + FAQPage). Falta registrar en Google Search Console.
9. **Página de IngeConverter** — sección o página dedicada al convertidor S10.
10. **Canales de instalación alternativos en «Descargar»** (a futuro, cuando estén aprobados) — hoy la landing solo ofrece descarga directa desde R2. Sumar:
    - **Microsoft Store**: badge oficial + deep link a la ficha (Store ID `9PN8FKLP4RH5`, PFN `MarcoSumari.ingepresupuestos_1enpbchnxx3hm`). El MSIX 2.4.20 ya fue enviado a Partner Center (en certificación al 2026-06-16).
    - **Winget**: bloque copiable `winget install ingepresupuestos` (o `winget install MarcoSumari.IngePresupuestos`). PR a `microsoft/winget-pkgs` #388765.
    - Ambos artefactos viven en el repo del **producto** (`~/ingepresupuestos-pyside6/installer/msix` y `installer/winget`), no en este repo.

---

## Redes / Marketing — Facebook (2026-06-16)

Marco creó la **página de Facebook** de IngePresupuestos. Material generado esta sesión (vive en este repo):
- **Portada** `images/fb-cover.png` (1640×624) y **foto de perfil** `images/fb-profile.png` (500×500) — compuestas con **HTML + Chromium headless** (mismo flujo que el OG banner). Plantillas en `.cover-build/` (`cover.html`, `profile.html`, `frame.tmpl.html`), regenerables.
- **Copy redactado** (en el historial del chat): post de bienvenida; **10 posts** «1 captura + característica» (programa, ACU, Gantt, valorizado, Curva S, reportes, fórmula polinómica, metrados, Tuxia, mapa) + 2 más (especificaciones, memoria); y el **anuncio pagado** (3 imágenes: programa + reportes + especificaciones; copy diferenciador — multiplataforma, IA, 5 formatos export, importa de S10/PowerCost/Delphin, prueba gratis).
- Capturas fuente en `captura/` (raíz + `doc/` + `elabora/`).

### 🔴 PENDIENTE próxima sesión — publicación de PAGA
1. **Renderizar las 3 imágenes enmarcadas** del anuncio (1080×1080) con `.cover-build/frame.tmpl.html` (logo + barra naranja + título). Pares imagen→título: `captura/imagen principal.png` → «Presupuesto + ACU en una sola pantalla» · `captura/centro de reportes.png` → «13 reportes profesionales en un clic» · `captura/elabora/especificaciones.png` → «Especificaciones técnicas integradas». La plantilla ya quedó lista; solo faltó el render.
2. Lanzar el **post promocionado** con ese copy + las 3 imágenes.

---

## Blog (lanzado 2026-06-18)

Blog en `blog/` (no es un CMS: HTML estático, un archivo por post). Se publica con `npx wrangler deploy` igual que la landing — el `git push` no basta.

- **Primer post PUBLICADO:** `blog/que-es-ingepresupuestos.html` — «IngePresupuestos: la historia desde sus inicios» (historia de origen personal: GNU/Linux → S10 restrictivo → Delphin/PowerCost → una alternativa más, multiplataforma). URL limpia en vivo: `https://ingepresupuestos.com/blog/que-es-ingepresupuestos` (Cloudflare redirige el `.html` con 307 a la versión sin extensión).
- **Cómo agregar un post:** copiar `blog/articulo-template.html` → `blog/tu-slug.html`, rellenar `{{...}}`; copiar el bloque `<article class="post-card">` al principio de `blog/index.html` (el más nuevo va primero); añadir la URL a `sitemap.xml`.
- **Funcionalidad del post (en `blog/blog.js` + `blog/blog.css`):**
  - **Lightbox/zoom**: cualquier `<img class="zoomable">` y la `.article-cover` abren a pantalla completa (clic/✕/Esc cierran); muestra el `<figcaption>` del `<figure>`. Comparación lado a lado con `<figure class="figure-compare">`.
  - **Botones de compartir** (`.share-bar`): WhatsApp/Facebook/X/LinkedIn (URLs `sharer`/`intent` hardcodeadas a la URL canónica) + «Copiar enlace» (JS, usa `data-url` de la barra).
  - **Cache-busting** de `blog.css`/`blog.js` con `?v=N` (subir N al cambiarlos, si no el navegador cachea el viejo).
- **Portada del post: UNA imagen compuesta 1200×630 para los tres usos** — tarjeta
  del listado, `<img class="article-cover">` y `og:image`. NO usar una captura de
  pantalla: en el artículo la portada quedaba repetida con la primera figura del
  texto, y en el listado desentonaba entre las portadas compuestas de los posts
  vecinos (corregido en el post de la 2.8.8, 2026-08-04). Se componen con HTML +
  Chromium headless, plantillas en `.cover-build/`:
  ```
  chromium --headless --disable-gpu --no-sandbox --hide-scrollbars \
    --screenshot=og-X.png --window-size=1200,630 --virtual-time-budget=5000 og-X.html
  ```
  Las capturas reales van DENTRO del artículo, como `<figure>`.
- **SEO/social del post:** OG + Twitter card completos con imagen **1200×630 dedicada** (`images/blog/og-que-es-ingepresupuestos.jpg`, recortada a 1.91:1 del foto de la laptop — NO usar imágenes 4:3 como `og:image`, se recortan feo). JSON-LD Article + BreadcrumbList + FAQPage. Tras publicar, refrescar caché en los validadores (FB debugger «Scrape Again», LinkedIn Post Inspector, X validator).
- **Copy para compartir en redes:** Facebook NO soporta markdown/negritas — pegar siempre **texto plano** (los emojis sí funcionan). Copy del lanzamiento en el historial del chat (opción «una alternativa más de software de presupuestos»).

---

## Decisiones de diseño (no revertir sin discutir)

- **Sin frameworks JS**: HTML/CSS/JS plano.
- **Sin trackers** (no GA, no FB Pixel).
- **Sin cookies banner**: no hay cookies de tracking.
- **Diseño estilo elementary.io**: screenshot grande a un lado, texto al otro, alternando. Mucho aire. Imagen como protagonista.
- **Header oscuro (slate-700)**: espejo del topbar de la app desktop.
- **Sección Tuxia morada**: color Grape de elementary, con ícono del pingüino.
- **Sección Importadores banana**: color Banana de elementary, con ícono IngeConverter.
- **Idioma español neutro** (no rioplatense, no peninsular) — tuteo para todo LATAM.
- **No publicar sin aprobación de Marco**: iterar local con `python3 -m http.server 8765`, NO `git push` hasta que Marco diga explícitamente.
- **Nombre del autor**: usar "Ing. Marco Sumari" (sin apellido materno).

---

## Contacto

- **Autor producto**: Ing. Marco Sumari
- **Email**: ing.sumari@gmail.com
- **WhatsApp**: +51 998 839 090
- **Repo producto**: github.com/tuxiasumari/ingepresupuestos-pyside6 (privado)
