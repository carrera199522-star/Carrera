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
let proyeccionTN = 0;
let proyeccionDatos = [];
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
legend:{display:false},

tooltip:{
callbacks:{
label:function(context){
return context.raw.toLocaleString("es-PE") + " kg";
}
}
},

datalabels:{
formatter:function(value){
return value.toLocaleString("es-PE");
}
}

}

}
});

// ==============================
// GRAFICO VARIEDAD
// ==============================

const ctxVariedad = document.getElementById("graficoVariedad").getContext("2d");

let graficoVariedad = new Chart(ctxVariedad,{
type:"bar",
data:{
labels:[],
datasets:[{
label:"Kg",
data:[],
backgroundColor:"#21B971"
}]
},

options:{
indexAxis:"y",

plugins:{
legend:{display:false},

datalabels:{
formatter:function(value){
return value.toLocaleString("es-PE");
}
}

}

}

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
label:"Kg",
data:[],
backgroundColor:gradient,
borderRadius:10
}]
},

options:{
plugins:{
legend:{display:false},

datalabels:{
formatter:function(value){
return value.toLocaleString("es-PE");
}
}

}
}

});


// ==============================
// GRAFICO TOTAL
// ==============================

const ctxTotal = document.getElementById("graficoTotal").getContext("2d");

let graficoTotal = new Chart(ctxTotal,{
type:"doughnut",
data:{
labels:["Ingreso","Restante"],
datasets:[{
data:[0,0],
backgroundColor:["#21B971","#e0e0e0"],
borderWidth:0
}]
},

options:{
plugins:{
legend:{
position:"bottom"
},

datalabels:{
formatter:function(value){
return value.toLocaleString("es-PE");
}
}

}
}

});
// ==============================
// TABLA
// ==============================

function cargarTabla(lista){

tabla.innerHTML="";

lista.forEach(d=>{

tabla.innerHTML+=`
<tr>
<td>${d.fecha}</td>
<td>${d.proveedor}</td>
<td>${d.lote || ""}</td>
<td>${d.guia || ""}</td>
<td>${d.jabas}</td>
<td>${Math.round(d.kg).toLocaleString("es-PE")}</td>
<td>${d.mp}</td>
<td>${d.variedad}</td>
<td>${d.sub_variedad}</td>
<td>${d.lote_campo}</td>
<td>${d.clp || ""}</td>
<td>${d.acopio || ""}</td>
<td>${d.entrega || ""}</td>
</tr>
`;

});

// calcular totales
let totalJabas = lista.reduce((sum,d)=>sum+d.jabas,0);
let totalKg = lista.reduce((sum,d)=>sum+d.kg,0);

// agregar fila total
tabla.innerHTML+=`
<tr class="fila-total">
<td colspan="4"><strong>TOTAL</strong></td>
<td><strong>${totalJabas.toLocaleString("es-PE")}</strong></td>
<td><strong>${Math.round(totalKg).toLocaleString("es-PE")}</strong></td>
<td colspan="7"></td>
</tr>
`;

}

// ==============================
// TARJETAS
// ==============================
function actualizarTarjetas(lista){

let totalKg = lista.reduce((sum,d)=> sum + d.kg, 0);
let totalJabas = lista.reduce((sum,d)=> sum + d.jabas, 0);
let promedio = lista.length > 0 ? totalKg / lista.length : 0;

document.getElementById("tn").innerText =
Math.round(totalKg/1000).toLocaleString("es-PE");

document.getElementById("promedio").innerText =
Math.round(promedio).toLocaleString("es-PE");

document.getElementById("jabas").innerText =
totalJabas.toLocaleString("es-PE");


// ==============================
// DIFERENCIA PROYECCION
// ==============================

let ingresoTN = totalKg / 1000;
let proyeccion = proyeccionTN;

let diferencia = 0;

if (ingresoTN > 0) {

let porcentaje = Math.round((proyeccion / ingresoTN) * 100);

diferencia = 100 - porcentaje;

}

document.getElementById("diferencia").innerText =
diferencia + "%";
document.getElementById("diferencia").innerText =
Math.round(diferencia) + "%";

}
// ==============================
// GRAFICO DIA
// ==============================
// ==============================
// INGRESO POR DIA
// ==============================

const ctxDia = document.getElementById("graficoDia").getContext("2d");

let graficoDia = new Chart(ctxDia,{
type:"line",
data:{
labels:["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"],
datasets:[{
label:"TN",
data:[0,0,0,0,0,0,0],
borderColor:"#21B971",
backgroundColor:"rgba(33,185,113,0.2)",
tension:0.3,
fill:true
}]
}
});
// ==============================
// GRAFICOS
// ==============================

function actualizarGraficos(lista){

let variedad={};
let fundo={};

// ==============================
// VARIEDAD Y FUNDO
// ==============================

lista.forEach(d=>{

variedad[d.variedad]=(variedad[d.variedad]||0)+d.kg;
fundo[d.lote_campo]=(fundo[d.lote_campo]||0)+d.kg;

});

// grafico variedad
graficoVariedad.data.labels=Object.keys(variedad);
graficoVariedad.data.datasets[0].data=
Object.values(variedad).map(v=>Math.round(v));
graficoVariedad.update();

// grafico fundo
graficoFundo.data.labels=Object.keys(fundo);
graficoFundo.data.datasets[0].data=
Object.values(fundo).map(v=>Math.round(v));
graficoFundo.update();


// ==============================
// JABAS SOLO POR SEMANA
// ==============================

let proveedorJabas={};

let semanaSeleccionada=document.getElementById("filtroSemana").value;

let listaSemana=datos.filter(d=>String(d.semana)===String(semanaSeleccionada));

listaSemana.forEach(d=>{
proveedorJabas[d.proveedor]=(proveedorJabas[d.proveedor]||0)+d.jabas;
});

graficoJabas.data.labels=Object.keys(proveedorJabas);
graficoJabas.data.datasets[0].data=Object.values(proveedorJabas);
graficoJabas.update();


// ==============================
// TOTAL INGRESO
// ==============================

let totalKg = lista.reduce((sum,d)=>sum+d.kg,0);
let ingresoTN = totalKg/1000;

let proyeccion = proyeccionTN;

graficoTotal.data.labels = ["Ingreso","Proyección"];

graficoTotal.data.datasets[0].data = [
Math.round(ingresoTN),
Math.round(proyeccion)
];

graficoTotal.update();


// ==============================
// INGRESO POR DIA
// ==============================

let dias=[0,0,0,0,0,0,0];

let semanaFiltro=document.getElementById("filtroSemana").value;
let proveedorSeleccionado=document.getElementById("filtroProveedor").value;
let variedadSeleccionada=document.getElementById("filtroVariedad").value;

// ignorar fecha y MP
let listaDia = datos.filter(d =>

String(d.semana)===String(semanaFiltro) &&

(proveedorSeleccionado==="" || d.proveedor===proveedorSeleccionado) &&

(variedadSeleccionada==="" || d.variedad===variedadSeleccionada)

);

listaDia.forEach(d=>{

let partes=d.fecha.split("/");
let fecha=new Date(partes[2],partes[1]-1,partes[0]);

let dia=fecha.getDay();
let indice=dia===0 ? 6 : dia-1;

dias[indice]+=d.kg;

});

graficoDia.data.datasets[0].data =
dias.map(v=>Math.round(v/1000));

graficoDia.update();

}


// ==============================
// GRAFICO MES
// ==============================

const ctxMes = document.getElementById("graficoMes").getContext("2d");

let graficoMes = new Chart(ctxMes,{
type:"bar",
data:{
labels:[],
datasets:[{
label:"TN",
data:[],
backgroundColor:"#21B971",
borderRadius:8
}]
},
options:{
plugins:{
legend:{display:false},
datalabels:{
formatter:function(value){
return value.toLocaleString("es-PE");
}
}
}
}
});

function convertirFechaExcel(numero){

if(!numero) return "";

let fecha = new Date((numero - 25569) * 86400 * 1000);

fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset());

return fecha.toLocaleDateString("es-PE");

}


cargarFirebase();
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



let semanaSeleccionada = document.getElementById("filtroSemana").value;
let listaSemana = datos.filter(d => d.semana == semanaSeleccionada);

calcularProyeccion();
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

function cargarProyeccion(){

fetch("https://appmateriaprima-default-rtdb.firebaseio.com/proyeccion.json")

.then(res=>res.json())

.then(data=>{

proyeccionDatos = Object.values(data);

calcularProyeccion();

});

}
cargarProyeccion();

function calcularProyeccion(){

let fecha = document.getElementById("filtroFecha").value;
let semana = document.getElementById("filtroSemana").value;
let variedad = document.getElementById("filtroVariedad").value;
let mp = document.getElementById("filtroMP").value;

let filtrado = proyeccionDatos.filter(p => {

let fechaProy = convertirFechaExcel(p.fecha);

return (

(fecha === "" || fechaProy == fecha) &&
(semana === "" || p.semana == semana) &&
(variedad === "" || p.variedad == variedad) &&
(mp === "" || p.mp == mp)

);

});

let total = filtrado.reduce((sum,p)=> sum + Number(p.proyectado || 0),0);

proyeccionTN = total/1000;

document.getElementById("proyeccion").innerText =
Math.round(proyeccionTN).toLocaleString("es-PE");

}

// ==============================
// FIREBASE
// ==============================

function cargarFirebase(){

fetch("https://appmateriaprima-default-rtdb.firebaseio.com/mp/registros.json")

.then(res=>res.json())

.then(data=>{

datos = Object.values(data)
.filter(d => d.jabas && !isNaN(d.jabas) && d.mp === "PALTA")


.map(d=>({

fecha: convertirFechaExcel(d.fecha),
semana: obtenerSemana(convertirFechaExcel(d.fecha)),
proveedor:d.proveedor || "",
codigo:d.codigo || "",
lote:d.lote || "",
guia:d.guia || "",
lote_campo:d.lote_campo || "",
variedad:d.variedad || "",
sub_variedad:d.sub_variedad || "",
mp:d.mp || "",
clp:d.clp || "",
acopio:d.acopio || "",
entrega:d.entrega || "",
jabas:Number(d.jabas) || 0,
kg:Math.round(Number(d.peso_final) || 0)

}));


// ==============================
// INGRESO POR MES
// ==============================

let meses={};

datos.forEach(d=>{

let partes = d.fecha.split("/");
let mes = ("0"+partes[1]).slice(-2);

meses[mes]=(meses[mes]||0)+d.kg;

});

let mesesOrdenados = Object.keys(meses).sort((a,b)=>a-b);

let nombresMes={
"01":"Ene","02":"Feb","03":"Mar","04":"Abr","05":"May","06":"Jun",
"07":"Jul","08":"Ago","09":"Sep","10":"Oct","11":"Nov","12":"Dic"
};

graficoMes.data.labels =
mesesOrdenados.map(m=>nombresMes[m]);

graficoMes.data.datasets[0].data =
mesesOrdenados.map(m=>Math.round(meses[m]/1000));

graficoMes.update();


// ==============================
// ACTUALIZAR DASHBOARD
// ==============================

cargarTabla(datos);
actualizarGraficos(datos);
actualizarTarjetas(datos);
llenarFiltros();

let semanaHoy = semanaActual();
let filtroSemana = document.getElementById("filtroSemana");
filtroSemana.value = semanaHoy;

aplicarFiltros();
calcularProyeccion();
});

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
// exportar a excel
// ==============================

function exportarExcel(){

let tabla = document.querySelector("table").outerHTML;

let titulo = `
<table>
<tr>
<td colspan="13" style="font-size:22px;font-weight:bold;text-align:center;">
PROCESADORA LARAN
</td>
</tr>

<tr>
<td colspan="13" style="font-size:18px;background:#21B971;color:white;text-align:center;">
REPORTE DE INGRESO DE PALTA - CAMPAÑA 2026
</td>
</tr>

<tr>
<td colspan="13">Fecha: ${new Date().toLocaleDateString("es-PE")}</td>
</tr>

<tr></tr>
</table>
`;

let html = titulo + tabla;

let url = 'data:application/vnd.ms-excel,' + encodeURIComponent(html);

let link = document.createElement("a");

link.href = url;
link.download = "Reporte_Ingreso_Palta.xls";

link.click();

}
