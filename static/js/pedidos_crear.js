document.addEventListener('DOMContentLoaded', function() {
    
    // Obtener platillos desde el script tag
    let platillos = [];
    const platillosScript = document.getElementById('platillos-data');
    if (platillosScript) {
        try {
            platillos = JSON.parse(platillosScript.textContent);
            console.log('✅ Platillos cargados:', platillos.length);
        } catch(e) {
            console.error('Error parsing platillos data:', e);
            platillos = [];
        }
    }
    
    if (platillos.length === 0) {
        console.warn('⚠️ No hay platillos disponibles');
        platillos = [
            {id: 1, nombre: 'Ceviche Clásico', emojis: '🐠', precio: 20000},
            {id: 2, nombre: 'Porción de arroz con coco', emojis: '🥥', precio: 6500}
        ];
    }
    
    let items = [];
    let itemCounter = 0;
    
    const itemsList = document.getElementById('itemsList');
    const addItemBtn = document.getElementById('addItemBtn');
    const subtotalTotal = document.getElementById('subtotalTotal');
    const totalGeneral = document.getElementById('totalGeneral');
    
    function calcularTotales() {
        let subtotal = 0;
        items.forEach(item => {
            subtotal += item.subtotal;
        });
        subtotalTotal.textContent = `$${subtotal.toFixed(2)}`;
        totalGeneral.textContent = `$${subtotal.toFixed(2)}`;
    }
    
    function eliminarItem(itemId) {
        // Remover del array
        items = items.filter(i => i.id !== itemId);
        
        // Remover del DOM
        const itemDiv = document.querySelector(`.item-row[data-id="${itemId}"]`);
        if (itemDiv) {
            itemDiv.remove();
        }
        
        // Recalcular totales
        calcularTotales();
        
        // Mostrar mensaje de confirmación
        mostrarNotificacion('Platillo eliminado del pedido', 'success');
    }
    
    function crearItem(platilloId = null, cantidad = 1) {
        if (platillos.length === 0) return;
        
        const itemId = ++itemCounter;
        const platillo = platillos.find(p => p.id == platilloId) || platillos[0];
        
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item-row';
        itemDiv.setAttribute('data-id', itemId);
        itemDiv.innerHTML = `
            <div class="item-header">
                <span class="item-title">${platillo.emojis || '🍽️'} ${platillo.nombre}</span>
            </div>
            <div class="item-fields">
                <div class="item-field">
                    <select class="platillo-select" data-id="${itemId}">
                        ${platillos.map(p => `
                            <option value="${p.id}" ${p.id == platillo.id ? 'selected' : ''}>
                                ${p.emojis || '🍽️'} ${p.nombre} - $${p.precio}
                            </option>
                        `).join('')}
                    </select>
                </div>
                <div class="item-field">
                    <input type="number" class="cantidad-input" data-id="${itemId}" value="${cantidad}" min="1" step="1">
                </div>
                <div class="item-field">
                    <input type="text" class="precio-input" data-id="${itemId}" value="$${platillo.precio}" readonly>
                </div>
                <div class="item-field">
                    <input type="text" class="subtotal-input" data-id="${itemId}" value="$${(platillo.precio * cantidad).toFixed(2)}" readonly>
                </div>
                <div class="item-field action-field">
                    <button type="button" class="btn-remove-item" data-id="${itemId}" title="Eliminar platillo">
                        <i class="fas fa-trash-alt"></i> Eliminar
                    </button>
                </div>
            </div>
        `;
        
        itemsList.appendChild(itemDiv);
        
        items.push({
            id: itemId,
            platilloId: platillo.id,
            nombre: platillo.nombre,
            precio: platillo.precio,
            cantidad: cantidad,
            subtotal: platillo.precio * cantidad
        });
        
        const select = itemDiv.querySelector('.platillo-select');
        const cantidadInput = itemDiv.querySelector('.cantidad-input');
        const removeBtn = itemDiv.querySelector('.btn-remove-item');
        
        select.addEventListener('change', function() {
            const newPlatillo = platillos.find(p => p.id == parseInt(this.value));
            if (!newPlatillo) return;
            const item = items.find(i => i.id === itemId);
            if (item) {
                item.platilloId = newPlatillo.id;
                item.nombre = newPlatillo.nombre;
                item.precio = newPlatillo.precio;
                item.subtotal = item.precio * item.cantidad;
                itemDiv.querySelector('.item-title').innerHTML = `${newPlatillo.emojis || '🍽️'} ${newPlatillo.nombre}`;
                itemDiv.querySelector('.precio-input').value = `$${newPlatillo.precio}`;
                itemDiv.querySelector('.subtotal-input').value = `$${item.subtotal.toFixed(2)}`;
                calcularTotales();
            }
        });
        
        cantidadInput.addEventListener('input', function() {
            const cantidad = parseInt(this.value) || 1;
            const item = items.find(i => i.id === itemId);
            if (item) {
                item.cantidad = cantidad;
                item.subtotal = item.precio * cantidad;
                itemDiv.querySelector('.subtotal-input').value = `$${item.subtotal.toFixed(2)}`;
                calcularTotales();
            }
        });
        
        removeBtn.addEventListener('click', function() {
            eliminarItem(itemId);
        });
        
        calcularTotales();
    }
    
    addItemBtn.addEventListener('click', function() {
        if (platillos.length > 0) crearItem();
    });
    
    // Iniciar con un item por defecto
    if (platillos.length > 0) {
        crearItem(platillos[0]?.id, 1);
    }
    
    const form = document.getElementById('pedidoForm');
    form.addEventListener('submit', function(e) {
        if (items.length === 0) {
            e.preventDefault();
            mostrarNotificacion('Debes agregar al menos un platillo al pedido', 'error');
            return;
        }
        
        const itemsInput = document.createElement('input');
        itemsInput.type = 'hidden';
        itemsInput.name = 'items';
        itemsInput.value = JSON.stringify(items.map(item => ({
            platillo_id: item.platilloId,
            nombre: item.nombre,
            cantidad: item.cantidad,
            precio_unitario: item.precio,
            subtotal: item.subtotal
        })));
        this.appendChild(itemsInput);
    });
    
    // Función para mostrar notificaciones
    function mostrarNotificacion(mensaje, tipo) {
        const notificacionDiv = document.createElement('div');
        notificacionDiv.className = `notificacion-flotante notificacion-${tipo}`;
        notificacionDiv.innerHTML = `
            <i class="fas ${tipo === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${mensaje}</span>
        `;
        document.body.appendChild(notificacionDiv);
        
        setTimeout(() => {
            notificacionDiv.remove();
        }, 3000);
    }
});