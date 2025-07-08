document.addEventListener('DOMContentLoaded', async() => {
  const cardSection = document.querySelector('.card-section');

  const procedimientos = [
    {
      id: 1,
      nombre: "Cirugía de Vesícula",
      descripcion: "Intervención quirúrgica para extraer la vesícula biliar.",
      archivo: "https://example.com/archivos/vesicula.pdf ",
      especialista: "Dr. Carlos Pérez"
    },
    {
      id: 2,
      nombre: "Endoscopia Digestiva",
      descripcion: "Examen mediante endoscopio para revisar tracto digestivo.",
      archivo: "https://example.com/archivos/endoscopia.pdf ",
      especialista: "Dra. Ana López"
    }
  ];

  async function renderizarTarjetas() {
    const get_procedimientos = await fetch("/obtener_procedimientos")
    const data = await get_procedimientos.json()
    console.log(data);
     if (!data.procedimientos?.length) {

      cardSection.innerHTML = '';
    }
    cardSection.innerHTML = '';
    data.procedimientos.forEach(procedimiento => {
      const card = document.createElement('div');
      card.classList.add('card');

      card.innerHTML = `
        <h3 class="nombre">${procedimiento.nombre}</h3>
        <p class="especialista">Realizado por: ${procedimiento.perfil_username}</p>

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
          <button class="btn-especialista" onclick="abrirModalConsulta('${procedimiento.especialista}')">
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

  window.abrirModalConsulta = (nombreEspecialista) => {
    document.getElementById('nombreEspecialistaInput').value = nombreEspecialista;
    document.getElementById('tituloModalEspecialista').textContent = `Consultar a ${nombreEspecialista}`;
    document.getElementById('modalConsulta').style.display = 'block';
  };

  window.cerrarModalConsulta = () => {
    document.getElementById('modalConsulta').style.display = 'none';
    document.getElementById('formularioConsulta').reset();
  };

  window.enviarConsulta = (e) => {
    e.preventDefault();
    const especialista = document.getElementById('nombreEspecialistaInput').value;
    const texto = document.getElementById('consultaTexto').value.trim();

    if (!texto) {
      alert('Por favor, escribe tu consulta antes de enviar.');
      return;
    }

    alert(`Consulta enviada a ${especialista}:\n\n${texto}`);
    cerrarModalConsulta();
  };

  // Event Listeners para el modal
  document.getElementById('modalCerrarConsulta').addEventListener('click', cerrarModalConsulta);
  document.getElementById('formularioConsulta').addEventListener('submit', enviarConsulta);

 await renderizarTarjetas();
});