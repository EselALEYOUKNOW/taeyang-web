import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD_ZTXQCIDsJcQ8I_2QzGyyYFQrkPlnfaE",
  authDomain: "taeyang-taekwondo.firebaseapp.com",
  projectId: "taeyang-taekwondo",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const contenedor = document.getElementById("alumnos");

// Solo mostrar alumnos activos
const q = query(
  collection(db, "Alumnos"),
  where("estado", "==", "activo")
);

const snapshot = await getDocs(q);

snapshot.forEach((docSnap) => {
  const alumno = docSnap.data();

  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <img src="fotos/${alumno.fotoURL}">
    <h3>${alumno.nombre}</h3>
    <p>🔒 Click → Login</p>
  `;

  card.addEventListener("click", () => {
    window.location.href = `login.html?id=${docSnap.id}`;
  });

  contenedor.appendChild(card);
});
