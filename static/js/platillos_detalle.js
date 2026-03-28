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