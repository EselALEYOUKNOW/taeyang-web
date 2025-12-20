import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔐 CONFIG FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyD_ZTXQCIDsJcQ8I_2QzGyyYFQrkPlnfaE",
  authDomain: "taeyang-taekwondo.firebaseapp.com",
  projectId: "taeyang-taekwondo",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const panel = document.getElementById("adminPanel");
panel.innerHTML = "";

// 📥 CARGAR ALUMNOS
const snapshot = await getDocs(collection(db, "Alumnos"));

snapshot.forEach(docSnap => {
  const alumno = docSnap.data();
  const id = docSnap.id;

  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <img src="fotos/${alumno.fotoURL}">
    <h3>${alumno.nombre}</h3>

    <label>Estado de pago:</label>
    <select id="pago-${id}">
      <option value="PAGADO">PAGADO</option>
      <option value="PENDIENTE">PENDIENTE</option>
    </select>

    <label>Próximo pago:</label>
    <input type="date" id="fecha-${id}" value="${alumno.proximoPago}">

    <button id="btn-${id}">Guardar</button>
  `;

  panel.appendChild(card);

  // Valores actuales
  document.getElementById(`pago-${id}`).value = alumno.pago;

  // 💾 GUARDAR CAMBIOS
  document.getElementById(`btn-${id}`).onclick = async () => {
    const nuevoPago = document.getElementById(`pago-${id}`).value;
    const nuevaFecha = document.getElementById(`fecha-${id}`).value;

    await updateDoc(doc(db, "Alumnos", id), {
      pago: nuevoPago,
      proximoPago: nuevaFecha
    });

    alert("Datos actualizados");
  };
});
