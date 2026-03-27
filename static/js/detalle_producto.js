// ===== DETALLE PRODUCTO JS (VERSIÓN ESTÁTICA) =====

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== ANIMACIÓN DE ENTRADA SUTIL =====
    const productCard = document.querySelector('.product-card');
    if (productCard) {
        productCard.style.opacity = '0';
        productCard.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            productCard.style.transition = 'all 0.3s ease';
            productCard.style.opacity = '1';
            productCard.style.transform = 'translateY(0)';
        }, 50);
        
        // Efecto hover simple en las tarjetas de información
        const infoCards = document.querySelectorAll('.info-card');
        infoCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.transition = 'all 0.2s ease';
            });
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }
    
    // ===== FUNCIÓN PARA MOSTRAR NOTIFICACIONES =====
    function showNotification(message, type) {
        // Eliminar notificaciones existentes
        const existingNotifications = document.querySelectorAll('.custom-notification');
        existingNotifications.forEach(notif => notif.remove());
        
        const notification = document.createElement('div');
        notification.className = 'custom-notification';
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close-btn">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${type === 'success' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(59, 130, 246, 0.95)'};
            color: white;
            padding: 10px 16px;
            border-radius: 10px;
            z-index: 9999;
            animation: fadeIn 0.2s ease;
            font-size: 0.85rem;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 10px;
            font-family: 'Inter', sans-serif;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateX(20px); }
                to { opacity: 1; transform: translateX(0); }
            }
            @keyframes fadeOut {
                from { opacity: 1; transform: translateX(0); }
                to { opacity: 0; transform: translateX(20px); }
            }
            .notification-close-btn {
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                cursor: pointer;
                width: 22px;
                height: 22px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }
            .notification-close-btn:hover {
                background: rgba(255,255,255,0.3);
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Botón de cerrar
        const closeBtn = notification.querySelector('.notification-close-btn');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'fadeOut 0.2s ease';
            setTimeout(() => notification.remove(), 200);
        });
        
        // Auto-cerrar después de 3 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'fadeOut 0.2s ease';
                setTimeout(() => notification.remove(), 200);
            }
        }, 3000);
    }
    
    // ===== FUNCIÓN PARA IMPRIMIR LA FICHA =====
    const printBtn = document.getElementById('printProduct');
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            const productElement = document.getElementById('productCard');
            if (!productElement) {
                showNotification('Error al cargar la ficha', 'error');
                return;
            }
            
            const originalTitle = document.title;
            document.title = `Producto_${window.productId || 'detalle'}`;
            
            // Clonar el elemento para imprimir
            const cloneCard = productElement.cloneNode(true);
            
            // Remover botones del clon
            const actionButtons = cloneCard.querySelectorAll('.action-buttons, .btn-print, .btn-download, .btn-edit');
            actionButtons.forEach(btn => btn.remove());
            
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Ficha de Producto</title>
                    <meta charset="UTF-8">
                    <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        body {
                            font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
                            background: white;
                            padding: 30px;
                        }
                        .product-print { max-width: 600px; margin: 0 auto; background: white; }
                        .product-name { font-size: 24px; font-weight: bold; color: #b8860b; text-align: center; margin: 10px 0; }
                        .product-code { text-align: center; color: #8b7a4b; margin-bottom: 20px; }
                        .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e8ddcc; }
                        .price { font-size: 28px; font-weight: bold; color: #b8860b; text-align: center; margin: 20px 0; }
                        .danger { background: #fee2e2; color: #dc2626; }
                        .warning { background: #fef3c7; color: #d97706; }
                        .success { background: #d1fae5; color: #059669; }
                        hr { margin: 20px 0; border-top: 1px dashed #e8ddcc; }
                        .footer { text-align: center; font-size: 10px; color: #a07e3c; margin-top: 20px; }
                        .stock-bar { width: 100%; height: 8px; background: #e8ddcc; border-radius: 10px; overflow: hidden; margin: 10px 0; }
                        .stock-bar-fill { height: 100%; background: linear-gradient(90deg, #b8860b, #d4af37); }
                    </style>
                </head>
                <body>
                    <div class="product-print">${cloneCard.outerHTML}</div>
                    <script>window.onload = function() { setTimeout(() => window.print(), 100); setTimeout(() => window.close(), 800); };<\/script>
                </body>
                </html>
            `);
            printWindow.document.close();
            document.title = originalTitle;
            showNotification('Enviando a impresión...', 'success');
        });
    }
    
    // ===== FUNCIÓN PARA DESCARGAR COMO PDF =====
    const downloadBtn = document.getElementById('downloadProduct');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            const element = document.getElementById('productCard');
            if (!element) {
                showNotification('Error al generar PDF', 'error');
                return;
            }
            
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...';
            this.disabled = true;
            
            // Crear una copia para PDF
            const cloneElement = element.cloneNode(true);
            
            // Remover elementos no deseados
            const actionButtons = cloneElement.querySelectorAll('.action-buttons, .btn-print, .btn-download, .btn-edit, .btn-back');
            actionButtons.forEach(btn => btn.remove());
            
            // Crear contenedor temporal
            const tempDiv = document.createElement('div');
            tempDiv.appendChild(cloneElement);
            tempDiv.style.padding = '20px';
            tempDiv.style.backgroundColor = '#fffef7';
            tempDiv.style.borderRadius = '20px';
            tempDiv.style.maxWidth = '700px';
            tempDiv.style.margin = '0 auto';
            
            document.body.appendChild(tempDiv);
            
            if (typeof html2pdf !== 'undefined') {
                const opt = {
                    margin: 0.5,
                    filename: `Producto_${window.productId || 'detalle'}.pdf`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2, backgroundColor: '#fffef7' },
                    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
                };
                
                html2pdf().set(opt).from(tempDiv).save()
                    .then(() => {
                        this.innerHTML = originalText;
                        this.disabled = false;
                        showNotification('PDF generado', 'success');
                    })
                    .catch(() => {
                        this.innerHTML = originalText;
                        this.disabled = false;
                        showNotification('Usando impresión', 'info');
                        window.print();
                    })
                    .finally(() => {
                        if (tempDiv.parentElement) document.body.removeChild(tempDiv);
                    });
            } else {
                this.innerHTML = originalText;
                this.disabled = false;
                if (tempDiv.parentElement) document.body.removeChild(tempDiv);
                window.print();
            }
        });
    }
    
    // ===== ANIMACIÓN DE LA BARRA DE STOCK =====
    const stockBar = document.querySelector('.stock-bar-fill');
    if (stockBar) {
        const targetWidth = stockBar.style.width;
        stockBar.style.width = '0%';
        setTimeout(() => {
            stockBar.style.transition = 'width 0.4s ease';
            stockBar.style.width = targetWidth;
        }, 100);
    }
    
    // ===== GUARDAR ID DEL PRODUCTO =====
    const productCardElement = document.getElementById('productCard');
    if (productCardElement) {
        const codeSpan = productCardElement.querySelector('.product-code');
        if (codeSpan) {
            window.productId = codeSpan.textContent.replace('#', '').trim();
        }
    }
    
    // ===== COPIAR CÓDIGO DEL PRODUCTO (OPCIONAL) =====
    const productCode = document.querySelector('.product-code');
    if (productCode) {
        productCode.style.cursor = 'pointer';
        productCode.title = 'Copiar código';
        productCode.addEventListener('click', function() {
            const code = this.textContent;
            navigator.clipboard.writeText(code).then(() => {
                showNotification(`Código copiado`, 'success');
            }).catch(() => {
                showNotification('Error al copiar', 'error');
            });
        });
    }
});