document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const responseMessage = document.getElementById('responseMessage');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(form);

        responseMessage.textContent = 'Procesando...';
        responseMessage.style.color = '#3399cc';

        fetch("/iniciar_sesion", {
            method: 'POST',
            body: formData,
            headers: {
                Accept: 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la conexión');
                }
                return response.json();
            })
            .then(data => {
                if (data.success === true) {
                    responseMessage.textContent = 'Redireccionando...';
                    responseMessage.style.color = 'green';
                    window.location.href = data.redirect_url

                } else {
                    responseMessage.textContent = 'Credenciales incorrectas o error del servidor.';
                    responseMessage.style.color = 'red';
                }
            })
            .catch(error => {
                responseMessage.textContent = 'Ocurrió un error al iniciar sesión.';
                responseMessage.style.color = 'red';
                console.error('Error:', error);
            });
    });
});