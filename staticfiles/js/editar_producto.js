// static/js/editar_producto.js

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del formulario
    const form = document.getElementById('productoForm');
    const nombre = document.getElementById('nombre');
    const fecha = document.getElementById('fecha_registro');
    const precio = document.getElementById('precio_unitario');
    const stockActual = document.getElementById('stock_actual');
    const stockMinimo = document.getElementById('stock_minimo');
    const unidad = document.getElementById('unidad_medida');
    const stockWarning = document.getElementById('stockWarning');
    
    // Función para validar un campo
    function validateField(input, groupId, condition) {
        const group = document.getElementById(groupId);
        
        if (condition) {
            group.classList.remove('error');
            group.classList.add('success');
            return true;
        } else {
            group.classList.add('error');
            group.classList.remove('success');
            return false;
        }
    }
    
    // Validar nombre
    nombre.addEventListener('input', function() {
        validateField(nombre, 'group-nombre', 
            nombre.value.trim().length >= 3);
    });
    
    // Validar fecha
    fecha.addEventListener('change', function() {
        validateField(fecha, 'group-fecha', 
            fecha.value !== '');
    });
    
    // Validar precio
    precio.addEventListener('input', function() {
        const isValid = parseFloat(precio.value) > 0;
        validateField(precio, 'group-precio', isValid);
    });
    
    // Validar stock actual
    stockActual.addEventListener('input', function() {
        const isValid = parseInt(stockActual.value) >= 0;
        validateField(stockActual, 'group-stock-actual', isValid);
        checkStockWarning();
    });
    
    // Validar stock mínimo
    stockMinimo.addEventListener('input', function() {
        const isValid = parseInt(stockMinimo.value) >= 0;
        validateField(stockMinimo, 'group-stock-minimo', isValid);
        checkStockWarning();
    });
    
    // Validar unidad de medida
    unidad.addEventListener('change', function() {
        const isValid = unidad.value !== '';
        validateField(unidad, 'group-unidad', isValid);
    });
    
    // Verificar advertencia de stock bajo
    function checkStockWarning() {
        const actual = parseInt(stockActual.value) || 0;
        const minimo = parseInt(stockMinimo.value) || 0;
        
        if (actual < minimo && minimo > 0) {
            stockWarning.classList.add('show');
        } else {
            stockWarning.classList.remove('show');
        }
    }
    
    // Validación inicial
    checkStockWarning();
    
    // Validar campos al cargar la página
    validateField(nombre, 'group-nombre', nombre.value.trim().length >= 3);
    validateField(fecha, 'group-fecha', fecha.value !== '');
    validateField(precio, 'group-precio', parseFloat(precio.value) > 0);
    validateField(stockActual, 'group-stock-actual', parseInt(stockActual.value) >= 0);
    validateField(stockMinimo, 'group-stock-minimo', parseInt(stockMinimo.value) >= 0);
    validateField(unidad, 'group-unidad', unidad.value !== '');
    
    // Validación final antes de enviar
    form.addEventListener('submit', function(e) {
        let isValid = true;
        
        // Validar nombre
        if (nombre.value.trim().length < 3) {
            validateField(nombre, 'group-nombre', false);
            isValid = false;
        }
        
        // Validar fecha
        if (!fecha.value) {
            validateField(fecha, 'group-fecha', false);
            isValid = false;
        }
        
        // Validar precio
        if (parseFloat(precio.value) <= 0) {
            validateField(precio, 'group-precio', false);
            isValid = false;
        }
        
        // Validar stock actual
        if (parseInt(stockActual.value) < 0 || stockActual.value === '') {
            validateField(stockActual, 'group-stock-actual', false);
            isValid = false;
        }
        
        // Validar stock mínimo
        if (parseInt(stockMinimo.value) < 0 || stockMinimo.value === '') {
            validateField(stockMinimo, 'group-stock-minimo', false);
            isValid = false;
        }
        
        // Validar unidad
        if (!unidad.value) {
            validateField(unidad, 'group-unidad', false);
            isValid = false;
        }
        
        // Mostrar advertencia de stock bajo
        checkStockWarning();
        
        if (!isValid) {
            e.preventDefault();
            alert('Por favor, corrige los errores en el formulario antes de enviar.');
            
            // Scroll al primer error
            const firstError = document.querySelector('.form-group.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
});