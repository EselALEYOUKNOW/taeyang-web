// js/perfil.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD_ZTXQCIDsJcQ8I_2QzGyyYFQrkPlnfaE",
  authDomain: "taeyang-taekwondo.firebaseapp.com",
  projectId: "taeyang-taekwondo",
  // ...otros campos si los tienes
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Detecta el usuario logueado
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Cargar perfil del usuario con su UID
    await cargarPerfil(user.uid);
  } else {
    console.log("No hay usuario logueado");
    // Redirigir al login si no hay usuario
    window.location.href = "login.html";
  }
});

async function cargarPerfil(uidAlumno) {
  try {
    const docRef = doc(db, "alumnos", uidAlumno);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      document.getElementById("nombre").textContent = data.nombre || "Nombre no disponible";
      document.getElementById("foto").src = data.fotoUrl || "images/default.jpg";
      document.getElementById("pago").textContent = data.estadoPago || "No disponible";
      document.getElementById("proximoPago").textContent = data.proximoPago || "No disponible";
    } else {
      console.log("Alumno no encontrado en Firestore");
      document.getElementById("nombre").textContent = "Alumno no encontrado";
    }
  } catch (error) {
    console.error("Error al cargar perfil:", error);
  }
}
