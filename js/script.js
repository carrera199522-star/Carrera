document.addEventListener("DOMContentLoaded", () => {

const elementos = document.querySelectorAll(".animar");

const observer = new IntersectionObserver((entries) => {

entries.forEach(entry => {

if(entry.isIntersecting){
entry.target.classList.add("mostrar");
}

});

});

elementos.forEach(el => observer.observe(el));


/* EFECTO 3D EN TARJETAS */

const cards = document.querySelectorAll(".card-opcion");

cards.forEach(card => {

card.addEventListener("mousemove", (e) => {

const rect = card.getBoundingClientRect();

const x = e.clientX - rect.left;
const y = e.clientY - rect.top;

const centerX = rect.width / 2;
const centerY = rect.height / 2;

const rotateX = -(y - centerY) / 10;
const rotateY = (x - centerX) / 10;

card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;

});

card.addEventListener("mouseleave", () => {

card.style.transform = "rotateX(0) rotateY(0) scale(1)";

});

});


/* CONTADOR ANIMADO */

const numeros = document.querySelectorAll(".contador");

numeros.forEach(num => {

let valor = 0;
const objetivo = num.dataset.numero;

const intervalo = setInterval(() => {

valor += Math.ceil(objetivo / 40);

if(valor >= objetivo){
valor = objetivo;
clearInterval(intervalo);
}

num.textContent = valor;

},40);

});

});

var firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "appmateriaprima.firebaseapp.com",
  databaseURL: "https://appmateriaprima-default-rtdb.firebaseio.com/",
  projectId: "appmateriaprima",
  storageBucket: "appmateriaprima.appspot.com",
  messagingSenderId: "XXXX",
  appId: "XXXX"
};

firebase.initializeApp(firebaseConfig);



document.addEventListener("DOMContentLoaded", function(){

let totalCamiones = 0;
let totalJabas = 0;

firebase.database().ref("despachos").on("value", function(snapshot){

totalCamiones = 0;
totalJabas = 0;

snapshot.forEach(function(child){

let data = child.val();

if(data.proveedor === "AGROINDUSTRIA CASABLANCA"){

totalCamiones++;

totalJabas += parseInt(data.jabas) || 0;

}

});

document.getElementById("camiones-calera").innerText = totalCamiones;

document.getElementById("jabas-calera").innerText = totalJabas.toLocaleString();

});

});
