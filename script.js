// 1. SELECTORES PARA LAS ANIMACIONES (Lo que hace que el botón funcione)
const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.registrate-link');
const registerLink = document.querySelector('.iniciasesion-link');
const btnPopup = document.querySelector('.Btn'); 
const iconClose = document.querySelector('.icon-close');
// Verificamos que los botones existan antes de asignarles el click para que no se rompa el JS
if (btnPopup) {
    btnPopup.onclick = () => { wrapper.classList.add('active-popup'); };
}

if (iconClose) {
    iconClose.onclick = () => { wrapper.classList.remove('active-popup'); };
}

if (loginLink) {
    loginLink.onclick = () => { wrapper.classList.add('active'); };
}

if (registerLink) {
    registerLink.onclick = () => { wrapper.classList.remove('active'); };
}

// 2. CONFIGURACIÓN DE TU BASE DE DATOS
const baseId = 'appkuLDMzBmUrR4vD';
const token = 'patinYdMxooFzzaUm.47a5902df81ea721f7e50ae0180deca89b2ff3620e433aa2c7c695d87928bd66';

// 3. LÓGICA DE REGISTRO
// Buscamos el formulario dentro de la caja de registro
const formRegistro = document.querySelector('.form-box.registrate form');

if (formRegistro) {
    formRegistro.onsubmit = async (e) => {
        e.preventDefault();

        // Buscamos los inputs específicos
        const usuario = formRegistro.querySelector('input[type="text"]').value;
        const email = formRegistro.querySelector('input[type="email"]').value;
        const pass = formRegistro.querySelector('input[type="password"]').value;
        const terminos = formRegistro.querySelector('input[type="checkbox"]').checked;

        if (!terminos) {
            alert("Debes aceptar los términos y condiciones.");
            return;
        }

        try {
            const respuesta = await fetch(`https://api.airtable.com/v0/${baseId}/Usuarios`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "fields": {
                        "Nombre": usuario,
                        "Email": email,
                        "Password": pass
                    }
                })
            });

            if (respuesta.ok) {
                alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
                wrapper.classList.remove('active'); // Te regresa al cuadro de login
            } else {
                alert("Error al registrar. Revisa que tu tabla en Airtable se llame 'Usuarios'");
            }
        } catch (error) {
            console.error("Error de conexión:", error);
        }
    };
}

// 4. LÓGICA DE INICIO DE SESIÓN
const formLogin = document.querySelector('.form-box.login form');

if (formLogin) {
    formLogin.onsubmit = async (e) => {
        e.preventDefault();

        const email = formLogin.querySelector('input[type="email"]').value;
        const pass = formLogin.querySelector('input[type="password"]').value;

        const url = `https://api.airtable.com/v0/${baseId}/Usuarios?filterByFormula=({Email}='${email}')`;

        try {
            const respuesta = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const datos = await respuesta.json();

            if (datos.records && datos.records.length > 0) {
                const user = datos.records[0].fields;
                if (user.Password === pass) {
                    // Guardamos la sesión
                    localStorage.setItem('usuarioLogueado', email);
                    localStorage.setItem('nombreUsuario', user.Nombre);

                    alert("¡Bienvenido, " + user.Nombre + "!");
                    window.location.href = "Bienvenidx.html"; 
                } else {
                    alert("Contraseña incorrecta.");
                }
            } else {
                alert("El correo no está registrado.");
            }
        } catch (error) {
            console.error("Error en login:", error);
        }
    };
}