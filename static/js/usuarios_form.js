// static/js/usuarios_form.js

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Formulario de usuarios cargado');

    // ===== ELEMENTOS =====
    const form = document.getElementById('usuarioForm');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm_password');
    const nuevaPassword = document.getElementById('nueva_password');
    const confirmNuevaPassword = document.getElementById('confirm_nueva_password');
    const nombreUsuario = document.getElementById('nombre_usuario');
    const email = document.getElementById('email');
    const submitBtn = document.getElementById('btnSubmit');
    const steps = document.querySelectorAll('.step');
    const progressFill = document.querySelector('.progress-fill');
    const strengthBar = document.querySelector('.strength-bar');
    const matchIcon = document.getElementById('matchIcon');
    const matchMessage = document.getElementById('matchMessage');

    // ===== VALIDACIONES EN TIEMPO REAL =====
    if (nombreUsuario) {
        nombreUsuario.addEventListener('input', function() {
            const value = this.value.trim();
            const feedback = this.closest('.form-group').querySelector('.input-feedback');
            
            if (value.length < 3) {
                showError(this, 'Mínimo 3 caracteres');
                updateProgress(1, false);
            } else if (value.length > 100) {
                showError(this, 'Máximo 100 caracteres');
                updateProgress(1, false);
            } else {
                showSuccess(this);
                updateProgress(1, true);
            }
        });
    }

    if (email) {
        email.addEventListener('input', function() {
            const value = this.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!emailRegex.test(value)) {
                showError(this, 'Email inválido');
                updateProgress(1, false);
            } else {
                showSuccess(this);
                updateProgress(1, true);
            }
        });
    }

    // ===== VALIDACIÓN DE CONTRASEÑAS (CREAR) =====
    if (password && confirmPassword) {
        password.addEventListener('input', function() {
            checkPasswordStrength(this.value);
            checkPasswordsMatch();
        });
        
        confirmPassword.addEventListener('input', checkPasswordsMatch);
    }

    // ===== VALIDACIÓN DE CONTRASEÑAS (EDITAR) =====
    if (nuevaPassword && confirmNuevaPassword) {
        nuevaPassword.addEventListener('input', function() {
            if (this.value.length > 0) {
                checkPasswordStrength(this.value);
                checkNewPasswordsMatch();
                updateProgress(2, this.value.length >= 6);
            } else {
                resetPasswordValidation();
            }
        });
        
        confirmNuevaPassword.addEventListener('input', checkNewPasswordsMatch);
    }

    function checkPasswordStrength(pwd) {
        if (!strengthBar) return;
        
        let strength = 0;
        
        // Longitud
        if (pwd.length >= 6) strength += 25;
        if (pwd.length >= 8) strength += 25;
        
        // Mayúsculas
        if (/[A-Z]/.test(pwd)) strength += 15;
        
        // Números
        if (/[0-9]/.test(pwd)) strength += 15;
        
        // Caracteres especiales
        if (/[^A-Za-z0-9]/.test(pwd)) strength += 20;
        
        strengthBar.style.width = strength + '%';
        
        if (strength < 30) {
            strengthBar.style.background = '#ef4444';
        } else if (strength < 60) {
            strengthBar.style.background = '#f59e0b';
        } else {
            strengthBar.style.background = '#10b981';
        }
    }

    function checkPasswordsMatch() {
        if (!password || !confirmPassword) return;
        
        if (confirmPassword.value.length > 0) {
            if (password.value === confirmPassword.value) {
                showSuccess(confirmPassword);
                if (matchIcon && matchMessage) {
                    matchIcon.className = 'fas fa-check';
                    matchIcon.style.color = '#10b981';
                    matchMessage.textContent = 'Las contraseñas coinciden';
                    matchMessage.style.color = '#10b981';
                }
                updateProgress(2, true);
            } else {
                showError(confirmPassword, 'Las contraseñas no coinciden');
                if (matchIcon && matchMessage) {
                    matchIcon.className = 'fas fa-times';
                    matchIcon.style.color = '#ef4444';
                    matchMessage.textContent = 'Las contraseñas no coinciden';
                    matchMessage.style.color = '#ef4444';
                }
                updateProgress(2, false);
            }
        }
    }

    function checkNewPasswordsMatch() {
        if (!nuevaPassword || !confirmNuevaPassword) return;
        
        if (confirmNuevaPassword.value.length > 0) {
            if (nuevaPassword.value === confirmNuevaPassword.value) {
                showSuccess(confirmNuevaPassword);
                updateProgress(2, true);
            } else {
                showError(confirmNuevaPassword, 'Las contraseñas no coinciden');
                updateProgress(2, false);
            }
        }
    }

    function resetPasswordValidation() {
        if (strengthBar) strengthBar.style.width = '0';
        updateProgress(2, true); // Password opcional, siempre válido si está vacío
    }

    // ===== FUNCIONES DE UI =====
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.add('error');
        formGroup.classList.remove('success');
        
        let feedback = formGroup.querySelector('.input-feedback');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.className = 'input-feedback';
            formGroup.appendChild(feedback);
        }
        feedback.textContent = message;
        feedback.style.color = '#ef4444';
        
        input.style.borderColor = '#ef4444';
    }

    function showSuccess(input) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.remove('error');
        formGroup.classList.add('success');
        
        const feedback = formGroup.querySelector('.input-feedback');
        if (feedback) feedback.remove();
        
        input.style.borderColor = '#10b981';
    }

    function updateProgress(section, isValid) {
        if (!steps || !progressFill) return;
        
        let completed = 0;
        
        // Sección 1: Nombre y email
        if (nombreUsuario && nombreUsuario.value.length >= 3) completed++;
        if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) completed++;
        
        // Sección 2: Contraseñas (solo si es creación o si se está cambiando)
        if (section >= 2) {
            if (password && confirmPassword) {
                if (password.value.length >= 6 && password.value === confirmPassword.value) completed++;
            } else if (nuevaPassword) {
                if (nuevaPassword.value.length === 0 || 
                    (nuevaPassword.value.length >= 6 && nuevaPassword.value === confirmNuevaPassword.value)) {
                    completed++;
                }
            } else {
                completed++; // Si no hay campo de contraseña, se considera válido
            }
        }
        
        // Sección 3: Rol y estado (siempre válidos por tener selects)
        if (section >= 3) completed++;
        
        const totalSections = 3;
        const progress = (completed / totalSections) * 100;
        progressFill.style.width = progress + '%';
        
        // Actualizar steps
        steps.forEach((step, index) => {
            if (index < completed) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    // ===== TOGGLE CONTRASEÑA =====
    window.togglePassword = function(inputId) {
        const input = document.getElementById(inputId);
        const type = input.type === 'password' ? 'text' : 'password';
        input.type = type;
        
        const button = input.nextElementSibling;
        const icon = button.querySelector('i');
        icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
    };

    // ===== VALIDACIÓN AL ENVIAR =====
    if (form) {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            
            // Validar nombre de usuario
            if (nombreUsuario && nombreUsuario.value.trim().length < 3) {
                showError(nombreUsuario, 'Mínimo 3 caracteres');
                isValid = false;
            }
            
            // Validar email
            if (email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email.value.trim())) {
                    showError(email, 'Email inválido');
                    isValid = false;
                }
            }
            
            // Validar contraseñas (crear)
            if (password && confirmPassword) {
                if (password.value.length < 6) {
                    showError(password, 'Mínimo 6 caracteres');
                    isValid = false;
                }
                if (password.value !== confirmPassword.value) {
                    showError(confirmPassword, 'Las contraseñas no coinciden');
                    isValid = false;
                }
            }
            
            // Validar contraseñas nuevas (editar)
            if (nuevaPassword && nuevaPassword.value.length > 0) {
                if (nuevaPassword.value.length < 6) {
                    showError(nuevaPassword, 'Mínimo 6 caracteres');
                    isValid = false;
                }
                if (nuevaPassword.value !== confirmNuevaPassword.value) {
                    showError(confirmNuevaPassword, 'Las contraseñas no coinciden');
                    isValid = false;
                }
            }
            
            if (!isValid) {
                e.preventDefault();
                showNotification('❌ Por favor corrige los errores', 'error');
                
                // Scroll al primer error
                const firstError = document.querySelector('.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } else {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
                submitBtn.disabled = true;
            }
        });
    }

    // ===== NOTIFICACIÓN =====
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #34d399)' : 
                        type === 'error' ? 'linear-gradient(135deg, #ef4444, #f87171)' : 
                        'linear-gradient(135deg, #f5d487, #d4af37)'};
            color: ${type === 'success' ? 'white' : type === 'error' ? 'white' : '#1a1a1a'};
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 0.8rem;
            animation: slideInRight 0.3s ease-out;
            border-left: 4px solid rgba(255, 255, 255, 0.5);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // ===== ANIMACIÓN DE ENTRADA =====
    const formCard = document.querySelector('.form-card');
    if (formCard) {
        formCard.style.opacity = '0';
        formCard.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            formCard.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            formCard.style.opacity = '1';
            formCard.style.transform = 'translateY(0)';
        }, 100);
    }

    // ===== KEYFRAMES PARA NOTIFICACIONES =====
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
    `;
    document.head.appendChild(style);
});