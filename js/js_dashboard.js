// ==============================
// sem
// ==============================
function semanaActual(){

let hoy = new Date();

let inicio = new Date(hoy.getFullYear(),0,1);

let dias = Math.floor((hoy - inicio) / (24*60*60*1000));

return Math.ceil((dias + inicio.getDay()+1)/7);

}




// ==============================
// PLUGIN
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
backgroundColor: "#21B971",
borderRadius: 8
}]
},

options: {

animation: {
duration:1200,
easing:'easeOutQuart'
},

plugins:{
legend:{display:false}
}

}

});

// ==============================
// GRAFICO VARIEDAD
// ==============================

const ctxVariedad = document.getElementById("graficoVariedad").getContext("2d");

let graficoVariedad = new Chart(ctxVariedad,{
type:"bar",
data:{labels:[],datasets:[{data:[],backgroundColor:"#21B971"}]},
options:{indexAxis:"y"}
});

// ==============================
// SEMANAS
// ==============================

function obtenerSemana(fechaStr){

let partes = fechaStr.split("/"); // dd/mm/yyyy
let fecha = new Date(partes[2], partes[1]-1, partes[0]);

let inicio = new Date(fecha.getFullYear(),0,1);

let dias = Math.floor((fecha - inicio) / (24*60*60*1000));

return Math.ceil((dias + inicio.getDay()+1)/7);

}


// ==============================
// GRAFICO FUNDO
// ==============================

const ctxFundo = document.getElementById("graficoFundo").getContext("2d");

let gradient = ctxFundo.createLinearGradient(0,0,0,400);
gradient.addColorStop(0,"#21B971");
gradient.addColorStop(1,"#21B971");

let graficoFundo = new Chart(ctxFundo,{
type:"bar",
data:{
labels:[],
datasets:[{
data:[],
backgroundColor:gradient,
borderRadius:10
}]
}
});
// ==============================
// GRAFICO TOTAL
// ==============================

const ctxTotal = document.getElementById("graficoTotal").getContext("2d");

let graficoTotal = new Chart(ctxTotal,{
type:"line",
data:{labels:[],datasets:[{data:[],borderColor:"#21B971",fill:false}]}
});

// ==============================
// TABLA
// ==============================

function cargarTabla(lista){

tabla.innerHTML="";

lista.forEach(d=>{

tabla.innerHTML+=`
<tr>
<td>${d.proveedor}</td>
<td>${d.lote_campo}</td>
<td>${d.variedad}</td>
<td>${d.sub_variedad}</td>
<td>${d.jabas}</td>
<td>${Math.round(d.kg).toLocaleString("es-PE")}</td>
</tr>
`;

});

}

// ==============================
// TARJETAS
// ==============================

function actualizarTarjetas(lista){

let totalKg = lista.reduce((sum,d)=> sum+d.kg,0);
let totalJabas = lista.reduce((sum,d)=> sum+d.jabas,0);
let promedio = lista.length>0 ? totalKg/lista.length : 0;
let proveedores = new Set(lista.map(d=>d.proveedor)).size;

document.getElementById("tn").innerText =
Math.round(totalKg/1000).toLocaleString("es-PE");

document.getElementById("promedio").innerText =
Math.round(promedio).toLocaleString("es-PE");

document.getElementById("jabas").innerText =
totalJabas.toLocaleString("es-PE");

document.getElementById("proveedores").innerText =
proveedores;

}

// ==============================
// GRAFICOS
// ==============================

function actualizarGraficos(lista){

let variedad={};
let fundo={};

lista.forEach(d=>{
variedad[d.variedad]=(variedad[d.variedad]||0)+d.kg;
fundo[d.lote_campo]=(fundo[d.lote_campo]||0)+d.kg;
});

graficoVariedad.data.labels=Object.keys(variedad);
graficoVariedad.data.datasets[0].data=Object.values(variedad);
graficoVariedad.update();

graficoFundo.data.labels=Object.keys(fundo);
graficoFundo.data.datasets[0].data=Object.values(fundo);
graficoFundo.update();

graficoTotal.data.labels=lista.map(d=>d.lote);
graficoTotal.data.datasets[0].data=lista.map(d=>d.kg);
graficoTotal.update();

let totalJabas=lista.reduce((s,d)=>s+d.jabas,0);
graficoJabas.data.datasets[0].data=[totalJabas];
graficoJabas.update();

}

// ==============================
// FILTROS
// ==============================

function aplicarFiltros(){

let fecha = document.getElementById("filtroFecha").value;
let proveedor = document.getElementById("filtroProveedor").value;
let variedad = document.getElementById("filtroVariedad").value;
let mp = document.getElementById("filtroMP").value;
let semana = document.getElementById("filtroSemana").value;
let filtrados = datos.filter(d => {

return(

(fecha === "" || d.fecha == fecha) &&
(semana === "" || d.semana == semana) &&
(proveedor === "" || d.proveedor == proveedor) &&
(variedad === "" || d.variedad == variedad) &&
(mp === "" || d.mp == mp)

);

});

cargarTabla(filtrados);
actualizarGraficos(filtrados);
actualizarTarjetas(filtrados);

}
// ==============================
// LLENAR FILTROS
// ==============================

function llenarFiltros(){

let filtroFecha = document.getElementById("filtroFecha");
let filtroProveedor = document.getElementById("filtroProveedor");
let filtroVariedad = document.getElementById("filtroVariedad");

// limpiar filtros antes de llenarlos
filtroFecha.innerHTML = `<option value="">Fecha</option>`;
filtroProveedor.innerHTML = `<option value="">Proveedor</option>`;
filtroVariedad.innerHTML = `<option value="">Variedad</option>`;

// obtener valores únicos y limpiar espacios


let fechas = [...new Set(datos.map(d => (d.fecha || "").toString().trim()))];

fechas.sort((a,b)=>{

let pa = a.split("/");
let pb = b.split("/");

let fa = new Date(pa[2], pa[1]-1, pa[0]);
let fb = new Date(pb[2], pb[1]-1, pb[0]);

return fa - fb;

});

let proveedores = [...new Set(datos.map(d => (d.proveedor || "").toString().trim()))];
let variedades = [...new Set(datos.map(d => (d.variedad || "").toString().trim()))];

// ordenar solo estos
proveedores.sort();
variedades.sort();
// llenar fechas
fechas.forEach(f=>{
if(f !== "") filtroFecha.innerHTML += `<option value="${f}">${f}</option>`;
});

// llenar proveedores
proveedores.forEach(p=>{
if(p !== "") filtroProveedor.innerHTML += `<option value="${p}">${p}</option>`;
});

// llenar variedades
variedades.forEach(v=>{
if(v !== "") filtroVariedad.innerHTML += `<option value="${v}">${v}</option>`;
});


// llenar semana
let semanas = [...new Set(datos.map(d=>d.semana))];
let filtroSemana = document.getElementById("filtroSemana");
filtroSemana.innerHTML = `<option value="">Semana</option>`;
semanas.sort((a,b)=>a-b);
semanas.forEach(s=>{
filtroSemana.innerHTML += `<option value="${s}">Semana ${s}</option>`;
});

}

// ==============================
// FIREBASE
// ==============================

function cargarFirebase(){

fetch("https://appmateriaprima-default-rtdb.firebaseio.com/mp/registros.json")

.then(res=>res.json())

.then(data=>{

datos = Object.values(data)
.filter(d => d.jabas && !isNaN(d.jabas))
.map(d=>({

fecha: convertirFechaExcel(d.fecha),
semana: obtenerSemana(convertirFechaExcel(d.fecha)),
proveedor:d.proveedor || "",
lote_campo:d.lote_campo || "",
variedad:d.variedad || "",
sub_variedad:d.sub_variedad || "",
lote:d.lote || "",
mp: d.mp || "",   // ← ESTA LINEA ES IMPORTANTE
jabas:Number(d.jabas) || 0,
kg:Number(d.peso_final) || 0

}));




cargarTabla(datos);
actualizarGraficos(datos);
actualizarTarjetas(datos);
llenarFiltros();
let semanaHoy = semanaActual();
let filtroSemana = document.getElementById("filtroSemana");
filtroSemana.value = semanaHoy;
aplicarFiltros();
});


}
function convertirFechaExcel(numero){

if(!numero) return "";

let fecha = new Date((numero - 25569) * 86400 * 1000);

fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset());

return fecha.toLocaleDateString("es-PE");

}


// ==============================
// EVENTOS FILTROS
// ==============================

document.getElementById("filtroFecha").addEventListener("change", aplicarFiltros);
document.getElementById("filtroProveedor").addEventListener("change", aplicarFiltros);
document.getElementById("filtroVariedad").addEventListener("change", aplicarFiltros);
document.getElementById("filtroMP").addEventListener("change", aplicarFiltros);
document.getElementById("filtroSemana").addEventListener("change", aplicarFiltros);

// ==============================
// INICIAR
// ==============================

datasets:[{
data:[],
backgroundColor:"#21B971",
borderRadius:10
}]



cargarFirebase();
