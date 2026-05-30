// static/js/compras_tabla.js

document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Inicializando tabla de compras...");

    // ===== ELEMENTOS DEL DOM =====
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearch');
    const tableBody = document.getElementById('tableBody');
    const selectAllCheckbox = document.getElementById('selectAll');
    const deleteSelectedBtn = document.getElementById('deleteSelected');
    const exportSelectedBtn = document.getElementById('exportSelected');
    const resultsCounter = document.getElementById('resultsCounter');
    
    // ===== VARIABLES GLOBALES =====
    let debounceTimer;
    let filasOriginales = [];

    // ===== INICIALIZACIÓN =====
    init();

    function init() {
        guardarFilasOriginales();
        configurarBusqueda();
        configurarCheckboxes();
        configurarOrdenamiento();
        configurarBatchActions();
        actualizarResumen();
        animarEntrada();
    }

    // ===== GUARDAR FILAS ORIGINALES =====
    function guardarFilasOriginales() {
        const filas = document.querySelectorAll('#tableBody tr');
        filas.forEach(fila => {
            if (!fila.classList.contains('no-data') && !fila.classList.contains('no-results')) {
                const celdas = fila.cells;
                if (celdas.length >= 5) {
                    filasOriginales.push({
                        elemento: fila,
                        id: celdas[1]?.textContent.toLowerCase() || '',
                        descripcion: celdas[2]?.textContent.toLowerCase() || '',
                        fecha: celdas[3]?.textContent.toLowerCase() || '',
                        total: celdas[4]?.textContent.toLowerCase() || ''
                    });
                }
            }
        });
        console.log(`📊 ${filasOriginales.length} filas cargadas`);
    }

    // ===== CONFIGURAR BÚSQUEDA =====
    function configurarBusqueda() {
        if (!searchInput || !tableBody) return;

        searchInput.addEventListener('input', function(e) {
            clearTimeout(debounceTimer);
            const termino = e.target.value.toLowerCase();
            
            // Mostrar botón de limpiar
            if (clearSearchBtn) {
                clearSearchBtn.style.display = termino ? 'block' : 'none';
            }
            
            debounceTimer = setTimeout(() => {
                filtrarTabla(termino);
            }, 300);
        });

        // Limpiar búsqueda
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', function() {
                searchInput.value = '';
                this.style.display = 'none';
                filtrarTabla('');
                searchInput.focus();
            });
        }
    }

    // ===== FILTRAR TABLA =====
    function filtrarTabla(termino) {
        // Eliminar fila de "no results" si existe
        const noResultsRow = document.querySelector('.no-results');
        if (noResultsRow) noResultsRow.remove();

        let resultadosVisibles = 0;

        filasOriginales.forEach(fila => {
            const coincide = fila.id.includes(termino) || 
                            fila.descripcion.includes(termino) || 
                            fila.fecha.includes(termino) ||
                            fila.total.includes(termino);
            
            fila.elemento.style.display = coincide ? '' : 'none';
            if (coincide) resultadosVisibles++;
        });

        // Actualizar contador
        if (resultsCounter) {
            if (termino) {
                resultsCounter.textContent = `${resultadosVisibles} resultado${resultadosVisibles !== 1 ? 's' : ''} encontrado${resultadosVisibles !== 1 ? 's' : ''} para "${termino}"`;
                resultsCounter.style.display = 'block';
            } else {
                resultsCounter.style.display = 'none';
            }
        }

        // Mostrar mensaje si no hay resultados
        if (resultadosVisibles === 0 && termino !== '' && filasOriginales.length > 0) {
            const newRow = document.createElement('tr');
            newRow.className = 'no-results';
            newRow.innerHTML = `
                <td colspan="6" class="no-data">
                    <i class="fas fa-search"></i>
                    <p>No se encontraron resultados para "<strong>${termino}</strong>"</p>
                    <button class="btn-empty" onclick="document.getElementById('searchInput').value=''; document.getElementById('clearSearch').click();">
                        Limpiar búsqueda
                    </button>
                </td>
            `;
            tableBody.appendChild(newRow);
        }
    }

    // ===== CONFIGURAR CHECKBOXES =====
    function configurarCheckboxes() {
        // Checkbox "Seleccionar todos"
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', function() {
                const checkboxes = document.querySelectorAll('.row-select:not([disabled])');
                checkboxes.forEach(cb => {
                    cb.checked = this.checked;
                    highlightRow(cb.closest('tr'), this.checked);
                });
                actualizarBotonesBatch();
            });
        }

        // Checkboxes individuales
        document.querySelectorAll('.row-select').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                highlightRow(this.closest('tr'), this.checked);
                actualizarSelectAllCheckbox();
                actualizarBotonesBatch();
            });
        });
    }

    // ===== RESALTAR FILA SELECCIONADA =====
    function highlightRow(row, selected) {
        if (selected) {
            row.classList.add('row-selected');
        } else {
            row.classList.remove('row-selected');
        }
    }

    // ===== ACTUALIZAR CHECKBOX "SELECCIONAR TODOS" =====
    function actualizarSelectAllCheckbox() {
        if (!selectAllCheckbox) return;
        
        const checkboxes = document.querySelectorAll('.row-select:not([disabled])');
        const checkedCount = document.querySelectorAll('.row-select:checked').length;
        
        selectAllCheckbox.checked = checkedCount === checkboxes.length && checkboxes.length > 0;
        selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < checkboxes.length;
    }

    // ===== ACTUALIZAR BOTONES DE ACCIONES POR LOTE =====
    function actualizarBotonesBatch() {
        const selectedCount = document.querySelectorAll('.row-select:checked').length;
        
        if (deleteSelectedBtn) {
            deleteSelectedBtn.disabled = selectedCount === 0;
            if (selectedCount > 0) {
                deleteSelectedBtn.innerHTML = `<i class="fas fa-trash"></i> Eliminar ${selectedCount} seleccionada${selectedCount > 1 ? 's' : ''}`;
            } else {
                deleteSelectedBtn.innerHTML = `<i class="fas fa-trash"></i> Eliminar seleccionadas`;
            }
        }
        
        if (exportSelectedBtn) {
            exportSelectedBtn.disabled = selectedCount === 0;
            if (selectedCount > 0) {
                exportSelectedBtn.innerHTML = `<i class="fas fa-file-export"></i> Exportar ${selectedCount} seleccionada${selectedCount > 1 ? 's' : ''}`;
            } else {
                exportSelectedBtn.innerHTML = `<i class="fas fa-file-export"></i> Exportar seleccionadas`;
            }
        }
    }

    // ===== CONFIGURAR ACCIONES POR LOTE =====
    function configurarBatchActions() {
        if (deleteSelectedBtn) {
            deleteSelectedBtn.addEventListener('click', function() {
                if (this.disabled) return;
                
                const selectedIds = [];
                document.querySelectorAll('.row-select:checked').forEach(cb => {
                    const row = cb.closest('tr');
                    const id = row.cells[1]?.textContent.replace('#', '');
                    if (id) selectedIds.push(id);
                });

                if (selectedIds.length === 0) return;

                const mensaje = selectedIds.length === 1 
                    ? '¿Estás seguro de eliminar esta compra?'
                    : `¿Estás seguro de eliminar ${selectedIds.length} compras?`;

                if (confirm(mensaje)) {
                    mostrarNotificacion(`Eliminando ${selectedIds.length} compra(s)...`, 'info');
                    // Aquí iría la petición AJAX para eliminar múltiples
                    // Por ahora redirigimos a una URL con los IDs
                    // window.location.href = `/compras/eliminar-multiples/?ids=${selectedIds.join(',')}`;
                }
            });
        }

        if (exportSelectedBtn) {
            exportSelectedBtn.addEventListener('click', function() {
                if (this.disabled) return;
                
                const selectedIds = [];
                document.querySelectorAll('.row-select:checked').forEach(cb => {
                    const row = cb.closest('tr');
                    const id = row.cells[1]?.textContent.replace('#', '');
                    if (id) selectedIds.push(id);
                });

                if (selectedIds.length === 0) return;
                
                mostrarNotificacion(`Exportando ${selectedIds.length} compra(s)...`, 'info');
                // window.location.href = `/compras/exportar-seleccionadas/?ids=${selectedIds.join(',')}`;
            });
        }
    }

    // ===== CONFIGURAR ORDENAMIENTO =====
    function configurarOrdenamiento() {
        const headers = document.querySelectorAll('th.sortable');
        
        headers.forEach(header => {
            header.addEventListener('click', function() {
                const column = this.dataset.sort;
                const currentOrder = this.dataset.order || 'asc';
                const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
                
                // Remover clases de otros headers
                headers.forEach(h => {
                    h.classList.remove('sort-asc', 'sort-desc');
                    h.querySelector('i').className = 'fas fa-sort';
                });
                
                // Agregar clase al header actual
                this.classList.add(`sort-${newOrder}`);
                this.dataset.order = newOrder;
                this.querySelector('i').className = newOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
                
                ordenarTabla(column, newOrder);
            });
        });
    }

    // ===== ORDENAR TABLA =====
    function ordenarTabla(column, order) {
        const filas = Array.from(filasOriginales);
        
        filas.sort((a, b) => {
            let aVal, bVal;
            
            switch(column) {
                case 'id':
                    aVal = parseInt(a.id.replace('#', '') || 0);
                    bVal = parseInt(b.id.replace('#', '') || 0);
                    break;
                case 'descripcion':
                    aVal = a.descripcion;
                    bVal = b.descripcion;
                    return order === 'asc' 
                        ? aVal.localeCompare(bVal)
                        : bVal.localeCompare(aVal);
                case 'fecha':
                    aVal = a.fecha.split('/').reverse().join('');
                    bVal = b.fecha.split('/').reverse().join('');
                    break;
                case 'total':
                    aVal = parseFloat(a.total.replace(/[$,]/g, '') || 0);
                    bVal = parseFloat(b.total.replace(/[$,]/g, '') || 0);
                    break;
                default:
                    return 0;
            }
            
            if (order === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });
        
        // Reordenar filas en el DOM
        const tbody = document.getElementById('tableBody');
        filas.forEach(fila => tbody.appendChild(fila.elemento));
    }

    // ===== ACTUALIZAR RESUMEN =====
    function actualizarResumen() {
        // Los valores ya vienen del backend
    }

    // ===== ANIMACIÓN DE ENTRADA =====
    function animarEntrada() {
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
    }

    // ===== MOSTRAR NOTIFICACIÓN =====
    function mostrarNotificacion(mensaje, tipo = 'info') {
        let notificacion = document.querySelector('.table-notification');
        
        if (!notificacion) {
            notificacion = document.createElement('div');
            notificacion.className = 'table-notification';
            document.body.appendChild(notificacion);
        }
        
        notificacion.textContent = mensaje;
        notificacion.className = `table-notification ${tipo}`;
        notificacion.classList.add('show');
        
        setTimeout(() => {
            notificacion.classList.remove('show');
        }, 3000);
    }
});