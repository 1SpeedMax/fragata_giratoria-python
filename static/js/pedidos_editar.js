// static/js/pedidos_editar.js

document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Inicializando formulario de edición de pedidos...");

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
    }

    if (cantidad && precioUnitario) {
        cantidad.addEventListener('input', calcularSubtotal);
        precioUnitario.addEventListener('input', calcularSubtotal);
        // Calcular al cargar
        calcularSubtotal();
    }

    // ===== VALIDACIONES =====
    form.addEventListener('submit', function(e) {
        let isValid = true;
        
        if (cantidad && (parseInt(cantidad.value) < 1)) {
            cantidad.style.borderColor = '#ef4444';
            isValid = false;
        }
        
        if (precioUnitario && (parseFloat(precioUnitario.value) <= 0)) {
            precioUnitario.style.borderColor = '#ef4444';
            isValid = false;
        }
        
        if (!isValid) {
            e.preventDefault();
            alert('Por favor corrige los valores inválidos');
        } else {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Actualizando...';
            submitBtn.disabled = true;
        }
    });

    // ===== CONFIRMACIÓN DE SALIDA =====
    let formChanged = false;
    
    form.addEventListener('input', () => formChanged = true);
    
    window.addEventListener('beforeunload', function(e) {
        if (formChanged) {
            e.preventDefault();
            e.returnValue = '¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.';
        }
    });
});