import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔐 Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD_ZTXQCIDsJcQ8I_2QzGyyYFQrkPlnfaE",
  authDomain: "taeyang-taekwondo.firebaseapp.com",
  projectId: "taeyang-taekwondo",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 📌 Obtener ID del alumno
const alumnoId = localStorage.getItem("alumnoId");

if (!alumnoId) {
  window.location.href = "login.html";
}

// 📥 Cargar perfil
async function cargarPerfil() {
  const ref = doc(db, "Alumnos", alumnoId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    alert("Alumno no encontrado");
    return;
  }

  const alumno = snap.data();

  document.getElementById("nombre").textContent = alumno.nombre;
  document.getElementById("pago").textContent = alumno.pago || "—";
  document.getElementById("proximoPago").textContent = alumno.proximoPago || "—";
  document.getElementById("foto").src = `fotos/${alumno.fotoURL}`;

  if (alumno.comprobanteURL) {
    const img = document.getElementById("comprobanteImg");
    img.src = alumno.comprobanteURL;
    img.style.display = "block";
  }
}

cargarPerfil();

