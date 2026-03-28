// ===== PLATILLOS ESTADÍSTICAS JS =====

document.addEventListener('DOMContentLoaded', function() {
    
    // Obtener datos de Django
    const categoriasLabels = JSON.parse(document.getElementById('categorias-labels-data')?.textContent || '[]');
    const valoresCategorias = JSON.parse(document.getElementById('valores-categorias-data')?.textContent || '[]');
    const meses = JSON.parse(document.getElementById('meses-data')?.textContent || '[]');
    const cantidades = JSON.parse(document.getElementById('cantidades-data')?.textContent || '[]');
    const totalPlatillos = JSON.parse(document.getElementById('total-platillos-data')?.textContent || '0');
    const platillosDisponibles = JSON.parse(document.getElementById('disponibles-data')?.textContent || '0');
    const precioPromedio = JSON.parse(document.getElementById('precio-promedio-data')?.textContent || '0');
    
    // Datos para gráfico de disponibilidad
    const noDisponibles = totalPlatillos - platillosDisponibles;
    
    // Precios por categoría (ejemplo - puedes ajustar con datos reales)
    const preciosPorCategoria = valoresCategorias.map(val => {
        const basePrice = 20000;
        return Math.round(basePrice * (1 + Math.random() * 0.5));
    });
    
    // ===== GRÁFICO DE DISTRIBUCIÓN POR CATEGORÍA (PIE) =====
    const ctxCategorias = document.getElementById('chartCategorias')?.getContext('2d');
    if (ctxCategorias) {
        new Chart(ctxCategorias, {
            type: 'pie',
            data: {
                labels: categoriasLabels,
                datasets: [{
                    data: valoresCategorias,
                    backgroundColor: ['#f5d487', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#ffffff',
                            font: { size: 11 }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                return `${label}: ${value} platillos (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // ===== GRÁFICO DE EVOLUCIÓN (LINE) =====
    const ctxEvolucion = document.getElementById('chartEvolucion')?.getContext('2d');
    if (ctxEvolucion && meses.length > 0) {
        new Chart(ctxEvolucion, {
            type: 'line',
            data: {
                labels: meses,
                datasets: [{
                    label: 'Cantidad de platillos',
                    data: cantidades,
                    borderColor: '#f5d487',
                    backgroundColor: 'rgba(245, 212, 135, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#ffd700',
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(212, 175, 55, 0.1)' },
                        ticks: { color: '#bba163' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#bba163' }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Platillos: ${context.raw}`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // ===== GRÁFICO DE PRECIOS POR CATEGORÍA (BAR) =====
    const ctxPrecios = document.getElementById('chartPrecios')?.getContext('2d');
    if (ctxPrecios) {
        new Chart(ctxPrecios, {
            type: 'bar',
            data: {
                labels: categoriasLabels,
                datasets: [{
                    label: 'Precio promedio ($)',
                    data: preciosPorCategoria,
                    backgroundColor: '#f5d487',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(212, 175, 55, 0.1)' },
                        ticks: { 
                            color: '#bba163',
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#bba163' }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Precio promedio: $${context.raw.toLocaleString()}`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // ===== GRÁFICO DE DISPONIBILIDAD (DOUGHNUT) =====
    const ctxDisponibilidad = document.getElementById('chartDisponibilidad')?.getContext('2d');
    if (ctxDisponibilidad) {
        new Chart(ctxDisponibilidad, {
            type: 'doughnut',
            data: {
                labels: ['Disponibles', 'No disponibles'],
                datasets: [{
                    data: [platillosDisponibles, noDisponibles],
                    backgroundColor: ['#10b981', '#ef4444'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#ffffff',
                            font: { size: 11 }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = platillosDisponibles + noDisponibles;
                                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                return `${label}: ${value} platillos (${percentage}%)`;
                            }
                        }
                    }
                },
                cutout: '60%'
            }
        });
    }
    
    // ===== ANIMACIONES DE ENTRADA =====
    const kpiCards = document.querySelectorAll('.kpi-card');
    kpiCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    const chartCards = document.querySelectorAll('.chart-card');
    chartCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 400 + index * 100);
    });
    
    // ===== SELECTOR DE PERÍODO =====
    const periodBtns = document.querySelectorAll('.period-btn');
    periodBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            periodBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            // Aquí puedes agregar lógica para cambiar los datos según el período
            console.log('Período seleccionado:', this.textContent);
        });
    });
});