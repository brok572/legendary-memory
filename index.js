import express from "express";
import axios from "axios";

const app = express();

// ---------- FULLSCREEN HOME ----------
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Broken Lord API Hub</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background: #020617;
          color: #e5e7eb;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        header {
          padding: 18px 26px;
          border-bottom: 1px solid #111827;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .brand {
          font-size: 22px;
          font-weight: 700;
        }
        .tag {
          font-size: 11px;
          padding: 4px 10px;
          border-radius: 999px;
          background: #020617;
          border: 1px solid #1f2937;
          color: #9ca3af;
        }
        main {
          flex: 1;
          padding: 22px 26px 32px;
          max-width: 1100px;
          width: 100%;
          margin: 0 auto;
        }
        h1 {
          font-size: 26px;
          margin-bottom: 6px;
        }
        .subtitle {
          font-size: 13px;
          color: #9ca3af;
          margin-bottom: 22px;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 16px;
        }
        .card {
          background: radial-gradient(circle at top left, #111827, #020617);
          border-radius: 14px;
          padding: 14px 14px 12px;
          border: 1px solid #1f2937;
        }
        .card h2 {
          font-size: 15px;
          margin-bottom: 4px;
        }
        .card p {
          font-size: 12px;
          color: #9ca3af;
          margin-bottom: 8px;
        }
        .badge {
          display: inline-block;
          font-size: 10px;
          padding: 2px 7px;
          border-radius: 999px;
          border: 1px solid #374151;
          color: #9ca3af;
          margin-bottom: 6px;
        }
        code {
          font-size: 11px;
          background: #020617;
          padding: 3px 6px;
          border-radius: 6px;
          border: 1px solid #111827;
          display: inline-block;
        }
        footer {
          padding: 10px 26px 14px;
          font-size: 11px;
          color: #6b7280;
          border-top: 1px solid #111827;
          text-align: center;
        }
        @media (max-width: 600px) {
          header, main, footer { padding-left: 14px; padding-right: 14px; }
        }
      </style>
    </head>
    <body>
      <header>
        <div class="brand">Broken Lord API Hub</div>
        <div class="tag">JSON • No Key • v1</div>
      </header>
      <main>
        <h1>Available APIs</h1>
        <p class="subtitle">Connect these endpoints to your site, bot, or app. All responses are JSON.</p>

        <div class="grid">
          <div class="card">
            <span class="badge">AI</span>
            <h2>ChatGPT Proxy (NexRay)</h2>
            <p>Simple AI reply using NexRay chatgpt endpoint.</p>
            <code>GET /ai/chatgpt?text=Halo</code>
          </div>

          <div class="card">
            <span class="badge">AI</span>
            <h2>Text to Image (NexRay)</h2>
            <p>Generate image via NexRay text2image wrapper.</p>
            <code>GET /ai/text2image?prompt=Cat</code>
          </div>

          <div class="card">
            <span class="badge">Fun</span>
            <h2>Random Joke</h2>
            <p>Returns a random joke from JokeAPI.</p>
            <code>GET /fun/joke</code>
          </div>

          <div class="card">
            <span class="badge">Fun</span>
            <h2>Cat Fact</h2>
            <p>Random cat fact from catfact.ninja.</p>
            <code>GET /fun/catfact</code>
          </div>

          <div class="card">
            <span class="badge">Image</span>
            <h2>Random Dog</h2>
            <p>Random dog image from dog.ceo.</p>
            <code>GET /img/dog</code>
          </div>

          <div class="card">
            <span class="badge">Image</span>
            <h2>Random Photo</h2>
            <p>Random photo from Picsum.</p>
            <code>GET /img/random</code>
          </div>

          <div class="card">
            <span class="badge">Data</span>
            <h2>Random User</h2>
            <p>Fake user profile from randomuser.me.</p>
            <code>GET /data/user</code>
          </div>

          <div class="card">
            <span class="badge">Tools</span>
            <h2>Your IP Info</h2>
            <p>IP geolocation via ipapi.co.</p>
            <code>GET /tools/ip</code>
          </div>

          <div class="card">
            <span class="badge">System</span>
            <h2>Status</h2>
            <p>Check hub health and endpoints.</p>
            <code>GET /status</code>
          </div>
        </div>
      </main>
      <footer>
        Broken Lord • API Hub • Extendable to 100+ endpoints by same pattern
      </footer>
    </body>
    </html>
  `);
});

// ---------- STATUS ----------
app.get("/status", (req, res) => {
  res.json({
    status: true,
    brand: "Broken Lord",
    message: "Broken Lord API Hub online",
    endpoints: {
      ai_chatgpt: "/ai/chatgpt?text=Halo",
      ai_text2image: "/ai/text2image?prompt=Cat",
      fun_joke: "/fun/joke",
      fun_catfact: "/fun/catfact",
      img_dog: "/img/dog",
      img_random: "/img/random",
      data_user: "/data/user",
      tools_ip: "/tools/ip"
    }
  });
});

// ---------- AI: NexRay chatgpt ----------
app.get("/ai/chatgpt", async (req, res) => {
  const text = req.query.text;
  if (!text) {
    return res.status(400).json({
      status: false,
      brand: "Broken Lord",
      error: "Missing text. Use ?text=Halo"
    });
  }

  try {
    const url = `https://api.nexray.web.id/ai/chatgpt?text=${encodeURIComponent(text)}`;
    const r = await axios.get(url);
    res.json({
      status: true,
      brand: "Broken Lord",
      source: "NexRay",
      input: text,
      result: r.data
    });
  } catch (e) {
    res.status(500).json({
      status: false,
      brand: "Broken Lord",
      error: "Failed to reach NexRay chatgpt"
    });
  }
});

// ---------- AI: NexRay text2image ----------
app.get("/ai/text2image", async (req, res) => {
  const prompt = req.query.prompt;
  if (!prompt) {
    return res.status(400).json({
      status: false,
      brand: "Broken Lord",
      error: "Missing prompt. Use ?prompt=Cat"
    });
  }

  try {
    const url = `https://api.nexray.web.id/ai/v1/text2image?prompt=${encodeURIComponent(prompt)}`;
    const r = await axios.get(url);
    res.json({
      status: true,
      brand: "Broken Lord",
      source: "NexRay",
      prompt,
      result: r.data
    });
  } catch (e) {
    res.status(500).json({
      status: false,
      brand: "Broken Lord",
      error: "Failed to reach NexRay text2image"
    });
  }
});

// ---------- FUN: Joke ----------
app.get("/fun/joke", async (req, res) => {
  try {
    const r = await axios.get("https://v2.jokeapi.dev/joke/Any");
    res.json({
      status: true,
      brand: "Broken Lord",
      source: "JokeAPI",
      joke: r.data
    });
  } catch (e) {
    res.status(500).json({
      status: false,
      brand: "Broken Lord",
      error: "Failed to fetch joke"
    });
  }
});

// ---------- FUN: Cat fact ----------
app.get("/fun/catfact", async (req, res) => {
  try {
    const r = await axios.get("https://catfact.ninja/fact");
    res.json({
      status: true,
      brand: "Broken Lord",
      source: "catfact.ninja",
      fact: r.data.fact
    });
  } catch (e) {
    res.status(500).json({
      status: false,
      brand: "Broken Lord",
      error: "Failed to fetch cat fact"
    });
  }
});

// ---------- IMAGE: Dog ----------
app.get("/img/dog", async (req, res) => {
  try {
    const r = await axios.get("https://dog.ceo/api/breeds/image/random");
    res.json({
      status: true,
      brand: "Broken Lord",
      source: "dog.ceo",
      image_url: r.data.message
    });
  } catch (e) {
    res.status(500).json({
      status: false,
      brand: "Broken Lord",
      error: "Failed to fetch dog image"
    });
  }
});

// ---------- IMAGE: Random photo ----------
app.get("/img/random", (req, res) => {
  // Picsum is just a URL, no JSON, so we wrap it
  const width = req.query.w || 600;
  const height = req.query.h || 400;
  const url = `https://picsum.photos/${width}/${height}`;
  res.json({
    status: true,
    brand: "Broken Lord",
    source: "picsum.photos",
    image_url: url
  });
});

// ---------- DATA: Random user ----------
app.get("/data/user", async (req, res) => {
  try {
    const r = await axios.get("https://randomuser.me/api/");
    res.json({
      status: true,
      brand: "Broken Lord",
      source: "randomuser.me",
      user: r.data.results[0]
    });
  } catch (e) {
    res.status(500).json({
      status: false,
      brand: "Broken Lord",
      error: "Failed to fetch random user"
    });
  }
});

// ---------- TOOLS: IP info ----------
app.get("/tools/ip", async (req, res) => {
  try {
    const r = await axios.get("https://ipapi.co/json/");
    res.json({
      status: true,
      brand: "Broken Lord",
      source: "ipapi.co",
      ip: r.data
    });
  } catch (e) {
    res.status(500).json({
      status: false,
      brand: "Broken Lord",
      error: "Failed to fetch IP info"
    });
  }
});

app.listen(3000, () => console.log("Broken Lord API Hub running"));
