// static/js/productos_estadisticas.js

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Estadísticas de productos cargadas');

    // ===== GRÁFICO DE CATEGORÍAS =====
    const ctxCategorias = document.getElementById('chartCategorias')?.getContext('2d');
    if (ctxCategorias) {
        new Chart(ctxCategorias, {
            type: 'doughnut',
            data: {
                labels: JSON.parse(document.getElementById('categorias-data')?.textContent || '["Pescados","Mariscos","Acompañamientos","Bebidas","Vegetales"]'),
                datasets: [{
                    data: JSON.parse(document.getElementById('valores-categorias-data')?.textContent || '[40,30,15,10,5]'),
                    backgroundColor: ['#f5d487', '#d4af37', '#b8860b', '#8b6914', '#5e4b1a'],
                    borderColor: 'rgba(0,0,0,0.5)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#f5d487' }
                    }
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
                labels: JSON.parse(document.getElementById('meses-data')?.textContent || '["Ene","Feb","Mar","Abr","May","Jun"]'),
                datasets: [{
                    label: 'Cantidad de Productos',
                    data: JSON.parse(document.getElementById('cantidades-data')?.textContent || '[10,15,12,18,22,25]'),
                    borderColor: '#f5d487',
                    backgroundColor: 'rgba(245, 212, 135, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#f5d487'
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
            
            // Animación
            this.style.transform = 'scale(0.95)';
            setTimeout(() => this.style.transform = 'scale(1)', 200);
            
            console.log('Período seleccionado:', this.dataset.period);
        });
    });

    // ===== ANIMACIÓN DE ENTRADA =====
    const cards = document.querySelectorAll('.kpi-card, .chart-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * (index % 4));
    });
});