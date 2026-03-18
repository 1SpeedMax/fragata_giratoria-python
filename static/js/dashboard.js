// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    inicializarDashboard();
    inicializarFechaHora();
    inicializarGrafico();
    cargarDatosDashboard();
    inicializarModal();
});

// ===== FECHA Y HORA =====
function inicializarFechaHora() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
}

function actualizarFechaHora() {
    const ahora = new Date();
    const opciones = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    
    const fechaHoraStr = ahora.toLocaleDateString('es-ES', opciones);
    document.getElementById('currentDateTime').innerHTML = `
        <i class="far fa-calendar-alt"></i>
        <span>${fechaHoraStr}</span>
    `;
}

// ===== GRÁFICO DE VENTAS =====
let ventasChart;

function inicializarGrafico() {
    const ctx = document.getElementById('ventasChart').getContext('2d');
    
    ventasChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            datasets: [{
                label: 'Ventas',
                data: [120000, 150000, 180000, 220000, 280000, 350000, 420000],
                borderColor: '#d4af37',
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                borderWidth: 3,
                pointBackgroundColor: '#d4af37',
                pointBorderColor: '#000',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 8,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#d4af37',
                    bodyColor: '#f5d487',
                    borderColor: '#d4af37',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    grid: {
                        color: 'rgba(212, 175, 55, 0.1)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        },
                        color: '#bba163'
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
            }
        }
    });
}

function cambiarPeriodo(periodo) {
    // Actualizar botones
    document.querySelectorAll('.card-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Simular cambio de datos
    const datosPorPeriodo = {
        semana: [120000, 150000, 180000, 220000, 280000, 350000, 420000],
        mes: [350000, 420000, 380000, 450000, 520000, 480000, 600000],
        año: [5200000, 5800000, 6200000, 7000000, 8200000, 9500000, 11000000]
    };
    
    ventasChart.data.datasets[0].data = datosPorPeriodo[periodo];
    ventasChart.update();
}

// ===== CARGA DE DATOS =====
function cargarDatosDashboard() {
    // Simular carga de datos
    setTimeout(() => {
        cargarStats();
        cargarStockBajo();
        cargarUltimosPedidos();
        cargarActividadReciente();
    }, 500);
}

function cargarStats() {
    document.getElementById('totalProductos').textContent = '156';
    document.getElementById('pedidosHoy').textContent = '24';
    document.getElementById('comprasMes').textContent = '$ 4.5M';
    document.getElementById('totalUsuarios').textContent = '12';
}

function cargarStockBajo() {
    const stockBajo = [
        { nombre: 'Arroz', cantidad: 5, unidad: 'kg', min: 20, status: 'critico' },
        { nombre: 'Papa', cantidad: 8, unidad: 'kg', min: 15, status: 'bajo' },
        { nombre: 'Carne', cantidad: 3, unidad: 'kg', min: 10, status: 'critico' },
        { nombre: 'Cebolla', cantidad: 2, unidad: 'kg', min: 5, status: 'critico' },
        { nombre: 'Tomate', cantidad: 4, unidad: 'kg', min: 8, status: 'bajo' }
    ];
    
    let html = '';
    stockBajo.forEach(item => {
        html += `
            <div class="stock-item">
                <div class="stock-info">
                    <i class="fas fa-box"></i>
                    <div>
                        <span class="stock-nombre">${item.nombre}</span>
                        <span class="stock-cantidad">${item.cantidad} ${item.unidad} / mínimo ${item.min} ${item.unidad}</span>
                    </div>
                </div>
                <span class="stock-status ${item.status}">
                    ${item.status === 'critico' ? 'Crítico' : 'Bajo'}
                </span>
            </div>
        `;
    });
    
    document.getElementById('stockBajoList').innerHTML = html;
}

function cargarUltimosPedidos() {
    const pedidos = [
        { cliente: 'Juan Pérez', total: 125000, estado: 'pendiente' },
        { cliente: 'María Gómez', total: 89000, estado: 'preparacion' },
        { cliente: 'Carlos López', total: 210000, estado: 'listo' },
        { cliente: 'Ana Martínez', total: 67000, estado: 'pendiente' },
        { cliente: 'Pedro Sánchez', total: 156000, estado: 'preparacion' }
    ];
    
    let html = '';
    pedidos.forEach(pedido => {
        const estadoTexto = {
            'pendiente': 'Pendiente',
            'preparacion': 'En Preparación',
            'listo': 'Listo'
        };
        
        html += `
            <div class="pedido-item">
                <div class="pedido-info">
                    <i class="fas fa-user"></i>
                    <div>
                        <span class="pedido-cliente">${pedido.cliente}</span>
                        <span class="pedido-total">$${pedido.total.toLocaleString()}</span>
                    </div>
                </div>
                <span class="pedido-estado ${pedido.estado}">
                    ${estadoTexto[pedido.estado]}
                </span>
            </div>
        `;
    });
    
    document.getElementById('ultimosPedidos').innerHTML = html;
}

function cargarActividadReciente() {
    const actividades = [
        { texto: 'Nuevo pedido creado por Juan Pérez', tiempo: 'Hace 5 min', icono: 'fa-clipboard-list' },
        { texto: 'Producto actualizado: Arroz', tiempo: 'Hace 15 min', icono: 'fa-box' },
        { texto: 'Nuevo usuario registrado: Ana López', tiempo: 'Hace 25 min', icono: 'fa-user-plus' },
        { texto: 'Compra realizada a Proveedor SAS', tiempo: 'Hace 1 hora', icono: 'fa-shopping-cart' },
        { texto: 'Stock bajo detectado en Papa', tiempo: 'Hace 2 horas', icono: 'fa-exclamation-triangle' }
    ];
    
    let html = '';
    actividades.forEach(act => {
        html += `
            <div class="actividad-item">
                <div class="actividad-icon">
                    <i class="fas ${act.icono}"></i>
                </div>
                <div class="actividad-content">
                    <div class="actividad-texto">${act.texto}</div>
                    <div class="actividad-tiempo">
                        <i class="far fa-clock"></i>
                        ${act.tiempo}
                    </div>
                </div>
            </div>
        `;
    });
    
    document.getElementById('actividadReciente').innerHTML = html;
}

// ===== MODAL =====
function inicializarModal() {
    const modal = document.getElementById('exportModal');
    
    window.abrirModalExport = function() {
        modal.style.display = 'block';
        modal.classList.add('active');
    };
    
    window.cerrarModal = function() {
        modal.style.display = 'none';
        modal.classList.remove('active');
    };
    
    window.toggleFechasPersonalizado = function() {
        const select = document.getElementById('reportePeriodo');
        const fechasDiv = document.getElementById('fechasPersonalizado');
        fechasDiv.style.display = select.value === 'personalizado' ? 'block' : 'none';
    };
    
    window.generarReporte = function() {
        const tipo = document.getElementById('reporteTipo').value;
        const periodo = document.getElementById('reportePeriodo').value;
        const formato = document.querySelector('input[name="formato"]:checked').value;
        
        let fechaInicio = '';
        let fechaFin = '';
        
        if (periodo === 'personalizado') {
            fechaInicio = document.getElementById('fechaInicio').value;
            fechaFin = document.getElementById('fechaFin').value;
            
            if (!fechaInicio || !fechaFin) {
                alert('Por favor selecciona las fechas de inicio y fin');
                return;
            }
        }
        
        // Simular generación de reporte
        mostrarNotificacion('Generando reporte...', 'info');
        
        setTimeout(() => {
            cerrarModal();
            mostrarNotificacion(`Reporte de ${tipo} generado exitosamente (${formato})`, 'success');
        }, 1500);
    };
    
    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            cerrarModal();
        }
    });
    
    // Cerrar modal haciendo clic fuera
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            cerrarModal();
        }
    });
}

// ===== SISTEMA DE NOTIFICACIONES =====
function mostrarNotificacion(mensaje, tipo = 'info') {
    const colores = {
        info: '#d4af37',
        success: '#10b981',
        error: '#ef4444'
    };
    
    const notificacion = document.createElement('div');
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.95);
        color: ${colores[tipo]};
        padding: 1rem 1.5rem;
        border-radius: 12px;
        border-left: 4px solid ${colores[tipo]};
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 0.8rem;
        animation: slideInRight 0.3s ease-out;
        font-family: 'Inter', sans-serif;
    `;
    
    notificacion.innerHTML = `
        <i class="fas ${tipo === 'success' ? 'fa-check-circle' : tipo === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${mensaje}</span>
    `;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notificacion.remove(), 300);
    }, 3000);
}

// ===== ACTUALIZACIÓN EN TIEMPO REAL (SIMULADA) =====
setInterval(() => {
    const valores = ['156', '24', '$ 4.5M', '12'];
    const stats = ['totalProductos', 'pedidosHoy', 'comprasMes', 'totalUsuarios'];
    
    stats.forEach((stat, index) => {
        const elemento = document.getElementById(stat);
        if (elemento) {
            elemento.style.transition = 'all 0.3s ease';
            elemento.style.transform = 'scale(1.1)';
            setTimeout(() => {
                elemento.style.transform = 'scale(1)';
            }, 200);
        }
    });
}, 30000); // Cada 30 segundos