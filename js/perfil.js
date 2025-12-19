import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD_ZTXQCIDsJcQ8I_2QzGyyYFQrkPlnfaE",
  authDomain: "taeyang-taekwondo.firebaseapp.com",
  projectId: "taeyang-taekwondo",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// OBTENER ID DESDE LA URL
const params = new URLSearchParams(window.location.search);
const alumnoId = params.get("id");

if (!alumnoId) {
  alert("Alumno no encontrado");
  throw new Error("ID no encontrado");
}

// LEER ALUMNO
const ref = doc(db, "Alumnos", alumnoId);
const snap = await getDoc(ref);

if (!snap.exists()) {
  alert("Alumno no existe");
  throw new Error("Documento no existe");
}

const alumno = snap.data();

// MOSTRAR DATOS
document.getElementById("foto").src = alumno.fotoURL;
document.getElementById("nombre").textContent = alumno.nombre;
document.getElementById("pago").textContent = alumno.pago;
document.getElementById("proximoPago").textContent = alumno.proximoPago;
