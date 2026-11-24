#!/usr/bin/env python3
"""Genera complementos.html desde los complementos incluidos en la app.

    python3 tools/gen-complementos.py [ruta de la app]   (por defecto ../app)

Las fichas salen de complementos/*/complemento.json y las imágenes se copian
como WebP a images/complementos/ (hace falta cwebp o ImageMagick). Volver a
ejecutarlo cuando cambie un complemento incluido.
"""
import html, json, subprocess, sys
from pathlib import Path

WEB = Path(__file__).resolve().parent.parent
APP = Path(sys.argv[1]) if len(sys.argv) > 1 else WEB.parent / "app"
CATS = {"paises": "Países", "metrados": "Metrados", "reportes": "Reportes",
        "precios": "Precios", "temas": "Temas", "importar": "Importar"}
e = lambda s: html.escape(s, quote=True)

fichas = [json.loads(p.read_text(encoding="utf-8")) | {"_dir": p.parent}
          for p in sorted((APP / "complementos").glob("*/complemento.json"))]
import unicodedata
llano = lambda s: "".join(c for c in unicodedata.normalize("NFD", s.lower()) if not unicodedata.combining(c))
fichas.sort(key=lambda j: llano(j["nombre"]))

tarjetas, usadas = [], set()
for j in fichas:
    img = WEB / "images/complementos" / f"{j['id']}.webp"
    subprocess.run(["convert", str(j["_dir"] / "imagen.png"), "-quality", "88", str(img)], check=True)
    ancho, alto = subprocess.check_output(["identify", "-format", "%w %h", str(img)], text=True).split()
    cats = [c for c in j.get("categorias", []) if c in CATS]
    usadas |= set(cats)
    parrafos = [p.strip() for p in j["descripcion"].split("\n\n") if p.strip()]
    tipo = "Con código" if "codigo" in j else "Solo datos"
    tarjetas.append(f'''        <article class="ext-card" id="{e(j['id'])}" data-cats="{' '.join(cats)}" data-q="{e(llano(j['nombre'] + ' ' + j['descripcion']))}">
          <div class="ext-shot"><img class="zoomable" src="/images/complementos/{e(j['id'])}.webp" alt="{e(j['nombre'])} en IngePresupuestos" width="{ancho}" height="{alto}" loading="lazy"></div>
          <div class="ext-body">
            <div class="ext-top"><h3>{e(j['nombre'])}</h3><span class="ext-badge ext-badge-ok">Incluido</span></div>
            <p class="ext-author">Versión {e(j['version'])} · {tipo}</p>
''' + "".join(f'            <p class="ext-summary">{e(p)}</p>\n' for p in parrafos) +
f'''            <div class="ext-card-tags">{''.join(f'<span>{CATS[c]}</span>' for c in cats)}</div>
            <div class="ext-links"><a class="ext-code" href="https://github.com/ingelibre/ingepresupuestos/tree/main/complementos/{e(j['id'])}" target="_blank" rel="noopener">Ver código</a></div>
          </div>
        </article>''')

chips = ['<button type="button" class="ext-chip" data-cat="" aria-pressed="true">Todos</button>'] + [
    f'<button type="button" class="ext-chip" data-cat="{c}" aria-pressed="false">{n}</button>'
    for c, n in CATS.items() if c in usadas]

# Cabecera, navegación y pie: los de apoyar.html, para que no se separen.
base = (WEB / "apoyar.html").read_text(encoding="utf-8")
nav = base[base.index("  <!-- ============ HEADER"):base.index("</header>") + len("</header>")]
pie = base[base.index('  <footer id="contacto"'):base.index("</footer>") + len("</footer>")]
ver = base.split("style.css?v=")[1].split('"')[0]
n = len(fichas)
titulo = "Complementos · IngePresupuestos"
desc = (f"Los {n} complementos de IngePresupuestos: formatos para nueve países, metrados de acero, ladrillos, "
        "tierras, concreto y zapatas, reportes, precios y temas. Libres, y puedes publicar el tuyo.")
datos = json.dumps({"@context": "https://schema.org", "@type": "ItemList", "name": "Complementos de IngePresupuestos",
    "numberOfItems": n, "itemListElement": [{"@type": "ListItem", "position": i + 1, "name": j["nombre"],
    "url": f"https://ingepresupuestos.com/complementos#{j['id']}"} for i, j in enumerate(fichas)]}, ensure_ascii=False)

(WEB / "complementos.html").write_text(f'''<!DOCTYPE html>
<!-- Generado por tools/gen-complementos.py: no editar a mano -->
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#273445">
  <title>{titulo}</title>
  <meta name="description" content="{e(desc)}">
  <link rel="canonical" href="https://ingepresupuestos.com/complementos">
  <meta property="og:site_name" content="IngePresupuestos">
  <meta property="og:title" content="{titulo}">
  <meta property="og:description" content="{e(desc)}">
  <meta property="og:image" content="https://ingepresupuestos.com/images/og-banner.jpg">
  <meta property="og:url" content="https://ingepresupuestos.com/complementos">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="es_PE">
  <link rel="icon" href="/images/favicon.ico" sizes="any">
  <link rel="icon" href="/images/favicon-32.png" type="image/png" sizes="32x32">
  <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" sizes="180x180">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/style.css?v={ver}">
  <script type="application/ld+json">{datos}</script>
</head>
<body>

{nav}

  <main class="section bg-light ext-page">
    <div class="container">
      <div class="section-head">
        <h1>Complementos</h1>
        <p>Formatos de tu país, metrados, reportes y temas. Los {n} vienen con IngePresupuestos 3.2.4, son libres y cada uno se activa solo donde lo necesitas. <a href="#instalar" class="ext-how">¿Cómo se instalan?</a></p>
      </div>

      <div class="ext-tools">
        <input type="search" id="comp-q" class="ext-search" placeholder="Buscar complementos…" aria-label="Buscar complementos" autocomplete="off">
      </div>
      <div class="ext-tags" id="comp-cats" role="group" aria-label="Filtrar por categoría">{''.join(chips)}</div>
      <p class="ext-count" id="comp-count" aria-live="polite">{n} complementos</p>
      <div class="ext-grid comp-page-grid" id="comp-grid">
{chr(10).join(tarjetas)}
      </div>

      <div class="ext-info">
        <div class="ext-box" id="instalar">
          <h2>Cómo se instalan</h2>
          <ol>
            <li>Abre un proyecto y ve a <strong>Complementos ▸ Administrar complementos…</strong></li>
            <li>En <strong>Explorar</strong>, elige uno y pulsa <strong>Instalar</strong>. Queda apagado.</li>
            <li>Pulsa <strong>Activar…</strong>: verás el autor, la licencia, los archivos y qué cambia.</li>
          </ol>
          <p class="ext-small">Los de esta página no necesitan internet: ya vienen con el programa. Para los que publican los usuarios, pulsa <strong>Sincronizar</strong> (desde la 3.2.4; no está en la versión de Microsoft Store). ¿Alguien te pasó uno? Usa <strong>Instalar .zip…</strong> o <strong>Instalar carpeta…</strong></p>
        </div>
        <div class="ext-box">
          <h2>Nada se activa solo</h2>
          <p>Ninguno se descarga por su cuenta, y desactivarlo no toca tus proyectos.</p>
          <p><strong>Solo datos:</strong> no ejecuta nada. <strong>Con código:</strong> puede hacer lo mismo que el programa, y por eso pide tu permiso.</p>
          <p class="ext-small">Los de otras personas llevan <strong>Revisado</strong> si alguien del proyecto leyó ese archivo exacto, o <strong>Comunidad</strong> si solo pasaron una revisión automática. Instálalos solo si confías en su autor.</p>
        </div>
        <div class="ext-box ext-box-cta" id="crear">
          <h2>Crea y publica el tuyo</h2>
          <p>Con <strong>Complementos ▸ Crear complemento…</strong> el programa arma la carpeta de partida. Un tema o un país se hacen sin programar.</p>
          <p>Para compartirlo, en <strong>Instalados ▸ ⋯ ▸ Publicar…</strong> el programa prepara el archivo y la ficha. Tu complemento se queda en <strong>tu</strong> repositorio de GitHub, con licencia libre; una persona aprueba la primera ficha y las versiones nuevas pueden salir solas.</p>
          <a class="btn btn-primary" href="https://github.com/ingelibre/ingepresupuestos/blob/main/docs/complementos.md" target="_blank" rel="noopener">Guía para crear complementos</a>
          <a class="ext-guide" href="https://github.com/ingelibre/ingepresupuestos-complementos" target="_blank" rel="noopener">Catálogo y pasos para publicar →</a>
          <a class="ext-guide" href="https://github.com/ingelibre/ingepresupuestos/issues" target="_blank" rel="noopener">Proponer uno →</a>
        </div>
      </div>
    </div>
  </main>

{pie}

  <script src="/script.js?v={ver}"></script>
  <script src="/complementos.js?v={ver}"></script>
</body>
</html>
'''.replace('href="/#complementos"', 'href="/complementos"'), encoding="utf-8")
print(n, "complementos")
