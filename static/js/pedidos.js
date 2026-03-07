// static/js/pedidos.js

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Módulo de pedidos cargado correctamente');

    // ===== ELEMENTOS DEL DOM =====
    const searchInput = document.querySelector('.table-search');
    const tableBody = document.querySelector('.pedidos-table tbody');
    const statsValues = document.querySelectorAll('.stat-item p');
    const backButton = document.querySelector('.back-to-dashboard');

    // ===== VARIABLES GLOBALES =====
    let pedidosData = [];
    let debounceTimer;

    // ===== INICIALIZACIÓN =====
    cargarDatosPedidos();
    configurarEventos();
    animarEntrada();

    // ===== CARGAR DATOS DE PEDIDOS =====
    function cargarDatosPedidos() {
        const filas = document.querySelectorAll('.pedidos-table tbody tr');
        pedidosData = [];
        
        filas.forEach((fila, index) => {
            if (!fila.classList.contains('no-data')) {
                const cells = fila.cells;
                pedidosData.push({
                    elemento: fila,
                    id: cells[0]?.textContent.toLowerCase() || '',
                    fecha: cells[1]?.textContent.toLowerCase() || '',
                    platillo: cells[2]?.textContent.toLowerCase() || '',
                    cantidad: cells[3]?.textContent || '',
                    total: cells[4]?.textContent.toLowerCase() || '',
                    estado: cells[5]?.textContent.toLowerCase() || '',
                    textoCompleto: fila.textContent.toLowerCase()
                });
            }
        });
        
        console.log(`✅ ${pedidosData.length} pedidos cargados`);
    }

    // ===== CONFIGURAR EVENTOS =====
    function configurarEventos() {
        // Búsqueda en tiempo real con debounce
        if (searchInput) {
            searchInput.addEventListener('input', function(e) {
                clearTimeout(debounceTimer);
                const termino = e.target.value.toLowerCase().trim();
                
                debounceTimer = setTimeout(() => {
                    filtrarPedidos(termino);
                }, 300);
            });

            // Animación del placeholder
            searchInput.addEventListener('focus', function() {
                this.parentElement.style.transform = 'scale(1.02)';
            });

            searchInput.addEventListener('blur', function() {
                this.parentElement.style.transform = 'scale(1)';
            });
        }

        // Efecto hover en filas
        const filas = document.querySelectorAll('.pedidos-table tbody tr');
        filas.forEach(fila => {
            fila.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s ease';
            });
        });

        // Confirmación para eliminar
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function(e) {
                const fila = this.closest('tr');
                const pedidoInfo = fila.cells[2]?.textContent.trim() || 'este pedido';
                
                if (!confirm(`🗑️ ¿Estás seguro de eliminar ${pedidoInfo}?`)) {
                    e.preventDefault();
                } else {
                    // Animación de eliminación
                    fila.style.transform = 'translateX(100px)';
                    fila.style.opacity = '0';
                }
            });
        });

        // Efecto de click en editar
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                this.style.transform = 'rotate(360deg) scale(1.2)';
                setTimeout(() => {
                    window.location.href = this.href;
                }, 300);
            });
        });

        // Hover en botón volver
        if (backButton) {
            backButton.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s ease';
            });
        }

        // Atajos de teclado
        document.addEventListener('keydown', function(e) {
            // Ctrl+F para enfocar búsqueda
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                if (searchInput) {
                    searchInput.focus();
                    searchInput.select();
                }
            }
            // Escape para limpiar búsqueda
            if (e.key === 'Escape' && searchInput && searchInput.value) {
                searchInput.value = '';
                filtrarPedidos('');
            }
        });
    }

    // ===== FILTRAR PEDIDOS =====
    function filtrarPedidos(termino) {
        let resultadosVisibles = 0;

        pedidosData.forEach(pedido => {
            if (pedido.elemento.parentNode) {
                const coincide = termino === '' || 
                    pedido.textoCompleto.includes(termino);
                
                pedido.elemento.style.display = coincide ? '' : 'none';
                if (coincide) resultadosVisibles++;
            }
        });

        // Mostrar mensaje si no hay resultados
        mostrarMensajeNoResultados(resultadosVisibles, termino);
        
        // Actualizar contador de resultados
        actualizarContadorResultados(resultadosVisibles, termino);
    }

    // ===== MOSTRAR MENSAJE DE NO RESULTADOS =====
    function mostrarMensajeNoResultados(visibles, termino) {
        const existingMsg = document.querySelector('.no-results-message');
        if (existingMsg) existingMsg.remove();

        if (visibles === 0 && termino !== '' && pedidosData.length > 0) {
            const tr = document.createElement('tr');
            tr.className = 'no-results-message';
            tr.innerHTML = `
                <td colspan="7" class="no-data">
                    <i class="fas fa-search"></i>
                    <p>No se encontraron resultados para "<strong>${termino}</strong>"</p>
                    <button class="btn-clear-search" onclick="limpiarBusqueda()">
                        <i class="fas fa-undo-alt"></i> Limpiar búsqueda
                    </button>
                </td>
            `;
            tableBody.appendChild(tr);
        }
    }

    // ===== LIMPIAR BÚSQUEDA =====
    window.limpiarBusqueda = function() {
        if (searchInput) {
            searchInput.value = '';
            filtrarPedidos('');
        }
    };

    // ===== ACTUALIZAR CONTADOR DE RESULTADOS =====
    function actualizarContadorResultados(visibles, termino) {
        const headerTitle = document.querySelector('.header-title h1');
        if (headerTitle && termino) {
            const tooltip = document.createElement('small');
            tooltip.className = 'result-count';
            tooltip.textContent = ` (${visibles} resultados)`;
            tooltip.style.cssText = `
                font-size: 0.9rem;
                color: #f5d487;
                margin-left: 0.5rem;
                font-weight: normal;
            `;
            
            const existingTooltip = headerTitle.querySelector('.result-count');
            if (existingTooltip) existingTooltip.remove();
            
            if (termino) {
                headerTitle.appendChild(tooltip);
            }
        }
    }

    // ===== ACTUALIZAR ESTADÍSTICAS =====
    function actualizarEstadisticas() {
        const totalPedidos = pedidosData.length;
        const totalElement = document.querySelector('.stat-item:first-child p');
        if (totalElement) {
            animateNumber(totalElement, parseInt(totalElement.textContent), totalPedidos);
        }

        // Calcular monto pendiente (solo pedidos pendientes)
        let montoPendiente = 0;
        pedidosData.forEach(pedido => {
            if (pedido.estado.includes('pendiente')) {
                const total = parseFloat(pedido.total.replace(/[$,]/g, '')) || 0;
                montoPendiente += total;
            }
        });

        const montoElement = document.querySelector('.stat-item:nth-child(2) p');
        if (montoElement) {
            animateNumber(montoElement, 
                parseFloat(montoElement.textContent.replace(/[$,]/g, '')) || 0, 
                montoPendiente, 
                true);
        }

        // Calcular pedidos hoy
        const hoy = new Date().toLocaleDateString('es-ES', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        }).replace(/\//g, '/');
        
        let pedidosHoy = 0;
        pedidosData.forEach(pedido => {
            if (pedido.fecha.includes(hoy) || 
                (pedido.fecha.includes('13/12/2025') && hoy.includes('13/12/2025'))) {
                pedidosHoy++;
            }
        });

        const hoyElement = document.querySelector('.stat-item:nth-child(3) p');
        if (hoyElement) {
            animateNumber(hoyElement, parseInt(hoyElement.textContent), pedidosHoy);
        }
    }

    // ===== ANIMAR NÚMEROS =====
    function animateNumber(element, start, end, isCurrency = false) {
        if (!element) return;
        
        const duration = 1000;
        const increment = (end - start) / (duration / 16);
        let current = start;
        
        function updateNumber() {
            current += increment;
            if (Math.abs(current - end) < Math.abs(increment)) {
                element.textContent = isCurrency ? '$' + end.toFixed(0) : end;
            } else {
                element.textContent = isCurrency ? '$' + Math.round(current) : Math.round(current);
                requestAnimationFrame(updateNumber);
            }
        }
        
        requestAnimationFrame(updateNumber);
    }

    // ===== ANIMACIÓN DE ENTRADA =====
    function animarEntrada() {
        // Animar tarjetas de estadísticas
        const statItems = document.querySelectorAll('.stat-item');
        statItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 100 * index);
        });

        // Animar filas de la tabla
        const filas = document.querySelectorAll('.pedidos-table tbody tr');
        filas.forEach((fila, index) => {
            if (!fila.classList.contains('no-data')) {
                fila.style.opacity = '0';
                fila.style.transform = 'translateX(-20px)';
                
                setTimeout(() => {
                    fila.style.transition = 'all 0.3s ease';
                    fila.style.opacity = '1';
                    fila.style.transform = 'translateX(0)';
                }, 100 * (index + 3));
            }
        });
    }

    // ===== EXPORTAR FUNCIONES GLOBALES =====
    window.filtrarPedidos = filtrarPedidos;
    window.actualizarEstadisticas = actualizarEstadisticas;

    // ===== ACTUALIZAR ESTADÍSTICAS CADA 30 SEGUNDOS =====
    setInterval(() => {
        actualizarEstadisticas();
        
        // Animación de actualización
        const statCards = document.querySelectorAll('.stat-item');
        statCards.forEach(card => {
            card.style.transform = 'scale(1.02)';
            setTimeout(() => card.style.transform = 'scale(1)', 200);
        });
    }, 30000);

    // ===== ESTILOS DINÁMICOS PARA MENSAJES =====
    const style = document.createElement('style');
    style.textContent = `
        .btn-clear-search {
            background: #f5d487;
            color: black;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            margin-top: 1rem;
            transition: all 0.3s ease;
        }
        
        .btn-clear-search:hover {
            background: #ffd700;
            transform: translateY(-2px);
        }
        
        .no-results-message td {
            padding: 3rem !important;
        }
        
        .result-count {
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .stat-item {
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(style);

    // ===== ACTUALIZAR ESTADÍSTICAS INICIALES =====
    setTimeout(() => {
        actualizarEstadisticas();
    }, 500);
});

// ===== FUNCIÓN PARA EXPORTAR A EXCEL (opcional) =====
function exportToExcel() {
    window.location.href = "{% url 'pedidos:export_excel' %}";
}

// ===== FUNCIÓN PARA EXPORTAR A PDF (opcional) =====
function exportToPDF() {
    window.location.href = "{% url 'pedidos:export_pdf' %}";
}