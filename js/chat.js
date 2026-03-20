async function enviar(){

let input = document.getElementById("pregunta");
let pregunta = input.value.trim();

if(pregunta === "") return;

let chat = document.getElementById("chatMensajes");

/* mensaje usuario */

let user = document.createElement("div");
user.className = "msg-user";
user.innerText = pregunta;

chat.appendChild(user);

input.value = "";

/* mensaje bot */

let bot = document.createElement("div");
bot.className = "msg-bot";
bot.innerText = "...";

chat.appendChild(bot);

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

bot.innerHTML = data.respuesta.replace(/\n/g,"<br>");

}catch(error){

bot.innerText = "Error al conectar con el asistente.";

}

chat.scrollTop = chat.scrollHeight;

}

/* ENTER para enviar */

document.addEventListener("DOMContentLoaded",function(){

let input = document.getElementById("pregunta");

input.addEventListener("keypress",function(e){

if(e.key === "Enter"){
enviar();
}

});

});
