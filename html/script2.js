function ShowHide(){
    var container = document.querySelector(".container");
    if (!container) return;

    if (container.style.visibility === "hidden") {
        container.style.visibility = "visible";
    } else {
        container.style.visibility = "hidden";
    }
}

function cerrarSesion() {
    localStorage.removeItem('usuarioLogueado');
    localStorage.removeItem('nombreUsuario');
    window.location.href = "Iniciodesesion.html";
}

document.addEventListener('DOMContentLoaded', function() {
    var btnCerrar = document.getElementById('btnshow');
    if (btnCerrar) {
        btnCerrar.addEventListener('click', cerrarSesion);
    }
});
