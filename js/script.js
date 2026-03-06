
document.addEventListener("DOMContentLoaded", function(){

const hero = document.querySelector(".hero");

const imagenes = [
"img/img1.jpg",
"img/img2.jpg",
"img/img3.jpg"
];

let index = 0;

function cambiarImagen(){

hero.style.backgroundImage = `url(${imagenes[index]})`;

hero.style.animation = "none";
hero.offsetHeight;
hero.style.animation = "movimiento 8s linear";

index++;

if(index >= imagenes.length){
index = 0;
}

}

cambiarImagen();

setInterval(cambiarImagen,9000);

});

