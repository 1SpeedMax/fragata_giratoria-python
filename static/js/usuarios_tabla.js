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
        usuariosData = [];
        if (!tableBody) return;

        const filas = tableBody.querySelectorAll('tr.usuario-row');
        filas.forEach(fila => {
            usuariosData.push({
                elemento: fila,
                id: fila.cells[1]?.textContent.toLowerCase().trim().replace('#', '') || '',
                nombre: fila.cells[2]?.textContent.toLowerCase().trim() || '',
                email: fila.cells[3]?.textContent.toLowerCase().trim() || '',
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

                if (clearSearchBtn) {
                    clearSearchBtn.style.display = termino ? 'inline-flex' : 'none';
                }
            });
        }

        // Limpiar búsqueda
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', function() {
                if (searchInput) searchInput.value = '';
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

        // Seleccionar todos (solo filas visibles)
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', function() {
                usuariosData.forEach(usuario => {
                    if (usuario.elemento.style.display === 'none') return;
                    if (!usuario.checkbox) return;

                    usuario.checkbox.checked = this.checked;
                    if (this.checked) {
                        usuario.elemento.classList.add('row-selected');
                    } else {
                        usuario.elemento.classList.remove('row-selected');
                    }
                });
                actualizarBotonesBatch();
            });
        }

        // Checkboxes individuales
        usuariosData.forEach(usuario => {
            if (!usuario.checkbox) return;
            usuario.checkbox.addEventListener('change', function() {
                if (this.checked) {
                    usuario.elemento.classList.add('row-selected');
                } else {
                    usuario.elemento.classList.remove('row-selected');
                }
                actualizarSelectAllCheckbox();
                actualizarBotonesBatch();
            });
        });

        // Eliminar seleccionados
        if (deleteSelectedBtn) {
            deleteSelectedBtn.addEventListener('click', function() {
                const seleccionados = usuariosData.filter(u => u.checkbox && u.checkbox.checked);
                if (seleccionados.length === 0) return;

                if (confirm(`¿Eliminar ${seleccionados.length} usuario(s)?`)) {
                    const ids = seleccionados.map(u => u.checkbox.value);

                    fetch(deleteSelectedBtn.dataset.deleteUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': obtenerCSRFToken()
                        },
                        body: JSON.stringify({ ids: ids })
                    })
                    .then(res => res.json().catch(() => ({})))
                    .then(() => {
                        seleccionados.forEach(u => u.elemento.remove());
                        usuariosData = usuariosData.filter(u => !seleccionados.includes(u));
                        actualizarContador();
                        actualizarBotonesBatch();
                        actualizarSelectAllCheckbox();
                    })
                    .catch(err => {
                        console.error('Error al eliminar usuarios:', err);
                        alert('Ocurrió un error al eliminar los usuarios seleccionados.');
                    });
                }
            });
        }

        // Exportar seleccionados
        if (exportSelectedBtn) {
            exportSelectedBtn.addEventListener('click', function() {
                const seleccionados = usuariosData.filter(u => u.checkbox && u.checkbox.checked);
                if (seleccionados.length === 0) return;

                const ids = seleccionados.map(u => u.checkbox.value).join(',');
                const baseUrl = this.dataset.exportUrl;
                if (baseUrl) {
                    window.location.href = `${baseUrl}?ids=${encodeURIComponent(ids)}`;
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
        actualizarBotonesBatch();
    }

    function actualizarSelectAllCheckbox() {
        if (!selectAllCheckbox) return;

        const visibles = usuariosData.filter(u => u.elemento.style.display !== 'none' && u.checkbox);
        const marcados = visibles.filter(u => u.checkbox.checked);

        if (visibles.length === 0 || marcados.length === 0) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = false;
        } else if (marcados.length === visibles.length) {
            selectAllCheckbox.checked = true;
            selectAllCheckbox.indeterminate = false;
        } else {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = true;
        }
    }

    function actualizarBotonesBatch() {
        const seleccionados = usuariosData.filter(u => u.checkbox && u.checkbox.checked).length;

        if (deleteSelectedBtn) {
            deleteSelectedBtn.disabled = seleccionados === 0;
        }
        if (exportSelectedBtn) {
            exportSelectedBtn.disabled = seleccionados === 0;
        }
    }

    function actualizarContador() {
        const total = usuariosData.length;
        const counter = document.querySelector('.summary-card:first-child .summary-value');
        if (counter) counter.textContent = total;
    }

    function obtenerCSRFToken() {
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('csrftoken='));
        return cookieValue ? cookieValue.split('=')[1] : '';
    }
});