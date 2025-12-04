const express = require('express');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

// Simple "AI" logic (contoh saja!)
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  if (!message || !message.trim()) {
    return res.json({ reply: "Silakan kirim pesan yang valid!" });
  }

  // Jawaban dummy, bisa dihubungkan ke OpenAI atau LLM lain.
  let reply = "";
  if (/halo|hi|hai/i.test(message)) {
    reply = "Halo juga! Ada yang bisa saya bantu?";
  } else if (/berapa.*2\+2/i.test(message)) {
    reply = "2 + 2 = 4";
  } else {
    reply = `Kamu bilang: "${message}" (ini dummy bot, ganti dengan model AI asli jika perlu)`;
  }
  res.json({ reply });
});

// Simple health check
app.get('/', (_, res) => res.send('Chatbot backend running!'));

app.listen(PORT, () => {
  console.log(`Chatbot backend listening at http://localhost:${PORT}`);
});