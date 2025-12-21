const btn = document.getElementById("btnEntrar");
const menu = document.getElementById("menu");

btn.addEventListener("click", () => {
  // Oculta hero
  document.querySelector(".hero").style.display = "none";

  // Muestra menú
  menu.style.display = "flex";
});
