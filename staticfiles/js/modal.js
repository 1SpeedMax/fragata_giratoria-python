// Variables de autenticación desde Django
var usuarioAutenticado = window.usuarioAutenticado || false;

function mostrarModalRegistro() {
    var modal = document.getElementById('modalRegistroAviso');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function cerrarModalRegistro() {
    var modal = document.getElementById('modalRegistroAviso');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Cerrar modal si se hace clic fuera del contenido
window.onclick = function(event) {
    var modal = document.getElementById('modalRegistroAviso');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Función para verificar autenticación antes de seleccionar platillo
function verificarAutenticacion() {
    if (!usuarioAutenticado) {
        mostrarModalRegistro();
        return false;
    }
    return true;
}