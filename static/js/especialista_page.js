document.addEventListener('DOMContentLoaded', async () => {
  const cardSection = document.querySelector('.card-section');
  const modal = document.getElementById('modal');
  const modalEdit = document.getElementById('modalEdit');
  const btnCrear = document.getElementById('btnCrearProcedimiento');
  const btnCerrarModal = document.getElementById('modalCerrar');
  const btnCerrarModalEdit = document.getElementById('modalCerrarEdit');
  const formulario = document.getElementById('formularioProcedimiento');
  const formularioProcedimiento = document.getElementById('formularioProcedimientoEdit');
  const inputNombre = document.getElementById('nombre');
  const inputDescripcion = document.getElementById('descripcion');
  const inputFile = document.getElementById('archivo');
  const inputNombreEdit = document.getElementById('modalEditNombre');
  const inputDescripcionEdit = document.getElementById('modalEditDescripcion');
  const inputFileEdit = document.getElementById('modalEditArchivo');
  const details = document.querySelectorAll('details');




  async function renderizarTarjetas() {
    const get_procedimientos = await fetch("/obtener_procedimientos_por_especialista")
    const data = await get_procedimientos.json()
    if (!data.procedimientos?.length) {

      cardSection.innerHTML = '';
    }
    cardSection.innerHTML = '';
    console.log(data)
    cardSection.innerHTML = '';
    data.procedimientos.forEach(procedimiento => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <h3 class="nombre">${procedimiento.nombre}</h3>
        <div class="descripcion-container">
        <div class="accordion">
        <details>
            <summary>Descripcion</summary>
            <div class="content">
               <p>${procedimiento.descripcion}</p>
            </div>
        </details>
        </div>
          
        </div>

        <div class="acciones">
          <button class="btn-ver-archivo" onclick="verArchivo('${procedimiento.archivo}')">
            Ver Archivo
          </button>
          <button class="btn-editar" onclick="editarProcedimiento('${procedimiento.id}')">
            Editar
          </button>
          <button class="btn-eliminar" onclick="eliminarProcedimiento(${procedimiento.id})">
            Eliminar
          </button>
        </div>
      `;

      cardSection.appendChild(card);
    });
  }
  // --------------------------------------------------------------
        
        details.forEach(detail => {
            detail.addEventListener('toggle', () => {
                if (detail.open) {
                    details.forEach(otherDetail => {
                        if (otherDetail !== detail) {
                            otherDetail.open = false;
                        }
                    });
                }
            });
        });

  window.verArchivo = (archivo) => {
    if (!archivo || archivo === 'null') {
      alert('No hay archivo disponible');
      return;
    }

    try {
      const nuevaVentana = window.open(archivo, '_blank');

      if (!nuevaVentana || nuevaVentana.closed || typeof nuevaVentana.closed == 'undefined') {
        alert('El navegador bloqueó la ventana emergente. Por favor, habilita las ventanas emergentes para este sitio.');
      }
    } catch (error) {
      console.error('Error al abrir el archivo:', error);
      alert('Error al abrir el archivo');
    }
  };

  window.editarProcedimiento = (id) => {
    console.log("activandose" + id)
    inputNombreEdit.value = '';
    inputDescripcionEdit.value = '';
    inputFileEdit.value = '';
    modalEdit.style.display = 'block';
    modalEdit.setAttribute('data-procedimiento-id', id);
  };

  window.eliminarProcedimiento = (id) => {
    if (confirm('¿Estás seguro de eliminar este procedimiento?')) {
      const formData = new FormData
      formData.append('procedimiento_id', id);
      fetch(`/eliminar_procedimiento`, {
        method: 'POST',
        body: formData
      })
      alert('Procedimiento eliminado correctamente');
      renderizarTarjetas();
    }
  };

  btnCrear.addEventListener('click', () => {
    inputNombre.value = '';
    inputDescripcion.value = '';
    inputFile.value = '';
    modal.style.display = 'block';
  });

  btnCerrarModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  btnCerrarModalEdit.addEventListener('click', () => {
    modalEdit.style.display = 'none';
  });

  formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(formulario);

    try {
      const response = await fetch('/crear_procedimiento', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (data.success) {
        alert('procedimiento creado correctamente');
        await renderizarTarjetas();
        modal.style.display = 'none';
        formulario.reset();
      } else {
        alert(data.error || 'Error al crear usuario');
      }
    } catch (error) {
      alert('Error en la solicitud');
    }
  });

  formularioProcedimiento.addEventListener('submit', async (e) => {
    e.preventDefault();

    const procedimientoId = modalEdit.getAttribute('data-procedimiento-id');
    const formData = new FormData(formularioProcedimiento);
    formData.append('procedimiento_id', procedimientoId);

    try {
      const response = await fetch('/actualizar_procedimiento', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (data.success) {
        alert('procedimiento actualizado correctamente');
        await renderizarTarjetas();
        modal.style.display = 'none';
        formulario.reset();
      } else {
        alert(data.error || 'Error al actualizar usuario');
      }
    } catch (error) {
      alert('Error en la solicitud');
    }
  });

  await renderizarTarjetas();
});

