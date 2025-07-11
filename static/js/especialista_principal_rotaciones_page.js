document.addEventListener("DOMContentLoaded", async () => {
  const tbody = document.querySelector("#rotacionesTabla tbody");
  const modal = document.getElementById("modalCrear");
  const btnCrear = document.getElementById("btnCrearRotacion");
  const btnCerrarModal = document.getElementById("modalCerrar");
  const formulario = document.getElementById("formularioRotacion");
  const searchButton = document.querySelector(".search-button");

  function convertirHora(hora24) {
    if (!hora24) return "";
    let [horas, minutos] = hora24.split(":").map(Number);
    let periodo = horas >= 12 ? "PM" : "AM";
    horas = horas % 12 || 12;
    return `${horas}:${minutos.toString().padStart(2, "0")} ${periodo}`;
  }

  function cargarUsuarios() {
    fetch("/obtener_usuarios")
      .then((res) => res.json())
      .then((data) => {
        const select = document.getElementById("nombre");
        select.innerHTML = '<option value="">Selecciona un usuario</option>';
        if (data.success && data.usuarios?.length) {
          data.usuarios.forEach((usuario) => {
            if (usuario.rol === "especialista") return;
            const option = document.createElement("option");
            option.value = usuario.username;
            option.textContent = usuario.username;
            select.appendChild(option);
          });
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Error al cargar usuarios");
      });
  }

  btnCrear.addEventListener("click", () => {
    modal.style.display = "block";
  });

  btnCerrarModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const fechaEntrada = document.getElementById("fechaEntrada").value;
    const horaEntrada = document.getElementById("horaEntrada").value;
    const fechaSalida = document.getElementById("fechaSalida").value;
    const horaSalida = document.getElementById("horaSalida").value;

    if (!nombre || !fechaEntrada || !horaEntrada || !fechaSalida || !horaSalida) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const entradaFormateada = convertirHora(horaEntrada);
    const salidaFormateada = convertirHora(horaSalida);

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("fecha_entrada", fechaEntrada);
    formData.append("entrada", entradaFormateada);
    formData.append("fecha_salida", fechaSalida);
    formData.append("salida", salidaFormateada);

    fetch("/anadir_rotacion_usuario", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Rotación creada correctamente");
          modal.style.display = "none";
          formulario.reset();
          cargarRotaciones();
        } else {
          alert(data.error || "Error al crear rotación");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Error en la solicitud");
      });
  });

  async function cargarRotaciones() {
    const fechaFiltro = document.getElementById("fechaSelector").value;
    if (!fechaFiltro) return alert("Por favor, seleccione una fecha");

    fetch(`/obtener_rotaciones_por_fecha?fecha=${fechaFiltro}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.rotaciones?.length) {
          tbody.innerHTML = "";

          // Función para convertir hora AM/PM a minutos desde medianoche
          function horaToMin(horaStr) {
            let [time, modifier] = horaStr.split(" ");
            let [hours, minutes] = time.split(":").map(Number);
            if (modifier === "PM" && hours < 12) hours += 12;
            if (modifier === "AM" && hours === 12) hours = 0;
            return hours * 60 + minutes;
          }

          // Ordenar: si es del mismo día del filtro → por hora entrada, sino por fecha salida
          const rotacionesOrdenadas = data.rotaciones.sort((a, b) => {
            const esAEntradaFiltro = a.fecha_entrada === fechaFiltro;
            const esBEntradaFiltro = b.fecha_entrada === fechaFiltro;

            const esASalidaFiltro = a.fecha_salida === fechaFiltro;
            const esBSalidaFiltro = b.fecha_salida === fechaFiltro;

            // Caso 1: ambos son del mismo día de entrada → ordenar por hora entrada
            if (esAEntradaFiltro && esBEntradaFiltro) {
              return horaToMin(a.entrada) - horaToMin(b.entrada);
            }
            // Caso 2: uno es entrada y otro salida en el filtro → priorizar entrada
            if (esAEntradaFiltro && !esBEntradaFiltro) return -1;
            if (!esAEntradaFiltro && esBEntradaFiltro) return 1;

            // Caso 3: ninguno es entrada en el filtro → ordenar por fecha salida
            return new Date(a.fecha_salida) - new Date(b.fecha_salida);
          });

          // Mostrar rotaciones ya ordenadas
          rotacionesOrdenadas.forEach((r, i) => {
            const mostrarFechaEntrada = r.fecha_entrada === fechaFiltro ? r.fecha_entrada : "—";
            const mostrarEntrada = r.fecha_entrada === fechaFiltro ? r.entrada : "—";

            const mostrarFechaSalida = r.fecha_salida === fechaFiltro ? r.fecha_salida : "—";
            const mostrarSalida = r.fecha_salida === fechaFiltro ? r.salida : "—";

            const tr = document.createElement("tr");
            tr.innerHTML = `
          <td>${i + 1}</td>
          <td>${r.username}</td>
          <td>${mostrarFechaEntrada}</td>
          <td>${mostrarEntrada}</td>
          <td>${mostrarFechaSalida}</td>
          <td>${mostrarSalida}</td>
          <td><button class="btn-eliminar" onclick="eliminarRotacion('${r.id}')">Eliminar</button></td>
        `;
            tbody.appendChild(tr);
          });
        } else {
          tbody.innerHTML = `<tr><td colspan="7">No hay rotaciones para esta fecha.</td></tr>`;
        }
      })
      .catch((err) => {
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
      body: formData,
    })
      .then((res) => res.json())
      .then(() => {
        alert("Rotación eliminada correctamente");
        cargarRotaciones();
      })
      .catch((err) => {
        console.error(err);
        alert("Error al eliminar rotación");
      });
  };
  searchButton.addEventListener("click", async () => {
    await cargarRotaciones();
  });
  cargarUsuarios();
});