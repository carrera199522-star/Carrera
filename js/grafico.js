/* ============================= */
/* CONFIGURACION FIREBASE */
/* ============================= */

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


/* ============================= */
/* LEER DATOS */
/* ============================= */

const ref = database.ref("despachos");

ref.on("value", function(snapshot){

let totalJabas = 0;

let jabasProveedor = {};
let jabasFundo = {};
let jabasEnvase = {};
let jabasSemana = {};


/* CREAR SEMANA COMPLETA */

let diasSemana = ["Lun","Mar","Mie","Jue","Vie","Sab","Dom"];

diasSemana.forEach(dia=>{
jabasSemana[dia] = 0;
});


/* RECORRER REGISTROS */

snapshot.forEach(function(child){

const datos = child.val();

let proveedor = datos.proveedor || "Sin proveedor";
let fundo = datos.fundo || "Sin fundo";
let envase = datos.envase || "Sin envase";
let fecha = datos.fecha || "";

let jabas = parseInt(datos.jabas) || 0;

totalJabas += jabas;


/* PROVEEDOR */

if(!jabasProveedor[proveedor]){
jabasProveedor[proveedor] = 0;
}

jabasProveedor[proveedor] += jabas;


/* FUNDO */

if(!jabasFundo[fundo]){
jabasFundo[fundo] = 0;
}

jabasFundo[fundo] += jabas;


/* ENVASE */

if(!jabasEnvase[envase]){
jabasEnvase[envase] = 0;
}

jabasEnvase[envase] += jabas;


/* SEMANA */

if(fecha){

let dia = new Date(fecha).getDay();

let mapaDias = {
1:"Lun",
2:"Mar",
3:"Mie",
4:"Jue",
5:"Vie",
6:"Sab",
0:"Dom"
};

let nombreDia = mapaDias[dia];

jabasSemana[nombreDia] += jabas;

}

});


/* TOTAL ANIMADO */

animarNumero("totalJabas", totalJabas);


/* CREAR GRAFICOS */

crearGrafico("graficoProveedor", jabasProveedor, "Jabas por proveedor");
crearGrafico("graficoFundo", jabasFundo, "Jabas por fundo");
crearGraficoDona("graficoEnvase", jabasEnvase);
crearGraficoLinea("graficoSemanal", jabasSemana);

});



/* ============================= */
/* GRAFICO BARRAS */
/* ============================= */

function crearGrafico(id, datos, titulo){

const ctx = document.getElementById(id);

new Chart(ctx, {

type:"bar",

data:{

labels:Object.keys(datos),

datasets:[{

label:titulo,

data:Object.values(datos),

backgroundColor:[
"#8FA2CF",
"#8FA2CF",
"#8FA2CF",
"#8FA2CF",
"#8FA2CF",
"#8FA2CF",
"#8FA2CF"
]

}]

},

options:{

responsive:true,

animation:{
duration:1500,
easing:'easeOutQuart'
},

interaction:{
mode:'index',
intersect:false
},

plugins:{
tooltip:{
backgroundColor:"#333",
titleColor:"#fff",
bodyColor:"#fff",
padding:10
}
}

}

});

}



/* ============================= */
/* GRAFICO LINEA */
/* ============================= */

function crearGraficoLinea(id, datos){

const ctx = document.getElementById(id);

new Chart(ctx, {

type:"line",

data:{

labels:Object.keys(datos),

datasets:[{

label:"Salida semanal",

data:Object.values(datos),

borderColor:"#9bc7ce",
backgroundColor:"rgba(155,199,206,0.2)",
fill:true,
tension:0.4

}]

},

options:{

responsive:true,

animation:{
duration:1500
},

plugins:{
tooltip:{
backgroundColor:"#333"
}
}

}

});

}



/* ============================= */
/* GRAFICO DONA */
/* ============================= */

function crearGraficoDona(id, datos){

const ctx = document.getElementById(id);

new Chart(ctx, {

type:"doughnut",

data:{

labels:Object.keys(datos),

datasets:[{

data:Object.values(datos),

backgroundColor:[
"#1f6f8b",
"#ff5a1f",
"#2e7d32",
"#f4b400",
"#8e24aa",
"#00acc1",
"#d81b60"
]

}]

},

options:{

responsive:true,

animation:{
duration:1500
},

plugins:{
legend:{
position:"bottom"
},

tooltip:{
backgroundColor:"#333"
}

}

}

});

}



/* ============================= */
/* NUMERO ANIMADO */
/* ============================= */

function animarNumero(id, valor){

let contador = 0;

let elemento = document.getElementById(id);

let intervalo = setInterval(()=>{

contador += Math.ceil(valor/50);

if(contador >= valor){

contador = valor;

clearInterval(intervalo);

}

elemento.innerText = contador.toLocaleString();

},20);

}
datasets: [{
    label: 'Jabas por proveedor',
    data: datosProveedor,
    backgroundColor: '#8da0cb',

    borderColor: '#1f6f8b',   // color del borde
    borderWidth: 2            // grosor del borde
}]