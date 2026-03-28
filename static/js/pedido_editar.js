document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando edición de pedido...');
    
    // Obtener platillos
    let platillos = [];
    const platillosScript = document.getElementById('platillos-data');
    if (platillosScript && platillosScript.textContent) {
        try {
            platillos = JSON.parse(platillosScript.textContent);
            console.log('✅ Platillos cargados:', platillos.length);
        } catch(e) {
            console.error('Error:', e);
            platillos = [];
        }
    }
    
    // Obtener items existentes
    let items = [];
    let itemCounter = 0;
    const itemsScript = document.getElementById('items-data');
    if (itemsScript && itemsScript.textContent) {
        try {
            const itemsData = JSON.parse(itemsScript.textContent);
            console.log('📦 Items:', itemsData);
            items = itemsData.map((item, idx) => ({
                id: idx + 1,
                platilloId: item.platillo_id,
                nombre: item.nombre_platillo,
                precio: parseFloat(item.precio_unitario),
                cantidad: item.cantidad,
                subtotal: parseFloat(item.subtotal)
            }));
            itemCounter = items.length;
        } catch(e) {
            console.error('Error items:', e);
        }
    }
    
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
        if (confirm('¿Eliminar este platillo?')) {
            items = items.filter(i => i.id !== itemId);
            const itemDiv = document.querySelector(`.item-row[data-id="${itemId}"]`);
            if (itemDiv) itemDiv.remove();
            calcularTotales();
            mostrarNotificacion('Platillo eliminado', 'success');
        }
    }
    
    function crearItem(platilloId = null, cantidad = 1, nombrePlatillo = null, precioPlatillo = null) {
        if (platillos.length === 0) {
            mostrarNotificacion('No hay platillos disponibles', 'error');
            return;
        }
        
        const itemId = ++itemCounter;
        let platillo;
        
        if (platilloId) {
            platillo = platillos.find(p => p.id == platilloId);
            if (!platillo && nombrePlatillo && precioPlatillo) {
                platillo = { id: platilloId, nombre: nombrePlatillo, emojis: '🍽️', precio: precioPlatillo };
            }
        }
        if (!platillo) platillo = platillos[0];
        
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
                        ${platillos.map(p => `<option value="${p.id}" ${p.id == platillo.id ? 'selected' : ''}>${p.emojis || '🍽️'} ${p.nombre} - $${p.precio}</option>`).join('')}
                    </select>
                </div>
                <div class="item-field">
                    <input type="number" class="cantidad-input" data-id="${itemId}" value="${cantidad}" min="1">
                </div>
                <div class="item-field">
                    <input type="text" class="precio-input" data-id="${itemId}" value="$${platillo.precio}" readonly>
                </div>
                <div class="item-field">
                    <input type="text" class="subtotal-input" data-id="${itemId}" value="$${(platillo.precio * cantidad).toFixed(2)}" readonly>
                </div>
                <div class="item-field">
                    <button type="button" class="btn-remove-item" data-id="${itemId}"><i class="fas fa-trash"></i> Eliminar</button>
                </div>
            </div>
        `;
        
        itemsList.appendChild(itemDiv);
        items.push({ id: itemId, platilloId: platillo.id, nombre: platillo.nombre, precio: platillo.precio, cantidad: cantidad, subtotal: platillo.precio * cantidad });
        
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
        
        removeBtn.addEventListener('click', () => eliminarItem(itemId));
        calcularTotales();
    }
    
    // Cargar items existentes
    if (itemsList) {
        itemsList.innerHTML = '';
        if (items.length > 0) {
            items.forEach(item => crearItem(item.platilloId, item.cantidad, item.nombre, item.precio));
        } else if (platillos.length > 0) {
            crearItem();
        } else {
            itemsList.innerHTML = '<div class="loading-items">No hay platillos disponibles</div>';
        }
    }
    
    if (addItemBtn) {
        addItemBtn.addEventListener('click', () => crearItem());
    }
    
    const form = document.getElementById('pedidoForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            if (items.length === 0) {
                e.preventDefault();
                mostrarNotificacion('Agrega al menos un platillo', 'error');
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
    }
    
    function mostrarNotificacion(mensaje, tipo) {
        const notif = document.createElement('div');
        notif.className = `notificacion-flotante notificacion-${tipo}`;
        notif.innerHTML = `<i class="fas ${tipo === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i><span>${mensaje}</span>`;
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 3000);
    }
    
    console.log('✅ Editor listo');
});