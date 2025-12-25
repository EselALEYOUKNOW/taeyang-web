import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD_ZTXQCIDsJcQ8I_2QzGyyYFQrkPlnfaE",
  authDomain: "taeyang-taekwondo.firebaseapp.com",
  projectId: "taeyang-taekwondo",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ===============================
// VERIFICAR SESIÓN
// ===============================
const alumnoId = localStorage.getItem("alumnoId");

if (!alumnoId) {
  alert("Acceso no autorizado");
  window.location.href = "login.html";
}

// ===============================
// OBTENER DATOS
// ===============================
const ref = doc(db, "Alumnos", alumnoId);
const snap = await getDoc(ref);

if (!snap.exists()) {
  alert("Alumno no existe");
  localStorage.removeItem("alumnoId");
  window.location.href = "login.html";
}

const alumno = snap.data();

// ===============================
// MOSTRAR PERFIL
// ===============================
document.getElementById("foto").src = "fotos/" + alumno.fotoURL;
document.getElementById("nombre").textContent = alumno.nombre;
document.getElementById("pago").textContent = alumno.pago;
document.getElementById("proximoPago").textContent = alumno.proximoPago;

if (alumno.comprobanteURL) {
  const img = document.getElementById("comprobanteImg");
  img.src = alumno.comprobanteURL;
  img.style.display = "block";
}

