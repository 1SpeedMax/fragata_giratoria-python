// ===== DETALLE PEDIDO JS =====

document.addEventListener('DOMContentLoaded', function() {
    
    // Animación de entrada del recibo
    const receipt = document.querySelector('.receipt-card');
    if (receipt) {
        receipt.style.opacity = '0';
        receipt.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            receipt.style.transition = 'all 0.5s ease';
            receipt.style.opacity = '1';
            receipt.style.transform = 'translateY(0)';
        }, 100);
        
        // Efecto hover en las filas de precios
        const pricingRows = document.querySelectorAll('.pricing-row');
        pricingRows.forEach(row => {
            row.addEventListener('mouseenter', function() {
                this.style.transform = 'translateX(5px)';
                this.style.transition = 'all 0.3s ease';
            });
            row.addEventListener('mouseleave', function() {
                this.style.transform = 'translateX(0)';
            });
        });
        
        // Efecto hover en el platillo
        const platilloCard = document.querySelector('.platillo-card');
        if (platilloCard) {
            platilloCard.addEventListener('mouseenter', function() {
                this.style.transform = 'translateX(5px)';
            });
            platilloCard.addEventListener('mouseleave', function() {
                this.style.transform = 'translateX(0)';
            });
        }
    }
    
    // Función para mostrar notificaciones
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification-${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 9999;
            animation: slideInNotification 0.3s ease;
            font-size: 0.9rem;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInNotification {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutNotification {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutNotification 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Función para imprimir el recibo
    const printBtn = document.getElementById('printReceipt');
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            const receiptElement = document.getElementById('receiptCard');
            if (!receiptElement) return;
            
            const originalTitle = document.title;
            document.title = 'Recibo_Pedido_' + (window.pedidoId || '');
            
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Recibo Pedido</title>
                    <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        body {
                            font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
                            background: white;
                            margin: 0;
                            padding: 20px;
                        }
                        .receipt-print {
                            max-width: 400px;
                            margin: 0 auto;
                            background: white;
                            padding: 20px;
                        }
                        .restaurant-name {
                            font-size: 20px;
                            font-weight: bold;
                            text-align: center;
                            color: #b8860b;
                        }
                        .restaurant-tagline {
                            font-size: 10px;
                            text-align: center;
                            color: #a07e3c;
                            margin-bottom: 15px;
                        }
                        .divider {
                            text-align: center;
                            margin: 10px 0;
                            color: #d4af37;
                        }
                        .receipt-number {
                            text-align: center;
                            font-size: 18px;
                            font-weight: bold;
                            background: #f5e6d3;
                            display: inline-block;
                            width: 100%;
                            padding: 5px;
                            margin: 10px 0;
                        }
                        .info-row {
                            display: flex;
                            justify-content: space-between;
                            margin: 8px 0;
                            padding: 5px 0;
                        }
                        .total {
                            font-weight: bold;
                            font-size: 18px;
                            border-top: 2px solid #e8ddcc;
                            margin-top: 10px;
                            padding-top: 10px;
                        }
                        .status-badge {
                            display: inline-block;
                            padding: 4px 12px;
                            border-radius: 20px;
                            font-size: 12px;
                            font-weight: bold;
                        }
                        .status-pendiente { background: #f59e0b20; color: #d97706; }
                        .status-enviado { background: #3b82f620; color: #2563eb; }
                        .status-entregado { background: #10b98120; color: #059669; }
                        .status-cancelado { background: #ef444420; color: #dc2626; }
                        .footer-text {
                            text-align: center;
                            font-size: 10px;
                            color: #a07e3c;
                            margin-top: 20px;
                        }
                        hr {
                            border: none;
                            border-top: 1px dashed #e8ddcc;
                            margin: 15px 0;
                        }
                    </style>
                </head>
                <body>
                    <div class="receipt-print">
                        ${receiptElement.cloneNode(true).outerHTML}
                    </div>
                    <script>
                        window.onload = function() { 
                            setTimeout(() => window.print(), 100);
                            setTimeout(() => window.close(), 1000);
                        };
                    <\/script>
                </body>
                </html>
            `);
            printWindow.document.close();
            document.title = originalTitle;
        });
    }
    
    // Función para descargar como PDF (usando html2pdf si está disponible)
    const downloadBtn = document.getElementById('downloadReceipt');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            const element = document.getElementById('receiptCard');
            if (!element) return;
            
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando PDF...';
            this.disabled = true;
            
            // Verificar si html2pdf está disponible
            if (typeof html2pdf !== 'undefined') {
                const opt = {
                    margin: 0.5,
                    filename: `Pedido_${window.pedidoId || 'detalle'}.pdf`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2, backgroundColor: '#ffffff' },
                    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
                };
                
                html2pdf().set(opt).from(element).save()
                    .then(() => {
                        this.innerHTML = originalText;
                        this.disabled = false;
                        showNotification('PDF generado exitosamente', 'success');
                    })
                    .catch(() => {
                        this.innerHTML = originalText;
                        this.disabled = false;
                        showNotification('Error al generar PDF. Usando impresión.', 'error');
                        window.print();
                    });
            } else {
                // Fallback: usar impresión
                this.innerHTML = originalText;
                this.disabled = false;
                window.print();
            }
        });
    }
    
    // Guardar ID del pedido para uso en las funciones
    const receiptCard = document.getElementById('receiptCard');
    if (receiptCard) {
        const numberSpan = receiptCard.querySelector('.receipt-number');
        if (numberSpan) {
            window.pedidoId = numberSpan.textContent.replace('#', '');
        }
    }
});