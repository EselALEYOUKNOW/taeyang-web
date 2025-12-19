import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD_ZTXQCIDsJcQ8I_2QzGyyYFQrkPlnfaE",
  authDomain: "taeyang-taekwondo.firebaseapp.com",
  projectId: "taeyang-taekwondo",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const contenedor = document.getElementById("alumnos");

const snapshot = await getDocs(collection(db, "Alumnos"));

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