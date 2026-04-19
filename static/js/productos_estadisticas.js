// static/js/productos_estadisticas.js

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Estadísticas de productos cargadas');

    // ===== FUNCIÓN PARA OBTENER DATOS DE MANERA SEGURA =====
    function getData(elementId, defaultValue) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.warn(`⚠️ Elemento ${elementId} no encontrado`);
            return defaultValue;
        }
        try {
            return JSON.parse(element.textContent);
        } catch (e) {
            console.error(`❌ Error parseando ${elementId}:`, e);
            return defaultValue;
        }
    }

    // ===== OBTENER DATOS =====
    const categorias = getData('categorias-data', ['Pescados', 'Mariscos', 'Acompañamientos', 'Bebidas', 'Vegetales']);
    const valoresCategorias = getData('valores-categorias-data', [40, 30, 15, 10, 5]);
    const meses = getData('meses-data', ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun']);
    const cantidades = getData('cantidades-data', [10, 15, 12, 18, 22, 25]);
    
    const totalProductos = document.getElementById('totalProductos')?.textContent || '0';
    const valorInventario = document.getElementById('valorInventario')?.textContent || '$0';
    const stockBajo = document.getElementById('stockBajo')?.textContent || '0';

    console.log('✅ Datos cargados:', { categorias, valoresCategorias, meses, cantidades });

    // ===== GRÁFICO DE CATEGORÍAS =====
    const ctxCategorias = document.getElementById('chartCategorias')?.getContext('2d');
    if (ctxCategorias) {
        new Chart(ctxCategorias, {
            type: 'doughnut',
            data: {
                labels: categorias,
                datasets: [{
                    data: valoresCategorias,
                    backgroundColor: [
                        '#f5d487',
                        '#d4af37',
                        '#b8860b',
                        '#8b6914',
                        '#5e4b1a'
                    ],
                    borderColor: 'rgba(0,0,0,0.5)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#f5d487',
                            font: {
                                size: 11
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleColor: '#f5d487',
                        bodyColor: '#fff',
                        borderColor: '#d4af37',
                        borderWidth: 1
                    }
                },
                cutout: '65%',
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        });
        console.log('✅ Gráfico de categorías creado');
    } else {
        console.error('❌ No se encontró el canvas chartCategorias');
    }

    // ===== GRÁFICO DE EVOLUCIÓN =====
    // ===== GRÁFICO DE EVOLUCIÓN =====
const ctxEvolucion = document.getElementById('chartEvolucion')?.getContext('2d');

if (ctxEvolucion) {
    new Chart(ctxEvolucion, {
        type: 'line',
        data: {
            labels: meses,
            datasets: [{
                label: 'Cantidad de Productos',
                data: cantidades,
                borderColor: '#FFD700',
                backgroundColor: 'rgba(255, 215, 0, 0.25)',
                tension: 0.4,
                fill: true,
                borderWidth: 3,
                pointBackgroundColor: '#FFD700',
                pointBorderColor: '#000',
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#FFD700',
                        font: { size: 14 }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#FFD700'
                    },
                    grid: {
                        color: 'rgba(255, 215, 0, 0.2)'
                    }
                },
                x: {
                    ticks: {
                        color: '#FFD700'
                    }
                }
            }
        }
    });
}

    // ===== SELECTOR DE PERÍODO =====
    const periodBtns = document.querySelectorAll('.period-btn');
    periodBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            periodBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Animación del botón
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
            
            const periodo = this.dataset.period;
            console.log('Período seleccionado:', periodo);
            
            // Aquí puedes agregar lógica para actualizar datos según el período
            mostrarNotificacion(`Mostrando datos de: ${this.textContent}`);
        });
    });

    // ===== ANIMACIÓN DE NÚMEROS =====
    function animarNumero(elemento, valorFinal) {
        if (!elemento) return;
        
        const valorInicial = 0;
        const duracion = 1000;
        const incremento = valorFinal / (duracion / 16);
        let valorActual = valorInicial;
        
        const animar = () => {
            valorActual += incremento;
            if (valorActual < valorFinal) {
                elemento.textContent = Math.round(valorActual);
                requestAnimationFrame(animar);
            } else {
                elemento.textContent = valorFinal;
            }
        };
        
        requestAnimationFrame(animar);
    }

    // Animar los KPI values
    const totalEl = document.getElementById('totalProductos');
    const valorEl = document.getElementById('valorInventario');
    const stockEl = document.getElementById('stockBajo');
    
    if (totalEl) animarNumero(totalEl, parseInt(totalProductos));
    if (stockEl) animarNumero(stockEl, parseInt(stockBajo));

    // ===== ANIMACIÓN DE ENTRADA =====
    const elementos = document.querySelectorAll('.kpi-card, .chart-card, .info-card');
    elementos.forEach((elemento, index) => {
        elemento.style.opacity = '0';
        elemento.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            elemento.style.transition = 'all 0.5s ease';
            elemento.style.opacity = '1';
            elemento.style.transform = 'translateY(0)';
        }, 100 * (index % 4));
    });

    // ===== FUNCIÓN PARA MOSTRAR NOTIFICACIONES =====
    function mostrarNotificacion(mensaje) {
        const notificacion = document.createElement('div');
        notificacion.className = 'data-notification';
        notificacion.textContent = `📊 ${mensaje}`;
        document.body.appendChild(notificacion);
        
        setTimeout(() => {
            notificacion.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notificacion.classList.remove('show');
            setTimeout(() => notificacion.remove(), 300);
        }, 2000);
    }

    // ===== ACTUALIZACIÓN EN TIEMPO REAL (SIMULADA) =====
    setInterval(() => {
        // Simular actualización de datos cada 30 segundos
        const stockEl = document.getElementById('stockBajo');
        if (stockEl) {
            const valorActual = parseInt(stockEl.textContent) || 0;
            const nuevoValor = Math.max(0, valorActual + (Math.random() > 0.5 ? 1 : -1));
            stockEl.textContent = nuevoValor;
            
            // Animación de la tarjeta
            const card = stockEl.closest('.kpi-card');
            if (card) {
                card.style.transform = 'scale(1.02)';
                setTimeout(() => card.style.transform = 'scale(1)', 200);
            }
        }
    }, 30000);

    // ===== ESTILOS PARA NOTIFICACIONES =====
    const style = document.createElement('style');
    style.textContent = `
        .data-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.95);
            color: #f5d487;
            padding: 12px 24px;
            border-radius: 8px;
            border: 1px solid #d4af37;
            box-shadow: 0 4px 20px rgba(212, 175, 55, 0.3);
            z-index: 9999;
            font-weight: 500;
            transition: all 0.3s;
            opacity: 0;
            transform: translateX(100%);
        }
        
        .data-notification.show {
            opacity: 1;
            transform: translateX(0);
        }
    `;
    document.head.appendChild(style);
});