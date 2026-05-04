/*boton calendario*/
const botonIrACalendario = document.getElementById('CalendarioBtn');

if (botonIrACalendario) {
    botonIrACalendario.addEventListener('click', function() {
        window.location.href = 'Calendario.html';
    });
}
/*boton mapita*/
const botonMapita = document.getElementById('MapitaBtn');
if (botonMapita) {
  botonMapita.addEventListener('click', function() {
    window.location.href = 'Mapita.html';
  });
}

/*boton medicamentos*/
const botonMedicamentos = document.getElementById('medicamentoBtn');
if (botonMedicamentos) {
  botonMedicamentos.addEventListener('click', function() {
    window.location.href = 'Medicamentosss.html';
  });
}
/*boton enfermedades*/
const botonEnfermedades = document.getElementById('enfermedadesBtn');
if (botonEnfermedades) {
  botonEnfermedades.addEventListener('click', function() {
    window.location.href = 'CachitoEnfer.html';
  });
}

/*boton regresar a index*/
const botonInicio = document.getElementById('IniBtn');
if (botonInicio) {
  botonInicio.addEventListener('click', function() {
    window.location.href = 'Bienvenidx.html';
  });
}
