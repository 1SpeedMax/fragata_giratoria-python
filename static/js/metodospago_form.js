// static/js/metodospago_form.js

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Formulario de métodos de pago cargado');

    // ===== ELEMENTOS =====
    const form = document.getElementById('metodoForm');
    const nombre = document.getElementById('nombreMetodo');
    const descripcion = document.getElementById('descripcionMetodo');
    const submitBtn = document.getElementById('btnSubmit');

    // ===== VALIDACIONES EN TIEMPO REAL =====
    if (nombre) {
        nombre.addEventListener('input', function() {
            const valor = this.value.trim();
            if (valor.length < 3) {
                mostrarError(this, 'Mínimo 3 caracteres');
            } else if (valor.length > 50) {
                mostrarError(this, 'Máximo 50 caracteres');
            } else {
                limpiarError(this);
            }
        });
    }

    if (descripcion) {
        descripcion.addEventListener('input', function() {
            if (this.value.length > 255) {
                mostrarError(this, 'Máximo 255 caracteres');
            } else {
                limpiarError(this);
            }
        });
    }

    // ===== VALIDACIÓN AL ENVIAR =====
    if (form) {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            
            if (nombre && nombre.value.trim().length < 3) {
                mostrarError(nombre, 'Mínimo 3 caracteres');
                isValid = false;
            }
            
            if (nombre && nombre.value.trim().length > 50) {
                mostrarError(nombre, 'Máximo 50 caracteres');
                isValid = false;
            }
            
            if (descripcion && descripcion.value.length > 255) {
                mostrarError(descripcion, 'Máximo 255 caracteres');
                isValid = false;
            }
            
            if (!isValid) {
                e.preventDefault();
                mostrarNotificacion('❌ Por favor corrige los errores', 'error');
                
                const firstError = document.querySelector('.form-group.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } else {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
                submitBtn.disabled = true;
            }
        });
    }

    // ===== FUNCIONES AUXILIARES =====
    function mostrarError(input, mensaje) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.add('error');
        
        let feedback = formGroup.querySelector('.error-feedback');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.className = 'error-feedback';
            formGroup.appendChild(feedback);
        }
        feedback.textContent = mensaje;
        feedback.style.color = '#ef4444';
        feedback.style.fontSize = '0.8rem';
        feedback.style.marginTop = '0.3rem';
        input.style.borderColor = '#ef4444';
    }

    function limpiarError(input) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.remove('error');
        
        const feedback = formGroup.querySelector('.error-feedback');
        if (feedback) feedback.remove();
        
        input.style.borderColor = '';
    }

    function mostrarNotificacion(mensaje, tipo = 'info') {
        const notificacion = document.createElement('div');
        notificacion.className = `notification ${tipo}`;
        notificacion.innerHTML = `
            <i class="fas ${tipo === 'success' ? 'fa-check-circle' : tipo === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${mensaje}</span>
        `;
        
        notificacion.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${tipo === 'success' ? 'linear-gradient(135deg, #10b981, #34d399)' : 
                        tipo === 'error' ? 'linear-gradient(135deg, #ef4444, #f87171)' : 
                        'linear-gradient(135deg, #f5d487, #d4af37)'};
            color: ${tipo === 'success' ? 'white' : tipo === 'error' ? 'white' : '#1a1a1a'};
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 0.8rem;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notificacion);
        
        setTimeout(() => {
            notificacion.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notificacion.remove(), 300);
        }, 3000);
    }

    // ===== ANIMACIÓN DE ENTRADA =====
    const formCard = document.querySelector('.form-card');
    if (formCard) {
        formCard.style.opacity = '0';
        formCard.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            formCard.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            formCard.style.opacity = '1';
            formCard.style.transform = 'translateY(0)';
        }, 100);
    }

    // ===== ESTILOS PARA NOTIFICACIONES =====
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
    `;
    document.head.appendChild(style);
});