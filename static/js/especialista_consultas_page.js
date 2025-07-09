document.addEventListener('DOMContentLoaded', async () => {
  const cardSection = document.querySelector('.card-section');
  const formulario = document.getElementById('FormularioConsulta');
  const inputBuscar = document.getElementById('inputBuscar');
  const btnBuscar = document.getElementById('btnBuscar');
  const btnRecargar = document.getElementById('btnRecargar');

  formmatearFecha = (fecha) => {

    return fechaCreacion = new Date(fecha).toLocaleDateString('es-ES', {
      day: "2-digit", year: "numeric", month: "2-digit"
    });
  }

  function recargarPagina() {
    location.reload();
  }

  async function renderizarTarjetas() {
    const get_consultas = await fetch("/obtener_consultas_por_receptor")
    const data = await get_consultas.json()
    console.log(data);
    if (data.consultas?.length) {
      if (inputBuscar.value.trim() !== '') {
        data.consultas = data.consultas.filter(consulta =>
          formmatearFecha(consulta.creada_en).toLowerCase().includes(inputBuscar.value.toLowerCase()) ||
          consulta.emisor.toLowerCase().includes(inputBuscar.value.toLowerCase()) ||
          consulta.procedimiento_nombre.toLowerCase().includes(inputBuscar.value.toLowerCase()) ||
          consulta.estado.toLowerCase().includes(inputBuscar.value.toLowerCase()) ||
          consulta.contenido.toLowerCase().includes(inputBuscar.value.toLowerCase()) ||
          consulta.respuesta?.toLowerCase().includes(inputBuscar.value.toLowerCase())

        );
      }
    }
    cardSection.innerHTML = '';
    data.consultas.forEach(consulta => {
      const fechaCreacion = new Date(consulta.creada_en).toLocaleDateString('es-ES', {
        day: "2-digit", year: "numeric", month: "2-digit"
      });
      const card = document.createElement('div');
      card.classList.add('card');

      card.innerHTML = `
        <h3 class="nombre">creada el: ${fechaCreacion}</h3>
        <p class="especialista"><strong>Procedimiento:</strong> ${consulta.procedimiento_nombre}</p>
        <p class="especialista"><strong>Consulta de:</strong> ${consulta.emisor}</p>
        <p class="especialista"><strong>Estado:</strong> ${consulta.estado}</p>

       
        <div class="descripcion-container">
          <div class="accordion">
            <details>
              <summary>Mensaje</summary>
              <div class="content">
                <p>${consulta.contenido}</p>
              </div>
            </details>
          </div>
        </div>
       <div class="descripcion-container">
          <div class="accordion">
            <details>
              <summary>Tu respuesta</summary>
              <div class="content">
                <p>${!consulta.respuesta ? "<strong>No haz respondido</strong>" : consulta.respuesta}</p>
              </div>
            </details>
          </div>
        </div>

        <div class="acciones">
          <button class="btn-ver-archivo" onclick="abrirModalConsulta('${consulta.id}')" ${consulta.estado == "respondida" && "disabled"}>
            Responder
          </button>
        </div>
      `;

      cardSection.appendChild(card);
    });
  }


  window.abrirModalConsulta = (consultaId) => {
    document.getElementById('consultaIdInput').value = consultaId;

    document.getElementById('modalConsulta').style.display = 'block';
  };

  window.cerrarModalConsulta = () => {
    document.getElementById('modalConsulta').style.display = 'none';
    document.getElementById('formularioConsulta').reset();
  };

  window.enviarConsulta = async (e) => {
    e.preventDefault();
    const modal = document.getElementById('modalConsulta')
    const formData = new FormData(e.target);

    try {
      const response = await fetch('/actualizar_consulta', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      console.log(response);
      console.log(data);
      if (data.success) {
        alert('consulta respondida correctamente');
        await renderizarTarjetas();
        modal.style.display = 'none';
        e.target.reset();
      } else {
        alert(data.error || 'Error al responder consulta');
      }
    } catch (error) {
      console.log(error)
      alert('Error en la solicitud');
    }
    cerrarModalConsulta();
  };

  document.getElementById('modalCerrarConsulta').addEventListener('click', cerrarModalConsulta);
  document.getElementById('formularioConsulta').addEventListener('submit', enviarConsulta);
  btnBuscar.addEventListener('click', renderizarTarjetas);
  btnRecargar.addEventListener('click', recargarPagina);


  await renderizarTarjetas();
});