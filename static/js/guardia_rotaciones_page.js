document.addEventListener('DOMContentLoaded', async () => {
  const tbody = document.querySelector('#rotacionesTabla tbody');
  const modal = document.getElementById('modalCrear');
  const btnCrear = document.getElementById('btnCrearRotacion');
  const btnCerrarModal = document.getElementById('modalCerrar');
  const formulario = document.getElementById('formularioRotacion');
  const searchButton = document.querySelector('.search-button');

  function cargarUsuarios() {
    fetch('/obtener_usuarios')
      .then(res => res.json())
      .then(data => {
        const select = document.getElementById('nombre');
        select.innerHTML = '<option value="">Selecciona un usuario</option>';
        if (data.success && data.usuarios?.length) {
          data.usuarios.forEach(usuario => {
            if (usuario.rol === 'especialista') return;
            const option = document.createElement('option');
            option.value = usuario.username;
            option.textContent = usuario.username;
            select.appendChild(option);
          });
        }
      })
      .catch(err => {
        console.error(err);
        alert("Error al cargar usuarios");
      });
  }

  async function cargarRotaciones() {

    const fecha = document.getElementById('fechaSelector').value;
    if (!fecha) return alert("Por favor, seleccione una fecha");

    fetch(`/obtener_rotaciones_por_fecha?fecha=${fecha}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.rotaciones?.length) {
          tbody.innerHTML = '';
          data.rotaciones.forEach((r, i) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${i + 1}</td>
              <td>${r.username}</td>
              <td>${r.fecha}</td>
              <td>${r.entrada}</td>
              <td>${r.salida}</td>
              <td><button class="btn-eliminar" onclick="eliminarRotacion('${r.id}')">Eliminar</button></td>
            `;
            tbody.appendChild(tr);
          });
        } else {
          tbody.innerHTML = `<tr><td colspan="6">No hay rotaciones para esta fecha.</td></tr>`;
        }
      })
      .catch(err => {
        console.error(err);
        alert("Error al obtener rotaciones");
      });
  }

  window.eliminarRotacion = (id) => {
    if (!confirm("¿Estás seguro de eliminar esta rotación?")) return;

    const formData = new FormData();
    formData.append("id", id);

    fetch("/eliminar_rotacion_usuario", {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(() => {
        alert("Rotación eliminada correctamente");
        cargarRotaciones();
      })
      .catch(err => {
        console.error(err);
        alert("Error al eliminar rotación");
      });
  };

  btnCrear.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  btnCerrarModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  formulario.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const fecha = document.getElementById('fecha').value;
    const entrada = document.getElementById('entrada').value;
    const salida = document.getElementById('salida').value;

    if (!nombre || !fecha || !entrada || !salida) {
      alert("Todos los campos son obligatorios");
      return;
    }
    console.log(nombre, fecha, entrada, salida);
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("fecha", fecha);
    formData.append("entrada", entrada);
    formData.append("salida", salida);

    fetch("/anadir_rotacion_usuario", {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Rotación creada correctamente");
          modal.style.display = 'none';
          formulario.reset();
          cargarRotaciones();
        } else {
          alert(data.error || "Error al crear rotación");
        }
      })
      .catch(err => {
        console.error(err);
        alert("Error en la solicitud");
      });
  });
  searchButton.addEventListener('click', async () => {
    await cargarRotaciones();
  });
  cargarUsuarios();
});