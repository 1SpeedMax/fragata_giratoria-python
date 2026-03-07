// static/js/compras.js

document.addEventListener('DOMContentLoaded', function() {
    
    console.log("🚀 Inicializando dashboard de compras...");

    // ===== DATOS DESDE DJANGO =====
    // Estos datos vienen del contexto de Django
    const datos = {
        meses: JSON.parse(document.getElementById('meses-data')?.textContent || '["Ene","Feb","Mar","Abr","May","Jun"]'),
        montos: JSON.parse(document.getElementById('montos-data')?.textContent || '[1.2,1.5,1.8,2.1,2.4,2.8]'),
        cantidades: JSON.parse(document.getElementById('cantidades-data')?.textContent || '[12,15,18,22,25,30]'),
        categorias: JSON.parse(document.getElementById('categorias-data')?.textContent || '["Pescados","Mariscos","Acompañamientos","Bebidas","Vegetales"]'),
        valoresCategorias: JSON.parse(document.getElementById('valores-categorias-data')?.textContent || '[40,30,15,10,5]'),
        dias: JSON.parse(document.getElementById('dias-data')?.textContent || '["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"]'),
        ventasDiarias: JSON.parse(document.getElementById('ventas-diarias-data')?.textContent || '[0.8,1.2,1.5,1.1,2.3,3.5,2.8]')
    };

    // ===== REFERENCIAS A GRÁFICOS =====
    let chartEvolucion, chartProveedores, chartCategorias, chartTendencias;

    // ===== FUNCIÓN PARA INICIALIZAR GRÁFICOS =====
    function inicializarGraficos() {
        
        // 1. GRÁFICO DE EVOLUCIÓN
        const ctx1 = document.getElementById('chartEvolucion')?.getContext('2d');
        if (ctx1) {
            chartEvolucion = new Chart(ctx1, {
                type: 'line',
                data: {
                    labels: datos.meses,
                    datasets: [
                        {
                            label: 'Monto (Millones $)',
                            data: datos.montos,
                            borderColor: '#f5d487',
                            backgroundColor: 'rgba(245, 212, 135, 0.1)',
                            tension: 0.4,
                            fill: true,
                            yAxisID: 'y',
                        },
                        {
                            label: 'Cantidad de Compras',
                            data: datos.cantidades,
                            borderColor: '#10b981',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            tension: 0.4,
                            fill: true,
                            yAxisID: 'y1',
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            type: 'linear',
                            position: 'left',
                            grid: { color: 'rgba(245, 212, 135, 0.1)' },
                            ticks: { 
                                color: '#f5d487',
                                callback: function(value) {
                                    return '$' + value + 'M';
                                }
                            }
                        },
                        y1: {
                            type: 'linear',
                            position: 'right',
                            grid: { display: false },
                            ticks: { color: '#10b981' }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: '#f5d487' }
                        }
                    }
                }
            });
        }

        // 2. GRÁFICO DE PROVEEDORES
        const ctx2 = document.getElementById('chartProveedores')?.getContext('2d');
        if (ctx2) {
            chartProveedores = new Chart(ctx2, {
                type: 'doughnut',
                data: {
                    labels: datos.categorias.slice(0, 5),
                    datasets: [{
                        data: [35, 25, 20, 12, 8],
                        backgroundColor: ['#f5d487', '#d4af37', '#b8860b', '#8b6914', '#5e4b1a'],
                        borderColor: 'rgba(0,0,0,0.5)',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { labels: { color: '#f5d487' } }
                    },
                    cutout: '65%'
                }
            });
        }

        // 3. GRÁFICO DE CATEGORÍAS
        const ctx3 = document.getElementById('chartCategorias')?.getContext('2d');
        if (ctx3) {
            chartCategorias = new Chart(ctx3, {
                type: 'bar',
                data: {
                    labels: datos.categorias,
                    datasets: [{
                        label: 'Monto (Millones $)',
                        data: datos.valoresCategorias,
                        backgroundColor: '#f5d487',
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            grid: { color: 'rgba(245, 212, 135, 0.1)' },
                            ticks: { 
                                color: '#f5d487',
                                callback: function(value) {
                                    return '$' + value + 'M';
                                }
                            }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: '#f5d487' }
                        }
                    }
                }
            });
        }

        // 4. GRÁFICO DE TENDENCIAS
        const ctx4 = document.getElementById('chartTendencias')?.getContext('2d');
        if (ctx4) {
            chartTendencias = new Chart(ctx4, {
                type: 'line',
                data: {
                    labels: datos.dias,
                    datasets: [
                        {
                            label: 'Ventas Diarias',
                            data: datos.ventasDiarias,
                            borderColor: '#f5d487',
                            backgroundColor: 'rgba(245, 212, 135, 0.1)',
                            tension: 0.4,
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            grid: { color: 'rgba(245, 212, 135, 0.1)' },
                            ticks: { 
                                color: '#f5d487',
                                callback: function(value) {
                                    return '$' + value + 'M';
                                }
                            }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: '#f5d487' }
                        }
                    }
                }
            });
        }
    }

    // ===== SELECTOR DE PERÍODO INTERACTIVO =====
    function inicializarPeriodSelector() {
        const periodBtns = document.querySelectorAll('.period-btn');
        
        periodBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                periodBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                this.style.transform = 'scale(0.95)';
                setTimeout(() => this.style.transform = 'scale(1)', 200);
                
                mostrarNotificacion(`Mostrando datos de: ${this.textContent}`);
                
                // Aquí puedes agregar lógica para actualizar datos según período
                const periodo = this.dataset.period;
                console.log(`Período seleccionado: ${periodo}`);
            });
        });
    }

    // ===== BÚSQUEDA EN TIEMPO REAL =====
    function inicializarBusqueda() {
        const searchInput = document.querySelector('.table-search');
        if (!searchInput) return;

        searchInput.addEventListener('input', function(e) {
            const termino = e.target.value.toLowerCase();
            const filas = document.querySelectorAll('.products-table tbody tr');
            
            filas.forEach(fila => {
                if (fila.classList.contains('no-products')) return;
                
                const texto = fila.textContent.toLowerCase();
                fila.style.display = texto.includes(termino) ? '' : 'none';
            });
            
            // Verificar si hay resultados visibles
            const filasVisibles = document.querySelectorAll('.products-table tbody tr:not([style*="display: none"])').length;
            const mensajeNoResultados = document.querySelector('.no-search-results');
            
            if (filasVisibles === 0) {
                if (!mensajeNoResultados) {
                    const tbody = document.querySelector('.products-table tbody');
                    const tr = document.createElement('tr');
                    tr.className = 'no-search-results';
                    tr.innerHTML = '<td colspan="5" style="text-align: center; padding: 2rem;">🔍 No se encontraron compras</td>';
                    tbody.appendChild(tr);
                }
            } else if (mensajeNoResultados) {
                mensajeNoResultados.remove();
            }
        });
    }

    // ===== NOTIFICACIONES =====
    function mostrarNotificacion(mensaje) {
        let notificacion = document.querySelector('.data-notification');
        
        if (!notificacion) {
            notificacion = document.createElement('div');
            notificacion.className = 'data-notification';
            document.body.appendChild(notificacion);
        }
        
        notificacion.textContent = `📊 ${mensaje}`;
        notificacion.classList.add('show');
        
        setTimeout(() => {
            notificacion.classList.remove('show');
        }, 2000);
    }

    // ===== ANIMACIÓN DE ENTRADA =====
    function animarEntrada() {
        const elementos = document.querySelectorAll('.kpi-card, .chart-card, .products-table-container');
        
        elementos.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                el.style.transition = 'all 0.5s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 100 * index);
        });
    }

    // ===== ACTUALIZACIÓN EN TIEMPO REAL (SIMULADA) =====
    function iniciarSimulacionTiempoReal() {
        setInterval(() => {
            // Actualizar compras pendientes aleatoriamente
            const pendientesEl = document.querySelector('.kpi-card:last-child .kpi-value');
            if (pendientesEl) {
                const valorActual = parseInt(pendientesEl.textContent) || 8;
                const nuevoValor = Math.max(3, valorActual + (Math.random() > 0.5 ? 1 : -1));
                pendientesEl.textContent = nuevoValor;
                
                // Animación
                const card = pendientesEl.closest('.kpi-card');
                card.style.transform = 'scale(1.02)';
                setTimeout(() => card.style.transform = 'scale(1)', 200);
            }
        }, 30000); // Cada 30 segundos
    }

    // ===== INICIALIZAR TODO =====
    try {
        inicializarGraficos();
        inicializarPeriodSelector();
        inicializarBusqueda();
        animarEntrada();
        iniciarSimulacionTiempoReal();
        
        console.log("✅ Dashboard de compras inicializado correctamente");
    } catch (error) {
        console.error("❌ Error al inicializar dashboard:", error);
    }
});