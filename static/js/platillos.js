// ===== PLATILLOS.JS =====

document.addEventListener('DOMContentLoaded', function() {
    
    // Búsqueda en tiempo real
    const searchInput = document.getElementById('searchInput');
    const table = document.getElementById('platillosTable');
    
    if (searchInput && table) {
        searchInput.addEventListener('keyup', function() {
            const searchText = this.value.toLowerCase().trim();
            const rows = table.querySelectorAll('tbody tr');
            let hasResults = false;
            
            rows.forEach(row => {
                if (row.classList.contains('empty-row')) return;
                
                let found = false;
                const cells = row.querySelectorAll('td');
                
                for (let i = 1; i < cells.length - 1; i++) {
                    const cellText = cells[i].textContent.toLowerCase();
                    if (cellText.indexOf(searchText) > -1) {
                        found = true;
                        hasResults = true;
                        break;
                    }
                }
                
                row.style.display = found ? '' : 'none';
            });
            
            // Mostrar mensaje si no hay resultados
            let noResultsMsg = document.querySelector('.no-results-message');
            if (!hasResults && searchText !== '') {
                if (!noResultsMsg) {
                    const emptyRow = document.querySelector('.empty-row');
                    if (emptyRow) emptyRow.style.display = 'none';
                    noResultsMsg = document.createElement('tr');
                    noResultsMsg.className = 'no-results-message';
                    noResultsMsg.innerHTML = `
                        <td colspan="8" class="empty-message-centered">
                            <i class="fas fa-search"></i>
                            <div class="empty-text">No se encontraron resultados</div>
                            <small>No hay platillos que coincidan con "${searchText}"</small>
                        </td>
                    `;
                    table.querySelector('tbody').appendChild(noResultsMsg);
                }
            } else if (noResultsMsg) {
                noResultsMsg.remove();
                const emptyRow = document.querySelector('.empty-row');
                if (emptyRow && searchText === '') emptyRow.style.display = '';
            }
        });
    }
    
    // Animación de entrada
    const rows = document.querySelectorAll('.platillo-row');
    rows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateY(10px)';
        setTimeout(() => {
            row.style.transition = 'all 0.3s ease';
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, index * 50);
    });
});

// static/js/platillos.js

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Platillos JS cargado');

    // ===== BÚSQUEDA EN TABLA DE PLATILLOS =====
    const searchInput = document.getElementById('searchInput');
    const table = document.getElementById('platillosTable');
    
    if (searchInput && table) {
        searchInput.addEventListener('keyup', function() {
            const searchText = this.value.toLowerCase().trim();
            const rows = table.querySelectorAll('tbody tr:not(.empty-row)');
            let hasResults = false;
            
            rows.forEach(row => {
                let found = false;
                const cells = row.querySelectorAll('td');
                
                // Buscar en todas las celdas excepto la última (acciones)
                for (let i = 1; i < cells.length - 1; i++) {
                    const cellText = cells[i].textContent.toLowerCase();
                    if (cellText.indexOf(searchText) > -1) {
                        found = true;
                        hasResults = true;
                        break;
                    }
                }
                
                row.style.display = found ? '' : 'none';
            });
            
            // Mostrar mensaje si no hay resultados
            let noResultsMsg = document.querySelector('.no-results-message');
            if (!hasResults && searchText !== '') {
                if (!noResultsMsg) {
                    noResultsMsg = document.createElement('tr');
                    noResultsMsg.className = 'no-results-message';
                    noResultsMsg.innerHTML = `
                        <td colspan="9" class="empty-message-centered">
                            <i class="fas fa-search"></i>
                            <div class="empty-text">No se encontraron resultados</div>
                            <small>No hay platillos que coincidan con "${searchText}"</small>
                        </td>
                    `;
                    table.querySelector('tbody').appendChild(noResultsMsg);
                }
            } else if (noResultsMsg) {
                noResultsMsg.remove();
            }
        });
    }
    
    // ===== ANIMACIÓN DE ENTRADA =====
    const rows = document.querySelectorAll('.platillo-row');
    rows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateY(10px)';
        setTimeout(() => {
            row.style.transition = 'all 0.3s ease';
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, index * 50);
    });
});