# IngePresupuestos · Landing Page

Sitio web público de IngePresupuestos — software de presupuestos de obra
desarrollado por Ing. Marco Sumari Tellez.

URL en producción: **https://ingepresupuestos.com** (cuando se compre el dominio)

## Stack

- **HTML + CSS + JS vanilla** — sin frameworks, sin build step.
- **Tipografía**: Inter (Google Fonts).
- **Hosting**: Cloudflare Pages (deploy automático desde GitHub).
- **CDN + SSL**: Cloudflare (automático, gratis).

## Estructura

```
ingepresupuestos-web/
├── index.html              ← página principal (única página)
├── style.css               ← estilos
├── script.js               ← JS mínimo (fetch última versión GitHub Releases)
├── images/                 ← logos, screenshots, íconos
│   ├── logo.svg
│   ├── favicon.png
│   └── ...
└── README.md
```

## Probar localmente

```bash
# Servidor estático sencillo (Python 3 stdlib)
cd ingepresupuestos-web
python3 -m http.server 8000
# Abrir http://localhost:8000 en el navegador
```

## Deploy

### Cloudflare Pages (recomendado, gratis)

1. Crear cuenta en https://dash.cloudflare.com/sign-up
2. Pages → Create a project → Connect to Git → seleccionar este repo
3. Configuración del build:
   - Framework preset: **None**
   - Build command: (vacío — no hay build)
   - Build output directory: `/` (raíz del repo)
4. Deploy → en ~30 segundos queda online en `ingepresupuestos-web.pages.dev`
5. Custom domain: configurar `ingepresupuestos.com` cuando se compre el dominio

Cada `git push` a `main` dispara auto-deploy.

### Alternativa: GitHub Pages

Settings del repo → Pages → Source: `main / root` → Save.

URL: `https://tuxiasumari.github.io/ingepresupuestos-web/`

## Relación con el producto

Este repo es **independiente** del repo del producto
(`ingepresupuestos-pyside6`, privado).

Cambios coordinados:
- **Precios**: cuando se decidan, actualizar la sección Precios de `index.html`.
- **Última versión**: `script.js` consulta automáticamente la API de
  GitHub Releases del repo del producto. No requiere edición manual.
- **URL de descarga**: apunta siempre a `releases/latest` del repo del
  producto — siempre da la versión más reciente.
- **URL de licencia**: la app desktop tiene
  `URL_COMPRA = "https://ingepresupuestos.com/licencia"` —
  cuando se decida vender, agregar `#licencia` o `/licencia` con la oferta.

## Contacto

- Autor: Ing. Marco Sumari Tellez
- Email: ing.sumari@gmail.com
- Producto: https://github.com/tuxiasumari/ingepresupuestos-pyside6

## Licencia

Código de esta landing: MIT. Marca, logo y contenido visual:
© 2026 Ing. Marco Sumari Tellez. Todos los derechos reservados.
