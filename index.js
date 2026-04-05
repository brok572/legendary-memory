import express from "express";
import axios from "axios";

const app = express();

// ---------------- HOME PAGE (FULL SCREEN + COPY BUTTONS) ----------------
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Broken Lord API Hub</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body {
      margin: 0;
      background: #020617;
      color: #e5e7eb;
      font-family: Arial, sans-serif;
    }
    header {
      padding: 20px;
      font-size: 24px;
      font-weight: bold;
      border-bottom: 1px solid #1f2937;
      text-align: center;
    }
    .container {
      padding: 20px;
      max-width: 900px;
      margin: auto;
    }
    .api-box {
      background: #0f172a;
      padding: 15px;
      border-radius: 10px;
      margin-bottom: 15px;
      border: 1px solid #1e293b;
    }
    .api-title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 6px;
    }
    .api-desc {
      font-size: 13px;
      color: #94a3b8;
      margin-bottom: 10px;
    }
    code {
      background: #1e293b;
      padding: 6px 10px;
      border-radius: 6px;
      display: block;
      margin-bottom: 8px;
      font-size: 13px;
      color: #38bdf8;
    }
    button {
      background: #38bdf8;
      border: none;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      font-weight: bold;
    }
    button:hover {
      background: #0ea5e9;
    }
  </style>

  <script>
    function copyText(text) {
      navigator.clipboard.writeText(text);
      alert("Copied: " + text);
    }
  </script>
</head>

<body>
  <header>Broken Lord API Hub</header>

  <div class="container">

    <div class="api-box">
      <div class="api-title">AI ChatGPT (NexRay)</div>
      <div class="api-desc">Simple AI reply using NexRay API.</div>
      <code>/ai/chatgpt?text=Halo</code>
      <button onclick="copyText('/ai/chatgpt?text=Halo')">Copy</button>
    </div>

    <div class="api-box">
      <div class="api-title">AI Text2Image (NexRay)</div>
      <div class="api-desc">Generate image using NexRay text2image.</div>
      <code>/ai/text2image?prompt=Cat</code>
      <button onclick="copyText('/ai/text2image?prompt=Cat')">Copy</button>
    </div>

    <div class="api-box">
      <div class="api-title">Random Joke</div>
      <div class="api-desc">Returns a random joke.</div>
      <code>/fun/joke</code>
      <button onclick="copyText('/fun/joke')">Copy</button>
    </div>

    <div class="api-box">
      <div class="api-title">Cat Fact</div>
      <div class="api-desc">Random cat fact.</div>
      <code>/fun/catfact</code>
      <button onclick="copyText('/fun/catfact')">Copy</button>
    </div>

    <div class="api-box">
      <div class="api-title">Random Dog Image</div>
      <div class="api-desc">Random dog picture.</div>
      <code>/img/dog</code>
      <button onclick="copyText('/img/dog')">Copy</button>
    </div>

    <div class="api-box">
      <div class="api-title">Random Photo</div>
      <div class="api-desc">Random image from Picsum.</div>
      <code>/img/random</code>
      <button onclick="copyText('/img/random')">Copy</button>
    </div>

    <div class="api-box">
      <div class="api-title">Random User</div>
      <div class="api-desc">Fake user profile.</div>
      <code>/data/user</code>
      <button onclick="copyText('/data/user')">Copy</button>
    </div>

    <div class="api-box">
      <div class="api-title">Your IP Info</div>
      <div class="api-desc">IP geolocation.</div>
      <code>/tools/ip</code>
      <button onclick="copyText('/tools/ip')">Copy</button>
    </div>

  </div>
</body>
</html>
  `);
});

// ---------------- STATUS ----------------
app.get("/status", (req, res) => {
  res.json({
    status: true,
    brand: "Broken Lord",
    message: "API Hub Online"
  });
});

// ---------------- AI: CHATGPT ----------------
app.get("/ai/chatgpt", async (req, res) => {
  const text = req.query.text;
  if (!text) return res.json({ status: false, error: "Missing text" });

  try {
    const r = await axios.get(`https://api.nexray.web.id/ai/chatgpt?text=${encodeURIComponent(text)}`);
    res.json({ status: true, brand: "Broken Lord", result: r.data });
  } catch {
    res.json({ status: false, error: "NexRay error" });
  }
});

// ---------------- AI: TEXT2IMAGE ----------------
app.get("/ai/text2image", async (req, res) => {
  const prompt = req.query.prompt;
  if (!prompt) return res.json({ status: false, error: "Missing prompt" });

  try {
    const r = await axios.get(`https://api.nexray.web.id/ai/v1/text2image?prompt=${encodeURIComponent(prompt)}`);
    res.json({ status: true, brand: "Broken Lord", result: r.data });
  } catch {
    res.json({ status: false, error: "NexRay error" });
  }
});

// ---------------- FUN: JOKE ----------------
app.get("/fun/joke", async (req, res) => {
  const r = await axios.get("https://v2.jokeapi.dev/joke/Any");
  res.json({ status: true, brand: "Broken Lord", joke: r.data });
});

// ---------------- FUN: CAT FACT ----------------
app.get("/fun/catfact", async (req, res) => {
  const r = await axios.get("https://catfact.ninja/fact");
  res.json({ status: true, brand: "Broken Lord", fact: r.data.fact });
});

// ---------------- IMAGE: DOG ----------------
app.get("/img/dog", async (req, res) => {
  const r = await axios.get("https://dog.ceo/api/breeds/image/random");
  res.json({ status: true, brand: "Broken Lord", image: r.data.message });
});

// ---------------- IMAGE: RANDOM ----------------
app.get("/img/random", (req, res) => {
  res.json({
    status: true,
    brand: "Broken Lord",
    image: "https://picsum.photos/600/400"
  });
});

// ---------------- DATA: USER ----------------
app.get("/data/user", async (req, res) => {
  const r = await axios.get("https://randomuser.me/api/");
  res.json({ status: true, brand: "Broken Lord", user: r.data.results[0] });
});

// ---------------- TOOLS: IP ----------------
app.get("/tools/ip", async (req, res) => {
  const r = await axios.get("https://ipapi.co/json/");
  res.json({ status: true, brand: "Broken Lord", ip: r.data });
});

app.listen(3000, () => console.log("Broken Lord API Hub Running"));
