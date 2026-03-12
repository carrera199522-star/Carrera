// ==============================
// REGISTRAR PLUGIN
// ==============================

Chart.register(ChartDataLabels);

// ==============================
// VARIABLES
// ==============================

let datos = [];
const tabla = document.getElementById("tablaDatos");

// ==============================
// GRAFICO JABAS
// ==============================

const ctxJabas = document.getElementById("graficoJabas").getContext("2d");

let graficoJabas = new Chart(ctxJabas, {

type: "bar",

data: {

labels: ["TOTAL"],

datasets: [{

label: "Jabas",

data: [0],

backgroundColor: "#ffa726",

borderRadius: 8

}]

},

options: {

responsive: true,

plugins: {

legend: { display: false },

datalabels: {

color:"#000",

anchor:"center",

align:"center",

font:{weight:"bold"}

}

}

}

});

// ==============================
// CARGAR TABLA
// ==============================

function cargarTabla(lista){

tabla.innerHTML = "";

lista.forEach(d => {

tabla.innerHTML += `

<tr>

<td>${d.proveedor}</td>

<td>${d.lote_campo}</td>

<td>${d.variedad}</td>

<td>${d.sub_variedad}</td>

<td>${d.jabas}</td>

<td>${d.kg}</td>

</tr>

`;

});

}

// ==============================
// ACTUALIZAR GRAFICOS
// ==============================

function actualizarGraficos(lista){

// =================
// VARIEDAD
// =================

let variedad = {};

lista.forEach(d=>{

variedad[d.variedad] = (variedad[d.variedad] || 0) + d.kg;

});

graficoVariedad.data.labels = Object.keys(variedad);
graficoVariedad.data.datasets[0].data = Object.values(variedad);
graficoVariedad.update();


// =================
// FUNDO
// =================

let fundo = {};

lista.forEach(d=>{

fundo[d.lote_campo] = (fundo[d.lote_campo] || 0) + d.kg;

});

graficoFundo.data.labels = Object.keys(fundo);
graficoFundo.data.datasets[0].data = Object.values(fundo);
graficoFundo.update();


// =================
// TOTAL INGRESO
// =================

graficoTotal.data.labels = lista.map(d=>d.lote);
graficoTotal.data.datasets[0].data = lista.map(d=>d.kg);
graficoTotal.update();


// =================
// JABAS
// =================

let totalJabas = lista.reduce((sum,d)=> sum + Number(d.jabas),0);

graficoJabas.data.datasets[0].data = [totalJabas];

graficoJabas.update();

}

// ==============================
// FILTROS
// ==============================

document.getElementById("filtroProveedor").addEventListener("change", aplicarFiltros);
document.getElementById("filtroVariedad").addEventListener("change", aplicarFiltros);

function aplicarFiltros(){

let proveedor = document.getElementById("filtroProveedor").value;
let variedad = document.getElementById("filtroVariedad").value;

let filtrados = datos.filter(d => {

return (

(proveedor === "" || d.proveedor === proveedor) &&
(variedad === "" || d.variedad === variedad)

);

});

cargarTabla(filtrados);
actualizarGraficos(filtrados);

}

// ==============================
// LEER FIREBASE
// ==============================

function cargarFirebase(){

fetch("https://appmateriaprima-default-rtdb.firebaseio.com/mp/registros.json")

.then(res => res.json())

.then(data => {

if(!data){

console.log("Firebase vacío");

return;

}

// convertir datos
datos = Object.values(data).map(d => ({

proveedor: d.proveedor || "",

lote_campo: d.lote_campo || "",

variedad: d.variedad || "",

sub_variedad: d.sub_variedad || "",

lote: d.lote || "",

jabas: Number(d.jabas) || 0,

kg: Number(d.peso_final) || 0

}));

console.log(datos);

// cargar dashboard
cargarTabla(datos);
actualizarGraficos(datos);

});

}

// ==============================
// INICIAR
// ==============================

cargarFirebase();

// ==============================
// GRAFICO VARIEDAD
// ==============================

const ctxVariedad = document.getElementById("graficoVariedad").getContext("2d");

let graficoVariedad = new Chart(ctxVariedad, {

type: "bar",

data:{
labels:[],
datasets:[{
label:"Kg",
data:[],
backgroundColor:"#ef7d00",
borderRadius:6
}]
},

options:{
indexAxis:"y",

plugins:{
legend:{display:false},

datalabels:{

color:"#000",
anchor:"end",
align:"right",
font:{weight:"bold"}
}
},

scales:{
x:{beginAtZero:true}
}

}

});	

// ==============================
// GRAFICO FUNDO
// ==============================

const ctxFundo = document.getElementById("graficoFundo").getContext("2d");

let graficoFundo = new Chart(ctxFundo,{

type:"bar",

data:{
labels:[],
datasets:[{
label:"Kg",
data:[],
backgroundColor:"#ef7d00",
borderRadius:6
}]
},

options:{
plugins:{
legend:{display:true}
}
}

});

// ==============================
// GRAFICO TOTAL
// ==============================
const ctxTotal = document.getElementById("graficoTotal").getContext("2d");

let graficoTotal = new Chart(ctxTotal,{

type:"line",

data:{
labels:[],
datasets:[{
label:"Kg ingresado",
data:[],
borderColor:"#ef7d00",
backgroundColor:"rgba(239,125,0,0.2)",
fill:true,
tension:0.4
}]
},

options:{
plugins:{
legend:{display:true}
}
}

});
