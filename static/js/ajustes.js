// static/js/ajustes.js

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Página de ajustes cargada');

    // ===== ELEMENTOS =====
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const saveButtons = document.querySelectorAll('.btn-save, .btn-backup, .btn-restore');
    const colorOptions = document.querySelectorAll('.color-option');
    const settingsInputs = document.querySelectorAll('.settings-input, .settings-select');
    const checkboxes = document.querySelectorAll('.checkbox-label input[type="checkbox"]');

    // ===== VARIABLES DE ESTADO =====
    let cambiosPendientes = false;
    let configuracionActual = {};

    // ===== FUNCIÓN PARA TABS =====
    window.openTab = function(event, tabName) {
        // Remover clase active de todos los tabs
        tabBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Ocultar todos los contenidos de tabs
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // Activar el tab clickeado
        event.currentTarget.classList.add('active');
        
        // Mostrar el contenido del tab seleccionado
        const activeTab = document.getElementById(tabName);
        if (activeTab) {
            activeTab.classList.add('active');
            
            // Animar entrada
            activeTab.style.animation = 'none';
            activeTab.offsetHeight; // Reflow
            activeTab.style.animation = 'fadeIn 0.5s ease';
        }
        
        console.log(`📋 Tab cambiado a: ${tabName}`);
    };

    // ===== GUARDAR CONFIGURACIÓN INICIAL =====
    function guardarConfiguracionInicial() {
        settingsInputs.forEach(input => {
            const id = input.id || input.name || Math.random().toString(36);
            configuracionActual[id] = input.value;
        });
        
        checkboxes.forEach(cb => {
            const id = cb.id || cb.name || Math.random().toString(36);
            configuracionActual[id] = cb.checked;
        });
        
        colorOptions.forEach((opt, index) => {
            if (opt.classList.contains('selected')) {
                configuracionActual['color'] = opt.dataset.color;
            }
        });
    }

    // ===== DETECTAR CAMBIOS =====
    function detectarCambios() {
        let cambios = false;
        
        settingsInputs.forEach(input => {
            const id = input.id || input.name || Math.random().toString(36);
            if (configuracionActual[id] !== input.value) {
                cambios = true;
            }
        });
        
        checkboxes.forEach(cb => {
            const id = cb.id || cb.name || Math.random().toString(36);
            if (configuracionActual[id] !== cb.checked) {
                cambios = true;
            }
        });
        
        colorOptions.forEach(opt => {
            if (opt.classList.contains('selected')) {
                if (configuracionActual['color'] !== opt.dataset.color) {
                    cambios = true;
                }
            }
        });
        
        cambiosPendientes = cambios;
        
        // Mostrar indicador visual de cambios
        const saveBtn = document.querySelector('.btn-save');
        if (saveBtn) {
            if (cambios) {
                saveBtn.style.background = 'linear-gradient(135deg, #f5d487, #ffd700)';
                saveBtn.style.boxShadow = '0 0 15px rgba(245,212,135,0.5)';
            } else {
                saveBtn.style.background = '';
                saveBtn.style.boxShadow = '';
            }
        }
    }

    // ===== EVENTOS PARA DETECTAR CAMBIOS =====
    settingsInputs.forEach(input => {
        input.addEventListener('input', detectarCambios);
        input.addEventListener('change', detectarCambios);
    });
    
    checkboxes.forEach(cb => {
        cb.addEventListener('change', detectarCambios);
    });

    // ===== SELECTOR DE COLORES =====
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            detectarCambios();
            
            // Vista previa del color
            document.documentElement.style.setProperty('--color-dorado', this.dataset.color);
            mostrarNotificacion(`🎨 Color cambiado a vista previa`, 'info');
        });
    });

    // ===== GUARDAR CONFIGURACIÓN =====
    saveButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (btn.classList.contains('btn-save') && !cambiosPendientes) {
                mostrarNotificacion('ℹ️ No hay cambios para guardar', 'info');
                return;
            }
            
            // Animación de guardado
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
            this.disabled = true;
            
            // Simular proceso de guardado
            setTimeout(() => {
                this.innerHTML = originalText;
                this.disabled = false;
                
                // Actualizar configuración actual
                guardarConfiguracionInicial();
                cambiosPendientes = false;
                
                // Restaurar estilo del botón
                this.style.background = '';
                this.style.boxShadow = '';
                
                // Mensaje según el botón
                if (btn.classList.contains('btn-save')) {
                    mostrarNotificacion('✅ Configuración guardada exitosamente', 'success');
                } else if (btn.classList.contains('btn-backup')) {
                    mostrarNotificacion('📦 Respaldo descargado', 'success');
                } else if (btn.classList.contains('btn-restore')) {
                    mostrarNotificacion('🔄 Respaldo restaurado', 'success');
                }
                
                console.log('💾 Configuración guardada:', configuracionActual);
            }, 1500);
        });
    });

    // ===== VALIDACIÓN DE CONTRASEÑAS =====
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    if (passwordInputs.length >= 3) {
        const [current, nuevo, confirm] = passwordInputs;
        
        function validarContraseñas() {
            if (nuevo.value.length > 0 && nuevo.value.length < 8) {
                mostrarError(nuevo, 'Mínimo 8 caracteres');
                return false;
            }
            
            if (nuevo.value !== confirm.value) {
                mostrarError(confirm, 'Las contraseñas no coinciden');
                return false;
            }
            
            limpiarError(nuevo);
            limpiarError(confirm);
            return true;
        }
        
        nuevo.addEventListener('input', validarContraseñas);
        confirm.addEventListener('input', validarContraseñas);
    }

    // ===== FUNCIONES AUXILIARES =====
    function mostrarError(input, mensaje) {
        input.style.borderColor = 'var(--color-rojo)';
        
        let errorMsg = input.parentElement.querySelector('.error-message');
        if (!errorMsg) {
            errorMsg = document.createElement('small');
            errorMsg.className = 'error-message';
            errorMsg.style.color = 'var(--color-rojo)';
            errorMsg.style.fontSize = '0.8rem';
            errorMsg.style.marginTop = '0.3rem';
            errorMsg.style.display = 'block';
            input.parentElement.appendChild(errorMsg);
        }
        errorMsg.textContent = mensaje;
    }

    function limpiarError(input) {
        input.style.borderColor = '';
        const errorMsg = input.parentElement.querySelector('.error-message');
        if (errorMsg) errorMsg.remove();
    }

    // ===== FUNCIÓN PARA NOTIFICACIONES =====
    function mostrarNotificacion(mensaje, tipo = 'info') {
        let notificacion = document.querySelector('.settings-notification');
        
        if (notificacion) {
            notificacion.remove();
        }

        notificacion = document.createElement('div');
        notificacion.className = `settings-notification ${tipo}`;
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
    const settingsCard = document.querySelector('.settings-card');
    if (settingsCard) {
        settingsCard.style.opacity = '0';
        settingsCard.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            settingsCard.style.transition = 'all 0.5s ease';
            settingsCard.style.opacity = '1';
            settingsCard.style.transform = 'translateY(0)';
        }, 200);
    }

    // ===== CONFIRMACIÓN DE SALIDA =====
    window.addEventListener('beforeunload', function(e) {
        if (cambiosPendientes) {
            e.preventDefault();
            e.returnValue = '¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.';
        }
    });

    // ===== INICIALIZAR =====
    guardarConfiguracionInicial();
    console.log('✅ Ajustes inicializados');

    // ===== ATALJO DE TECLADO =====
    document.addEventListener('keydown', function(e) {
        // Ctrl+S para guardar
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            const saveBtn = document.querySelector('.btn-save');
            if (saveBtn && !saveBtn.disabled) {
                saveBtn.click();
            }
        }
    });
});