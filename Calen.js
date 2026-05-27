const grid = document.getElementById('calendar');
const monthNameDisplay = document.getElementById('MesNomb');
let seleccionadia = null;
let currentDate = new Date(2026, 3, 1);

// CONFIGURACIÓN DE AIRTABLE 
window.baseId = 'appkuLDMzBmUrR4vD';
window.token = 'patinYdMxooFzzaUm.47a5902df81ea721f7e50ae0180deca89b2ff3620e433aa2c7c695d87928bd66';
const tabla = 'Calendario';

const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

/*esto hace el calendario*/
function renderCalendar() {
    if (!grid) return;
    grid.innerHTML = '';
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    monthNameDisplay.innerText = `${months[month]} ${year}`;

    const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    weekDays.forEach(d => {
        const div = document.createElement('div');
        div.className = 'dianNomb';
        div.innerText = d;
        grid.appendChild(div);
    });

    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();

    for (let x = 0; x < firstDayIndex; x++) {
        const emptyDiv = document.createElement('div');
        grid.appendChild(emptyDiv);
    }

    for (let i = 1; i <= lastDay; i++) {
        const daySquare = document.createElement('div');
        daySquare.className = 'calendario-dia';
        daySquare.innerHTML = `<span class="dia-numero">${i}</span>`;
        
        const fechaID = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        daySquare.id = `dia-${fechaID}`;

        daySquare.onclick = () => {
            if (seleccionadia) {
                seleccionadia.classList.remove('selected');
                seleccionadia.style.borderColor = "rgba(255, 255, 255, 0.1)";
            }
            seleccionadia = daySquare;
            daySquare.classList.add('selected');
            daySquare.style.borderColor = "#0d6efd";
        };
        grid.appendChild(daySquare);
    }
    cargarDesdeAirtable();
}

const botonGuardar = document.getElementById('GuardarRecordatorio');
if (botonGuardar) {
    botonGuardar.onclick = async () => {
        const medInput = document.getElementById('nombreMed');
        const timeInput = document.getElementById('horaMed');
        const emailLogueado = localStorage.getItem('usuarioLogueado');

        if (!seleccionadia) return alert("Selecciona un día primero.");
        if (medInput.value === "" || timeInput.value === "") return alert("Ingresa todos los campos.");

        const fechaSeleccionada = seleccionadia.id.replace('dia-', '');

        try {
            const respuesta = await fetch(`https://api.airtable.com/v0/${window.baseId}/${tabla}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${window.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "fields": {
                        "Medicamento": medInput.value,
                        "Hora del Recordatorio": `${fechaSeleccionada}T${timeInput.value}:00.000Z`,
                        "Día": fechaSeleccionada,
                        "Email": emailLogueado // Segun se guarda el correo 
                    }
                })
            });

            if (respuesta.ok) {
                alert("¡Guardado en tu Bitácora personal!");
                renderCalendar(); 
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };
}

/*aqui se carga la base de datos*/
async function cargarDesdeAirtable() {
    const emailLogueado = localStorage.getItem('usuarioLogueado');
    if (!emailLogueado) return;

    // Filtro para traer solo lo que coincida con el Email de la sesión
    const filtro = `filterByFormula=({Email}='${emailLogueado}')`;
    const url = `https://api.airtable.com/v0/${window.baseId}/${tabla}?${filtro}`;

    try {
        const respuesta = await fetch(url, {
            headers: { 'Authorization': `Bearer ${window.token}` }
        });
        const datos = await respuesta.json();

        if (datos.records) {
            datos.records.forEach(registro => {
                const med = registro.fields.Medicamento;
                const fecha = registro.fields.Día;
                const hora = registro.fields['Hora del Recordatorio'] ? registro.fields['Hora del Recordatorio'].split('T')[1].substring(0, 5) : "";

                const cuadrito = document.getElementById(`dia-${fecha}`);
                if (cuadrito) {
                    const medItem = document.createElement('div');
                    medItem.className = 'med-item';
                    medItem.innerHTML = `<span>${hora} - ${med}</span>`;
                    cuadrito.appendChild(medItem);
                }
            });
        }
    } catch (error) {
        console.log("Error cargando datos:", error);
    }
}

if (document.getElementById('MesAnterior')) {
    document.getElementById('MesAnterior').onclick = () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    };
}
if (document.getElementById('MesSiguiente')) {
    document.getElementById('MesSiguiente').onclick = () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    };
}

if (document.getElementById('calendar')) {
    renderCalendar();
}
