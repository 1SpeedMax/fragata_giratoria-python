// ===== VARIABLES GLOBALES =====
let usuarioIdEliminar = null;
let usuarioNombreEliminar = null;

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    inicializarEventos();
    obtenerTokenCSRF();
});

// ===== OBTENER TOKEN CSRF =====
function obtenerTokenCSRF() {
    const csrfInput = document.querySelector('[name=csrfmiddlewaretoken]');
    if (csrfInput) {
        return csrfInput.value;
    }
    const csrfCookie = document.cookie.split(';').find(c => c.trim().startsWith('csrftoken='));
    return csrfCookie ? csrfCookie.split('=')[1] : '';
}

// ===== INICIALIZAR EVENTOS =====
function inicializarEventos() {
    const confirmarBtn = document.getElementById('confirmarEliminar');
    if (confirmarBtn) {
        confirmarBtn.addEventListener('click', eliminarUsuario);
    }
    
    // Cerrar modal con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            cerrarModal();
        }
    });
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('modalEliminar');
        if (e.target === modal) {
            cerrarModal();
        }
    });
}

// ===== ABRIR MODAL ELIMINAR =====
function abrirModalEliminar(id, nombre) {
    usuarioIdEliminar = id;
    usuarioNombreEliminar = nombre;
    const usuarioSpan = document.getElementById('usuarioAEliminar');
    if (usuarioSpan) {
        usuarioSpan.textContent = nombre;
    }
    const modal = document.getElementById('modalEliminar');
    if (modal) {
        modal.classList.add('active');
    }
}

// ===== CERRAR MODAL =====
function cerrarModal() {
    const modal = document.getElementById('modalEliminar');
    if (modal) {
        modal.classList.remove('active');
    }
    usuarioIdEliminar = null;
    usuarioNombreEliminar = null;
}

// ===== ELIMINAR USUARIO =====
function eliminarUsuario() {
    if (!usuarioIdEliminar) return;
    
    mostrarToast(`Eliminando usuario ${usuarioNombreEliminar}...`, 'info');
    
    const csrfToken = obtenerTokenCSRF();
    
    fetch(`/usuarios/eliminar/${usuarioIdEliminar}/`, {
        method: 'DELETE',
        headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin'
    })
    .then(response => {
        if (response.ok) {
            mostrarToast(`✅ Usuario ${usuarioNombreEliminar} eliminado correctamente`, 'success');
            setTimeout(() => {
                window.location.href = '/usuarios/lista/';
            }, 1500);
        } else if (response.status === 404) {
            mostrarToast('Usuario no encontrado', 'error');
        } else {
            mostrarToast('Error al eliminar usuario', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarToast('Error de conexión al eliminar usuario', 'error');
    });
    
    cerrarModal();
}

// ===== MOSTRAR TOAST NOTIFICACIÓN =====
function mostrarToast(mensaje, tipo = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    
    const iconos = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="fas ${iconos[tipo]}"></i>
        <span>${mensaje}</span>
        <i class="fas fa-times"></i>
    `;
    
    const closeBtn = toast.querySelector('.fa-times');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => toast.remove());
    }
    
    container.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 3000);
}

// ===== COPIAR AL PORTAPAPELES =====
function copiarAlPortapapeles(texto) {
    navigator.clipboard.writeText(texto).then(() => {
        mostrarToast('Copiado al portapapeles', 'success');
    }).catch(() => {
        mostrarToast('Error al copiar', 'error');
    });
}

// ===== ACTUALIZAR DATOS =====
function actualizarDatos() {
    location.reload();
}

// ===== EXPONER FUNCIONES GLOBALES =====
window.abrirModalEliminar = abrirModalEliminar;
window.cerrarModal = cerrarModal;
window.copiarAlPortapapeles = copiarAlPortapapeles;
window.actualizarDatos = actualizarDatos;