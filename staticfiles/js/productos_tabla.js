// static/js/productos_tabla.js

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Tabla de productos inicializada');

    // ===== CONFIGURACIÓN =====
    const CONFIG = {
        ITEMS_PER_PAGE: 10,
        SEARCH_DELAY: 300,
        ANIMATION_DURATION: 300
    };

    // ===== REFERENCIAS DOM =====
    const DOM = {
        searchInput: document.getElementById('searchInput'),
        selectAllCheckbox: document.getElementById('selectAll'),
        deleteSelectedBtn: document.getElementById('deleteSelected'),
        exportSelectedBtn: document.getElementById('exportSelected'),
        tableBody: document.getElementById('tableBody'),
        tableWrapper: document.querySelector('.table-wrapper')
    };

    // ===== VARIABLES DE ESTADO =====
    let State = {
        selectedProducts: new Set(),
        allProducts: [],
        filteredProducts: [],
        currentPage: 1,
        searchTerm: '',
        isProcessing: false
    };

    // ===== FUNCIÓN: OBTENER CSRF TOKEN =====
    function getCsrfToken() {
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('csrftoken='))
            ?.split('=')[1];
        return cookieValue || '';
    }

    // ===== FUNCIÓN: MOSTRAR NOTIFICACIÓN =====
    function showNotification(message, type = 'success') {
        let notificationContainer = document.querySelector('.notifications-container');
        
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'notifications-container';
            notificationContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 10px;
            `;
            document.body.appendChild(notificationContainer);
        }
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #34d399)' : 
                        type === 'error' ? 'linear-gradient(135deg, #ef4444, #f87171)' : 
                        'linear-gradient(135deg, #f59e0b, #fbbf24)'};
            color: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            gap: 0.8rem;
            font-weight: 500;
            animation: slideInRight 0.3s ease-out;
            transform-origin: right;
        `;
        
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-exclamation-triangle'}"></i>
            <span>${message}</span>
        `;
        
        notificationContainer.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), CONFIG.ANIMATION_DURATION);
        }, 3000);
    }

    // ===== FUNCIÓN: ACTUALIZAR CONTADOR Y BOTONES =====
    function updateSelectionUI() {
        const totalSelected = State.selectedProducts.size;
        const visibleRows = State.filteredProducts.length;
        
        if (DOM.deleteSelectedBtn) {
            DOM.deleteSelectedBtn.disabled = totalSelected === 0;
            DOM.deleteSelectedBtn.innerHTML = `<i class="fas fa-trash"></i> Eliminar seleccionados${totalSelected > 0 ? ` (${totalSelected})` : ''}`;
        }
        
        if (DOM.exportSelectedBtn) {
            DOM.exportSelectedBtn.disabled = totalSelected === 0;
            DOM.exportSelectedBtn.innerHTML = `<i class="fas fa-file-export"></i> Exportar seleccionados${totalSelected > 0 ? ` (${totalSelected})` : ''}`;
        }
        
        if (DOM.selectAllCheckbox && visibleRows > 0) {
            const allChecked = totalSelected === visibleRows;
            const someChecked = totalSelected > 0 && totalSelected < visibleRows;
            
            DOM.selectAllCheckbox.checked = allChecked;
            DOM.selectAllCheckbox.indeterminate = someChecked;
        }
    }

    // ===== FUNCIÓN: CAPTURAR PRODUCTOS =====
    function captureProducts() {
        const rows = document.querySelectorAll('#tableBody .producto-row');
        State.allProducts = [];
        
        rows.forEach(row => {
            const checkbox = row.querySelector('.row-select');
            State.allProducts.push({
                element: row,
                id: row.querySelector('.id-cell')?.innerText.replace('#', '') || '',
                nombre: row.querySelector('td:nth-child(3)')?.innerText.toLowerCase() || '',
                categoria: row.querySelector('td:nth-child(4)')?.innerText.toLowerCase() || '',
                checkbox: checkbox
            });
        });
        
        State.filteredProducts = [...State.allProducts];
        return State.allProducts.length;
    }

    // ===== FUNCIÓN: GENERAR NÚMEROS DE PÁGINA =====
    function generatePageNumbers(current, total) {
        let html = '';
        const maxVisible = 5;
        let startPage = Math.max(1, current - Math.floor(maxVisible / 2));
        let endPage = Math.min(total, startPage + maxVisible - 1);
        
        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }
        
        if (startPage > 1) {
            html += `<a href="#" class="page-link" data-page="1">1</a>`;
            if (startPage > 2) html += `<span class="page-dots">...</span>`;
        }
        
        for (let i = startPage; i <= endPage; i++) {
            if (i === current) {
                html += `<span class="page-current">${i}</span>`;
            } else {
                html += `<a href="#" class="page-link" data-page="${i}">${i}</a>`;
            }
        }
        
        if (endPage < total) {
            if (endPage < total - 1) html += `<span class="page-dots">...</span>`;
            html += `<a href="#" class="page-link" data-page="${total}">${total}</a>`;
        }
        
        return html;
    }

    // ===== FUNCIÓN: ACTUALIZAR CONTROLES DE PAGINACIÓN =====
    function updatePaginationControls() {
        const totalPages = Math.ceil(State.filteredProducts.length / CONFIG.ITEMS_PER_PAGE);
        const existingPagination = document.querySelector('.pagination-container-client');
        
        if (existingPagination) {
            existingPagination.remove();
        }
        
        if (totalPages <= 1 || State.filteredProducts.length === 0) return;
        
        const startIndex = (State.currentPage - 1) * CONFIG.ITEMS_PER_PAGE + 1;
        const endIndex = Math.min(State.currentPage * CONFIG.ITEMS_PER_PAGE, State.filteredProducts.length);
        
        const paginationHtml = `
            <div class="pagination-container pagination-container-client">
                <div class="pagination-info">
                    <i class="fas fa-list"></i>
                    Mostrando ${startIndex} - ${endIndex} de ${State.filteredProducts.length} productos
                </div>
                
                <div class="pagination">
                    <a href="#" class="page-link ${State.currentPage === 1 ? 'disabled' : ''}" data-page="prev">
                        <i class="fas fa-chevron-left"></i> Anterior
                    </a>
                    
                    <div class="page-numbers">
                        ${generatePageNumbers(State.currentPage, totalPages)}
                    </div>
                    
                    <a href="#" class="page-link ${State.currentPage === totalPages ? 'disabled' : ''}" data-page="next">
                        Siguiente <i class="fas fa-chevron-right"></i>
                    </a>
                </div>
                
                <div class="pagination-page-info">
                    <i class="fas fa-file-alt"></i>
                    Página ${State.currentPage} de ${totalPages}
                </div>
            </div>
        `;
        
        if (DOM.tableWrapper) {
            DOM.tableWrapper.insertAdjacentHTML('afterend', paginationHtml);
            attachPaginationEvents();
        }
    }

    // ===== FUNCIÓN: ASIGNAR EVENTOS DE PAGINACIÓN =====
    function attachPaginationEvents() {
        document.querySelectorAll('.pagination-container-client .page-link').forEach(link => {
            link.removeEventListener('click', handlePaginationClick);
            link.addEventListener('click', handlePaginationClick);
        });
    }

    // ===== MANEJADOR DE CLICK EN PAGINACIÓN =====
    function handlePaginationClick(e) {
        e.preventDefault();
        if (this.classList.contains('disabled') || State.isProcessing) return;
        
        const action = this.getAttribute('data-page');
        const totalPages = Math.ceil(State.filteredProducts.length / CONFIG.ITEMS_PER_PAGE);
        
        State.isProcessing = true;
        
        if (action === 'prev' && State.currentPage > 1) {
            State.currentPage--;
        } else if (action === 'next' && State.currentPage < totalPages) {
            State.currentPage++;
        } else if (!isNaN(parseInt(action))) {
            State.currentPage = parseInt(action);
        }
        
        renderPage();
        
        setTimeout(() => {
            State.isProcessing = false;
        }, 200);
    }

    // ===== FUNCIÓN: RENDERIZAR PÁGINA ACTUAL =====
    function renderPage() {
        const start = (State.currentPage - 1) * CONFIG.ITEMS_PER_PAGE;
        const end = start + CONFIG.ITEMS_PER_PAGE;
        const productsToShow = State.filteredProducts.slice(start, end);
        
        // Ocultar todos los productos
        State.allProducts.forEach(product => {
            product.element.style.display = 'none';
        });
        
        // Mostrar solo los de la página actual con animación
        productsToShow.forEach((product, index) => {
            product.element.style.display = '';
            product.element.style.animation = 'fadeInUp 0.3s ease-out';
            product.element.style.animationDelay = `${index * 0.05}s`;
        });
        
        updatePaginationControls();
        updateSelectionUI();
    }

    // ===== FUNCIÓN: FILTRAR PRODUCTOS =====
    function filterProducts() {
        const searchTerm = State.searchTerm.toLowerCase().trim();
        
        if (!searchTerm) {
            State.filteredProducts = [...State.allProducts];
        } else {
            State.filteredProducts = State.allProducts.filter(product => 
                product.nombre.includes(searchTerm) ||
                product.categoria.includes(searchTerm)
            );
        }
        
        // Limpiar selección de productos ocultos
        State.selectedProducts.forEach(productId => {
            const product = State.allProducts.find(p => p.id === productId);
            if (product && !State.filteredProducts.includes(product)) {
                State.selectedProducts.delete(productId);
                if (product.checkbox) product.checkbox.checked = false;
            }
        });
        
        State.currentPage = 1;
        renderPage();
        
        // Mostrar mensaje si no hay resultados
        const noResultsMsg = document.querySelector('.no-results-message');
        if (State.filteredProducts.length === 0 && State.allProducts.length > 0) {
            if (!noResultsMsg) {
                const msg = document.createElement('tr');
                msg.className = 'no-results-message';
                msg.innerHTML = `
                    <td colspan="8" class="empty-message-centered">
                        <i class="fas fa-search"></i>
                        <div class="empty-text">No se encontraron productos</div>
                        <small>Intenta con otro término de búsqueda</small>
                    </td>
                `;
                DOM.tableBody.appendChild(msg);
            }
        } else if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }

    // ===== FUNCIÓN: SELECCIONAR TODOS =====
    function toggleSelectAll() {
        const isChecked = DOM.selectAllCheckbox.checked;
        const visibleProducts = State.filteredProducts;
        
        visibleProducts.forEach(product => {
            if (product.checkbox) {
                product.checkbox.checked = isChecked;
                if (isChecked) {
                    State.selectedProducts.add(product.id);
                } else {
                    State.selectedProducts.delete(product.id);
                }
            }
        });
        
        updateSelectionUI();
    }

    // ===== FUNCIÓN: SELECCIONAR FILA INDIVIDUAL =====
    function toggleRowSelection(checkbox, productId) {
        if (checkbox.checked) {
            State.selectedProducts.add(productId);
        } else {
            State.selectedProducts.delete(productId);
        }
        updateSelectionUI();
    }

    // ===== FUNCIÓN: EXPORTAR SELECCIONADOS =====
    function exportSelectedProducts() {
        const totalSelected = State.selectedProducts.size;
        
        if (totalSelected === 0) {
            showNotification('No hay productos seleccionados para exportar', 'warning');
            return;
        }
        
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/productos/exportar-seleccionados/';
        form.style.display = 'none';
        
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = 'csrfmiddlewaretoken';
        csrfInput.value = getCsrfToken();
        form.appendChild(csrfInput);
        
        State.selectedProducts.forEach(productId => {
            const idInput = document.createElement('input');
            idInput.type = 'hidden';
            idInput.name = 'ids';
            idInput.value = productId;
            form.appendChild(idInput);
        });
        
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
        
        showNotification(`📤 Exportando ${totalSelected} producto${totalSelected > 1 ? 's' : ''}...`, 'success');
    }

    // ===== FUNCIÓN: ELIMINAR SELECCIONADOS =====
    async function deleteSelectedProducts() {
        const totalSelected = State.selectedProducts.size;
        
        if (totalSelected === 0) {
            showNotification('No hay productos seleccionados para eliminar', 'warning');
            return;
        }
        
        if (confirm(`¿Estás seguro de eliminar ${totalSelected} producto${totalSelected > 1 ? 's' : ''}?`)) {
            try {
                const response = await fetch('/productos/eliminar-multiple/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCsrfToken()
                    },
                    body: JSON.stringify({ ids: Array.from(State.selectedProducts) })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showNotification(`✅ ${data.deleted_count} producto(s) eliminado(s)`, 'success');
                    
                    // Remover elementos eliminados del DOM
                    State.selectedProducts.forEach(productId => {
                        const product = State.allProducts.find(p => p.id === productId);
                        if (product && product.element) {
                            product.element.remove();
                        }
                    });
                    
                    // Recargar datos
                    captureProducts();
                    filterProducts();
                    
                    State.selectedProducts.clear();
                    updateSelectionUI();
                    
                } else {
                    showNotification('❌ Error al eliminar productos', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification('❌ Error al eliminar productos', 'error');
            }
        }
    }

    // ===== FUNCIÓN: MANEJAR BÚSQUEDA CON DEBOUNCE =====
    function handleSearchInput() {
        clearTimeout(window.searchTimeout);
        window.searchTimeout = setTimeout(() => {
            State.searchTerm = DOM.searchInput.value;
            filterProducts();
        }, CONFIG.SEARCH_DELAY);
    }

    // ===== FUNCIÓN: CLICK EN FILA =====
    function handleRowClick(row, checkbox, e) {
        if (e.target.tagName === 'A' || e.target.closest('a')) return;
        if (e.target.type === 'checkbox') return;
        
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change'));
    }

    // ===== INICIALIZAR EVENTOS =====
    function initializeEvents() {
        if (DOM.selectAllCheckbox) {
            DOM.selectAllCheckbox.addEventListener('change', toggleSelectAll);
        }
        
        if (DOM.deleteSelectedBtn) {
            DOM.deleteSelectedBtn.addEventListener('click', deleteSelectedProducts);
        }
        
        if (DOM.exportSelectedBtn) {
            DOM.exportSelectedBtn.addEventListener('click', exportSelectedProducts);
        }
        
        if (DOM.searchInput) {
            DOM.searchInput.addEventListener('input', handleSearchInput);
        }
        
        // Eventos para checkboxes individuales y filas
        State.allProducts.forEach(product => {
            if (product.checkbox) {
                product.checkbox.addEventListener('change', function() {
                    toggleRowSelection(this, product.id);
                });
            }
            
            if (product.element) {
                product.element.addEventListener('click', (e) => {
                    if (product.checkbox) {
                        handleRowClick(product.element, product.checkbox, e);
                    }
                });
            }
        });
    }

    // ===== ANIMACIONES CSS =====
    function addAnimations() {
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
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .producto-row {
                transition: background 0.3s ease;
            }
            
            .producto-row:hover {
                background: rgba(212, 175, 55, 0.1);
                cursor: pointer;
            }
            
            .stock-bajo {
                color: #f56565;
                font-weight: bold;
            }
            
            .page-link {
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .page-link:hover:not(.disabled) {
                transform: translateY(-2px);
            }
        `;
        document.head.appendChild(style);
    }

    // ===== INICIALIZACIÓN PRINCIPAL =====
    function init() {
        addAnimations();
        captureProducts();
        initializeEvents();
        
        if (State.allProducts.length > CONFIG.ITEMS_PER_PAGE) {
            renderPage();
        }
        
        console.log(`✅ Tabla inicializada con ${State.allProducts.length} productos`);
    }
    
    init();
});