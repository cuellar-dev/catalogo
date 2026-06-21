# Catálogo → PDF

Web app that turns a JSON product list into a clean, print‑ready catalog and exports it to a multi‑page **A4 PDF** with one click.

> 🔗 **Live demo:** https://cuellar-dev.github.io/catalogo/
> 📱 **Mobile‑first** design.

> ℹ️ **Scope note:** this was built to a **client's specific request** — they only needed a simple way to generate a clean PDF catalog they could edit and send. The tool is intentionally minimal and focused on that single goal.

## What it does

- Reads products from `datos.json`, grouped by category.
- Renders each product as a card with image, name, description, technical details and price.
- Automatically paginates the catalog into **A4 pages** (4 products per page) so the printed/exported result looks professional.
- Exports the whole catalog to a downloadable **PDF** (`Catalogo.pdf`) using `html2pdf.js`.

## Tech stack

- HTML5
- CSS3
- JavaScript (vanilla, no framework)
- [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) (via CDN) for client‑side PDF generation

## How it works

The app fetches `datos.json`, normalizes each item and builds the DOM dynamically. The height of the container is computed from the number of page separators (`297 mm` per A4 page) so each "page" maps exactly to a sheet when exported. The **Convert to PDF** button captures the rendered catalog and saves it as an A4 portrait PDF.

## Data format

```json
{
  "categorias": [
    {
      "nombre": "Category name",
      "articulos": [
        ["Product name", "Description", "Price", "image.jpg", [["Key", "Value"]]]
      ]
    }
  ]
}
```

Each article is an array: `[nombre, descripcion, precio, imagen, detalles]`, where `detalles` is a list of `[key, value]` pairs.

## Run it locally

It's a static site, so no installation is required:

```bash
# from the project folder
python -m http.server 5500
# then open http://localhost:5500
```

Or open `index.html` with the **Live Server** extension in VS Code.

## Edit the catalog

1. Open `datos.json`.
2. Add or edit categories and their `articulos`.
3. Keep the JSON valid and make sure each image path exists.

## Deploy

As a static site you can host it for free on **GitHub Pages**, **Netlify**, **Vercel** or **Cloudflare Pages** — just upload the folder.

## Author

**Luis Ernesto Cuellar del Castillo** — [@cuellar-dev](https://github.com/cuellar-dev)
