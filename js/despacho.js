document.addEventListener("DOMContentLoaded", function(){

const hero = document.querySelector(".hero");

if(!hero) return;

const imagenes = [
"img/img4.jpg",
"img/img5.jpg",
"img/img6.jpg"
];

let index = 0;

function cambiarImagen(){

hero.style.backgroundImage = `url(${imagenes[index]})`;

hero.style.backgroundPosition = "right center";

setTimeout(() => {

hero.style.backgroundPosition = "left center";

},100);

index++;

if(index >= imagenes.length){
index = 0;
}

}

cambiarImagen();

setInterval(cambiarImagen,9000);

});


// FIREBASE

// FIREBASE

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

const tabla = document.getElementById("tablaDatos");
tabla.innerHTML = "";

snapshot.forEach(function(child){

const datos = child.val();
if(!datos.placa) return;

const fila = `
<tr>
<td>${datos.fecha ? datos.fecha : "--"}</td>
<td>${datos.placa ? datos.placa : "--"}</td>
<td>${datos.chofer ? datos.chofer : "--"}</td>
<td>${datos.envase ? datos.envase : "--"}</td>
<td>${datos.proveedor ? datos.proveedor : "--"}</td>
<td>${datos.fundo ? datos.fundo : "--"}</td>
<td>${datos.pallets ? datos.pallets : "--"}</td>
<td>${datos.jabas ? datos.jabas : "--"}</td>
<td>${datos.sobrantes ? datos.sobrantes : "--"}</td>
</tr>
`;

tabla.innerHTML += fila;

});

});