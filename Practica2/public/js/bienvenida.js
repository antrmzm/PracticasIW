

const params = new URLSearchParams(window.location.search);
const nombre = params.get("nombre");

document.getElementById("mensaje").textContent =
    `Bienvenido,  ${nombre}`;