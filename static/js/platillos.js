// static/js/platillos.js

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== DATOS POR PERÍODO =====
    // Simulando datos que vendrían del backend
    const datosPorPeriodo = {
        day: {
            titulo: 'Hoy',
            totalPlatillos: 48,
            platilloTop: 'Bandeja Paisa',
            platilloMejorValorado: 'Mojarra Frita',
            tiempoPromedio: '15',
            ingresosTotales: '$1,250,000',
            ventas: {
                labels: ['Bandeja Paisa', 'Mojarra Frita', 'Sancocho', 'Arepa con Queso', 'Postre de Natas'],
                data: [28, 22, 18, 35, 12]
            },
            categorias: {
                labels: ['Platos Fuertes', 'Pescados', 'Sopas', 'Entradas', 'Postres', 'Bebidas'],
                data: [40, 18, 12, 15, 8, 7]
            },
            dias: {
                labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
                data: [0, 0, 0, 0, 28, 35, 22] // Solo hoy (viernes)
            },
            precios: {
                labels: ['$0 - $10k', '$10k - $20k', '$20k - $30k', '$30k - $40k', '$40k+'],
                data: [8, 18, 15, 5, 2]
            }
        },
        week: {
            titulo: 'Esta Semana',
            totalPlatillos: 48,
            platilloTop: 'Arepa con Queso',
            platilloMejorValorado: 'Bandeja Paisa',
            tiempoPromedio: '17',
            ingresosTotales: '$4,850,000',
            ventas: {
                labels: ['Bandeja Paisa', 'Mojarra Frita', 'Sancocho', 'Arepa con Queso', 'Postre de Natas'],
                data: [85, 72, 58, 105, 42]
            },
            categorias: {
                labels: ['Platos Fuertes', 'Pescados', 'Sopas', 'Entradas', 'Postres', 'Bebidas'],
                data: [38, 22, 15, 18, 5, 2]
            },
            dias: {
                labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
                data: [42, 38, 45, 52, 68, 85, 72]
            },
            precios: {
                labels: ['$0 - $10k', '$10k - $20k', '$20k - $30k', '$30k - $40k', '$40k+'],
                data: [12, 22, 30, 18, 4]
            }
        },
        month: {
            titulo: 'Este Mes',
            totalPlatillos: 48,
            platilloTop: 'Arepa con Queso',
            platilloMejorValorado: 'Mojarra Frita',
            tiempoPromedio: '18',
            ingresosTotales: '$14,624,000',
            ventas: {
                labels: ['Bandeja Paisa', 'Mojarra Frita', 'Sancocho', 'Arepa con Queso', 'Postre de Natas'],
                data: [156, 142, 128, 215, 98]
            },
            categorias: {
                labels: ['Platos Fuertes', 'Pescados', 'Sopas', 'Entradas', 'Postres', 'Bebidas'],
                data: [35, 20, 15, 12, 10, 8]
            },
            dias: {
                labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
                data: [320, 380, 410, 390]
            },
            precios: {
                labels: ['$0 - $10k', '$10k - $20k', '$20k - $30k', '$30k - $40k', '$40k+'],
                data: [15, 25, 35, 20, 5]
            }
        },
        quarter: {
            titulo: 'Este Trimestre',
            totalPlatillos: 52,
            platilloTop: 'Bandeja Paisa',
            platilloMejorValorado: 'Mojarra Frita',
            tiempoPromedio: '18',
            ingresosTotales: '$42,850,000',
            ventas: {
                labels: ['Bandeja Paisa', 'Mojarra Frita', 'Sancocho', 'Arepa con Queso', 'Postre de Natas'],
                data: [480, 410, 350, 620, 280]
            },
            categorias: {
                labels: ['Platos Fuertes', 'Pescados', 'Sopas', 'Entradas', 'Postres', 'Bebidas'],
                data: [37, 21, 14, 13, 9, 6]
            },
            dias: {
                labels: ['Enero', 'Febrero', 'Marzo'],
                data: [1250, 1380, 1420]
            },
            precios: {
                labels: ['$0 - $10k', '$10k - $20k', '$20k - $30k', '$30k - $40k', '$40k+'],
                data: [14, 24, 34, 22, 6]
            }
        },
        year: {
            titulo: 'Este Año',
            totalPlatillos: 58,
            platilloTop: 'Arepa con Queso',
            platilloMejorValorado: 'Bandeja Paisa',
            tiempoPromedio: '18',
            ingresosTotales: '$168,250,000',
            ventas: {
                labels: ['Bandeja Paisa', 'Mojarra Frita', 'Sancocho', 'Arepa con Queso', 'Postre de Natas'],
                data: [1850, 1620, 1480, 2450, 1120]
            },
            categorias: {
                labels: ['Platos Fuertes', 'Pescados', 'Sopas', 'Entradas', 'Postres', 'Bebidas'],
                data: [36, 20, 15, 14, 9, 6]
            },
            dias: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                data: [1250, 1180, 1420, 1380, 1520, 1680, 1720, 1850, 1680, 1580, 1420, 1380]
            },
            precios: {
                labels: ['$0 - $10k', '$10k - $20k', '$20k - $30k', '$30k - $40k', '$40k+'],
                data: [16, 24, 32, 21, 7]
            }
        }
    };

    // ===== REFERENCIAS A LOS GRÁFICOS =====
    let chartTop, chartCategorias, chartDiarias, chartPrecios;

    // ===== FUNCIÓN PARA CREAR GRÁFICOS =====
    function crearGraficos(periodo) {
        const datos = datosPorPeriodo[periodo];
        
        // Destruir gráficos existentes si los hay
        if (chartTop) chartTop.destroy();
        if (chartCategorias) chartCategorias.destroy();
        if (chartDiarias) chartDiarias.destroy();
        if (chartPrecios) chartPrecios.destroy();

        // ===== ACTUALIZAR TARJETAS =====
        document.getElementById('totalPlatillos').textContent = datos.totalPlatillos;
        document.getElementById('platilloTop').textContent = datos.platilloTop;
        document.getElementById('platilloMejorValorado').textContent = datos.platilloMejorValorado;
        document.getElementById('tiempoPromedio').textContent = datos.tiempoPromedio;
        document.getElementById('ingresosTotales').textContent = datos.ingresosTotales;
        
        // Actualizar título del período
        document.querySelector('.period-selector').setAttribute('data-periodo-activo', datos.titulo);

        // ===== GRÁFICO DE PLATILLOS MÁS VENDIDOS =====
        const ctxTop = document.getElementById('chartTopPlatillos').getContext('2d');
        chartTop = new Chart(ctxTop, {
            type: 'bar',
            data: {
                labels: datos.ventas.labels,
                datasets: [{
                    label: 'Unidades Vendidas',
                    data: datos.ventas.data,
                    backgroundColor: [
                        '#f5d487',
                        '#d4af37',
                        '#b8860b',
                        '#8b6914',
                        '#5e4b1a'
                    ],
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 800,
                    easing: 'easeInOutQuad'
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: `Top 5 - ${datos.titulo}`,
                        color: '#f5d487',
                        font: { size: 14 }
                    }
                },
                scales: {
                    y: {
                        grid: { color: 'rgba(245, 212, 135, 0.1)' },
                        ticks: { color: '#f5d487' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { 
                            color: '#f5d487',
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                }
            }
        });
        
        // ===== GRÁFICO DE VENTAS POR CATEGORÍA =====
        const ctxCategorias = document.getElementById('chartCategorias').getContext('2d');
        chartCategorias = new Chart(ctxCategorias, {
            type: 'doughnut',
            data: {
                labels: datos.categorias.labels,
                datasets: [{
                    data: datos.categorias.data,
                    backgroundColor: [
                        '#f5d487',
                        '#d4af37',
                        '#b8860b',
                        '#8b6914',
                        '#5e4b1a',
                        '#3d2e0d'
                    ],
                    borderColor: 'rgba(0,0,0,0.5)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 800,
                    easing: 'easeInOutQuad'
                },
                plugins: {
                    legend: {
                        labels: { color: '#f5d487' }
                    },
                    title: {
                        display: true,
                        text: `Distribución - ${datos.titulo}`,
                        color: '#f5d487',
                        font: { size: 14 }
                    }
                }
            }
        });
        
        // ===== GRÁFICO DE VENTAS POR DÍA/SEMANA =====
        const ctxDiarias = document.getElementById('chartVentasDiarias').getContext('2d');
        let tipoGrafico = 'line';
        let labelLinea = 'Ventas';
        
        if (periodo === 'day') {
            tipoGrafico = 'bar';
            labelLinea = 'Ventas por hora';
        }
        
        chartDiarias = new Chart(ctxDiarias, {
            type: tipoGrafico,
            data: {
                labels: datos.dias.labels,
                datasets: [{
                    label: labelLinea,
                    data: datos.dias.data,
                    borderColor: '#f5d487',
                    backgroundColor: periodo === 'day' ? '#f5d487' : 'rgba(245, 212, 135, 0.1)',
                    tension: 0.4,
                    fill: periodo !== 'day',
                    pointBackgroundColor: '#f5d487',
                    pointBorderColor: '#000',
                    borderRadius: periodo === 'day' ? 5 : 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 800,
                    easing: 'easeInOutQuad'
                },
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: periodo === 'day' ? 'Ventas por hora' : 
                              periodo === 'week' ? 'Ventas diarias' :
                              periodo === 'month' ? 'Ventas semanales' :
                              periodo === 'quarter' ? 'Ventas mensuales' : 'Ventas anuales',
                        color: '#f5d487',
                        font: { size: 14 }
                    }
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
        
        // ===== GRÁFICO DE DISTRIBUCIÓN DE PRECIOS =====
        const ctxPrecios = document.getElementById('chartPrecios').getContext('2d');
        chartPrecios = new Chart(ctxPrecios, {
            type: 'pie',
            data: {
                labels: datos.precios.labels,
                datasets: [{
                    data: datos.precios.data,
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
                animation: {
                    duration: 800,
                    easing: 'easeInOutQuad'
                },
                plugins: {
                    legend: {
                        labels: { color: '#f5d487' }
                    },
                    title: {
                        display: true,
                        text: `Rangos de precio - ${datos.titulo}`,
                        color: '#f5d487',
                        font: { size: 14 }
                    }
                }
            }
        });

        // Actualizar tendencias
        actualizarTendencias(periodo);
    }

    // ===== FUNCIÓN PARA ACTUALIZAR TENDENCIAS =====
    function actualizarTendencias(periodo) {
        const tendencias = {
            day: { total: '+5%', activos: '+2%', nuevos: '12', inactivos: '3' },
            week: { total: '+8%', activos: '+5%', nuevos: '28', inactivos: '5' },
            month: { total: '+12%', activos: '+8%', nuevos: '45', inactivos: '7' },
            quarter: { total: '+15%', activos: '+10%', nuevos: '120', inactivos: '12' },
            year: { total: '+25%', activos: '+18%', nuevos: '380', inactivos: '25' }
        };

        const t = tendencias[periodo];
        
        // Actualizar textos de tendencia
        document.querySelectorAll('.stat-card')[0].querySelector('.stat-trend').innerHTML = 
            `<i class="fas fa-arrow-up"></i> ${t.total} vs período anterior`;
        
        document.querySelectorAll('.stat-card')[3].querySelector('.stat-trend').innerHTML = 
            `${t.inactivos} del total`;
    }

    // ===== SELECTOR DE PERÍODO INTERACTIVO =====
    const periodBtns = document.querySelectorAll('.period-btn');
    periodBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remover clase active de todos
            periodBtns.forEach(b => b.classList.remove('active'));
            
            // Agregar clase active al botón clickeado
            this.classList.add('active');
            
            // Obtener período seleccionado
            const period = this.dataset.period;
            
            // Animar la transición
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
            
            // Actualizar todos los gráficos y datos
            crearGraficos(period);
            
            // Mostrar mensaje de actualización (opcional)
            mostrarNotificacion(`Mostrando datos de: ${datosPorPeriodo[period].titulo}`);
        });
    });

    // ===== FUNCIÓN PARA MOSTRAR NOTIFICACIONES =====
    function mostrarNotificacion(mensaje) {
        // Crear elemento de notificación si no existe
        let notificacion = document.querySelector('.data-notification');
        if (!notificacion) {
            notificacion = document.createElement('div');
            notificacion.className = 'data-notification';
            document.body.appendChild(notificacion);
            
            // Estilos para la notificación
            notificacion.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.9);
                color: #f5d487;
                padding: 12px 24px;
                border-radius: 8px;
                border: 1px solid #d4af37;
                box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
                z-index: 9999;
                font-weight: 500;
                transition: opacity 0.3s;
                opacity: 0;
            `;
        }
        
        // Mostrar notificación
        notificacion.textContent = `📊 ${mensaje}`;
        notificacion.style.opacity = '1';
        
        // Ocultar después de 2 segundos
        setTimeout(() => {
            notificacion.style.opacity = '0';
        }, 2000);
    }

    // ===== SIMULACIÓN DE DATOS EN TIEMPO REAL =====
    function simularDatosEnVivo() {
        // Actualizar cada 30 segundos con datos ligeramente diferentes
        setInterval(() => {
            const periodoActivo = document.querySelector('.period-btn.active').dataset.period;
            const datos = datosPorPeriodo[periodoActivo];
            
            // Modificar ligeramente los números para simular datos en vivo
            const variacion = Math.floor(Math.random() * 5) + 1;
            const nuevosIngresos = parseInt(datos.ingresosTotales.replace(/[$,]/g, '')) + (variacion * 1000);
            
            // Formatear de vuelta a moneda
            datos.ingresosTotales = '$' + nuevosIngresos.toLocaleString('es-CO');
            
            // Actualizar tarjeta de ingresos
            document.getElementById('ingresosTotales').textContent = datos.ingresosTotales;
            
            // Pequeña animación en la tarjeta
            const card = document.querySelector('.stat-card:first-child');
            card.style.transform = 'scale(1.02)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 200);
            
        }, 30000); // Cada 30 segundos
    }

    // ===== INICIALIZAR CON PERÍODO POR DEFECTO (MES) =====
    crearGraficos('month');
    
    // Iniciar simulación de datos en vivo
    simularDatosEnVivo();

    // ===== ANIMACIÓN DE ENTRADA =====
    const cards = document.querySelectorAll('.stat-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * index);
    });
});