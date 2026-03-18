async function enviar(){

let input = document.getElementById("pregunta");
let pregunta = input.value.trim();

if(pregunta === "") return;

let chat = document.getElementById("chatMensajes");

/* MENSAJE USUARIO */

let user = document.createElement("div");
user.className = "msg-user";
user.innerText = pregunta;

chat.appendChild(user);

input.value = "";

/* MENSAJE BOT */

let bot = document.createElement("div");
bot.className = "msg-bot";

bot.innerHTML = `
<div class="avatar">
<img src="img/bots.png">
</div>
<div class="bubble">...</div>
`;

chat.appendChild(bot);

let bubble = bot.querySelector(".bubble");

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

bubble.innerText = data.respuesta;

}catch(error){

bubble.innerText = "Error al conectar con el asistente.";

}

chat.scrollTop = chat.scrollHeight;

}

/* ENTER PARA ENVIAR */

document.addEventListener("DOMContentLoaded", function(){

let input = document.getElementById("pregunta");

input.addEventListener("keypress", function(e){

if(e.key === "Enter"){
enviar();
}

});

});
