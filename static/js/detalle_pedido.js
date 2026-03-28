document.addEventListener('DOMContentLoaded', function() {
    
    // Imprimir recibo
    const printBtn = document.getElementById('printReceipt');
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            const receiptCard = document.getElementById('receiptCard');
            const originalTitle = document.title;
            
            // Guardar el contenido original
            const originalContent = document.body.innerHTML;
            
            // Crear ventana de impresión
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Pedido #${document.querySelector('.receipt-number').textContent}</title>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
                    <style>
                        * {
                            margin: 0;
                            padding: 0;
                            box-sizing: border-box;
                        }
                        body {
                            font-family: 'Inter', sans-serif;
                            padding: 2rem;
                            background: white;
                            color: black;
                        }
                        @media print {
                            body {
                                padding: 0;
                            }
                            .no-print {
                                display: none;
                            }
                        }
                        .receipt-card {
                            max-width: 800px;
                            margin: 0 auto;
                        }
                        /* Copiar estilos del recibo */
                        .receipt-header, .receipt-info, .platillo-section, 
                        .pricing-section, .additional-info, .observations-section, 
                        .receipt-footer {
                            margin-bottom: 1rem;
                        }
                        .restaurant-name {
                            font-size: 1.5rem;
                            font-weight: bold;
                            color: #d4af37;
                        }
                        .status-badge {
                            display: inline-block;
                            padding: 0.3rem 1rem;
                            border-radius: 20px;
                            background: #f0f0f0;
                        }
                        .pricing-row {
                            display: flex;
                            justify-content: space-between;
                            padding: 0.5rem 0;
                        }
                        .total {
                            font-weight: bold;
                            border-top: 1px solid #ddd;
                            margin-top: 0.5rem;
                            padding-top: 0.5rem;
                        }
                    </style>
                </head>
                <body>
                    <div class="receipt-card">
                        ${receiptCard.outerHTML}
                    </div>
                </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
            printWindow.close();
        });
    }
    
    // Descargar como PDF (simulado - en producción usarías una librería)
    const downloadBtn = document.getElementById('downloadReceipt');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            alert('La funcionalidad de descarga de PDF estará disponible pronto.\nPor ahora puedes usar "Imprimir" y guardar como PDF.');
        });
    }
    
    // Animación al cargar
    console.log('✅ Detalle del pedido cargado correctamente');
});