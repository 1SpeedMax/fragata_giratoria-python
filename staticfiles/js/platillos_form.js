// ===== PLATILLOS_FORM.JS =====

document.addEventListener('DOMContentLoaded', function() {
    
    // Animación de entrada
    const formCard = document.querySelector('.form-card');
    if (formCard) {
        formCard.style.opacity = '0';
        formCard.style.transform = 'translateY(20px)';
        setTimeout(() => {
            formCard.style.transition = 'all 0.5s ease';
            formCard.style.opacity = '1';
            formCard.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Validación de emojis
    const emojiInput = document.getElementById('emoji');
    if (emojiInput) {
        emojiInput.addEventListener('input', function() {
            // Permitir solo emojis y caracteres especiales
            this.value = this.value.replace(/[^🀀-🏿\u2000-\u3300]/g, '');
            if (this.value.length > 10) {
                this.value = this.value.slice(0, 10);
            }
        });
    }
    
    // Formateo de precio
    const precioInput = document.getElementById('precio');
    if (precioInput) {
        precioInput.addEventListener('blur', function() {
            let value = parseFloat(this.value);
            if (!isNaN(value)) {
                this.value = value.toFixed(2);
            }
        });
    }
    
    // Confirmación antes de enviar
    const form = document.getElementById('platilloForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            const nombre = document.getElementById('nombre')?.value.trim();
            const categoria = document.getElementById('categoria')?.value;
            const precio = document.getElementById('precio')?.value;
            
            if (!nombre) {
                e.preventDefault();
                alert('⚠️ Por favor ingresa el nombre del platillo');
                return false;
            }
            
            if (!categoria) {
                e.preventDefault();
                alert('⚠️ Por favor selecciona una categoría');
                return false;
            }
            
            if (!precio || parseFloat(precio) <= 0) {
                e.preventDefault();
                alert('⚠️ Por favor ingresa un precio válido');
                return false;
            }
        });
    }
    
    // Botón limpiar
    const clearBtn = document.querySelector('.btn-clear');
    if (clearBtn) {
        clearBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('¿Deseas limpiar todos los campos del formulario?')) {
                const form = document.getElementById('platilloForm');
                if (form) form.reset();
            }
        });
    }
});