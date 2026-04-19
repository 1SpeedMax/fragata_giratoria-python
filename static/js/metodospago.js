// static/js/metodospago.js

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Módulo de métodos de pago cargado');

    // ===== ELEMENTOS =====
    const searchInput = document.getElementById('searchInput');
    const selectAllCheckbox = document.getElementById('selectAll');
    const deleteSelectedBtn = document.getElementById('deleteSelected');
    const exportSelectedBtn = document.getElementById('exportSelected');
    
    // ===== FUNCIÓN PARA OBTENER CSRF TOKEN =====
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // ===== SELECCIÓN DE TODOS LOS CHECKBOXES =====
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.row-select');
            checkboxes.forEach(checkbox => {
                checkbox.checked = selectAllCheckbox.checked;
                if (selectAllCheckbox.checked) {
                    checkbox.closest('tr').classList.add('row-selected');
                } else {
                    checkbox.closest('tr').classList.remove('row-selected');
                }
            });
            actualizarBotonesBatch();
        });
    }

    // ===== CHECKBOXES INDIVIDUALES =====
    function actualizarCheckboxesIndividuales() {
        const checkboxes = document.querySelectorAll('.row-select');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    this.closest('tr').classList.add('row-selected');
                } else {
                    this.closest('tr').classList.remove('row-selected');
                }
                actualizarSelectAllCheckbox();
                actualizarBotonesBatch();
            });
        });
    }
    
    function actualizarSelectAllCheckbox() {
        if (!selectAllCheckbox) return;
        const checkboxes = document.querySelectorAll('.row-select');
        const checkedCheckboxes = document.querySelectorAll('.row-select:checked');
        
        if (checkboxes.length === 0) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = false;
        } else if (checkedCheckboxes.length === checkboxes.length) {
            selectAllCheckbox.checked = true;
            selectAllCheckbox.indeterminate = false;
        } else if (checkedCheckboxes.length === 0) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = false;
        } else {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = true;
        }
    }
    
    function actualizarBotonesBatch() {
        const selectedCount = document.querySelectorAll('.row-select:checked').length;
        if (deleteSelectedBtn) {
            deleteSelectedBtn.disabled = selectedCount === 0;
        }
        if (exportSelectedBtn) {
            exportSelectedBtn.disabled = selectedCount === 0;
        }
    }
    
    // Inicializar checkboxes
    actualizarCheckboxesIndividuales();
    actualizarBotonesBatch();

    // ===== ELIMINAR SELECCIONADOS =====
    if (deleteSelectedBtn) {
        deleteSelectedBtn.addEventListener('click', function() {
            const selected = document.querySelectorAll('.row-select:checked');
            if (selected.length === 0) return;
            
            if (confirm(`¿Eliminar ${selected.length} método(s) de pago seleccionados?`)) {
                const ids = Array.from(selected).map(cb => cb.value);
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = window.location.href;
                
                const csrfInput = document.createElement('input');
                csrfInput.type = 'hidden';
                csrfInput.name = 'csrfmiddlewaretoken';
                csrfInput.value = getCookie('csrftoken');
                form.appendChild(csrfInput);
                
                const idsInput = document.createElement('input');
                idsInput.type = 'hidden';
                idsInput.name = 'delete_ids';
                idsInput.value = ids.join(',');
                form.appendChild(idsInput);
                
                document.body.appendChild(form);
                form.submit();
            }
        });
    }

    // ===== EXPORTAR SELECCIONADOS =====
    if (exportSelectedBtn) {
        exportSelectedBtn.addEventListener('click', function() {
            const selected = document.querySelectorAll('.row-select:checked');
            if (selected.length === 0) return;
            
            const ids = Array.from(selected).map(cb => cb.value).join(',');
            window.location.href = `/metodos_pago/exportar/excel/?ids=${ids}`;
        });
    }

    // ===== BÚSQUEDA CON PAGINACIÓN =====
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const searchTerm = this.value.trim();
                const url = new URL(window.location.href);
                if (searchTerm) {
                    url.searchParams.set('search', searchTerm);
                } else {
                    url.searchParams.delete('search');
                }
                url.searchParams.set('page', '1');
                window.location.href = url.toString();
            }, 500);
        });
    }

    // ===== PAGINACIÓN =====
    function configurarPaginacion() {
        const paginationLinks = document.querySelectorAll('.page-link:not(.disabled)');
        
        paginationLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const url = this.getAttribute('href');
                if (url && url !== '#') {
                    window.location.href = url;
                }
            });
        });
    }
    
    configurarPaginacion();

    // ===== ANIMACIÓN DE ENTRADA PARA FILAS =====
    const filas = document.querySelectorAll('#tableBody tr');
    filas.forEach((fila, index) => {
        if (!fila.classList.contains('empty-row')) {
            fila.style.opacity = '0';
            fila.style.transform = 'translateY(10px)';
            setTimeout(() => {
                fila.style.transition = 'all 0.3s ease';
                fila.style.opacity = '1';
                fila.style.transform = 'translateY(0)';
            }, 50 * index);
        }
    });

    // ===== NOTIFICACIÓN FLOTANTE =====
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
                        'linear-gradient(135deg, #d4af37, #f5d487)'};
            color: ${tipo === 'success' ? 'white' : tipo === 'error' ? 'white' : '#1a1a1a'};
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 0.8rem;
            animation: slideInRight 0.3s ease-out;
            font-weight: 500;
        `;
        
        document.body.appendChild(notificacion);
        
        setTimeout(() => {
            notificacion.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notificacion.remove(), 300);
        }, 3000);
    }

    // Mostrar notificación si hay mensajes en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
    const error = urlParams.get('error');
    if (message) {
        mostrarNotificacion(decodeURIComponent(message), 'success');
    }
    if (error) {
        mostrarNotificacion(decodeURIComponent(error), 'error');
    }

    console.log('✅ Paginación y funcionalidades configuradas correctamente');
});