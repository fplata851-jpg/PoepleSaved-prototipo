

// 1. Verificar que el usuario tenga permiso de estar aquí
const emailLogueado = localStorage.getItem('usuarioLogueado');

if (!emailLogueado) {
    alert("Acceso denegado. Por favor inicia sesión.");
    window.location.href = "index.html"; 
}

// Mostrar el nombre del usuario logueado
const nombreUsuario = localStorage.getItem('nombreUsuario') || "Usuario";
console.log("Nombre de usuario:", nombreUsuario);
document.getElementById("mensajeBienvenida").textContent = ` ${nombreUsuario}`;

async function cargarMisDatos() {
   
    const filtro = `filterByFormula=({Email}='${emailLogueado}')`;
    const url = `https://api.airtable.com/v0/${baseId}/Calendario?${filtro}`;

    try {
        const res = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        console.log("Datos de mi Bitácora:", data.records);

    } catch (error) {
        console.error("Error al cargar datos:", error);
    }
}

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
                    "Email": emailLogueado 
                }
            })
        });
        alert("Guardado correctamente");
        cargarMisDatos(); 
    } catch (error) {
        console.error("Error al guardar:", error);
    }
}

async function cargarMisDatos() {
    const filtro = `filterByFormula=({Email}='${emailLogueado}')`;
    const url = `https://api.airtable.com/v0/${baseId}/Calendario?${filtro}`;

    try {
        const res = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        console.log("Datos de mi Bitácora:", data.records);

    } catch (error) {
        console.error("Error, no se cargaron los datos:", error);
    }
}
function cerrarSesion() {
    localStorage.removeItem('usuarioLogueado');
    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('token'); 

    sessionStorage.clear();
    window.location.href = "index.html";
}
document.addEventListener('DOMContentLoaded', () => {
    cargarMisDatos();
});
