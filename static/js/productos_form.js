// static/js/productos_form.js

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Formulario de productos cargado');

    // ===== ELEMENTOS =====
    const form = document.getElementById('productoForm');
    const nombre = document.getElementById('nombre');
    const fecha = document.getElementById('fecha_registro');
    const precio = document.getElementById('precio_unitario');
    const stockActual = document.getElementById('stock_actual');
    const stockMinimo = document.getElementById('stock_minimo');
    const unidad = document.getElementById('unidad_medida');
    const stockWarning = document.getElementById('stockWarning');
    const submitBtn = document.getElementById('btnSubmit');
    const clearBtn = document.getElementById('btnClear');

    // ===== FECHA ACTUAL POR DEFECTO =====
    if (fecha && !fecha.value) {
        const today = new Date().toISOString().split('T')[0];
        fecha.value = today;
    }

    // ===== VALIDACIONES EN TIEMPO REAL =====
    if (nombre) {
        nombre.addEventListener('input', function() {
            if (this.value.trim().length < 3) {
                mostrarError(this, 'Mínimo 3 caracteres');
            } else {
                limpiarError(this);
            }
        });
    }

    if (precio) {
        precio.addEventListener('input', function() {
            const valor = parseFloat(this.value);
            if (isNaN(valor) || valor <= 0) {
                mostrarError(this, 'Debe ser mayor a 0');
            } else {
                limpiarError(this);
            }
        });
    }

    if (stockActual) {
        stockActual.addEventListener('input', function() {
            const valor = parseInt(this.value);
            if (isNaN(valor) || valor < 0) {
                mostrarError(this, 'No puede ser negativo');
            } else {
                limpiarError(this);
            }
            validarStock();
        });
    }

    if (stockMinimo) {
        stockMinimo.addEventListener('input', function() {
            const valor = parseInt(this.value);
            if (isNaN(valor) || valor < 0) {
                mostrarError(this, 'No puede ser negativo');
            } else {
                limpiarError(this);
            }
            validarStock();
        });
    }

    if (unidad) {
        unidad.addEventListener('change', function() {
            if (this.value) {
                limpiarError(this);
            }
        });
    }

    function validarStock() {
        const actual = parseInt(stockActual?.value) || 0;
        const minimo = parseInt(stockMinimo?.value) || 0;
        
        if (actual < minimo && minimo > 0) {
            stockWarning.classList.add('show');
        } else {
            stockWarning.classList.remove('show');
        }
    }

    // ===== VALIDACIÓN AL ENVIAR =====
    if (form) {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            
            if (nombre && nombre.value.trim().length < 3) {
                mostrarError(nombre, 'Mínimo 3 caracteres');
                isValid = false;
            }
            
            if (!fecha || !fecha.value) {
                if (fecha) mostrarError(fecha, 'Fecha obligatoria');
                isValid = false;
            }
            
            if (precio) {
                const valor = parseFloat(precio.value);
                if (isNaN(valor) || valor <= 0) {
                    mostrarError(precio, 'Debe ser mayor a 0');
                    isValid = false;
                }
            }
            
            if (stockActual) {
                const valor = parseInt(stockActual.value);
                if (isNaN(valor) || valor < 0) {
                    mostrarError(stockActual, 'No puede ser negativo');
                    isValid = false;
                }
            }
            
            if (stockMinimo) {
                const valor = parseInt(stockMinimo.value);
                if (isNaN(valor) || valor < 0) {
                    mostrarError(stockMinimo, 'No puede ser negativo');
                    isValid = false;
                }
            }
            
            if (!unidad || !unidad.value) {
                if (unidad) mostrarError(unidad, 'Selecciona una unidad');
                isValid = false;
            }
            
            if (!isValid) {
                e.preventDefault();
                mostrarNotificacion('❌ Por favor corrige los errores', 'error');
                
                const firstError = document.querySelector('.error-message[style*="display: block"]')?.closest('.form-group');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } else {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
                submitBtn.disabled = true;
            }
        });
    }

    // ===== BOTÓN LIMPIAR =====
    if (clearBtn) {
        clearBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (fecha) {
                const today = new Date().toISOString().split('T')[0];
                fecha.value = today;
            }
            
            [nombre, precio, stockActual, stockMinimo, unidad].forEach(input => {
                if (input) {
                    input.value = '';
                    limpiarError(input);
                }
            });
            
            stockWarning.classList.remove('show');
            mostrarNotificacion('🧹 Formulario limpiado', 'info');
        });
    }

    // ===== FUNCIONES AUXILIARES =====
    function mostrarError(input, mensaje) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.add('error');
        
        const errorMsg = formGroup.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.style.display = 'block';
            errorMsg.textContent = mensaje;
        }
        
        input.style.borderColor = '#ef4444';
    }

    function limpiarError(input) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.remove('error');
        
        const errorMsg = formGroup.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.style.display = 'none';
        }
        
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