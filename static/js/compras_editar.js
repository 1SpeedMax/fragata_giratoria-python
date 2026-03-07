// static/js/compras_editar.js

document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Inicializando formulario de edición de compras...");

    // ===== ELEMENTOS DEL DOM =====
    const form = document.querySelector('.edit-form');
    const descripcion = document.getElementById('descripcion');
    const fecha = document.getElementById('fecha');
    const total = document.getElementById('total');
    const submitBtn = document.querySelector('.btn-submit');

    // ===== VALIDACIONES EN TIEMPO REAL =====
    if (descripcion) {
        descripcion.addEventListener('input', function() {
            validarCampo(this, this.value.length >= 5, 'La descripción debe tener al menos 5 caracteres');
        });
    }

    if (total) {
        total.addEventListener('input', function() {
            const valor = parseFloat(this.value);
            validarCampo(this, valor > 0, 'El total debe ser mayor a 0');
        });
    }

    if (fecha) {
        fecha.addEventListener('change', function() {
            const fechaSeleccionada = new Date(this.value);
            const hoy = new Date();
            validarCampo(this, fechaSeleccionada <= hoy, 'La fecha no puede ser futura');
        });
    }

    // ===== FUNCIÓN DE VALIDACIÓN =====
    function validarCampo(input, condicion, mensaje) {
        const formGroup = input.closest('.form-group');
        let errorElement = formGroup.querySelector('.error-message');
        
        if (!condicion) {
            input.style.borderColor = '#ef4444';
            
            if (!errorElement) {
                errorElement = document.createElement('small');
                errorElement.className = 'error-message';
                errorElement.style.color = '#ef4444';
                errorElement.style.fontSize = '0.8rem';
                errorElement.style.marginTop = '0.3rem';
                errorElement.style.display = 'block';
                errorElement.textContent = mensaje;
                formGroup.appendChild(errorElement);
            }
            return false;
        } else {
            input.style.borderColor = '#10b981';
            if (errorElement) {
                errorElement.remove();
            }
            return true;
        }
    }

    // ===== VALIDACIÓN ANTES DE ENVIAR =====
    if (form) {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            
            // Validar descripción
            if (descripcion && descripcion.value.length < 5) {
                validarCampo(descripcion, false, 'La descripción debe tener al menos 5 caracteres');
                isValid = false;
            }
            
            // Validar total
            if (total && parseFloat(total.value) <= 0) {
                validarCampo(total, false, 'El total debe ser mayor a 0');
                isValid = false;
            }
            
            // Validar fecha
            if (fecha) {
                const fechaSeleccionada = new Date(fecha.value);
                const hoy = new Date();
                if (fechaSeleccionada > hoy) {
                    validarCampo(fecha, false, 'La fecha no puede ser futura');
                    isValid = false;
                }
            }
            
            if (!isValid) {
                e.preventDefault();
                mostrarNotificacion('Por favor corrige los errores en el formulario', 'error');
                
                // Scroll al primer error
                const firstError = document.querySelector('[style*="border-color: #ef4444"]');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } else {
                // Mostrar loading
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
                submitBtn.disabled = true;
            }
        });
    }

    // ===== MOSTRAR NOTIFICACIÓN =====
    function mostrarNotificacion(mensaje, tipo = 'info') {
        let notificacion = document.querySelector('.notification');
        
        if (!notificacion) {
            notificacion = document.createElement('div');
            notificacion.className = 'notification';
            document.body.appendChild(notificacion);
        }
        
        notificacion.textContent = mensaje;
        notificacion.className = `notification ${tipo}`;
        notificacion.classList.add('show');
        
        setTimeout(() => {
            notificacion.classList.remove('show');
        }, 3000);
    }

    // ===== ANIMACIÓN DE ENTRADA =====
    const formCard = document.querySelector('.form-card');
    if (formCard) {
        formCard.style.opacity = '0';
        formCard.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            formCard.style.transition = 'all 0.5s ease';
            formCard.style.opacity = '1';
            formCard.style.transform = 'translateY(0)';
        }, 100);
    }

    // ===== CONFIRMACIÓN DE SALIDA =====
    let formChanged = false;
    
    form.addEventListener('input', function() {
        formChanged = true;
    });
    
    window.addEventListener('beforeunload', function(e) {
        if (formChanged) {
            e.preventDefault();
            e.returnValue = '¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.';
        }
    });

    console.log("✅ Formulario de edición inicializado correctamente");
});