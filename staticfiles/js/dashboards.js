// ===== DASHBOARD.JS =====

// Variables globales
let salesChart;
let currentPeriod = 'week';

// Datos para gráficos (recibidos desde Django)
const weekData = {
    labels: typeof diasSemana !== 'undefined' ? diasSemana : ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    values: typeof ventasSemana !== 'undefined' ? ventasSemana : [0, 0, 0, 0, 0, 0, 0]
};

const monthData = {
    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
    values: typeof ventasMes !== 'undefined' ? ventasMes : [0, 0, 0, 0]
};

// Inicializar gráfico
function initChart() {
    const canvas = document.getElementById('ventasChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: weekData.labels,
            datasets: [{
                label: 'Ventas (Millones $)',
                data: weekData.values,
                borderColor: '#f5d487',
                backgroundColor: 'rgba(245, 212, 135, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#ffd700',
                pointBorderColor: '#d4af37',
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(212, 175, 55, 0.1)'
                    },
                    ticks: {
                        color: '#bba163',
                        callback: function(value) {
                            return '$' + value + 'M';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#bba163'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Ventas: $' + context.raw + 'M';
                        }
                    }
                }
            }
        }
    });
}

// Actualizar gráfico según período
function updateChart(period) {
    currentPeriod = period;
    
    let newData;
    let newLabels;
    
    if (period === 'week') {
        newData = weekData.values;
        newLabels = weekData.labels;
    } else {
        newData = monthData.values;
        newLabels = monthData.labels;
    }
    
    if (salesChart) {
        salesChart.data.datasets[0].data = newData;
        salesChart.data.labels = newLabels;
        salesChart.update();
    }
}

// Actualizar fecha
function updateDate() {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const today = new Date();
    const dateElement = document.getElementById('currentDateText');
    if (dateElement) {
        dateElement.textContent = today.toLocaleDateString('es-ES', options);
    }
}

// Exportar reporte
function handleExport() {
    toggleExportModal();
    
    // Simular generación de PDF
    setTimeout(() => {
        alert('📊 Reporte generado exitosamente\nEl archivo se ha descargado en formato PDF.');
    }, 500);
}

// Inicializar botones de período
function initPeriodButtons() {
    const buttons = document.querySelectorAll('.card-btn');
    buttons.forEach(btn => {
        const period = btn.getAttribute('data-period');
        btn.addEventListener('click', function() {
            updateChart(period);
            buttons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Animación de entrada para los elementos
function animateElements() {
    const elements = document.querySelectorAll('.stat-card, .dashboard-card, .action-item');
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        setTimeout(() => {
            el.style.transition = 'all 0.5s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

// Refrescar estadísticas (opcional)
function refreshStats() {
    fetch('/api/dashboard/stats/')
        .then(response => response.json())
        .then(data => {
            if (data.total_productos) {
                document.getElementById('totalProductos').textContent = data.total_productos;
            }
            if (data.pedidos_hoy) {
                document.getElementById('pedidosHoy').textContent = data.pedidos_hoy;
            }
            if (data.compras_mes) {
                document.getElementById('comprasMes').textContent = '$' + data.compras_mes;
            }
            if (data.total_usuarios) {
                document.getElementById('totalUsuarios').textContent = data.total_usuarios;
            }
        })
        .catch(error => console.log('Error al refrescar estadísticas:', error));
}

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    initChart();
    updateDate();
    initPeriodButtons();
    setupModalClose();
    animateElements();
    
    // Opcional: actualizar estadísticas cada 30 segundos
    // setInterval(refreshStats, 30000);
});

// Exportar funciones para uso global
window.updateChart = updateChart;
window.toggleExportModal = toggleExportModal;
window.handleExport = handleExport;