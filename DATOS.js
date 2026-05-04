

// 1. Verificar que el usuario tenga permiso de estar aquí
const emailLogueado = localStorage.getItem('usuarioLogueado');

if (!emailLogueado) {
    alert("Acceso denegado. Por favor inicia sesión.");
    window.location.href = "index.html"; // Te regresa al login si no entraste legalmente
}

// Mostrar el nombre del usuario logueado
const nombreUsuario = localStorage.getItem('nombreUsuario') || "Usuario";
console.log("Nombre de usuario:", nombreUsuario);
document.getElementById("mensajeBienvenida").textContent = ` ${nombreUsuario}`;

// 2. Función para CARGAR solo mis datos
async function cargarMisDatos() {
    // El filtro mágico: busca en la columna 'Email' lo que coincida con el usuario actual
    const filtro = `filterByFormula=({Email}='${emailLogueado}')`;
    const url = `https://api.airtable.com/v0/${baseId}/Calendario?${filtro}`;

    try {
        const res = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        console.log("Datos de mi calendario:", data.records);
        
        // AQUÍ llamas a tu función que dibuja el calendario con 'data.records'
        // ejemplo: renderizarCalendario(data.records);

    } catch (error) {
        console.error("Error al cargar datos:", error);
    }
}

// 3. Función para GUARDAR un nuevo evento (Vinculado)
async function guardarEvento(nombreMedicina, fecha) {
    try {
        await fetch(`https://api.airtable.com/v0/${baseId}/Calendario`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "fields": {
                    "Nombre": nombreMedicina,
                    "Fecha": fecha,
                    "Email": emailLogueado // <--- ESTO vincula el dato a este usuario
                }
            })
        });
        alert("Guardado correctamente");
        cargarMisDatos(); // Recargar para ver el nuevo cambio
    } catch (error) {
        console.error("Error al guardar:", error);
    }
}


// 2. Función para CARGAR solo mis datos
async function cargarMisDatos() {
    const filtro = `filterByFormula=({Email}='${emailLogueado}')`;
    const url = `https://api.airtable.com/v0/${baseId}/Calendario?${filtro}`;

    try {
        const res = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        console.log("Datos de mi calendario:", data.records);

    } catch (error) {
        console.error("Error, no se cargaron los datos:", error);
    }
}
function cerrarSesion() {
    // Eliminar datos de sesión del almacenamiento local
    localStorage.removeItem('usuarioLogueado');
    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('token'); // Solo si lo guardas en localStorage

    // Opcional: limpiar sessionStorage también
    sessionStorage.clear();

    // Redirigir al login
    window.location.href = "index.html";
}
// 3. Ejecutar al abrir la página
document.addEventListener('DOMContentLoaded', () => {
    cargarMisDatos();
});
