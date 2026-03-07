document.addEventListener("DOMContentLoaded", function() {

    const mensajes = document.querySelectorAll(".mensaje-exito");

    mensajes.forEach(function(mensaje) {

        setTimeout(function() {
            mensaje.classList.add("ocultar");

            setTimeout(() => {
                mensaje.remove();
            }, 500);

        }, 3000);

    });

});