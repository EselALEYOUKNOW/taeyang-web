<script type="module">
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

// 🔐 CONFIG FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyD_ZTXQCIDsJcQ8I_2QzGyyYFQrkPlnfaE",
  authDomain: "taeyang-taekwondo.firebaseapp.com",
  projectId: "taeyang-taekwondo",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ELEMENTOS
const panel = document.getElementById("adminPanel");
const logoutBtn = document.getElementById("logoutBtn");

// 🔒 PROTECCIÓN DEL PANEL
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "admin-login.html";
    return;
  }
  cargarAlumnos();
});

// 🚪 CERRAR SESIÓN
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "admin-login.html";
});

// 📥 CARGAR ALUMNOS
async function cargarAlumnos() {
  panel.innerHTML = "";

  const snapshot = await getDocs(collection(db, "Alumnos"));

  snapshot.forEach((docSnap) => {
    const alumno = docSnap.data();
    const id = docSnap.id;

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="fotos/${alumno.fotoURL || 'default.jpg'}">
      <h3>${alumno.nombre}</h3>

      <label>Estado de pago:</label>
      <select id="pago-${id}">
        <option value="PAGADO">PAGADO</option>
        <option value="PENDIENTE">PENDIENTE</option>
      </select>

      <label>Próximo pago:</label>
      <input type="date" id="fecha-${id}" value="${alumno.proximoPago || ""}">

      <label>Comprobante de pago:</label>
      <input type="file" id="file-${id}" accept="image/*">

      <button id="subir-${id}">Subir comprobante</button>

      ${
        alumno.comprobanteURL
          ? `<a href="${alumno.comprobanteURL}" target="_blank">Ver comprobante</a>`
          : `<p>No hay comprobante</p>`
      }

      <button id="btn-${id}">Guardar cambios</button>
    `;

    panel.appendChild(card);

    // valores actuales
    document.getElementById(`pago-${id}`).value =
      alumno.pago || "PENDIENTE";

    // 💾 GUARDAR DATOS
    document.getElementById(`btn-${id}`).onclick = async () => {
      const nuevoPago = document.getElementById(`pago-${id}`).value;
      const nuevaFecha = document.getElementById(`fecha-${id}`).value;

      await updateDoc(doc(db, "Alumnos", id), {
        pago: nuevoPago,
        proximoPago: nuevaFecha
      });

      alert("Datos actualizados");
    };

    // 📤 SUBIR COMPROBANTE
    document.getElementById(`subir-${id}`).onclick = async () => {
      const fileInput = document.getElementById(`file-${id}`);
      const file = fileInput.files[0];

      if (!file) {
        alert("Selecciona una imagen");
        return;
      }

      const storageRef = ref(storage, `fotos/comprobantes/${id}.jpg`);

      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      await updateDoc(doc(db, "Alumnos", id), {
        comprobanteURL: url
      });

      alert("Comprobante subido correctamente");
      cargarAlumnos();
    };
  });
}

// ➕ AGREGAR NUEVO ALUMNO
const btnAgregar = document.getElementById("btnAgregar");

btnAgregar.addEventListener("click", async () => {
  const nombre = document.getElementById("nombreNuevo").value;
  const usuario = document.getElementById("usuarioNuevo").value;
  const password = document.getElementById("passwordNuevo").value;
  const foto = document.getElementById("fotoNueva").value;
  const fecha = document.getElementById("fechaNueva").value;
  const pago = document.getElementById("pagoNuevo").value;

  if (!nombre || !usuario || !password) {
    alert("Completa todos los campos");
    return;
  }

  await addDoc(collection(db, "Alumnos"), {
    nombre,
    usuario,
    password,
    fotoURL: foto,
    pago,
    proximoPago: fecha
  });

  alert("Alumno agregado");

  document.getElementById("nombreNuevo").value = "";
  document.getElementById("usuarioNuevo").value = "";
  document.getElementById("passwordNuevo").value = "";
  document.getElementById("fotoNueva").value = "";
  document.getElementById("fechaNueva").value = "";

  cargarAlumnos();
});
</script>

