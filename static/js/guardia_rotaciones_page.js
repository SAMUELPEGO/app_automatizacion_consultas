document.addEventListener("DOMContentLoaded", async () => {
  const tbody = document.querySelector("#rotacionesTabla tbody");
  const searchButton = document.querySelector(".search-button");



  async function cargarRotaciones() {
    const fechaFiltro = document.getElementById("fechaSelector").value;
    if (!fechaFiltro) return alert("Por favor, seleccione una fecha");

    fetch(`/obtener_rotaciones_por_fecha?fecha=${fechaFiltro}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.rotaciones?.length) {
          tbody.innerHTML = "";
          data.rotaciones.forEach((r, i) => {
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

  searchButton.addEventListener("click", async () => {
    await cargarRotaciones();
  });
});