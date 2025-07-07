document.addEventListener('DOMContentLoaded', () => {
  const tabla = document.getElementById('usuariosTabla').querySelector('tbody');
  const modal = document.getElementById('modal');
  const btnCrear = document.getElementById('btnCrearUsuario');
  const btnCerrarModal = document.getElementById('modalCerrar');
  const formulario = document.getElementById('formularioUsuario');
  const tituloModal = document.getElementById('modalTitulo');
  const inputId = document.getElementById('usuarioId');
  const inputNombre = document.getElementById('nombre');
  const inputEmail = document.getElementById('email');

  let usuarios = [
    { id: 1, nombre: 'Ana López', email: 'ana@example.com' },
    { id: 2, nombre: 'Carlos Pérez', email: 'carlos@example.com' }
  ];

  function renderizarTabla() {
    tabla.innerHTML = '';
    usuarios.forEach(usuario => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>${usuario.id}</td>
        <td>${usuario.nombre}</td>
        <td>${usuario.email}</td>
        <td>
          <button class="btn-editar" onclick="editarUsuario(${usuario.id})">Editar</button>
          <button class="btn-eliminar" onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
        </td>
      `;

      tabla.appendChild(tr);
    });
  }

  window.editarUsuario = (id) => {
    const usuario = usuarios.find(u => u.id === id);
    if (usuario) {
      inputId.value = usuario.id;
      inputNombre.value = usuario.nombre;
      inputEmail.value = usuario.email;
      tituloModal.textContent = 'Editar Usuario';
      modal.style.display = 'block';
    }
  };

  window.eliminarUsuario = (id) => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      usuarios = usuarios.filter(u => u.id !== id);
      renderizarTabla();
    }
  };

  btnCrear.addEventListener('click', () => {
    inputId.value = '';
    inputNombre.value = '';
    inputEmail.value = '';
    tituloModal.textContent = 'Crear Usuario';
    modal.style.display = 'block';
  });

  btnCerrarModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  formulario.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = parseInt(inputId.value);
    const nombre = inputNombre.value.trim();
    const email = inputEmail.value.trim();

    if (!nombre || !email) return alert('Por favor, completa todos los campos.');

    if (id) {
      // Editar
      const usuario = usuarios.find(u => u.id === id);
      usuario.nombre = nombre;
      usuario.email = email;
    } else {
      // Crear
      const nuevoId = usuarios.length ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;
      usuarios.push({ id: nuevoId, nombre, email });
    }

    renderizarTabla();
    modal.style.display = 'none';
  });

  renderizarTabla();
});