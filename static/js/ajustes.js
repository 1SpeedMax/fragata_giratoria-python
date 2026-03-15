// ===== FUNCIONES PARA TABS =====
function openTab(evt, tabName) {
    // Ocultar todos los tabs
    const tabContents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove("active");
    }
    
    // Quitar clase active de todos los botones
    const tabButtons = document.getElementsByClassName("tab-btn");
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove("active");
    }
    
    // Mostrar el tab actual y añadir clase active al botón
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
    
    // Guardar el tab activo en localStorage (opcional)
    localStorage.setItem('activeTab', tabName);
}

// ===== FUNCIÓN PARA PREVISUALIZAR LOGO =====
function previewLogo(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const logoPreview = document.getElementById('logoPreview');
            if (logoPreview) {
                logoPreview.src = e.target.result;
            }
        }
        
        reader.readAsDataURL(input.files[0]);
    }
}

// ===== FUNCIONES PARA RESPALDO =====
function crearRespaldo() {
    // Simular creación de respaldo
    showNotification('Iniciando creación de respaldo...', 'info');
    
    setTimeout(() => {
        showNotification('Respaldo creado exitosamente', 'success');
    }, 2000);
}

function descargarRespaldo() {
    // Simular descarga
    showNotification('Preparando descarga...', 'info');
    
    setTimeout(() => {
        showNotification('Descarga completada', 'success');
    }, 1500);
}

function restaurarRespaldo() {
    // Mostrar confirmación antes de restaurar
    if (confirm('¿Estás seguro de que deseas restaurar desde un respaldo? Esta acción sobrescribirá los datos actuales.')) {
        showNotification('Iniciando restauración...', 'warning');
        
        setTimeout(() => {
            showNotification('Restauración completada', 'success');
        }, 3000);
    }
}

function descargarArchivo(nombreArchivo) {
    showNotification(`Descargando ${nombreArchivo}...`, 'info');
    
    setTimeout(() => {
        showNotification('Descarga completada', 'success');
    }, 1500);
}

function restaurarArchivo(nombreArchivo) {
    if (confirm(`¿Restaurar desde ${nombreArchivo}? Esta acción sobrescribirá los datos actuales.`)) {
        showNotification(`Restaurando desde ${nombreArchivo}...`, 'warning');
        
        setTimeout(() => {
            showNotification('Restauración completada', 'success');
        }, 3000);
    }
}

// ===== SISTEMA DE NOTIFICACIONES =====
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${getIconForType(type)}"></i>
        <span>${message}</span>
    `;
    
    // Añadir estilos dinámicamente
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${getColorForType(type)};
        color: white;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        font-size: 0.95rem;
    `;
    
    document.body.appendChild(notification);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function getIconForType(type) {
    switch(type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

function getColorForType(type) {
    switch(type) {
        case 'success': return '#10b981';
        case 'error': return '#ef4444';
        case 'warning': return '#f59e0b';
        default: return '#3b82f6';
    }
}

// ===== FUNCIÓN PARA GUARDAR CONFIGURACIÓN =====
function guardarConfiguracion(section) {
    // Simular guardado
    showNotification(`Guardando configuración de ${section}...`, 'info');
    
    setTimeout(() => {
        showNotification('Configuración guardada exitosamente', 'success');
    }, 1000);
}

// ===== FUNCIÓN PARA CAMBIAR COLOR DE ACENTO =====
function initColorPicker() {
    const colorOptions = document.querySelectorAll('.color-option');
    
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Quitar selected de todos
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Añadir selected al actual
            this.classList.add('selected');
            
            // Cambiar variable CSS
            const color = this.dataset.color;
            document.documentElement.style.setProperty('--acento', color);
            
            // Guardar preferencia
            localStorage.setItem('acentoColor', color);
        });
    });
}

// ===== FUNCIÓN PARA CARGAR COLOR GUARDADO =====
function loadSavedColor() {
    const savedColor = localStorage.getItem('acentoColor');
    if (savedColor) {
        document.documentElement.style.setProperty('--acento', savedColor);
        
        // Marcar opción correspondiente
        const colorOptions = document.querySelectorAll('.color-option');
        colorOptions.forEach(option => {
            if (option.dataset.color === savedColor) {
                option.classList.add('selected');
            }
        });
    }
}

// ===== FUNCIÓN PARA CARGAR TAB ACTIVO =====
function loadActiveTab() {
    const activeTab = localStorage.getItem('activeTab');
    if (activeTab) {
        const tabButton = Array.from(document.querySelectorAll('.tab-btn')).find(
            btn => btn.getAttribute('onclick')?.includes(activeTab)
        );
        
        if (tabButton) {
            // Simular click en el tab
            const event = { currentTarget: tabButton };
            openTab(event, activeTab);
        }
    }
}

// ===== VALIDACIONES DE FORMULARIO =====
function validateForm(inputs) {
    let isValid = true;
    
    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            input.style.borderColor = '#ef4444';
            isValid = false;
        } else {
            input.style.borderColor = '';
        }
    });
    
    return isValid;
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    // Cargar color guardado
    loadSavedColor();
    
    // Cargar tab activo
    loadActiveTab();
    
    // Inicializar color picker
    initColorPicker();
    
    // Agregar animaciones CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Agregar listeners a botones de guardar
    document.querySelectorAll('.btn-save').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Obtener la sección actual
            const activeTab = document.querySelector('.tab-content.active');
            const sectionTitle = activeTab?.querySelector('h2')?.textContent || 'general';
            
            guardarConfiguracion(sectionTitle);
        });
    });
});

// ===== FUNCIÓN PARA CONFIRMAR ACCIONES DESTRUCTIVAS =====
function confirmAction(message, callback) {
    if (confirm(message)) {
        callback();
    }
}

// ===== FUNCIÓN PARA EXPORTAR CONFIGURACIÓN =====
function exportarConfiguracion() {
    // Recopilar todas las configuraciones
    const config = {};
    
    document.querySelectorAll('.settings-input, .settings-select, input[type="checkbox"]').forEach(input => {
        if (input.type === 'checkbox') {
            config[input.name || input.id] = input.checked;
        } else {
            config[input.name || input.id] = input.value;
        }
    });
    
    // Crear archivo JSON
    const dataStr = JSON.stringify(config, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    // Descargar
    const exportFileDefaultName = `configuracion_fragata_${new Date().toISOString().slice(0,10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('Configuración exportada', 'success');
}

// ===== FUNCIÓN PARA IMPORTAR CONFIGURACIÓN =====
function importarConfiguracion() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const config = JSON.parse(e.target.result);
                
                // Aplicar configuración
                Object.keys(config).forEach(key => {
                    const input = document.querySelector(`[name="${key}"], #${key}`);
                    if (input) {
                        if (input.type === 'checkbox') {
                            input.checked = config[key];
                        } else {
                            input.value = config[key];
                        }
                    }
                });
                
                showNotification('Configuración importada exitosamente', 'success');
            } catch (error) {
                showNotification('Error al importar configuración', 'error');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}
