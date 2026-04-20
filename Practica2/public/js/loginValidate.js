document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loginForm");

    const modal = document.getElementById("modalError");
    const mensajeError = document.getElementById("mensajeError");
    const cerrarModal = document.getElementById("cerrarModal");

    cerrarModal.onclick = () => modal.style.display = "none";

    console.log("FORM:", form); 
    

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const datos = Object.fromEntries(new FormData(form));

        const res = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        if (res.redirected) {
            window.location.href = res.url;
            return;
        }

        const data = await res.json();

        if (!res.ok) {
        mensajeError.textContent = data.mensaje;
        modal.style.display = "block";
        }
    });

});