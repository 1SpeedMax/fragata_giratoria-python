// static/js/productos_form.js

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Formulario de productos inicializado');

    // ===== REFERENCIAS DOM =====
    const form = document.getElementById('productoForm');
    const nombreInput = document.getElementById('nombre');
    const fechaInput = document.getElementById('fecha_registro');
    const precioInput = document.getElementById('precio_unitario');
    const stockActualInput = document.getElementById('stock_actual');
    const stockMinimoInput = document.getElementById('stock_minimo');
    const unidadSelect = document.getElementById('unidad_medida');
    const btnSubmit = document.getElementById('btnSubmit');
    const btnClear = document.getElementById('btnClear');
    const stockWarning = document.getElementById('stockWarning');

    // ===== FUNCIONES DE VALIDACIÓN =====

    // 1. Validar nombre (solo letras, espacios, acentos, mínimo 3 caracteres)
    function validarNombre(nombre) {
        const regex = /^[A-Za-záéíóúüñÁÉÍÓÚÜÑ\s]{3,100}$/;
        return regex.test(nombre);
    }

    // 2. Validar fecha (solo futuras, no pasadas)
    function validarFecha(fecha) {
        if (!fecha) return false;
        
        const fechaSeleccionada = new Date(fecha);
        const fechaActual = new Date();
        
        // Resetear horas para comparar solo fechas
        fechaActual.setHours(0, 0, 0, 0);
        fechaSeleccionada.setHours(0, 0, 0, 0);
        
        // Validar: fecha debe ser hoy o futura (no pasada)
        return fechaSeleccionada >= fechaActual;
    }

    // 3. Validar precio (mayor a 0)
    function validarPrecio(precio) {
        return precio && parseFloat(precio) > 0;
    }

    // 4. Validar stock actual (no negativo, entero)
    function validarStockActual(stock) {
        return stock !== null && stock !== '' && parseInt(stock) >= 0;
    }

    // 5. Validar stock mínimo (no negativo, entero)
    function validarStockMinimo(stock) {
        return stock !== null && stock !== '' && parseInt(stock) >= 0;
    }

    // 6. Validar stock mínimo vs stock actual
    function validarStockRelacion(stockActual, stockMinimo) {
        return parseInt(stockActual) >= parseInt(stockMinimo);
    }

    // 7. Validar unidad de medida seleccionada
    function validarUnidad(unidad) {
        return unidad && unidad !== '';
    }

    // ===== MOSTRAR/OCULTAR ERRORES =====

    function mostrarError(elementoId, mensajeId, mostrar) {
        const group = document.getElementById(`group-${elementoId}`);
        const error = document.getElementById(`error-${mensajeId}`);
        
        if (group) {
            if (mostrar) {
                group.classList.add('has-error');
                if (error) error.style.display = 'block';
            } else {
                group.classList.remove('has-error');
                if (error) error.style.display = 'none';
            }
        }
    }

    // ===== VALIDAR CAMPO EN TIEMPO REAL =====

    function validarCampoNombre() {
        const nombre = nombreInput.value.trim();
        const isValid = validarNombre(nombre);
        
        if (!isValid && nombre !== '') {
            mostrarError('nombre', 'nombre', true);
            return false;
        } else {
            mostrarError('nombre', 'nombre', false);
            return true;
        }
    }

    function validarCampoFecha() {
        const fecha = fechaInput.value;
        const isValid = validarFecha(fecha);
        
        if (!isValid && fecha !== '') {
            mostrarError('fecha', 'fecha', true);
            return false;
        } else {
            mostrarError('fecha', 'fecha', false);
            return true;
        }
    }

    function validarCampoPrecio() {
        const precio = precioInput.value;
        const isValid = validarPrecio(precio);
        
        if (!isValid && precio !== '') {
            mostrarError('precio', 'precio', true);
            return false;
        } else {
            mostrarError('precio', 'precio', false);
            return true;
        }
    }

    function validarCampoStockActual() {
        const stock = stockActualInput.value;
        const isValid = validarStockActual(stock);
        
        if (!isValid && stock !== '') {
            mostrarError('stock-actual', 'stock-actual', true);
            return false;
        } else {
            mostrarError('stock-actual', 'stock-actual', false);
            return true;
        }
    }

    function validarCampoStockMinimo() {
        const stock = stockMinimoInput.value;
        const isValid = validarStockMinimo(stock);
        
        if (!isValid && stock !== '') {
            mostrarError('stock-minimo', 'stock-minimo', true);
            return false;
        } else {
            mostrarError('stock-minimo', 'stock-minimo', false);
            return true;
        }
    }

    function validarRelacionStock() {
        const stockActual = stockActualInput.value;
        const stockMinimo = stockMinimoInput.value;
        
        if (stockActual !== '' && stockMinimo !== '') {
            const isValid = validarStockRelacion(stockActual, stockMinimo);
            
            if (!isValid) {
                mostrarError('stock-actual', 'stock-actual', true);
                mostrarError('stock-minimo', 'stock-minimo', true);
                return false;
            } else {
                mostrarError('stock-actual', 'stock-actual', false);
                mostrarError('stock-minimo', 'stock-minimo', false);
                
                // Mostrar advertencia si stock actual < stock mínimo
                if (parseInt(stockActual) < parseInt(stockMinimo)) {
                    stockWarning.style.display = 'flex';
                } else {
                    stockWarning.style.display = 'none';
                }
                return true;
            }
        }
        return true;
    }

    function validarCampoUnidad() {
        const unidad = unidadSelect.value;
        const isValid = validarUnidad(unidad);
        
        if (!isValid) {
            mostrarError('unidad', 'unidad', true);
            return false;
        } else {
            mostrarError('unidad', 'unidad', false);
            return true;
        }
    }

    // ===== VALIDAR TODO EL FORMULARIO =====

    function validarFormularioCompleto() {
        const isValidNombre = validarCampoNombre();
        const isValidFecha = validarCampoFecha();
        const isValidPrecio = validarCampoPrecio();
        const isValidStockActual = validarCampoStockActual();
        const isValidStockMinimo = validarCampoStockMinimo();
        const isValidRelacion = validarRelacionStock();
        const isValidUnidad = validarCampoUnidad();
        
        return isValidNombre && isValidFecha && isValidPrecio && 
               isValidStockActual && isValidStockMinimo && 
               isValidRelacion && isValidUnidad;
    }

    // ===== CONFIGURAR FECHA MÍNIMA =====
    function configurarFechas() {
        const hoy = new Date();
        const año = hoy.getFullYear();
        const mes = String(hoy.getMonth() + 1).padStart(2, '0');
        const dia = String(hoy.getDate()).padStart(2, '0');
        const fechaMinima = `${año}-${mes}-${dia}`;
        
        // La fecha mínima es hoy (no se pueden seleccionar fechas pasadas)
        fechaInput.setAttribute('min', fechaMinima);
    }

    // ===== LIMPIAR FORMULARIO =====
    function limpiarFormulario() {
        form.reset();
        
        // Remover errores
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('has-error');
        });
        
        document.querySelectorAll('.error-message').forEach(error => {
            error.style.display = 'none';
        });
        
        stockWarning.style.display = 'none';
        
        // Limpiar validación visual
        nombreInput.dispatchEvent(new Event('input'));
        fechaInput.dispatchEvent(new Event('input'));
        precioInput.dispatchEvent(new Event('input'));
        stockActualInput.dispatchEvent(new Event('input'));
        stockMinimoInput.dispatchEvent(new Event('input'));
        unidadSelect.dispatchEvent(new Event('change'));
    }

    // ===== EVENTOS EN TIEMPO REAL =====
    nombreInput.addEventListener('input', function(e) {
        // Limitar a solo letras
        this.value = this.value.replace(/[^A-Za-záéíóúüñÁÉÍÓÚÜÑ\s]/g, '');
        validarCampoNombre();
    });

    fechaInput.addEventListener('change', validarCampoFecha);
    fechaInput.addEventListener('input', validarCampoFecha);

    precioInput.addEventListener('input', function() {
        if (this.value < 0) this.value = 0;
        validarCampoPrecio();
    });

    stockActualInput.addEventListener('input', function() {
        if (this.value < 0) this.value = 0;
        validarCampoStockActual();
        validarRelacionStock();
    });

    stockMinimoInput.addEventListener('input', function() {
        if (this.value < 0) this.value = 0;
        validarCampoStockMinimo();
        validarRelacionStock();
    });

    unidadSelect.addEventListener('change', validarCampoUnidad);

    // ===== ENVÍO DEL FORMULARIO =====
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validarFormularioCompleto()) {
            // Mostrar loading
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
            
            // Enviar formulario
            this.submit();
        } else {
            // Mostrar mensaje de error general
            const errorGeneral = document.createElement('div');
            errorGeneral.className = 'error-general';
            errorGeneral.innerHTML = '<i class="fas fa-exclamation-circle"></i> Por favor, corrige los errores antes de enviar.';
            errorGeneral.style.cssText = `
                background: rgba(239, 68, 68, 0.2);
                border: 1px solid #ef4444;
                color: #ef4444;
                padding: 1rem;
                border-radius: 8px;
                margin-bottom: 1rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            `;
            
            const existingError = document.querySelector('.error-general');
            if (existingError) existingError.remove();
            
            form.insertBefore(errorGeneral, form.firstChild);
            
            setTimeout(() => {
                errorGeneral.remove();
            }, 3000);
        }
    });

    // Botón limpiar
    btnClear.addEventListener('click', limpiarFormulario);

    // ===== INICIALIZACIÓN =====
    function init() {
        configurarFechas();
        
        // Configurar fecha por defecto (hoy)
        const hoy = new Date();
        const año = hoy.getFullYear();
        const mes = String(hoy.getMonth() + 1).padStart(2, '0');
        const dia = String(hoy.getDate()).padStart(2, '0');
        fechaInput.value = `${año}-${mes}-${dia}`;
        
        // Validar campos vacíos
        validarCampoNombre();
        validarCampoFecha();
        validarCampoPrecio();
        validarCampoStockActual();
        validarCampoStockMinimo();
        validarCampoUnidad();
        
        console.log('✅ Formulario inicializado correctamente');
    }
    
    init();
});

// Configurar fecha mínima = hoy (no fechas pasadas)
function configurarFechas() {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    const fechaMinima = `${año}-${mes}-${dia}`;
    
    // La fecha mínima es hoy (puedes seleccionar hoy o futuro)
    fechaInput.setAttribute('min', fechaMinima);
}

// Al inicializar, establecer fecha actual por defecto
const hoy = new Date();
const año = hoy.getFullYear();
const mes = String(hoy.getMonth() + 1).padStart(2, '0');
const dia = String(hoy.getDate()).padStart(2, '0');
fechaInput.value = `${año}-${mes}-${dia}`;