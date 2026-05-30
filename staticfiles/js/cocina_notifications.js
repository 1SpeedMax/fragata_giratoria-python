// ========================================
// SISTEMA DE NOTIFICACIONES PARA COCINA
// ========================================

// Configuración
var NOTIFICATION_DURATION = 4000;
var NOTIFICATION_MAX_STACK = 5;

// Función para obtener hora actual formateada
function getCurrentTime() {
    var now = new Date();
    return now.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });
}

// Función para cerrar notificación
function closeNotification(notification, immediate) {
    if (!notification) return;
    
    if (immediate) {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
        return;
    }
    
    notification.classList.add('fade-out');
    setTimeout(function() {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Función principal para mostrar notificación
function showNotification(message, type, title, duration) {
    type = type || 'info';
    duration = duration || NOTIFICATION_DURATION;
    
    var container = document.getElementById('notificationContainer');
    if (!container) {
        var newContainer = document.createElement('div');
        newContainer.id = 'notificationContainer';
        newContainer.className = 'notification-container';
        document.body.appendChild(newContainer);
        container = newContainer;
    }
    
    // Limitar número de notificaciones visibles
    var existingNotes = container.querySelectorAll('.notification');
    if (existingNotes.length >= NOTIFICATION_MAX_STACK) {
        var oldestNote = existingNotes[0];
        if (oldestNote) {
            closeNotification(oldestNote, true);
        }
    }
    
    // Crear elemento de notificación
    var notification = document.createElement('div');
    notification.className = 'notification ' + type;
    
    // Configurar icono según tipo
    var icon = '';
    var displayTitle = title || '';
    
    switch(type) {
        case 'success':
            icon = '✓';
            displayTitle = displayTitle || 'Éxito';
            break;
        case 'error':
            icon = '✗';
            displayTitle = displayTitle || 'Error';
            break;
        case 'warning':
            icon = '⚠';
            displayTitle = displayTitle || 'Advertencia';
            break;
        case 'info':
        default:
            icon = 'ℹ';
            displayTitle = displayTitle || 'Información';
            break;
    }
    
    var currentTime = getCurrentTime();
    
    notification.innerHTML = 
        '<div class="notification-content">' +
            '<div class="notification-icon">' + icon + '</div>' +
            '<div class="notification-message">' +
                '<strong>' + displayTitle + '</strong>' +
                '<span>' + message + '</span>' +
                '<span class="notification-time">' + currentTime + '</span>' +
            '</div>' +
        '</div>' +
        '<button class="close-notification">✕</button>';
    
    container.appendChild(notification);
    
    // Auto-cerrar después de la duración
    var timeout = setTimeout(function() {
        closeNotification(notification);
    }, duration);
    
    // Cerrar manualmente
    var closeBtn = notification.querySelector('.close-notification');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            clearTimeout(timeout);
            closeNotification(notification);
        });
    }
    
    return notification;
}

// Función para mostrar mensajes de Django
function showDjangoMessages() {
    var messagesContainer = document.getElementById('django-messages-data');
    if (messagesContainer) {
        var messages = messagesContainer.querySelectorAll('.django-msg');
        for (var i = 0; i < messages.length; i++) {
            var msg = messages[i];
            var messageText = msg.getAttribute('data-message');
            var messageTag = msg.getAttribute('data-tag');
            var type = 'info';
            if (messageTag === 'success') type = 'success';
            else if (messageTag === 'error') type = 'error';
            else if (messageTag === 'warning') type = 'warning';
            showNotification(messageText, type);
        }
    }
}

// Función para actualizar estado del pedido
function actualizarEstadoPedido(form, pedidoId) {
    var formData = new FormData(form);
    var url = form.action;
    var submitBtn = form.querySelector('button[type="submit"]');
    var select = form.querySelector('select');
    var nuevoEstadoTexto = select.options[select.selectedIndex].text;
    var originalText = submitBtn.textContent;
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Actualizando...';
    
    fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Error HTTP: ' + response.status);
        }
        return response.json();
    })
    .then(function(data) {
        if (data.success) {
            showNotification(data.message, 'success', 'Estado Actualizado');
            
            // Actualizar el estado visualmente en la tabla
            var estadoCell = document.getElementById('estado-' + pedidoId);
            if (estadoCell) {
                var nuevoEstado = data.nuevo_estado;
                var estadoDisplay = '';
                
                if (nuevoEstado === 'PENDIENTE') {
                    estadoDisplay = 'PENDIENTE';
                } else if (nuevoEstado === 'EN PROCESO') {
                    estadoDisplay = 'EN PROCESO';
                } else if (nuevoEstado === 'COMPLETADO') {
                    estadoDisplay = 'COMPLETADO';
                } else {
                    estadoDisplay = nuevoEstado;
                }
                estadoCell.textContent = estadoDisplay;
            }
            
            // Recargar después de 1.5 segundos si el estado es COMPLETADO
            if (data.nuevo_estado === 'COMPLETADO') {
                setTimeout(function() {
                    location.reload();
                }, 1500);
            }
        } else {
            showNotification(data.error || 'Error al actualizar el pedido', 'error', 'Error');
        }
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    })
    .catch(function(error) {
        console.error('Error:', error);
        showNotification('Error de conexión: ' + error.message, 'error', 'Error');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    });
}

// Inicializar formularios
function initForms() {
    var forms = document.querySelectorAll('.actualizar-form');
    
    for (var i = 0; i < forms.length; i++) {
        var form = forms[i];
        // Eliminar event listeners anteriores para evitar duplicados
        var newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
        
        newForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var pedidoId = this.getAttribute('data-pedido-id');
            actualizarEstadoPedido(this, pedidoId);
        });
    }
}

// Mostrar bienvenida
function showWelcomeNotification() {
    setTimeout(function() {
        showNotification('Bienvenido al panel de cocina', 'info', '👨‍🍳 La Fragata Giratoria');
    }, 500);
}

// Verificar nuevos pedidos
function checkNewPedidos() {
    var checkUrl = '/cocina/check_pedidos/';
    
    fetch(checkUrl, {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Error HTTP: ' + response.status);
        }
        return response.json();
    })
    .then(function(data) {
        if (data.new_pedidos && data.new_pedidos.length > 0) {
            for (var i = 0; i < data.new_pedidos.length; i++) {
                showNotification(
                    'Nuevo pedido #' + data.new_pedidos[i].id,
                    'info',
                    '🍽️ Nuevo Pedido'
                );
            }
            setTimeout(function() {
                location.reload();
            }, 2000);
        }
    })
    .catch(function(error) {
        console.error('Error checking pedidos:', error);
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initForms();
    showDjangoMessages();
    showWelcomeNotification();
    
    // Verificar nuevos pedidos cada 15 segundos
    setInterval(checkNewPedidos, 15000);
});