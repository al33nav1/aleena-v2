let chatHistory = [];

async function sendMessage() {
  const input = document.getElementById('user-input');
  const chatLog = document.getElementById('chat-log');
  const userMessage = input.value.trim();
  if (!userMessage) return;

  // Tampilkan pesan pengguna
  chatLog.innerHTML += `<div class="user">🧍 Kamu: ${userMessage}</div>`;
  input.value = "";
  input.disabled = true;

  // Tambahkan ke histori
  chatHistory.push({ role: "user", content: userMessage });

  const payload = {
    inputs: {
      past_user_inputs: chatHistory.filter(m => m.role === "user").map(m => m.content),
      generated_responses: chatHistory.filter(m => m.role === "assistant").map(m => m.content),
      text: userMessage
    },
    parameters: {
      max_new_tokens: 100,
      temperature: 0.7
    }
  };

  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL_ID}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    const reply = data.generated_text || "Maaf ya, Aleena bingung jawabnya... (>_<)";
    chatHistory.push({ role: "assistant", content: reply });

    chatLog.innerHTML += `<div class="bot">🤖 Aleena: ${reply}</div>`;
    chatLog.scrollTop = chatLog.scrollHeight;
  } catch (err) {
    chatLog.innerHTML += `<div class="bot">❌ Error: ${err.message}</div>`;
  }

  input.disabled = false;
  input.focus();
}
