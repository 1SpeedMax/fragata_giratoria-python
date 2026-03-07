document.addEventListener("DOMContentLoaded", () => {

const form = document.getElementById("formCompra");

form.addEventListener("submit", function(e){

const descripcion = document.getElementById("descripcion").value.trim();
const total = parseFloat(document.getElementById("total").value);
const fecha = document.getElementById("fecha").value;

const hoy = new Date().toISOString().split("T")[0];

if(descripcion.length < 10){
alert("La descripción debe tener al menos 10 caracteres.");
e.preventDefault();
return;
}

if(total <= 0){
alert("El total de la compra debe ser mayor a 0.");
e.preventDefault();
return;
}

if(total > 10000000){
alert("El total ingresado es demasiado alto.");
e.preventDefault();
return;
}

if(fecha > hoy){
alert("La fecha de la compra no puede ser futura.");
e.preventDefault();
return;
}

});

});