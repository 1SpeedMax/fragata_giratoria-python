// static/js/pedidos_estadisticas.js

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Estadísticas de pedidos cargadas');

    // ===== FUNCIÓN PARA OBTENER DATOS =====
    function getData(elementId, defaultValue) {
        const element = document.getElementById(elementId);
        if (!element) return defaultValue;
        try {
            return JSON.parse(element.textContent);
        } catch (e) {
            console.warn(`Error parseando ${elementId}:`, e);
            return defaultValue;
        }
    }

    // ===== OBTENER DATOS =====
    const totalPedidos = parseInt(document.getElementById('total-pedidos-data')?.textContent || '0');
    const pendientes = parseInt(document.getElementById('pendientes-data')?.textContent || '0');
    const enviados = parseInt(document.getElementById('enviados-data')?.textContent || '0');
    const entregados = parseInt(document.getElementById('entregados-data')?.textContent || '0');
    const cancelados = parseInt(document.getElementById('cancelados-data')?.textContent || '0');
    
    const meses = getData('meses-data', ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun']);
    const montos = getData('montos-data', [1200000, 1500000, 1800000, 2100000, 1900000, 2300000]);

    // ===== GRÁFICO DE ESTADOS =====
    const ctxEstados = document.getElementById('chartEstados')?.getContext('2d');
    if (ctxEstados) {
        new Chart(ctxEstados, {
            type: 'doughnut',
            data: {
                labels: ['Pendientes', 'Enviados', 'Entregados', 'Cancelados'],
                datasets: [{
                    data: [pendientes, enviados, entregados, cancelados],
                    backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'],
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

    // ===== GRÁFICO DE EVOLUCIÓN =====
    const ctxEvolucion = document.getElementById('chartEvolucion')?.getContext('2d');
    if (ctxEvolucion) {
        new Chart(ctxEvolucion, {
            type: 'line',
            data: {
                labels: meses,
                datasets: [{
                    label: 'Cantidad de Pedidos',
                    data: [12, 15, 18, 22, 25, 28],
                    borderColor: '#f5d487',
                    backgroundColor: 'rgba(245, 212, 135, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        grid: { color: 'rgba(245, 212, 135, 0.1)' },
                        ticks: { color: '#f5d487' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#f5d487' }
                    }
                }
            }
        });
    }

    // ===== GRÁFICO DE INGRESOS =====
    const ctxIngresos = document.getElementById('chartIngresos')?.getContext('2d');
    if (ctxIngresos) {
        new Chart(ctxIngresos, {
            type: 'bar',
            data: {
                labels: meses,
                datasets: [{
                    label: 'Ingresos ($)',
                    data: montos.map(m => Math.round(m / 1000)),
                    backgroundColor: '#f5d487',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        grid: { color: 'rgba(245, 212, 135, 0.1)' },
                        ticks: { 
                            color: '#f5d487',
                            callback: v => '$' + v + 'k'
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

    // ===== GRÁFICO DE HORAS =====
    const ctxHoras = document.getElementById('chartHoras')?.getContext('2d');
    if (ctxHoras) {
        new Chart(ctxHoras, {
            type: 'line',
            data: {
                labels: ['12pm', '2pm', '4pm', '6pm', '8pm', '10pm'],
                datasets: [{
                    label: 'Pedidos',
                    data: [8, 15, 22, 28, 25, 18],
                    borderColor: '#f5d487',
                    backgroundColor: 'rgba(245, 212, 135, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        grid: { color: 'rgba(245, 212, 135, 0.1)' },
                        ticks: { color: '#f5d487' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#f5d487' }
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
            this.style.transform = 'scale(0.95)';
            setTimeout(() => this.style.transform = 'scale(1)', 200);
        });
    });

    // ===== ANIMACIÓN DE ENTRADA =====
    const elementos = document.querySelectorAll('.kpi-card, .chart-card, .info-card');
    elementos.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        setTimeout(() => {
            el.style.transition = 'all 0.5s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100 * (i % 4));
    });
});