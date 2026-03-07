// static/js/metodospago_estadisticas.js

document.addEventListener('DOMContentLoaded', function() {
    // Obtener datos
    const totalMetodos = parseInt(document.getElementById('total-metodos-data')?.textContent || '0');
    const tiposData = JSON.parse(document.getElementById('tipo-data')?.textContent || '{}');
    const conDesc = parseInt(document.getElementById('con-descripcion-data')?.textContent || '0');
    const sinDesc = parseInt(document.getElementById('sin-descripcion-data')?.textContent || '0');

    // Gráfico de tipos
    const ctxTipos = document.getElementById('chartTipos')?.getContext('2d');
    if (ctxTipos) {
        new Chart(ctxTipos, {
            type: 'doughnut',
            data: {
                labels: Object.keys(tiposData),
                datasets: [{
                    data: Object.values(tiposData),
                    backgroundColor: ['#f5d487', '#d4af37', '#b8860b', '#8b6914'],
                    borderColor: 'rgba(0,0,0,0.5)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#f5d487' } }
                }
            }
        });
    }

    // Gráfico de descripciones
    const ctxDesc = document.getElementById('chartDescripciones')?.getContext('2d');
    if (ctxDesc) {
        new Chart(ctxDesc, {
            type: 'bar',
            data: {
                labels: ['Con Descripción', 'Sin Descripción'],
                datasets: [{
                    data: [conDesc, sinDesc],
                    backgroundColor: ['#10b981', '#ef4444'],
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
});