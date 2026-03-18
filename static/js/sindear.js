// ===== SIDEBAR FUNCTIONS =====
document.addEventListener('DOMContentLoaded', function() {
    inicializarSidebar();
    inicializarBusquedaMenu();
    inicializarSubmenus();
});

function inicializarSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebarToggle');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle collapsed state
            sidebar.classList.toggle('collapsed');
            
            // Guardar preferencia en localStorage
            const isCollapsed = sidebar.classList.contains('collapsed');
            localStorage.setItem('sidebarCollapsed', isCollapsed);
            
            // Si está colapsado, cerrar todos los submenús
            if (isCollapsed) {
                document.querySelectorAll('.nav-item.has-submenu').forEach(item => {
                    item.classList.remove('open');
                });
            }
        });
    }
    
    // Restaurar estado guardado
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState === 'true') {
        sidebar.classList.add('collapsed');
    }
    
    // Manejar overlay en móvil
    if (overlay) {
        overlay.addEventListener('click', function() {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
    
    // Detectar si es móvil
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('collapsed');
    }
}

function inicializarSubmenus() {
    const submenuToggles = document.querySelectorAll('.submenu-toggle');
    
    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const navItem = this.closest('.nav-item');
            const sidebar = document.getElementById('sidebar');
            
            // Si el sidebar está colapsado, no hacer toggle
            if (sidebar && sidebar.classList.contains('collapsed')) {
                return;
            }
            
            // Cerrar otros submenús
            document.querySelectorAll('.nav-item.has-submenu').forEach(item => {
                if (item !== navItem) {
                    item.classList.remove('open');
                }
            });
            
            // Toggle submenú actual
            navItem.classList.toggle('open');
        });
    });
    
    // Cerrar submenús al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.sidebar-nav')) {
            document.querySelectorAll('.nav-item.has-submenu').forEach(item => {
                item.classList.remove('open');
            });
        }
    });
}

function inicializarBusquedaMenu() {
    const searchInput = document.getElementById('menuSearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            const menuItems = document.querySelectorAll('.nav-link, .submenu-link');
            
            if (searchTerm.length < 2) {
                menuItems.forEach(item => {
                    item.closest('.nav-item, .submenu-item').style.display = '';
                });
                return;
            }
            
            menuItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                const parentItem = item.closest('.nav-item, .submenu-item');
                
                if (text.includes(searchTerm)) {
                    parentItem.style.display = '';
                    
                    // Si es un submenú, mostrar también el padre
                    if (item.classList.contains('submenu-link')) {
                        const parentNav = item.closest('.nav-item');
                        if (parentNav) {
                            parentNav.style.display = '';
                            parentNav.classList.add('open');
                        }
                    }
                } else {
                    parentItem.style.display = 'none';
                }
            });
        });
    }
}

// Función para abrir/cerrar sidebar en móvil
function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Hacer función global para usar en otros archivos
window.toggleMobileSidebar = toggleMobileSidebar;