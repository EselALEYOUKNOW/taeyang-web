import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔐 Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD_ZTXQCIDsJcQ8I_2QzGyyYFQrkPlnfaE",
  authDomain: "taeyang-taekwondo.firebaseapp.com",
  projectId: "taeyang-taekwondo",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 📌 Obtener ID del alumno desde la URL
// ejemplo: perfil.html?id=ABC123
const params = new URLSearchParams(window.location.search);
const alumnoId = params.get("id");

if (!alumnoId) {
  alert("Alumno no especificado");
  throw new Error("No hay ID de alumno");
}

// 📥 Cargar datos del alumno
async function cargarPerfil() {
  const refAlumno = doc(db, "Alumnos", alumnoId);
  const snap = await getDoc(refAlumno);

  if (!snap.exists()) {
    alert("Alumno no encontrado");
    return;
  }

  const alumno = snap.data();

  // Datos básicos
  document.getElementById("nombre").textContent = alumno.nombre;
  document.getElementById("pago").textContent = alumno.pago || "—";
  document.getElementById("proximoPago").textContent = alumno.proximoPago || "—";

  // Foto de perfil
  if (alumno.fotoURL) {
    document.getElementById("foto").src = `fotos/${alumno.fotoURL}`;
  }

  // 🧾 Comprobante
  if (alumno.comprobanteURL) {
    const img = document.getElementById("comprobanteImg");
    img.src = alumno.comprobanteURL;
    img.style.display = "block";
  }
}

cargarPerfil();
