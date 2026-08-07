// ===============================
// FIREBASE
// ===============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
    getFirestore,
    collection,
    getDocs,
    doc,
    updateDoc,
    addDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";


// ===============================
// CONFIG FIREBASE
// ===============================

const firebaseConfig = {

    apiKey: "AIzaSyD_ZTXQCIDsJcQ8I_2QzGyyYFQrkPlnfaE",

    authDomain: "taeyang-taekwondo.firebaseapp.com",

    projectId: "taeyang-taekwondo",

    storageBucket: "taeyang-taekwondo.appspot.com"

};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);


// ===============================
// ELEMENTOS HTML
// ===============================

const panel = document.getElementById("adminPanel");

const logoutBtn = document.getElementById("logoutBtn");

const btnAgregar = document.getElementById("btnAgregar");


// ===============================
// PROTEGER PANEL
// ===============================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "admin-login.html";

        return;

    }

    cargarAlumnos();

});


// ===============================
// CERRAR SESIÓN
// ===============================

logoutBtn.addEventListener("click", async () => {

    await signOut(auth);

    window.location.href = "admin-login.html";

});

// ===============================
// CARGAR ALUMNOS
// ===============================

async function cargarAlumnos() {

    panel.innerHTML = "<h2>Cargando alumnos...</h2>";

    try {

        const snapshot = await getDocs(collection(db, "Alumnos"));

        panel.innerHTML = "";

        if (snapshot.empty) {

            panel.innerHTML = "<h2>No hay alumnos registrados.</h2>";

            return;

        }

        snapshot.forEach((docSnap) => {

            const alumno = {

                id: docSnap.id,

                ...docSnap.data()

            };

            crearTarjetaAlumno(alumno);

        });

    }

    catch(error){

        console.error(error);

        panel.innerHTML = "<h2>Error al cargar alumnos.</h2>";

    }

}
// ===============================
// CREAR TARJETA DEL ALUMNO
// ===============================

function crearTarjetaAlumno(alumno){

    const card = document.createElement("div");

    card.className = "admin-card";

    card.innerHTML = `

    <div class="admin-foto">

        <img src="fotos/${alumno.fotoURL || "default.jpg"}" alt="${alumno.nombre}">

    </div>

    <div class="admin-info">

        <h2>${alumno.nombre}</h2>

        <label>Usuario</label>

        <input
            type="text"
            id="usuario-${alumno.id}"
            value="${alumno.usuario || ""}"
        >

        <label>Estado del alumno</label>

        <select id="estado-${alumno.id}">

            <option value="activo">ACTIVO</option>

            <option value="inactivo">INACTIVO</option>

        </select>

        <label>Estado del pago</label>

        <select id="pago-${alumno.id}">

            <option value="PAGADO">PAGADO</option>

            <option value="PENDIENTE">PENDIENTE</option>

        </select>

        <label>Próximo pago</label>

        <input
            type="date"
            id="fecha-${alumno.id}"
            value="${alumno.proximoPago || ""}"
        >

        <label>Comprobante</label>

        <input
            type="file"
            id="archivo-${alumno.id}"
            accept="image/*"
        >

        <div class="admin-botones">

            <button id="guardar-${alumno.id}">
                💾 Guardar cambios
            </button>

            <button id="comprobante-${alumno.id}">
                📤 Subir comprobante
            </button>

        </div>

    </div>

    `;

    panel.appendChild(card);

    document.getElementById(`estado-${alumno.id}`).value =
        alumno.estado || "activo";

    document.getElementById(`pago-${alumno.id}`).value =
        alumno.pago || "PENDIENTE";
// ===============================
// GUARDAR CAMBIOS
// ===============================

document
.getElementById(`guardar-${alumno.id}`)
.addEventListener("click", async () => {

    try{

        await updateDoc(
            doc(db,"Alumnos",alumno.id),
            {

                usuario:
                document.getElementById(`usuario-${alumno.id}`).value,

                estado:
                document.getElementById(`estado-${alumno.id}`).value,

                pago:
                document.getElementById(`pago-${alumno.id}`).value,

                proximoPago:
                document.getElementById(`fecha-${alumno.id}`).value

            }
        );

        alert("Alumno actualizado correctamente.");

    }
    catch(error){

        console.error(error);

        alert("Error al guardar.");

    }

});


// ===============================
// SUBIR COMPROBANTE
// ===============================

document
.getElementById(`comprobante-${alumno.id}`)
.addEventListener("click", async () => {

    const archivo =
        document.getElementById(`archivo-${alumno.id}`).files[0];

    if(!archivo){

        alert("Selecciona una imagen.");

        return;

    }

    try{

        const ruta =
            ref(storage,`comprobantes/${alumno.id}.jpg`);

        await uploadBytes(ruta,archivo);

        const url =
            await getDownloadURL(ruta);

        await updateDoc(
            doc(db,"Alumnos",alumno.id),
            {

                comprobanteURL:url

            }
        );

        alert("Comprobante subido correctamente.");

        cargarAlumnos();

    }
    catch(error){

        console.error(error);

        alert("Error al subir el comprobante.");

    }

});
}
// ===============================
// AGREGAR NUEVO ALUMNO
// ===============================

btnAgregar.addEventListener("click", async () => {

    const nombre =
        document.getElementById("nombreNuevo").value.trim();

    const usuario =
        document.getElementById("usuarioNuevo").value.trim();

    const password =
        document.getElementById("passwordNuevo").value.trim();

    const foto =
        document.getElementById("fotoNueva").value.trim();

    const fecha =
        document.getElementById("fechaNueva").value;

    const pago =
        document.getElementById("pagoNuevo").value;

    if (
        nombre === "" ||
        usuario === "" ||
        password === ""
    ) {

        alert("Completa todos los campos obligatorios.");

        return;

    }

    try{

        await addDoc(collection(db,"Alumnos"),{

            nombre: nombre,

            usuario: usuario,

            password: password,

            fotoURL: foto || "default.jpg",

            pago: pago,

            proximoPago: fecha,

            estado: "activo",

            comprobanteURL: ""

        });

        alert("Alumno agregado correctamente.");

        document.getElementById("nombreNuevo").value="";
        document.getElementById("usuarioNuevo").value="";
        document.getElementById("passwordNuevo").value="";
        document.getElementById("fotoNueva").value="";
        document.getElementById("fechaNueva").value="";
        document.getElementById("pagoNuevo").value="PAGADO";

        cargarAlumnos();

    }
    catch(error){

        console.error(error);

        alert("Error al agregar el alumno.");

    }

});
