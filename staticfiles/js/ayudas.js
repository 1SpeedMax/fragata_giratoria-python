// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    inicializarBusqueda();
    inicializarCategorias();
    inicializarDestacados();
    inicializarFAQ();
    inicializarSoporte();
    inicializarChat();
    inicializarModales();
});

// ===== SISTEMA DE NOTIFICACIONES =====
function mostrarNotificacion(mensaje, tipo = 'info', duracion = 3000) {
    const notification = document.getElementById('notification');
    notification.textContent = mensaje;
    notification.className = `notification ${tipo} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, duracion);
}

// ===== BASE DE DATOS DE ARTÍCULOS =====
const baseDatosArticulos = [
    {
        id: 'primeros-pasos',
        titulo: 'Primeros pasos en el sistema',
        categoria: 'general',
        contenido: `
            <div class="article-content">
                <h2>Bienvenido a La Fragata Giratoria</h2>
                
                <div class="article-section">
                    <h3><i class="fas fa-map-signs"></i> Navegación básica</h3>
                    <p>El sistema está organizado en módulos accesibles desde el menú lateral:</p>
                    <ul>
                        <li><strong>Dashboard:</strong> Vista general del negocio</li>
                        <li><strong>Pedidos:</strong> Gestión de pedidos de clientes</li>
                        <li><strong>Productos:</strong> Inventario y catálogo</li>
                        <li><strong>Compras:</strong> Control de compras a proveedores</li>
                        <li><strong>Usuarios:</strong> Administración de usuarios</li>
                        <li><strong>Reportes:</strong> Estadísticas y exportación</li>
                    </ul>
                </div>

                <div class="tip-box">
                    <i class="fas fa-lightbulb"></i>
                    <p><strong>Tip:</strong> Usa la barra de búsqueda en cada módulo para encontrar rápidamente lo que necesitas.</p>
                </div>
            </div>
        `
    },
    {
        id: 'exportar-datos',
        titulo: 'Cómo exportar datos a Excel y PDF',
        categoria: 'reportes',
        contenido: `
            <div class="article-content">
                <h2>Exportación de datos</h2>
                
                <div class="article-section">
                    <h3><i class="fas fa-file-excel"></i> Exportar a Excel</h3>
                    <ol>
                        <li>Ve al módulo que deseas exportar</li>
                        <li>En la barra de acciones, busca el botón <span class="badge excel">Excel</span></li>
                        <li>Haz clic y el archivo se descargará automáticamente</li>
                    </ol>
                </div>

                <div class="article-section">
                    <h3><i class="fas fa-file-pdf"></i> Exportar a PDF</h3>
                    <ol>
                        <li>Sigue los mismos pasos que para Excel</li>
                        <li>Haz clic en el botón <span class="badge">PDF</span></li>
                    </ol>
                </div>

                <div class="tip-box">
                    <i class="fas fa-lightbulb"></i>
                    <p><strong>Tip:</strong> Puedes aplicar filtros antes de exportar para obtener solo los datos que necesitas.</p>
                </div>
            </div>
        `
    },
    {
        id: 'gestion-usuarios',
        titulo: 'Gestión de usuarios y permisos',
        categoria: 'usuarios',
        contenido: `
            <div class="article-content">
                <h2>Gestión de usuarios</h2>
                
                <div class="article-section">
                    <h3><i class="fas fa-user-plus"></i> Crear usuario</h3>
                    <ol>
                        <li>Ve a <strong>Usuarios</strong> en el menú</li>
                        <li>Haz clic en <strong>Nuevo Usuario</strong></li>
                        <li>Completa los datos del usuario</li>
                        <li>Asigna un rol:
                            <ul>
                                <li><strong>Administrador:</strong> Acceso completo</li>
                                <li><strong>Mesero:</strong> Tomar pedidos</li>
                                <li><strong>Cocinero:</strong> Cocina</li>
                                <li><strong>Bodeguero:</strong> Inventario</li>
                            </ul>
                        </li>
                    </ol>
                </div>

                <div class="warning">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Solo los administradores pueden crear y modificar usuarios.</p>
                </div>
            </div>
        `
    },
    {
        id: 'crear-producto',
        titulo: 'Cómo crear un producto',
        categoria: 'productos',
        contenido: `
            <div class="article-content">
                <h2>Crear un producto</h2>
                <div class="article-section">
                    <h3><i class="fas fa-box"></i> Pasos</h3>
                    <ol>
                        <li>Ve a <strong>Productos</strong></li>
                        <li>Haz clic en <strong>Nuevo Producto</strong></li>
                        <li>Completa nombre, precio, stock y categoría</li>
                        <li>Haz clic en <strong>Guardar</strong></li>
                    </ol>
                </div>
            </div>
        `
    },
    {
        id: 'crear-pedido',
        titulo: 'Cómo crear un pedido',
        categoria: 'pedidos',
        contenido: `
            <div class="article-content">
                <h2>Crear un pedido</h2>
                <div class="article-section">
                    <h3><i class="fas fa-clipboard-list"></i> Pasos</h3>
                    <ol>
                        <li>Ve a <strong>Pedidos</strong></li>
                        <li>Selecciona <strong>Nuevo Pedido</strong></li>
                        <li>Elige el cliente</li>
                        <li>Agrega productos</li>
                        <li>Confirma el pedido</li>
                    </ol>
                </div>
            </div>
        `
    }
];

// ===== FUNCIONES DE BÚSQUEDA =====
function inicializarBusqueda() {
    const searchInput = document.getElementById('helpSearch');
    const searchBtn = document.getElementById('searchBtn');
    const searchResults = document.getElementById('searchResults');
    const popularTags = document.querySelectorAll('.tag-btn');

    function realizarBusqueda() {
        const termino = searchInput.value.toLowerCase().trim();
        
        if (termino.length < 2) {
            searchResults.classList.remove('active');
            return;
        }

        const resultados = baseDatosArticulos.filter(articulo => 
            articulo.titulo.toLowerCase().includes(termino) ||
            articulo.categoria.toLowerCase().includes(termino)
        );

        if (resultados.length > 0) {
            let html = '';
            resultados.forEach(articulo => {
                html += `
                    <div class="search-result-item" onclick="mostrarArticulo('${articulo.id}')">
                        <div class="search-result-icon">
                            <i class="fas ${articulo.categoria === 'productos' ? 'fa-box' : 
                                              articulo.categoria === 'pedidos' ? 'fa-clipboard-list' : 
                                              articulo.categoria === 'usuarios' ? 'fa-users' : 
                                              articulo.categoria === 'reportes' ? 'fa-chart-line' : 
                                              'fa-file-alt'}"></i>
                        </div>
                        <div class="search-result-content">
                            <h4>${articulo.titulo}</h4>
                            <p>${articulo.categoria}</p>
                        </div>
                    </div>
                `;
            });
            searchResults.innerHTML = html;
            searchResults.classList.add('active');
        } else {
            searchResults.innerHTML = `
                <div class="search-result-item no-results">
                    <i class="fas fa-search"></i>
                    <p>No se encontraron resultados para "${termino}"</p>
                </div>
            `;
            searchResults.classList.add('active');
        }
    }

    searchInput.addEventListener('input', realizarBusqueda);
    searchBtn.addEventListener('click', realizarBusqueda);

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            realizarBusqueda();
        }
    });

    popularTags.forEach(tag => {
        tag.addEventListener('click', () => {
            searchInput.value = tag.dataset.tag;
            realizarBusqueda();
        });
    });

    document.addEventListener('click', (e) => {
        if (!searchResults.contains(e.target) && !searchInput.contains(e.target) && !searchBtn.contains(e.target)) {
            searchResults.classList.remove('active');
        }
    });
}

// ===== FUNCIONES DE CATEGORÍAS =====
function inicializarCategorias() {
    const categorias = {
        productos: {
            titulo: 'Productos',
            icono: 'fa-box',
            articulos: baseDatosArticulos.filter(a => a.categoria === 'productos')
        },
        pedidos: {
            titulo: 'Pedidos',
            icono: 'fa-clipboard-list',
            articulos: baseDatosArticulos.filter(a => a.categoria === 'pedidos')
        },
        usuarios: {
            titulo: 'Usuarios',
            icono: 'fa-users',
            articulos: baseDatosArticulos.filter(a => a.categoria === 'usuarios')
        },
        reportes: {
            titulo: 'Reportes',
            icono: 'fa-chart-line',
            articulos: baseDatosArticulos.filter(a => a.categoria === 'reportes')
        }
    };

    document.querySelectorAll('.categoria-card').forEach(card => {
        card.addEventListener('click', () => {
            const categoria = card.dataset.category;
            const data = categorias[categoria];
            
            if (data) {
                let html = '';
                data.articulos.forEach(articulo => {
                    html += `
                        <div class="category-article" onclick="mostrarArticulo('${articulo.id}')">
                            <h4><i class="fas ${data.icono}"></i> ${articulo.titulo}</h4>
                            <p>${articulo.contenido.replace(/<[^>]*>/g, '').substring(0, 150)}...</p>
                            <span class="categoria-link">Leer más <i class="fas fa-arrow-right"></i></span>
                        </div>
                    `;
                });

                if (data.articulos.length === 0) {
                    html = '<p class="no-results">No hay artículos disponibles en esta categoría.</p>';
                }

                abrirModalCategoria(`${data.titulo}`, html);
            }
        });
    });
}

// ===== FUNCIONES DE DESTACADOS =====
function inicializarDestacados() {
    document.querySelectorAll('.destacado-card').forEach(card => {
        card.addEventListener('click', () => {
            const articleId = card.dataset.article;
            mostrarArticulo(articleId);
        });
    });
}

// ===== FUNCIONES DE FAQ =====
function inicializarFAQ() {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.closest('.faq-item');
            faqItem.classList.toggle('active');
            
            // Cerrar otros FAQs
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem && item.classList.contains('active')) {
                    item.classList.remove('active');
                }
            });
        });
    });
}

// ===== FUNCIONES DE SOPORTE =====
function inicializarSoporte() {
    const emailBtn = document.getElementById('emailSupport');
    const phoneBtn = document.getElementById('phoneSupport');
    const openChatBtn = document.getElementById('openChatBtn');

    emailBtn.addEventListener('click', (e) => {
        e.preventDefault();
        navigator.clipboard.writeText('soporte@fragata.com');
        mostrarNotificacion('Correo copiado al portapapeles', 'success');
    });

    phoneBtn.addEventListener('click', (e) => {
        e.preventDefault();
        navigator.clipboard.writeText('+57 300 123 4567');
        mostrarNotificacion('Teléfono copiado al portapapeles', 'success');
    });

    openChatBtn.addEventListener('click', () => {
        abrirChat();
    });
}

// ===== FUNCIONES DE CHAT =====
let chatActivo = false;
let mensajes = [
    { tipo: 'agent', texto: '¡Hola! Soy el asistente virtual. ¿En qué puedo ayudarte?', tiempo: 'Ahora' }
];

function inicializarChat() {
    const chatWidget = document.getElementById('chatWidget');
    const floatingBtn = document.getElementById('floatingHelpBtn');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const sendBtn = document.getElementById('sendMessageBtn');
    const chatInput = document.getElementById('chatInput');
    const chatBody = document.getElementById('chatBody');

    floatingBtn.addEventListener('click', toggleChat);
    closeChatBtn.addEventListener('click', cerrarChat);

    sendBtn.addEventListener('click', enviarMensaje);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            enviarMensaje();
        }
    });

    function enviarMensaje() {
        const mensaje = chatInput.value.trim();
        if (!mensaje) return;

        // Mensaje del usuario
        agregarMensaje('user', mensaje);
        chatInput.value = '';

        // Simular respuesta
        setTimeout(() => {
            const respuestas = [
                'Entiendo, déjame verificar eso por ti.',
                '¡Claro! Te puedo ayudar con eso.',
                'Un momento mientras reviso la información.',
                'Gracias por tu mensaje. Un agente te responderá pronto.'
            ];
            const respuesta = respuestas[Math.floor(Math.random() * respuestas.length)];
            agregarMensaje('agent', respuesta);
        }, 1000);
    }

    function agregarMensaje(tipo, texto) {
        const tiempo = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const mensajeDiv = document.createElement('div');
        mensajeDiv.className = `chat-message ${tipo}`;
        mensajeDiv.innerHTML = `
            <div class="message-content">${texto}</div>
            <span class="message-time">${tiempo}</span>
        `;
        chatBody.appendChild(mensajeDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }
}

function toggleChat() {
    const chatWidget = document.getElementById('chatWidget');
    chatWidget.classList.toggle('active');
}

function abrirChat() {
    document.getElementById('chatWidget').classList.add('active');
}

function cerrarChat() {
    document.getElementById('chatWidget').classList.remove('active');
}

// ===== FUNCIONES DE MODALES =====
function inicializarModales() {
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').classList.remove('active');
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
}

function abrirModalCategoria(titulo, contenido) {
    const modal = document.getElementById('categoryModal');
    document.getElementById('modalCategoryTitle').innerHTML = `<i class="fas fa-folder"></i> ${titulo}`;
    document.getElementById('modalCategoryBody').innerHTML = contenido;
    modal.classList.add('active');
}

function abrirModalArticulo(titulo, contenido) {
    const modal = document.getElementById('articleModal');
    document.getElementById('modalArticleTitle').innerHTML = titulo;
    document.getElementById('modalArticleBody').innerHTML = contenido;
    modal.classList.add('active');
}

// ===== FUNCIÓN GLOBAL PARA MOSTRAR ARTÍCULOS =====
window.mostrarArticulo = function(articuloId) {
    const articulo = baseDatosArticulos.find(a => a.id === articuloId);
    if (articulo) {
        abrirModalArticulo(articulo.titulo, articulo.contenido);
    }
};

// ===== CIERRE DE MODALES CON ESC =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }
});