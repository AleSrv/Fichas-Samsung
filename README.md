# Catálogo Web — Fichas técnicas Samsung

Visor web de fichas técnicas Samsung con navegación tipo flipbook, zoom, pantalla completa y descarga directa del PDF.

Construido con React 19, Vite 6 y Tailwind CSS v4.

![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite) ![React](https://img.shields.io/badge/React-19-58c4dc?logo=react) ![Tailwind](https://img.shields.io/badge/Tailwind-4-06b6d4?logo=tailwindcss)

## Características

- **37 fichas técnicas** de Samsung (TVs Neo QLED, OLED, The Frame, barras de sonido)
- **Flipbook interactivo** — navegación por swipe, tap en bordes (30% izq/der) y teclado (← → Home End)
- **Zoom + Pan** — scroll con Ctrl, doble click, pinch en táctil
- **Miniaturas** — strip inferior con scroll sincronizado a la página activa
- **Pantalla completa** — con botón dedicado
- **Compartir PDF** — menú con envío directo del PDF por WhatsApp y Telegram, más opción de descarga
- **Tema oscuro** — diseño inspirado en Stitch (Google) con acentos periwinkle (#c0c1ff)
- **Responsive** — funciona en móvil, tablet y desktop
- **Persistencia** — la página activa se guarda en el hash de la URL

## Stack

| | |
|---|---|
| Runtime | Vite 6 |
| UI | React 19 |
| Estilos | Tailwind CSS v4 |
| Iconos | Material Symbols Outlined |
| Tipografía | Inter |
| PDF (build) | pdf-to-png-converter + sharp |
| Almacenamiento | Google Drive (directo) |

## Uso

```bash
npm install
npm run dev
```

Abrir en `http://localhost:5173`

## Build producción

```bash
npm run build
npm run preview
```

Los archivos estáticos se generan en `dist/`. Compatible con deploy en Netlify (incluye `netlify.toml` con redirect SPA).

## Agregar un catálogo

1. Subí el PDF a Google Drive como **público** (cualquiera con el enlace puede ver)
2. Copiá el `fileId` de la URL (ej: `1ABCxyz...`)
3. Agregalo en `src/data/catalogos.js`:

```js
{
  id: 'mi-catalogo',
  title: 'Mi Catálogo',
  fileId: '1ABCxyz...',
  pages: 2,
  category: 'video', // o 'audio'
}
```

4. Ejecutá el script de exportación para generar las imágenes WebP:

```bash
node scripts/export-images.mjs
```

**Importante:** los PDFs se renderizan a imágenes WebP en **build time**. El navegador nunca descarga el PDF; solo carga las imágenes pre-renderizadas. El enlace de descarga del PDF original se comparte desde Google Drive directamente.

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo Vite |
| `npm run build` | Build de producción |
| `npm run preview` | Vista previa del build |
| `npm run lint` | ESLint |
| `node scripts/export-images.mjs` | Renderiza PDFs → WebP |

## Compartir

Desde el visor, el botón **Compartir** abre un menú con:

- **WhatsApp / Telegram** → envía el enlace de descarga directa del PDF original
- **Descargar PDF** → descarga el archivo desde Google Drive
- **WhatsApp / Telegram (enlace)** → comparte el enlace a la página web actual

Los PDFs se sirven mediante descarga directa de Google Drive (`uc?export=download`).
