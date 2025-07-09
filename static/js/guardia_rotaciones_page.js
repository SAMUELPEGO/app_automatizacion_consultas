document.addEventListener('DOMContentLoaded', async () => {
  const tbody = document.querySelector('#rotacionesTabla tbody');
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

  searchButton.addEventListener('click', async () => {
    await cargarRotaciones();
  });
  cargarUsuarios();
});