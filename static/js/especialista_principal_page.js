document.addEventListener('DOMContentLoaded', async () => {
  const tabla = document.getElementById('usuariosTabla').querySelector('tbody');
  const modal = document.getElementById('modal');
  const modalEdit = document.getElementById('modalEdit');
  const btnCrear = document.getElementById('btnCrearUsuario');
  const btnCerrarModal = document.getElementById('modalCerrar');
  const btnCerrarModalEdit = document.getElementById('modalCerrarEdit');
  const formulario = document.getElementById('formularioUsuario');
  const formularioEdit = document.getElementById('formularioUsuarioEdit');
  const inputNombre = document.getElementById('username');
  const inputPassword = document.getElementById('password');
  const modalEditInputNombre = document.getElementById('modalEditUsername');
  const modalEditInputPassword = document.getElementById('modalEditPassword');
  const inputBuscar = document.getElementById('inputBuscar');
  const btnBuscar = document.getElementById('btnBuscar');
  const btnRecargar = document.getElementById('btnRecargar');

  function recargarPagina() {
    location.reload();
  }
  const API_URLS = {
    procedimientos: '/obtener_procedimientos',
    consultas: '/obtener_consultas',
    usuarios: '/obtener_usuarios'
  };

  async function fetchData(endpoint) {
    try {
      const response = await fetch(endpoint);
      const result = await response.json();
      return result.success ? result : null;
    } catch (error) {
      console.error("Error al obtener datos:", error);
      return null;
    }
  }

  async function loadCounts() {
    const procData = await fetchData(API_URLS.procedimientos);
    const consData = await fetchData(API_URLS.consultas);
    const userData = await fetchData(API_URLS.usuarios);

    document.getElementById('count-procedimientos').textContent = procData?.procedimientos.length || 0;
    document.getElementById('count-consultas').textContent = consData?.consultas.length || 0;
    document.getElementById('count-usuarios').textContent = userData?.usuarios.length || 0;
  }

  window.onload = loadCounts;
  async function renderizarTabla() {
    const get_usuarios = await fetch("/obtener_usuarios")
    const data = await get_usuarios.json()
    if (data.usuarios?.length) {
      if (inputBuscar.value.trim() !== '') {
        data.usuarios = data.usuarios.filter(usuario =>
          usuario.username.toLowerCase().includes(inputBuscar.value.toLowerCase()) ||
          usuario.rol.toLowerCase().includes(inputBuscar.value.toLowerCase())

        );
      }
    }
    tabla.innerHTML = '';
    console.log(data)
    data.usuarios.forEach((usuario, index) => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
       <td>${index + 1}</td>
        <td title="${usuario.id}">${usuario.id.slice(0, 8)}...</td>
        <td>${usuario.username}</td>
        <td>${usuario.rol}</td>
        <td>
          <button class="btn-editar"  onclick="editarUsuario('${usuario.id}')">Editar</button>
          <button class="btn-eliminar" onclick="eliminarUsuario('${usuario.id}')">Eliminar</button>
        </td>
      `;

      tabla.appendChild(tr);
    });
  }

  window.editarUsuario = (id) => {
    modalEditInputNombre.value = '';
    modalEditInputPassword.value = '';
    modalEdit.style.display = 'block';
    modalEdit.setAttribute('data-usuario-id', id);
  };

  window.eliminarUsuario = (id) => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      const formData = new FormData
      formData.append('usuario_id', id);
      fetch(`/eliminar_usuario`, {
        method: 'POST',
        body: formData
      })
      alert('Usuario eliminado correctamente');
      renderizarTabla();
    }
  };

  btnCrear.addEventListener('click', () => {
    inputNombre.value = '';
    inputPassword.value = '';
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
      const response = await fetch('/crear_usuario', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (data.success) {
        alert('Usuario creado correctamente');
        await renderizarTabla();
        modal.style.display = 'none';
        formulario.reset();
      } else {
        alert(data.error || 'Error al crear usuario');
      }
    } catch (error) {
      alert('Error en la solicitud');
    }
  });


  formularioEdit.addEventListener('submit', async (e) => {
    e.preventDefault();

    const usuarioId = modalEdit.getAttribute('data-usuario-id');
    const formData = new FormData(formularioEdit);
    formData.append('usuario_id', usuarioId);

    try {
      const response = await fetch('/actualizar_usuario', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (data.success) {
        alert('Usuario actualizado correctamente');
        await renderizarTabla();
        modal.style.display = 'none';
        formulario.reset();
      } else {
        alert(data.error || 'Error al actualizar usuario');
      }
    } catch (error) {
      alert('Error en la solicitud');
    }
  });

  btnBuscar.addEventListener('click', renderizarTabla);
  btnRecargar.addEventListener('click', recargarPagina);

  await renderizarTabla();
});


