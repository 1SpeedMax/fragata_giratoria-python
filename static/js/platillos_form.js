// ===== PLATILLOS_FORM.JS =====

document.addEventListener('DOMContentLoaded', function() {

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

    const precioInput = document.getElementById('precio');
    if (precioInput) {
        precioInput.addEventListener('blur', function() {
            const value = parseFloat(this.value);
            if (!isNaN(value)) {
                this.value = value.toFixed(2);
            }
        });
    }

    const imagenInput = document.getElementById('imagen_url');
    const previewWrap = document.getElementById('imagenPreviewWrap');
    const previewImg = document.getElementById('imagenPreview');

    function actualizarVistaPrevia() {
        if (!imagenInput || !previewWrap || !previewImg) {
            return;
        }
        const valor = imagenInput.value.trim();
        if (!valor) {
            previewWrap.hidden = true;
            return;
        }
        let src = valor;
        if (!valor.startsWith('http')) {
            const path = valor.replace(/^\/+/, '').replace(/^static\//, '');
            src = '/static/' + path;
        }
        previewImg.src = src;
        previewWrap.hidden = false;
        previewImg.onerror = function() {
            previewWrap.hidden = true;
        };
    }

    if (imagenInput) {
        imagenInput.addEventListener('input', actualizarVistaPrevia);
        imagenInput.addEventListener('change', actualizarVistaPrevia);
        actualizarVistaPrevia();
    }

    const form = document.getElementById('platilloForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            const nombre = document.getElementById('nombre')?.value.trim();
            const categoria = document.getElementById('categoria')?.value;
            const precio = document.getElementById('precio')?.value;

            if (!nombre) {
                e.preventDefault();
                alert('Por favor ingresa el nombre del platillo');
                return false;
            }
            if (!categoria) {
                e.preventDefault();
                alert('Por favor selecciona una categoría');
                return false;
            }
            if (!precio || parseFloat(precio) <= 0) {
                e.preventDefault();
                alert('Por favor ingresa un precio válido');
                return false;
            }
        });
    }

    const clearBtn = document.querySelector('.btn-clear');
    if (clearBtn) {
        clearBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('¿Deseas limpiar todos los campos del formulario?')) {
                form?.reset();
                if (previewWrap) {
                    previewWrap.hidden = true;
                }
            }
        });
    }
});
