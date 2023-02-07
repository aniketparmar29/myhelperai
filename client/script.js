import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadInterval;

function loader(el){
  if (!el) return;
  el.textContent = '';
  loadInterval = setInterval(() => {
    el.textContent += ".";
    if (el.textContent === "....") {
      el.textContent = '';
    }
  }, 300);
}

function typetext(el,text){
  let index=0;
  let interval = setInterval(()=>{
    if(index<text.length){
      el.innerHTML += text.charAt(index);
      index++;
    }else{
      clearInterval(interval);
    }
  },50)
}

function generateUniquqID(){
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}


function chatStripe (isAi,value,uniqueId){
  return (
    `
    <div class="wrapper ${isAi && 'ai'}">
      <div class="chat">
        <div class="profile">
          <img
            src="${isAi?bot:user}"
            alt="${isAi?"bot":"user"}"
          />
        </div>
        <div class="message" id=${uniqueId}>${value}</div>
      </div>
    </div>
    `
  )
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
  form.reset();

  const uniqueId = generateUniquqID();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;
  console.log(data.get('prompt'))
  const messageDiv = document.getElementById(uniqueId);
  loader(messageDiv);
  const response = await fetch("http://localhost:5000",{
    method:'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })

  })
  clearInterval(loadInterval);
  messageDiv.innerHTML='';

  if(response.ok){
    const data = await response.json();
    const parsedata = data.bot.trim();
    console.log(parsedata)
    typetext(messageDiv,parsedata);
  }else{
    const err =await response.text();

    messageDiv.innerHTML="something went wrong";

    alert(err);
  }
};

form.addEventListener("submit",handleSubmit);
form.addEventListener("keyup",(e)=>{
  if(e.keyCode===13){
    handleSubmit(e);
  }
});