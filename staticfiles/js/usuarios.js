// static/js/usuarios_tabla.js

document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Tabla de usuarios cargada");

    // ===== ELEMENTOS =====
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearch');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const selectAllCheckbox = document.getElementById('selectAll');
    const deleteSelectedBtn = document.getElementById('deleteSelected');
    const exportSelectedBtn = document.getElementById('exportSelected');
    const tableBody = document.getElementById('tableBody');
    const resultsCounter = document.getElementById('resultsCounter');

    // ===== VARIABLES =====
    let usuariosData = [];
    let filtroActual = 'todos';

    // ===== INICIALIZAR =====
    cargarDatos();
    configurarEventos();
    actualizarContador();

    function cargarDatos() {
        const filas = document.querySelectorAll('#tableBody tr');
        filas.forEach(fila => {
            usuariosData.push({
                elemento: fila,
                id: fila.cells[1]?.textContent || '',
                nombre: fila.cells[2]?.textContent.toLowerCase() || '',
                email: fila.cells[3]?.textContent.toLowerCase() || '',
                rol: fila.dataset.rol || '',
                estado: fila.dataset.estado || '',
                checkbox: fila.querySelector('.row-select')
            });
        });
    }

    function configurarEventos() {
        // Búsqueda
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const termino = this.value.toLowerCase().trim();
                filtrar(termino, filtroActual);
                
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
                filtrar('', filtroActual);
            });
        }

        // Filtros
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                filtroActual = this.dataset.filter;
                
                const termino = searchInput ? searchInput.value.toLowerCase().trim() : '';
                filtrar(termino, filtroActual);
            });
        });

        // Seleccionar todos
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', function() {
                const checkboxes = document.querySelectorAll('.row-select');
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
                
                if (confirm(`¿Eliminar ${selected.length} usuario(s)?`)) {
                    selected.forEach(cb => {
                        cb.closest('tr').remove();
                    });
                    actualizarContador();
                    actualizarBotonesBatch();
                }
            });
        }
    }

    function filtrar(termino, filtro) {
        let visibles = 0;
        
        usuariosData.forEach(usuario => {
            let mostrar = true;
            
            // Aplicar filtro
            if (filtro !== 'todos') {
                if (['activo', 'inactivo', 'suspendido'].includes(filtro)) {
                    mostrar = usuario.estado === filtro;
                } else {
                    mostrar = usuario.rol === filtro;
                }
            }
            
            // Aplicar búsqueda
            if (mostrar && termino) {
                mostrar = usuario.nombre.includes(termino) || 
                         usuario.email.includes(termino) ||
                         usuario.id.includes(termino);
            }
            
            usuario.elemento.style.display = mostrar ? '' : 'none';
            if (mostrar) visibles++;
        });
        
        // Actualizar contador
        if (resultsCounter) {
            if (termino || filtro !== 'todos') {
                let texto = `Mostrando ${visibles} de ${usuariosData.length} usuarios`;
                if (termino) texto += ` que coinciden con "${termino}"`;
                resultsCounter.textContent = texto;
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
        
        if (deleteSelectedBtn) {
            deleteSelectedBtn.disabled = selected === 0;
        }
        if (exportSelectedBtn) {
            exportSelectedBtn.disabled = selected === 0;
        }
    }

    function actualizarContador() {
        const total = document.querySelectorAll('#tableBody tr').length;
        const counter = document.querySelector('.summary-card:first-child .summary-value');
        if (counter) counter.textContent = total;
    }
});