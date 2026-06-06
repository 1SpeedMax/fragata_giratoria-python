/* ============================================
   KITCHEN COMMAND CENTER - JAVASCRIPT
   ============================================ */

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // INICIALIZAR COMPONENTES
    // ============================================
    initKitchenGauge();
    initNotificationSystem();
    initFormSubmissions();
    initDjangoMessages();
    initBottomNavigation();
    updateStatsFromTable();
    
    // ============================================
    // FUNCIÓN: INICIALIZAR GAUGE DE CARGA
    // ============================================
    function initKitchenGauge() {
        const gaugeFill = document.getElementById('gaugeFill');
        const gaugePercent = document.getElementById('gaugePercent');
        const loadStatus = document.getElementById('loadStatus');
        
        if (!gaugeFill) return;
        
        // Calcular porcentaje basado en pedidos
        function updateGauge() {
            const pendientes = document.querySelectorAll('.estado-PENDIENTE').length;
            const enProceso = document.querySelectorAll('.estado-EN_PROCESO').length;
            const totalPedidos = pendientes + enProceso;
            
            // Calcular carga (máximo 30 pedidos = 100%)
            let percent = Math.min(Math.round((totalPedidos / 30) * 100), 100);
            percent = Math.max(percent, 0);
            
            // Actualizar gauge
            const circumference = 125.6; // 2 * PI * 20
            const offset = circumference - (percent / 100) * circumference;
            gaugeFill.style.strokeDashoffset = offset;
            gaugePercent.textContent = percent + '%';
            
            // Actualizar estado de carga
            if (percent >= 70) {
                loadStatus.textContent = 'Alta Demanda';
                loadStatus.style.color = '#ef4444';
            } else if (percent >= 40) {
                loadStatus.textContent = 'Demanda Media';
                loadStatus.style.color = '#f59e0b';
            } else {
                loadStatus.textContent = 'Baja Demanda';
                loadStatus.style.color = '#10b981';
            }
            
            // Actualizar delta de pendientes
            const pendientesDelta = document.getElementById('pendientesDelta');
            if (pendientesDelta && pendientes > 5) {
                pendientesDelta.textContent = '+' + Math.floor(Math.random() * 5 + 1) + 'm';
                pendientesDelta.style.color = '#ef4444';
            }
        }
        
        updateGauge();
        
        // Actualizar cada 30 segundos
        setInterval(updateGauge, 30000);
    }
    
    // ============================================
    // FUNCIÓN: INICIALIZAR SISTEMA DE NOTIFICACIONES
    // ============================================
    function initNotificationSystem() {
        window.showNotification = function(type, title, message, duration = 4000) {
            const container = document.getElementById('notificationContainer');
            if (!container) return;
            
            const icons = {
                success: '✓',
                error: '✗',
                info: 'ℹ',
                warning: '⚠'
            };
            
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <div class="notification-icon">${icons[type] || icons.info}</div>
                    <div class="notification-message">
                        <strong>${title}</strong>
                        <span>${message}</span>
                        <span class="notification-time">Ahora</span>
                    </div>
                </div>
                <button class="close-notification" onclick="this.parentElement.remove()">×</button>
            `;
            
            container.appendChild(notification);
            
            // Auto-cerrar después de duration ms
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.classList.add('fade-out');
                    setTimeout(() => notification.remove(), 300);
                }
            }, duration);
            
            return notification;
        };
    }
    
    // ============================================
    // FUNCIÓN: MANEJAR ENVÍOS DE FORMULARIOS (AJAX)
    // ============================================
    function initFormSubmissions() {
        const forms = document.querySelectorAll('.acciones-form');
        
        forms.forEach(form => {
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const pedidoId = this.dataset.pedidoId;
                const formData = new FormData(this);
                const select = this.querySelector('.estado-select');
                const nuevoEstado = select.value;
                const oldStateBadge = this.closest('tr').querySelector('.estado-badge');
                const oldEstado = oldStateBadge ? oldStateBadge.textContent.trim() : '';
                
                // Mostrar notificación de carga
                window.showNotification('info', 'Actualizando', `Cambiando estado del pedido #${pedidoId}...`, 2000);
                
                try {
                    const response = await fetch(this.action, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest'
                        }
                    });
                    
                    const data = await response.json();
                    
                    if (response.ok && data.success) {
                        // Actualizar UI
                        updatePedidoRow(pedidoId, nuevoEstado);
                        
                        // Mostrar notificación de éxito
                        window.showNotification('success', 'Estado Actualizado', 
                            `Pedido #${pedidoId} marcado como ${nuevoEstado.toLowerCase()}`);
                        
                        // Actualizar contadores
                        updateStatsFromTable();
                        initKitchenGauge();
                        
                    } else {
                        window.showNotification('error', 'Error', data.message || 'No se pudo actualizar el estado');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    window.showNotification('error', 'Error de conexión', 'No se pudo conectar con el servidor');
                }
            });
        });
    }
    
    // ============================================
    // FUNCIÓN: ACTUALIZAR FILA DE PEDIDO EN UI
    // ============================================
    function updatePedidoRow(pedidoId, nuevoEstado) {
        const row = document.getElementById(`pedido-${pedidoId}`);
        if (!row) return;
        
        const estadoBadge = row.querySelector('.estado-badge');
        if (estadoBadge) {
            // Actualizar clases del badge
            const estadosPosibles = ['PENDIENTE', 'EN_PROCESO', 'COMPLETADO', 'LISTO'];
            estadosPosibles.forEach(estado => {
                estadoBadge.classList.remove(`estado-${estado}`);
            });
            estadoBadge.classList.add(`estado-${nuevoEstado}`);
            estadoBadge.textContent = nuevoEstado;
        }
        
        // Si el pedido está completado, moverlo al final o eliminarlo con animación
        if (nuevoEstado === 'COMPLETADO' || nuevoEstado === 'LISTO') {
            row.style.opacity = '0.5';
            row.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                // Opcional: eliminar fila después de un tiempo
                // row.remove();
            }, 3000);
        }
        
        // Actualizar el select si existe
        const select = row.querySelector('.estado-select');
        if (select) {
            select.value = nuevoEstado;
        }
    }
    
    // ============================================
    // FUNCIÓN: ACTUALIZAR ESTADÍSTICAS
    // ============================================
    function updateStatsFromTable() {
        const pendientes = document.querySelectorAll('.estado-PENDIENTE').length;
        const enProceso = document.querySelectorAll('.estado-EN_PROCESO').length;
        
        const pendientesCount = document.getElementById('pendientesCount');
        const enCursoCount = document.getElementById('enCursoCount');
        
        if (pendientesCount) {
            pendientesCount.innerHTML = `${pendientes} <small id="pendientesDelta">${pendientes > 3 ? '+' + Math.floor(Math.random() * 5 + 1) + 'm' : ''}</small>`;
        }
        
        if (enCursoCount) {
            enCursoCount.textContent = enProceso;
        }
        
        // Actualizar tiempo promedio (simulado)
        const tiempoPromedio = document.getElementById('tiempoPromedio');
        if (tiempoPromedio) {
            const minutos = 15 + Math.floor(Math.random() * 8);
            const segundos = Math.floor(Math.random() * 60);
            tiempoPromedio.textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
        }
    }
    
    // ============================================
    // FUNCIÓN: PROCESAR MENSAJES DE DJANGO
    // ============================================
    function initDjangoMessages() {
        const messagesData = document.getElementById('django-messages-data');
        if (messagesData) {
            const messages = messagesData.querySelectorAll('.django-msg');
            messages.forEach(msg => {
                const message = msg.dataset.message;
                const tag = msg.dataset.tag;
                
                let type = 'info';
                if (tag === 'success') type = 'success';
                else if (tag === 'error') type = 'error';
                else if (tag === 'warning') type = 'warning';
                
                window.showNotification(type, 'Notificación', message);
            });
            
            // Limpiar mensajes después de mostrarlos
            setTimeout(() => {
                messagesData.remove();
            }, 100);
        }
    }
    
    // ============================================
    // FUNCIÓN: BOTTOM NAVIGATION (MÓVIL)
    // ============================================
    function initBottomNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                // Remover active de todos
                navItems.forEach(nav => nav.classList.remove('active'));
                // Agregar active al clickeado
                this.classList.add('active');
                
                const section = this.dataset.nav;
                // Aquí puedes agregar lógica para cambiar secciones
                window.showNotification('info', 'Navegación', `Cambiando a sección ${section}`, 1500);
            });
        });
    }
    
    // ============================================
    // FUNCIÓN: ACTUALIZACIÓN AUTOMÁTICA (POLLING)
    // ============================================
    // Actualizar datos cada 60 segundos
    setInterval(() => {
        updateStatsFromTable();
        initKitchenGauge();
    }, 60000);
});

// ============================================
// FUNCIÓN GLOBAL: ACTUALIZAR ESTADO (para eventos externos)
// ============================================
window.refreshKitchenData = function() {
    location.reload();
};