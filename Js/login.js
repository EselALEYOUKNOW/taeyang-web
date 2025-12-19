import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD_ZTXQCIDsJcQ8I_2QzGyyYFQrkPlnfaE",
  authDomain: "taeyang-taekwondo.firebaseapp.com",
  projectId: "taeyang-taekwondo",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// LEER ID DEL ALUMNO DESDE URL
const params = new URLSearchParams(window.location.search);
const alumnoId = params.get("id");

if (!alumnoId) {
  alert("Acceso no válido");
  window.location.href = "index.html";
}

// FORM
const form = document.getElementById("loginForm");
const error = document.getElementById("error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const usuario = document.getElementById("usuario").value;
  const password = document.getElementById("password").value;

  const alumnoRef = doc(db, "alumnos", alumnoId);
  const alumnoSnap = await getDoc(alumnoRef);

  if (!alumnoSnap.exists()) {
    error.style.display = "block";
    return;
  }

  const alumno = alumnoSnap.data();

  if (alumno.usuario === usuario && alumno.password === password) {
    localStorage.setItem("alumnoId", alumnoId);
    window.location.href = "perfil.html";
  } else {
    error.style.display = "block";
  }
});
