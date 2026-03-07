// static/js/pedidos_crear.js

document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Inicializando formulario de creación de pedidos...");

    const form = document.getElementById('pedidoForm');
    const cantidad = document.getElementById('cantidad');
    const precioUnitario = document.getElementById('precio_unitario');
    const subtotal = document.getElementById('subtotal');
    const total = document.getElementById('total');
    const submitBtn = document.getElementById('btnSubmit');

    // ===== CÁLCULO AUTOMÁTICO DE SUBTOTAL =====
    function calcularSubtotal() {
        const cant = parseFloat(cantidad.value) || 0;
        const precio = parseFloat(precioUnitario.value) || 0;
        const calcSubtotal = cant * precio;
        subtotal.value = calcSubtotal.toFixed(2);
        
        // Si total está vacío, sugerir el subtotal
        if (!total.value || parseFloat(total.value) === 0) {
            total.value = calcSubtotal.toFixed(2);
        }
    }

    if (cantidad && precioUnitario) {
        cantidad.addEventListener('input', calcularSubtotal);
        precioUnitario.addEventListener('input', calcularSubtotal);
    }

    // ===== VALIDACIONES =====
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
                errorElement.textContent = mensaje;
                formGroup.appendChild(errorElement);
            }
            return false;
        } else {
            input.style.borderColor = '#10b981';
            if (errorElement) errorElement.remove();
            return true;
        }
    }

    // ===== VALIDACIÓN AL ENVIAR =====
    if (form) {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            
            // Validar cantidad
            if (cantidad && (parseInt(cantidad.value) < 1)) {
                validarCampo(cantidad, false, 'La cantidad debe ser al menos 1');
                isValid = false;
            }
            
            // Validar precio
            if (precioUnitario && (parseFloat(precioUnitario.value) <= 0)) {
                validarCampo(precioUnitario, false, 'El precio debe ser mayor a 0');
                isValid = false;
            }
            
            // Validar total
            if (total && (parseFloat(total.value) <= 0)) {
                validarCampo(total, false, 'El total debe ser mayor a 0');
                isValid = false;
            }
            
            if (!isValid) {
                e.preventDefault();
                alert('Por favor corrige los errores en el formulario');
            } else {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
                submitBtn.disabled = true;
            }
        });
    }
});