const boton = document.getElementById('btn-detalles');
boton.addEventListener('click', () => {
    const contenido = document.getElementById('productos');
    const opciones = {
        margin: 0,
        filename: 'Catalogo.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opciones).from(contenido).save();
    
});