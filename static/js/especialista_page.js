document.addEventListener('DOMContentLoaded', () => {
  const cardSection = document.querySelector('.card-section');
  const modal = document.getElementById('modal');
  const btnCrear = document.getElementById('btnCrearProcedimiento');
  const btnCerrarModal = document.getElementById('modalCerrar');
  const formulario = document.getElementById('formularioProcedimiento');
  const tituloModal = document.getElementById('modalTitulo');
  const inputId = document.getElementById('procedimientoId');
  const inputNombre = document.getElementById('nombre');
  const inputDescripcion = document.getElementById('descripcion');
  const inputFile = document.getElementById('archivo');

  let procedimientos = [
    {
      id: 1,
      nombre: 'Procedimiento 1',
      descripcion: 'Este es el primer procedimiento.',
      archivo: 'documento1.pdf'
    },
    {
      id: 2,
      nombre: 'Procedimiento 2',
      descripcion: 'Este es el segundo procedimiento.',
      archivo: 'documento2.docx'
    }
  ];

  function renderizarTarjetas() {
    cardSection.innerHTML = '';
    procedimientos.forEach(procedimiento => {
      const card = document.createElement('div');
      card.classList.add('card');

      card.innerHTML = `
        <h3 class="nombre">${procedimiento.nombre}</h3>
        <div class="descripcion-container">
          <div class="accordion-header" onclick="toggleDescripcion(${procedimiento.id})">
            <span>Descripción</span>
            <span class="icon">&#x25BE;</span>
          </div>
          <div class="descripcion collapsed" data-id="${procedimiento.id}">
            ${procedimiento.descripcion}
          </div>
        </div>
        <div class="acciones">
          <button class="btn-ver-archivo" onclick="verArchivo('${procedimiento.archivo}')">
            Ver Archivo
          </button>
          <button class="btn-editar" onclick="editarProcedimiento(${procedimiento.id})">
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

  window.toggleDescripcion = (id) => {
    const descripcion = document.querySelector(`.descripcion[data-id="${id}"]`);
    const icon = document.querySelector(`.descripcion[data-id="${id}"]`).closest('.descripcion-container').querySelector('.icon');

    if (descripcion.classList.contains('collapsed')) {
      descripcion.classList.remove('collapsed');
      descripcion.classList.add('expanded');
      icon.style.transform = 'rotate(180deg)';
    } else {
      descripcion.classList.remove('expanded');
      descripcion.classList.add('collapsed');
      icon.style.transform = 'rotate(0deg)';
    }
  };

  window.verArchivo = (archivo) => {
    alert(`Visualizando archivo: ${archivo}`);
  };

  window.editarProcedimiento = (id) => {
    const procedimiento = procedimientos.find(p => p.id === id);
    if (procedimiento) {
      inputId.value = procedimiento.id;
      inputNombre.value = procedimiento.nombre;
      inputDescripcion.value = procedimiento.descripcion;
      tituloModal.textContent = 'Editar Procedimiento';
      modal.style.display = 'block';
    }
  };

  window.eliminarProcedimiento = (id) => {
    if (confirm('¿Estás seguro de eliminar este procedimiento?')) {
      procedimientos = procedimientos.filter(p => p.id !== id);
      renderizarTarjetas();
    }
  };

  btnCrear.addEventListener('click', () => {
    inputId.value = '';
    inputNombre.value = '';
    inputDescripcion.value = '';
    inputFile.value = '';
    tituloModal.textContent = 'Crear Procedimiento';
    modal.style.display = 'block';
  });

  btnCerrarModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  formulario.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = parseInt(inputId.value);
    const nombre = inputNombre.value.trim();
    const descripcion = inputDescripcion.value.trim();
    const archivo = inputFile.files[0]?.name || '';

    if (!nombre || !descripcion) return alert('Por favor, completa todos los campos.');

    if (id) {
      const procedimiento = procedimientos.find(p => p.id === id);
      procedimiento.nombre = nombre;
      procedimiento.descripcion = descripcion;
      procedimiento.archivo = archivo;
    } else {
      const nuevoId = procedimientos.length ? Math.max(...procedimientos.map(p => p.id)) + 1 : 1;
      procedimientos.push({ id: nuevoId, nombre, descripcion, archivo });
    }

    renderizarTarjetas();
    modal.style.display = 'none';
  });

  renderizarTarjetas();
});