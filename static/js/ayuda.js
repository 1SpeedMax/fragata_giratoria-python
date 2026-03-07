// static/js/ayuda.js

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Centro de ayuda cargado');

    // ===== ELEMENTOS =====
    const searchInput = document.getElementById('helpSearch');
    const faqItems = document.querySelectorAll('.faq-item');
    const categoriaCards = document.querySelectorAll('.categoria-card');
    const articulosCards = document.querySelectorAll('.articulo-card');

    // ===== BÚSQUEDA EN TIEMPO REAL =====
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const termino = e.target.value.toLowerCase().trim();
            
            // Buscar en categorías
            categoriaCards.forEach(card => {
                const texto = card.textContent.toLowerCase();
                if (termino === '' || texto.includes(termino)) {
                    card.style.display = 'block';
                    // Animación de aparición
                    card.style.animation = 'fadeIn 0.3s ease';
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Buscar en artículos destacados
            articulosCards.forEach(art => {
                const texto = art.textContent.toLowerCase();
                if (termino === '' || texto.includes(termino)) {
                    art.style.display = 'flex';
                    art.style.animation = 'fadeIn 0.3s ease';
                } else {
                    art.style.display = 'none';
                }
            });
            
            // Buscar en FAQs
            faqItems.forEach(faq => {
                const texto = faq.textContent.toLowerCase();
                if (termino === '' || texto.includes(termino)) {
                    faq.style.display = 'block';
                    faq.style.animation = 'fadeIn 0.3s ease';
                } else {
                    faq.style.display = 'none';
                }
            });

            // Mostrar notificación de resultados
            const resultados = contarResultados();
            if (termino !== '') {
                mostrarNotificacion(`🔍 ${resultados} resultados encontrados`, 'info');
            }
        });
    }

    // ===== FUNCIÓN PARA CONTAR RESULTADOS =====
    function contarResultados() {
        let total = 0;
        categoriaCards.forEach(c => { if (c.style.display !== 'none') total++; });
        articulosCards.forEach(a => { if (a.style.display !== 'none') total++; });
        faqItems.forEach(f => { if (f.style.display !== 'none') total++; });
        return total;
    }

    // ===== FUNCIÓN PARA TOGGLE DE FAQS =====
    window.toggleFaq = function(element) {
        const faqItem = element.closest('.faq-item');
        
        // Cerrar otros FAQs abiertos
        faqItems.forEach(item => {
            if (item !== faqItem && item.classList.contains('active')) {
                item.classList.remove('active');
            }
        });
        
        // Toggle el actual
        faqItem.classList.toggle('active');
    };

    // ===== CLICK EN CATEGORÍAS =====
    categoriaCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // No hacer nada si el click fue en un enlace
            if (e.target.tagName === 'A') return;
            
            const categoria = this.querySelector('h3')?.textContent || '';
            mostrarNotificacion(`📂 Categoría: ${categoria}`, 'info');
            
            // Aquí podrías redirigir o mostrar artículos relacionados
            // window.location.href = `?categoria=${categoria}`;
        });
    });

    // ===== CLICK EN ARTÍCULOS =====
    document.querySelectorAll('.leer-mas').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const articulo = this.closest('.articulo-card').querySelector('h3')?.textContent || '';
            mostrarNotificacion(`📖 Leyendo: ${articulo}`, 'info');
            
            // Aquí podrías abrir un modal o redirigir
            // window.location.href = this.href;
        });
    });

    // ===== CLICK EN CONTACTOS =====
    document.querySelectorAll('.contacto-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tipo = this.querySelector('i').className.includes('envelope') ? 'email' : 'teléfono';
            mostrarNotificacion(`✉️ Contactando por ${tipo}...`, 'success');
            
            // Simular apertura de cliente de correo/teléfono
            if (tipo === 'email') {
                window.location.href = this.href;
            } else {
                window.location.href = this.href;
            }
        });
    });

    // ===== FUNCIÓN PARA MOSTRAR NOTIFICACIONES =====
    function mostrarNotificacion(mensaje, tipo = 'info') {
        let notificacion = document.querySelector('.help-notification');
        
        if (notificacion) {
            notificacion.remove();
        }

        notificacion = document.createElement('div');
        notificacion.className = `help-notification ${tipo}`;
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

    // ===== ANIMACIÓN DE ENTRADA =====
    const elementos = [
        ...categoriaCards,
        ...articulosCards,
        ...faqItems,
        document.querySelector('.soporte-card')
    ];
    
    elementos.forEach((el, index) => {
        if (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                el.style.transition = 'all 0.5s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 100 * (index % 4));
        }
    });

    // ===== INICIALIZAR FAQS (cerrados por defecto) =====
    faqItems.forEach(item => {
        item.classList.remove('active');
    });

    // ===== ATALJO DE TECLADO =====
    document.addEventListener('keydown', function(e) {
        // Ctrl+F para enfocar búsqueda
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }
        // Escape para limpiar búsqueda
        if (e.key === 'Escape' && searchInput && searchInput.value) {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
            mostrarNotificacion('🧹 Búsqueda limpiada', 'info');
        }
    });
});