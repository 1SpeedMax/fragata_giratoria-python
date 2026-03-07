// static/js/metodospago.js

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Módulo de métodos de pago cargado');

    // ===== ELEMENTOS =====
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearch');
    const selectAllCheckbox = document.getElementById('selectAll');
    const deleteSelectedBtn = document.getElementById('deleteSelected');
    const exportSelectedBtn = document.getElementById('exportSelected');
    const tableBody = document.getElementById('tableBody');
    const resultsCounter = document.getElementById('resultsCounter');

    // ===== VARIABLES =====
    let metodosData = [];

    // ===== INICIALIZAR =====
    cargarDatos();
    configurarEventos();

    function cargarDatos() {
        const filas = document.querySelectorAll('#tableBody tr');
        filas.forEach(fila => {
            if (!fila.classList.contains('no-data')) {
                metodosData.push({
                    elemento: fila,
                    id: fila.cells[1]?.textContent || '',
                    nombre: fila.cells[2]?.textContent.toLowerCase() || '',
                    descripcion: fila.cells[3]?.textContent.toLowerCase() || '',
                    checkbox: fila.querySelector('.row-select')
                });
            }
        });
        console.log(`✅ ${metodosData.length} métodos cargados`);
    }

    function configurarEventos() {
        // Búsqueda
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const termino = this.value.toLowerCase().trim();
                filtrar(termino);
                
                if (termino) {
                    clearSearchBtn.style.display = 'block';
                } else {
                    clearSearchBtn.style.display = 'none';
                }
            });
        }

        // Limpiar búsqueda
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', function() {
                searchInput.value = '';
                this.style.display = 'none';
                filtrar('');
                mostrarNotificacion('🧹 Búsqueda limpiada', 'info');
            });
        }

        // Seleccionar todos
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', function() {
                const checkboxes = document.querySelectorAll('.row-select:visible');
                checkboxes.forEach(cb => {
                    cb.checked = this.checked;
                    if (this.checked) {
                        cb.closest('tr').classList.add('row-selected');
                    } else {
                        cb.closest('tr').classList.remove('row-selected');
                    }
                });
                actualizarBotonesBatch();
            });
        }

        // Checkboxes individuales
        document.querySelectorAll('.row-select').forEach(cb => {
            cb.addEventListener('change', function() {
                if (this.checked) {
                    this.closest('tr').classList.add('row-selected');
                } else {
                    this.closest('tr').classList.remove('row-selected');
                }
                actualizarSelectAllCheckbox();
                actualizarBotonesBatch();
            });
        });

        // Eliminar seleccionados
        if (deleteSelectedBtn) {
            deleteSelectedBtn.addEventListener('click', function() {
                const selected = document.querySelectorAll('.row-select:checked');
                if (selected.length === 0) return;
                
                if (confirm(`¿Eliminar ${selected.length} método(s) de pago?`)) {
                    selected.forEach(cb => {
                        cb.closest('tr').remove();
                    });
                    actualizarContador();
                    actualizarBotonesBatch();
                    mostrarNotificacion('✅ Métodos eliminados', 'success');
                    
                    // Actualizar datos después de eliminar
                    metodosData = metodosData.filter(m => 
                        !Array.from(selected).some(cb => cb.value === m.id.replace('#', ''))
                    );
                }
            });
        }

        // Exportar seleccionados
        if (exportSelectedBtn) {
            exportSelectedBtn.addEventListener('click', function() {
                const selected = document.querySelectorAll('.row-select:checked');
                if (selected.length === 0) return;
                
                const ids = Array.from(selected).map(cb => cb.value).join(',');
                mostrarNotificacion(`📊 Exportando ${selected.length} método(s)...`, 'info');
                
                // Redirigir a exportación con filtro
                window.location.href = `/metodospago/export/excel/?ids=${ids}`;
            });
        }
    }

    function filtrar(termino) {
        let visibles = 0;
        
        metodosData.forEach(metodo => {
            if (metodo.elemento.parentNode) {
                const mostrar = termino === '' || 
                    metodo.nombre.includes(termino) || 
                    metodo.descripcion.includes(termino) ||
                    metodo.id.includes(termino);
                
                metodo.elemento.style.display = mostrar ? '' : 'none';
                if (mostrar) visibles++;
            }
        });
        
        // Actualizar contador
        if (resultsCounter) {
            if (termino) {
                resultsCounter.textContent = `Mostrando ${visibles} de ${metodosData.length} métodos`;
                resultsCounter.style.display = 'block';
            } else {
                resultsCounter.style.display = 'none';
            }
        }
        
        actualizarSelectAllCheckbox();
    }

    function actualizarSelectAllCheckbox() {
        if (!selectAllCheckbox) return;
        
        const checkboxes = document.querySelectorAll('.row-select:visible');
        const checked = document.querySelectorAll('.row-select:checked:visible');
        
        if (checked.length === 0) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = false;
        } else if (checked.length === checkboxes.length) {
            selectAllCheckbox.checked = true;
            selectAllCheckbox.indeterminate = false;
        } else {
            selectAllCheckbox.indeterminate = true;
        }
    }

    function actualizarBotonesBatch() {
        const selected = document.querySelectorAll('.row-select:checked').length;
        if (deleteSelectedBtn) deleteSelectedBtn.disabled = selected === 0;
        if (exportSelectedBtn) exportSelectedBtn.disabled = selected === 0;
    }

    function actualizarContador() {
        const total = document.querySelectorAll('#tableBody tr:not(.no-data)').length;
        const totalEl = document.querySelector('.summary-card:first-child .summary-value');
        if (totalEl) totalEl.textContent = total;
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
    const filas = document.querySelectorAll('#tableBody tr');
    filas.forEach((fila, index) => {
        if (!fila.classList.contains('no-data')) {
            fila.style.opacity = '0';
            fila.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                fila.style.transition = 'all 0.3s ease';
                fila.style.opacity = '1';
                fila.style.transform = 'translateY(0)';
            }, 50 * index);
        }
    });

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
        
        .notification {
            border-left-width: 4px;
        }
        
        .notification.success {
            border-left-color: #10b981;
        }
        
        .notification.error {
            border-left-color: #ef4444;
        }
        
        .notification.info {
            border-left-color: #f5d487;
        }
    `;
    document.head.appendChild(style);
});