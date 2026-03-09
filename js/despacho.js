// ============================
// HERO IMAGEN EN MOVIMIENTO
// ============================

document.addEventListener("DOMContentLoaded", function(){

const hero = document.querySelector(".hero");

if(hero){

const imagenes = [
"img/img4.jpg",
"img/img5.jpg",
"img/img6.jpg"
];

let index = 0;

function cambiarImagen(){

hero.style.backgroundImage = `url(${imagenes[index]})`;
hero.style.backgroundPosition = "center";

index++;

if(index >= imagenes.length){
index = 0;
}

}

cambiarImagen();
setInterval(cambiarImagen,9000);

}

});


// ============================
// FIREBASE
// ============================

let listaDespachos = [];
let jabasProveedor = {};
const firebaseConfig = {
apiKey: "AIzaSyCy1xrDp1bXktSfCKfspqTwQgAG25CQITc",
authDomain: "appmateriaprima.firebaseapp.com",
databaseURL: "https://appmateriaprima-default-rtdb.firebaseio.com",
projectId: "appmateriaprima",
storageBucket: "appmateriaprima.firebasestorage.app",
messagingSenderId: "352383418434",
appId: "1:352383418434:web:c176d4685d864be75d2ddb"
};

firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const ref = database.ref("despachos");

ref.on("value", function(snapshot){

listaDespachos = [];

snapshot.forEach(function(child){

const datos = child.val();

if(!datos.placa) return;

listaDespachos.push(datos);
let proveedor = datos.proveedor || "Sin proveedor";

let cantidad = parseInt(datos.jabas) || 0;

if(!jabasProveedor[proveedor]){
jabasProveedor[proveedor] = 0;
}

jabasProveedor[proveedor] += cantidad;

});

mostrarTabla(listaDespachos);
actualizarEstadisticas(listaDespachos);

let totalCamiones = listaDespachos.length;

let totalJabas = 0;

listaDespachos.forEach(d => {

let j = parseInt(d.jabas) || 0;

totalJabas += j;

});

document.getElementById("totalCamiones").innerText = totalCamiones;
document.getElementById("totalJabas").innerText = totalJabas;

});


// ============================
// MOSTRAR TABLA
// ============================

function mostrarTabla(lista){

const tabla = document.getElementById("tablaDatos");

tabla.innerHTML = "";

lista.forEach(function(datos){

const fila = `
<tr>
<td>${datos.fecha || "--"}</td>
<td>${datos.placa || "--"}</td>
<td>${datos.chofer || "--"}</td>
<td>${datos.envase || "--"}</td>
<td>${datos.proveedor || "--"}</td>
<td>${datos.fundo || "--"}</td>
<td>${datos.jabas || "--"}</td>
<td>${datos.pallets || "--"}</td>
<td>${datos.sobrantes || "--"}</td>
</tr>
`;

tabla.innerHTML += fila;

});

}


// ============================
// FILTROS
// ============================

document.getElementById("buscarProveedor").addEventListener("keyup", filtrar);
document.getElementById("buscarFundo").addEventListener("keyup", filtrar);
document.getElementById("buscarFecha").addEventListener("change", filtrar);

function filtrar(){

const proveedor = document.getElementById("buscarProveedor").value.toLowerCase();
const fundo = document.getElementById("buscarFundo").value.toLowerCase();
const fecha = document.getElementById("buscarFecha").value;

const filtrados = listaDespachos.filter(d =>

(!proveedor || (d.proveedor || "").toLowerCase().includes(proveedor)) &&
(!fundo || (d.fundo || "").toLowerCase().includes(fundo)) &&
(!fecha || d.fecha === fecha)

);

mostrarTabla(filtrados);
actualizarEstadisticas(filtrados);

}
function actualizarEstadisticas(lista){

let totalCamiones = lista.length;

let totalJabas = 0;

lista.forEach(d => {

let j = parseInt(d.jabas) || 0;

totalJabas += j;

});

animarNumero("totalCamiones",totalCamiones);
animarNumero("totalJabas",totalJabas);

}

function animarNumero(id,valor){

let elemento = document.getElementById(id);
let contador = 0;

let intervalo = setInterval(()=>{

contador += Math.ceil(valor/30);

if(contador >= valor){
contador = valor;
clearInterval(intervalo);
}

elemento.innerText = contador;

},30);

}

function animarNumero(id,valor){

let elemento = document.getElementById(id);

let contador = 0;

let intervalo = setInterval(()=>{

contador += Math.ceil(valor/20);

if(contador >= valor){

contador = valor;

clearInterval(intervalo);

}

elemento.innerText = contador;

},30);

}
let grafico;

/* FUNCION PARA CREAR EL GRAFICO */

function crearGrafico(datos){

const proveedores = Object.keys(datos);
const jabas = Object.values(datos);

const ctx = document.getElementById("graficoJabas").getContext("2d");

if(grafico){
grafico.destroy();
}

grafico = new Chart(ctx, {

type: "bar",

data:{

labels: proveedores,

datasets:[{

label:"Jabas despachadas",

data: jabas,

backgroundColor:"#1f6f8b"

}]

},

options:{

responsive:true,

plugins:{
legend:{display:false}
},

scales:{
y:{
beginAtZero:true
}
}

}

});

}

/* ANIMACION SUAVE AL CARGAR */

window.addEventListener("load", () => {

const hero = document.querySelector(".hero-contenido");

hero.style.opacity = "0";
hero.style.transform = "translateY(40px)";

setTimeout(() => {

hero.style.transition = "all 0.8s ease";
hero.style.opacity = "1";
hero.style.transform = "translateY(0px)";

},200);

});
