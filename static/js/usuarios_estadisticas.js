// static/js/usuarios_estadisticas.js

document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Estadísticas de usuarios cargadas");

    // ===== OBTENER DATOS =====
    const totalUsuarios = parseInt(document.getElementById('totalUsuarios')?.textContent || '7');
    const activos = parseInt(document.getElementById('usuariosActivos')?.textContent || '5');
    const inactivos = parseInt(document.getElementById('usuariosInactivos')?.textContent || '1');
    const suspendidos = parseInt(document.getElementById('usuariosSuspendidos')?.textContent || '1');

    // ===== GRÁFICO DE ESTADOS =====
    const ctxEstados = document.getElementById('chartEstados')?.getContext('2d');
    if (ctxEstados) {
        new Chart(ctxEstados, {
            type: 'doughnut',
            data: {
                labels: ['Activos', 'Inactivos', 'Suspendidos'],
                datasets: [{
                    data: [activos, inactivos, suspendidos],
                    backgroundColor: [
                        '#10b981',
                        '#f59e0b',
                        '#ef4444'
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
                        labels: { color: '#f5d487' }
                    }
                }
            }
        });
    }

    // ===== GRÁFICO DE ROLES =====
    const ctxRoles = document.getElementById('chartRoles')?.getContext('2d');
    if (ctxRoles) {
        new Chart(ctxRoles, {
            type: 'bar',
            data: {
                labels: ['Admin', 'Cocinero', 'Mesero', 'Cliente'],
                datasets: [{
                    label: 'Cantidad',
                    data: [2, 1, 1, 3],
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
            console.log('Período seleccionado:', this.dataset.period);
        });
    });
});