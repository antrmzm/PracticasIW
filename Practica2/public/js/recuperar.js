document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("formRecuperar");
    const correoInput = document.getElementById("correo");
    const respuestaInput = document.getElementById("respuesta");
    const nuevaPasswordInput = document.getElementById("nuevaPassword");
    const confirmarPasswordInput = document.getElementById("confirmPassword");

    const grupoRespuesta = document.getElementById("grupoRespuesta");
    const grupoPassword = document.getElementById("grupoPassword");

    const preguntaTexto = document.getElementById("preguntaTexto");
    const resultado = document.getElementById("resultado");

    let etapa = 1;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        resultado.textContent = "";

        try {

            // =========================
            // ETAPA 1: VERIFICAR USUARIO
            // =========================
            if (etapa === 1) {
                const correo = correoInput.value;

                const res = await fetch("/recuperar/verificar", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ correo })
                });

                const data = await res.json();

                if (!res.ok) {
                    resultado.textContent = data.mensaje;
                    return;
                }

                // Mostrar pregunta
                preguntaTexto.textContent = data.pregunta;
                grupoRespuesta.style.display = "block";

                etapa = 2;
                return;
            }

            // =========================
            // ETAPA 2: VALIDAR RESPUESTA
            // =========================
            if (etapa === 2) {
                const correo = correoInput.value;
                const respuesta = respuestaInput.value;

                const res = await fetch("/recuperar/respuesta", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ correo, respuesta })
                });

                const data = await res.json();

                if (!res.ok) {
                    resultado.textContent = data.mensaje;
                    return;
                }

                // Mostrar cambio de contraseña
                grupoPassword.style.display = "block";

                etapa = 3;
                return;
            }

            // =========================
            // ETAPA 3: CAMBIAR PASSWORD
            // =========================
            if (etapa === 3) {
                const correo = correoInput.value;
                const nuevaPassword = nuevaPasswordInput.value;
                const confirmPassword = confirmarPasswordInput.value;

                if (nuevaPassword !== confirmPassword) {
                    resultado.textContent = "Las contraseñas no coinciden";
                    return;
                }

                const res = await fetch("/recuperar/password", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ correo, nuevaPassword })
                });

                const data = await res.json();

                if (!res.ok) {
                    resultado.textContent = data.mensaje;
                    return;
                }

                resultado.textContent = "Contraseña actualizada correctamente";

                // Reset opcional
                form.reset();
                grupoRespuesta.style.display = "none";
                grupoPassword.style.display = "none";
                preguntaTexto.textContent = "";
                etapa = 1;
            }

        } catch (error) {
            console.error(error);
            resultado.textContent = "Error en el servidor";
        }

        
    });

    

});