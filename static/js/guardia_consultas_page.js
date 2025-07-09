document.addEventListener('DOMContentLoaded', async () => {
  const cardSection = document.querySelector('.card-section');
  const inputBuscar = document.getElementById('inputBuscar');
  const btnBuscar = document.getElementById('btnBuscar');
  const btnRecargar = document.getElementById('btnRecargar');

  function recargarPagina() {
    location.reload(); 
  }

  async function renderizarTarjetas() {
    const get_consultas = await fetch("/obtener_consultas_por_emisor")
    const data = await get_consultas.json()
    console.log(data);
    if (data.consultas?.length) {
      if (inputBuscar.value.trim() !== '') {
        data.consultas = data.consultas.filter(consulta =>
          consulta.procedimiento_nombre.toLowerCase().includes(inputBuscar.value.toLowerCase()) ||
          consulta.receptor.toLowerCase().includes(inputBuscar.value.toLowerCase()) ||
          consulta.estado.toLowerCase().includes(inputBuscar.value.toLowerCase()) ||
          consulta.contenido.toLowerCase().includes(inputBuscar.value.toLowerCase()) ||
          consulta.creada_en.toLowerCase().includes(inputBuscar.value.toLowerCase())
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
        <p class="especialista"><strong>Consultado a:</strong> ${consulta.receptor}</p>
        <p class="especialista"><strong>Estado:</strong> ${consulta.estado}</p>

       
        <div class="descripcion-container">
          <div class="accordion">
            <details>
              <summary>Tu mensaje</summary>
              <div class="content">
                <p>${consulta.contenido}</p>
              </div>
            </details>
          </div>
        </div>
        <div class="descripcion-container">
          <div class="accordion">
            <details>
              <summary>Respuesta del especialista</summary>
              <div class="content">
                <p>${!consulta.respuesta ? "<strong>El especialista no ha respondido</strong>" : consulta.respuesta}</p>
              </div>
            </details>
          </div>
        </div>

        <div class="acciones">
          <button class="btn-ver-archivo" onclick="eliminarConsulta('${consulta.id}')">
            Eliminar consulta
          </button>
        </div>
      `;

      cardSection.appendChild(card);
    });
  }

  window.verArchivo = (url) => {
    if (!url || url === '#') {
      alert('No hay archivo disponible.');
      return;
    }
    window.open(url, '_blank');
  };

  window.abrirModalConsulta = (nombreEspecialista, procedimiento_id) => {
    console.log(nombreEspecialista, procedimiento_id);
    document.getElementById('nombreEspecialistaInput').value = nombreEspecialista;
    document.getElementById('procedimientoId').value = procedimiento_id;
    document.getElementById('tituloModalEspecialista').textContent = `Consultar a ${nombreEspecialista}`;
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
      const response = await fetch('/crear_consulta', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      console.log(response);
      console.log(data);
      if (data.success) {
        alert('consulta creada correctamente');
        await renderizarTarjetas();
        modal.style.display = 'none';
        e.target.reset();
      } else {
        alert(data.error || 'Error al crear consulta');
      }
    } catch (error) {
      console.log(error)
      alert('Error en la solicitud');
    }
    cerrarModalConsulta();
  };

  window.eliminarConsulta = async (consultaId) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta consulta?')) {
      return;
    }
    const formData = new FormData()
    formData.append('consulta_id', consultaId);
    try {
      const response = await fetch(`/eliminar_consulta`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        alert('Consulta eliminada correctamente');
        await renderizarTarjetas();
      } else {
        alert(data.error || 'Error al eliminar la consulta');
      }
    } catch (error) {
      console.error('Error al eliminar la consulta:', error);
      alert('Ocurrió un error al eliminar la consulta.');
    }

  }
  document.getElementById('modalCerrarConsulta').addEventListener('click', cerrarModalConsulta);
  document.getElementById('formularioConsulta').addEventListener('submit', enviarConsulta);
  btnBuscar.addEventListener('click', renderizarTarjetas);
  btnRecargar.addEventListener('click', recargarPagina);

  await renderizarTarjetas();
});