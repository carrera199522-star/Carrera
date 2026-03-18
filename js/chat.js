// ENVIAR MENSAJE
async function enviar(){

let pregunta = document.getElementById("pregunta").value;
let chat = document.getElementById("chatMensajes");

chat.innerHTML += `<div class="msg-user">${pregunta}</div>`;

try{

let response = await fetch("https://us-central1-chatbot-castilla.cloudfunctions.net/chatbot",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
pregunta: pregunta
})
});

let data = await response.json();

chat.innerHTML += `<div class="msg-bot">${data.respuesta}</div>`;

}catch(error){

chat.innerHTML += `<div class="msg-bot">Error al conectar con el asistente.</div>`;

}

document.getElementById("pregunta").value="";

}

/* MENSAJE USUARIO */

let user = document.createElement("div");
user.className = "msg-user";
user.innerText = pregunta;

chat.appendChild(user);

input.value = "";

chat.scrollTop = chat.scrollHeight;


/* MENSAJE BOT */

let bot = document.createElement("div");
bot.className="msg-bot";

bot.innerHTML=`
<div class="avatar">
<img src="img/bots.png">
</div>
<div class="bubble">...</div>
`;

chat.appendChild(bot);

let bubble = bot.querySelector(".bubble");


/* LLAMAR API */

try{

let response = await fetch("https://us-central1-chatbot-castilla.cloudfunctions.net/chatbot", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
pregunta: pregunta
})
});

let data = await response.json();

/* ANIMACION TEXTO */

escribirTexto(data.respuesta, bubble);

}catch(error){

bubble.innerText = "Error al conectar con el asistente.";

}

chat.scrollTop = chat.scrollHeight;


/* GUARDAR HISTORIAL */

guardarHistorial();

}


/* ANIMACION LETRA POR LETRA */

function escribirTexto(texto, elemento){

elemento.innerText = "";

let i = 0;

let intervalo = setInterval(()=>{

elemento.innerText += texto.charAt(i);

i++;

if(i >= texto.length){
clearInterval(intervalo);
}

},20);

}


/* GUARDAR HISTORIAL */

function guardarHistorial(){

let chat = document.getElementById("chatMensajes").innerHTML;

localStorage.setItem("chatHistorial", chat);

}


/* CARGAR HISTORIAL */




/* NUEVO CHAT */

function nuevoChat(){

localStorage.removeItem("chatHistorial");

document.getElementById("chatMensajes").innerHTML = "";

}


/* ENTER PARA ENVIAR */

document.addEventListener("DOMContentLoaded",function(){

let input = document.getElementById("pregunta");

input.addEventListener("keypress",function(e){

if(e.key === "Enter"){
enviar();
}

});

});
