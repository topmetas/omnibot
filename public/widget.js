(function () {
    // 🔑 API Key (depois pode vir por querystring)
    const API_KEY = "SUA_API_KEY_AQUI";
  
    // 🧱 Cria o HTML do widget
    const widgetHTML = `
      <div id="chat-widget" style="border:1px solid #ccc; padding:10px; width:300px;">
        <div id="chat" style="height:200px; overflow:auto; margin-bottom:10px;"></div>
        <input id="msg" placeholder="Digite sua pergunta" style="width:100%; margin-bottom:5px;" />
        <button id="sendBtn" style="width:100%;">Enviar</button>
      </div>
    `;
  
    // 📌 Insere no site do cliente
    const container = document.createElement("div");
    container.innerHTML = widgetHTML;
    document.body.appendChild(container);
  
    // 🎯 Função de envio
    async function sendMessage() {
      const input = document.getElementById("msg");
      const chat = document.getElementById("chat");
      const msg = input.value;
  
      if (!msg) return;
  
      chat.innerHTML += `<p><b>Você:</b> ${msg}</p>`;
      input.value = "";
  
      const res = await fetch("https://seubackend.com/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY
        },
        body: JSON.stringify({ message: msg })
      });
  
      const data = await res.json();
      chat.innerHTML += `<p><b>Bot:</b> ${data.reply}</p>`;
      chat.scrollTop = chat.scrollHeight;
    }
  
    // 🖱️ Evento do botão
    document.getElementById("sendBtn").addEventListener("click", sendMessage);
  })();

  document.documentElement.style.setProperty(
    "--primary-color",
    client.brand.primaryColor
  );
  
  document.getElementById("logo").src = client.brand.logoUrl;
  document.title = client.brand.name;
  