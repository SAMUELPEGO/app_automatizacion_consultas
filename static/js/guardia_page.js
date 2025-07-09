document.addEventListener('DOMContentLoaded', async () => {
  const cardSection = document.querySelector('.card-section');
  const inputBuscar = document.getElementById('inputBuscar');
  const btnBuscar = document.getElementById('btnBuscar');
  const btnRecargar = document.getElementById('btnRecargar');


  function recargarPagina() {
    location.reload();
  }

  async function renderizarTarjetas() {


    const get_procedimientos = await fetch("/obtener_procedimientos")
    const data = await get_procedimientos.json()
    console.log(data);
    if (data.procedimientos?.length) {
      if (inputBuscar.value.trim() !== '') {
        data.procedimientos = data.procedimientos.filter(procedimiento =>
          procedimiento.nombre.toLowerCase().includes(inputBuscar.value.toLowerCase()) ||
          procedimiento.perfil_username.toLowerCase().includes(inputBuscar.value.toLowerCase()) ||
          procedimiento.descripcion.toLowerCase().includes(inputBuscar.value.toLowerCase())
        );
      }
    }
    cardSection.innerHTML = '';
    data.procedimientos.forEach(procedimiento => {
      const card = document.createElement('div');
      card.classList.add('card');

      card.innerHTML = `
        <h3 class="nombre">${procedimiento.nombre}</h3>
        <p class="especialista"><strong>Especialista:</strong> ${procedimiento.perfil_username}</p>
       
        <div class="descripcion-container">
          <div class="accordion">
            <details>
              <summary>Descripción</summary>
              <div class="content">
                <p>${procedimiento.descripcion}</p>
              </div>
            </details>
          </div>
        </div>

        <div class="acciones">
          <button class="btn-especialista" onclick="abrirModalConsulta('${procedimiento.perfil_username}', '${procedimiento.id}','${procedimiento.nombre}')">
            Consultar al Especialista
          </button>
          <button class="btn-ver-archivo" onclick="verArchivo('${procedimiento.archivo || '#'}')">
            Ver Archivo
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

  window.abrirModalConsulta = (nombreEspecialista, procedimiento_id, procedimiento_nombre) => {
    console.log(nombreEspecialista, procedimiento_id, procedimiento_nombre);
    document.getElementById('nombreEspecialistaInput').value = nombreEspecialista;
    document.getElementById('procedimientoId').value = procedimiento_id;
    document.getElementById('procedimientoNombre').value = procedimiento_nombre;
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

  document.getElementById('modalCerrarConsulta').addEventListener('click', cerrarModalConsulta);
  document.getElementById('formularioConsulta').addEventListener('submit', enviarConsulta);
  btnBuscar.addEventListener('click', renderizarTarjetas);
  btnRecargar.addEventListener('click', recargarPagina);

  await renderizarTarjetas();
});