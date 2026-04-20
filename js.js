const URL_DATOS = 'datos.json';
const MAX_ITEMS_POR_SEPARADOR = 4;
const ALTO_A4_MM = 297;
const AJUSTE_CORTE_MM = 0.5;

function actualizarAlturaContenedorPDF() {
    const productos = document.getElementById('productos');
    if (!productos) return;

    // Contar la cantidad de separadores (cada separador = 1 página A4)
    const totalSeparadores = productos.querySelectorAll('.separador-cada4').length;
    const alturaBaseMM = ALTO_A4_MM * totalSeparadores;
    const alturaTotalMM = Math.max(0, alturaBaseMM - AJUSTE_CORTE_MM);

    productos.style.height = `${alturaTotalMM}mm`;
}

function normalizarArticulo(articuloArray) {
    const [nombre, descripcion, precio, imagen, detalles] = articuloArray;
    return {
        nombre: nombre || '',
        descripcion: descripcion || '',
        precio: precio || '',
        imagen: imagen || 'images.jpg',
        detalles: Array.isArray(detalles) ? detalles : []
    };
}

function crearDetallesTecnicos(detalles) {
    const contenedor = document.createElement('div');
    contenedor.className = 'detalles-tecnicos';

    const lista = document.createElement('ul');
    detalles.forEach((detalle) => {
        if (!Array.isArray(detalle) || detalle.length < 2) return;
        const [clave, valor] = detalle;
        if (!clave && !valor) return;
        const item = document.createElement('li');
        item.innerHTML = `<span>${clave}:</span> ${valor}`;
        lista.appendChild(item);
    });

    if (lista.children.length === 0) {
        contenedor.style.display = 'none';
    }

    contenedor.appendChild(lista);
    return contenedor;
}

function crearProductoCard(articulo) {
    const card = document.createElement('article');
    card.className = 'producto-card';

    const imagenProducto = document.createElement('div');
    imagenProducto.className = 'imagen-producto';

    const img = document.createElement('div');
    img.className = 'img';
    img.style.backgroundImage = `url('${articulo.imagen}')`;
    img.setAttribute('aria-label', articulo.nombre);
    imagenProducto.appendChild(img);

    const info = document.createElement('div');
    info.className = 'info-producto';
    const nombreProducto = document.createElement('p');
    nombreProducto.className = 'nombre-producto';
    nombreProducto.textContent = articulo.nombre;

    const descripcionProducto = document.createElement('p');
    descripcionProducto.className = 'descripcion-producto';
    const descripcion = String(articulo.descripcion || '').trim();
    if (descripcion) {
        descripcionProducto.textContent = descripcion;
    } else {
        descripcionProducto.style.display = 'none';
    }

    info.appendChild(nombreProducto);
    info.appendChild(descripcionProducto);

    info.appendChild(crearDetallesTecnicos(articulo.detalles));

    const compra = document.createElement('div');
    compra.className = 'compra-seccion';
    compra.innerHTML = `<p class="price">${articulo.precio}</p>`;
    info.appendChild(compra);

    card.appendChild(imagenProducto);
    card.appendChild(info);
    return card;
}

function crearSeparador(nombreCategoria, esPrimero) {
    const separador = document.createElement('div');
    separador.className = `separador-cada4${esPrimero ? ' primera' : ''}`;

    if (esPrimero) {
        const h3Container = document.createElement('div');
        h3Container.className = 'h3-container';

        const titulo = document.createElement('h3');
        titulo.textContent = nombreCategoria;

        h3Container.appendChild(titulo);
        separador.appendChild(h3Container);
    }

    return separador;
}

function renderizarCatalogo(data) {
    const productos = document.getElementById('productos');
    productos.innerHTML = '';

    const categorias = Array.isArray(data.categorias) ? data.categorias : [];

    categorias.forEach((categoria) => {
        const articulosNormalizados = (categoria.articulos || []).map(normalizarArticulo);
        const section = document.createElement('section');
        section.className = 'categoria-container';

        const grid = document.createElement('div');
        grid.className = 'grid-productos';

        let indice = 0;
        let esPrimerSeparador = true;

        if (articulosNormalizados.length === 0) {
            grid.appendChild(crearSeparador(categoria.nombre || 'Categoria', true));
        }

        while (indice < articulosNormalizados.length) {
            const separador = crearSeparador(categoria.nombre || 'Categoria', esPrimerSeparador);
            const capacidad = MAX_ITEMS_POR_SEPARADOR;

            for (let i = 0; i < capacidad && indice < articulosNormalizados.length; i += 1) {
                separador.appendChild(crearProductoCard(articulosNormalizados[indice]));
                indice += 1;
            }

            grid.appendChild(separador);
            esPrimerSeparador = false;
        }

        section.appendChild(grid);
        productos.appendChild(section);
    });

    const ultimaCategoria = productos.querySelector('.categoria-container:last-child');
    if (ultimaCategoria) {
        ultimaCategoria.style.marginBottom = '0';
    }

    actualizarAlturaContenedorPDF();
}

async function cargarCatalogo() {
    const respuesta = await fetch(URL_DATOS);
    if (!respuesta.ok) {
        throw new Error('No se pudo cargar datos.json');
    }
    return respuesta.json();
}

function configurarBotonPDF() {
    const boton = document.getElementById('btn-detalles');
    if (!boton) return;

    boton.addEventListener('click', async () => {
        const contenido = document.getElementById('productos');
        if (!contenido) return;

        actualizarAlturaContenedorPDF();

        const opciones = {
            margin: 0,
            filename: 'Catalogo.pdf',
            image: { type: 'jpeg', quality: 0.8},
            html2canvas: {
                scale: 2,
                useCORS: true,
                x: 0,
                y: 0,
                scrollX: 0,
                scrollY: 0,
                windowWidth: contenido.scrollWidth,
                windowHeight: contenido.scrollHeight
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait'}
        };

        await html2pdf().set(opciones).from(contenido).save();
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const data = await cargarCatalogo();
        renderizarCatalogo(data);
    } catch (error) {
        console.error(error);
    }

    configurarBotonPDF();
});