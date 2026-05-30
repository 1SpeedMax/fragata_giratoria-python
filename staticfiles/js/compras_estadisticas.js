// static/js/compras_estadisticas.js

document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Inicializando dashboard de compras...");

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
    const meses = getData('meses-data', ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun']);
    const montos = getData('montos-data', [0, 0, 0, 0, 0, 0]);
    const cantidades = getData('cantidades-data', [0, 0, 0, 0, 0, 0]);
    const categorias = getData('categorias-data', ['Pescados', 'Mariscos', 'Acompañamientos', 'Bebidas', 'Vegetales']);
    const valoresCat = getData('valores-categorias-data', [0, 0, 0, 0, 0]);
    const dias = getData('dias-data', ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']);
    const ventas = getData('ventas-diarias-data', [0, 0, 0, 0, 0, 0, 0]);

    console.log("✅ Datos cargados:", { meses, montos, cantidades, categorias, valoresCat, dias, ventas });

    // ===== GRÁFICO 1: EVOLUCIÓN =====
    const ctx1 = document.getElementById('chartEvolucion')?.getContext('2d');
    if (ctx1) {
        new Chart(ctx1, {
            type: 'line',
            data: {
                labels: meses,
                datasets: [
                    {
                        label: 'Monto (Millones $)',
                        data: montos,
                        borderColor: '#f5d487',
                        backgroundColor: 'rgba(245, 212, 135, 0.1)',
                        tension: 0.4,
                        fill: true,
                        yAxisID: 'y',
                    },
                    {
                        label: 'Cantidad',
                        data: cantidades,
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
        console.log("✅ Gráfico 1 creado");
    } else {
        console.error("❌ No se encontró el canvas chartEvolucion");
    }

    // ===== GRÁFICO 2: PROVEEDORES =====
    const ctx2 = document.getElementById('chartProveedores')?.getContext('2d');
    if (ctx2) {
        new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: categorias.slice(0, 5),
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
        console.log("✅ Gráfico 2 creado");
    }

    // ===== GRÁFICO 3: CATEGORÍAS =====
    const ctx3 = document.getElementById('chartCategorias')?.getContext('2d');
    if (ctx3) {
        new Chart(ctx3, {
            type: 'bar',
            data: {
                labels: categorias,
                datasets: [{
                    label: 'Monto (Millones $)',
                    data: valoresCat,
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
        console.log("✅ Gráfico 3 creado");
    }

    // ===== GRÁFICO 4: TENDENCIAS =====
    const ctx4 = document.getElementById('chartTendencias')?.getContext('2d');
    if (ctx4) {
        new Chart(ctx4, {
            type: 'line',
            data: {
                labels: dias,
                datasets: [{
                    label: 'Ventas Diarias',
                    data: ventas,
                    borderColor: '#f5d487',
                    backgroundColor: 'rgba(245, 212, 135, 0.1)',
                    tension: 0.4,
                    fill: true
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
        console.log("✅ Gráfico 4 creado");
    }
});