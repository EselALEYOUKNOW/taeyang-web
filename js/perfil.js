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
// OBTENER ID
// ===============================
const params = new URLSearchParams(window.location.search);
let alumnoId = params.get("id");

// 🔹 SI NO VIENE EN LA URL, BUSCAR EN LOCALSTORAGE
if (!alumnoId) {
  alumnoId = localStorage.getItem("alumnoId");
}

// 🔹 SI AÚN NO EXISTE
if (!alumnoId) {
  alert("No hay alumno seleccionado");
  throw new Error("Alumno ID no encontrado");
}

// ===============================
// LEER FIRESTORE
// ===============================
const ref = doc(db, "Alumnos", alumnoId);
const snap = await getDoc(ref);

if (!snap.exists()) {
  alert("Alumno no existe");
  throw new Error("Documento no existe");
}

const alumno = snap.data();

// ===============================
// MOSTRAR DATOS
// ===============================
document.getElementById("foto").src = "fotos/" + alumno.fotoURL;
document.getElementById("nombre").textContent = alumno.nombre;
document.getElementById("pago").textContent = alumno.pago;
document.getElementById("proximoPago").textContent = alumno.proximoPago;
