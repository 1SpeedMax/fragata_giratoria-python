// Manejar error al cargar imagen - intenta cargar desde URL como fallback
function handleImageError(img) {
    const fallbackUrl = img.dataset.fallbackUrl;
    
    // Si hay una URL de fallback y aún no la hemos intentado
    if (fallbackUrl && !img.dataset.fallbackTried) {
        img.dataset.fallbackTried = 'true';
        img.src = fallbackUrl;
    } else {
        // Si no hay fallback o también falló, mostrar placeholder
        img.style.display = 'none';
        const placeholder = img.parentElement.querySelector('.imagen-placeholder');
        if (placeholder) {
            placeholder.style.display = 'flex';
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    
    const platilloCard = document.querySelector('.platillo-card');
    if (platilloCard) {
        platilloCard.style.opacity = '0';
        platilloCard.style.transform = 'translateY(20px)';
        setTimeout(() => {
            platilloCard.style.transition = 'all 0.5s ease';
            platilloCard.style.opacity = '1';
            platilloCard.style.transform = 'translateY(0)';
        }, 100);
    }
    
    const infoCards = document.querySelectorAll('.info-card');
    infoCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});