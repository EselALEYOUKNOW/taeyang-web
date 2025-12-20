import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD_ZTXQCIDsJcQ8I_2QzGyyYFQrkPlnfaE",
  authDomain: "taeyang-taekwondo.firebaseapp.com",
  projectId: "taeyang-taekwondo",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const usuario = document.getElementById("usuario").value.trim();
  const password = document.getElementById("password").value.trim();

  const snapshot = await getDocs(collection(db, "Alumnos"));

  let encontrado = false;

  snapshot.forEach(doc => {
    const alumno = doc.data();

    if (alumno.usuario === usuario && alumno.password === password) {
      // ✅ LOGIN CORRECTO
      localStorage.setItem("alumnoId", doc.id);
      encontrado = true;
      window.location.href = "perfil.html";
    }
  });

  if (!encontrado) {
    alert("Usuario o contraseña incorrectos");
  }
});
