import express from "express";
import axios from "axios";

const app = express();

// ---------------- CONFIG: LIST OF APIS FOR UI ----------------
const apiList = [
  { key: "ai_chatgpt", label: "AI ChatGPT (NexRay)", path: "/ai/chatgpt", param: "text", example: "Halo" },
  { key: "ai_text2image", label: "AI Text2Image (NexRay)", path: "/ai/text2image", param: "prompt", example: "Cat" },
  { key: "fun_joke", label: "Random Joke", path: "/fun/joke", param: null, example: "" },
  { key: "fun_catfact", label: "Cat Fact", path: "/fun/catfact", param: null, example: "" },
  { key: "img_dog", label: "Random Dog Image", path: "/img/dog", param: null, example: "" },
  { key: "img_random", label: "Random Photo", path: "/img/random", param: null, example: "" },
  { key: "data_user", label: "Random User", path: "/data/user", param: null, example: "" },
  { key: "tools_ip", label: "Your IP Info", path: "/tools/ip", param: null, example: "" },
  { key: "fun_quote", label: "Random Quote", path: "/fun/quote", param: null, example: "" },
  { key: "fun_advice", label: "Random Advice", path: "/fun/advice", param: null, example: "" },
  { key: "crypto_price", label: "Crypto Price (BTC)", path: "/data/crypto", param: "symbol", example: "bitcoin" },
  { key: "time_world", label: "World Time (Africa/Nairobi)", path: "/data/time", param: "zone", example: "Africa/Nairobi" },
  { key: "anime_quote", label: "Anime Quote", path: "/fun/animequote", param: null, example: "" },
  { key: "bored", label: "Bored Activity", path: "/fun/bored", param: null, example: "" },
  { key: "genderize", label: "Guess Gender by Name", path: "/tools/gender", param: "name", example: "Mohd" },
  { key: "age", label: "Guess Age by Name", path: "/tools/age", param: "name", example: "Mohd" },
  { key: "nationality", label: "Guess Nationality by Name", path: "/tools/nationality", param: "name", example: "Mohd" },
  { key: "ip_echo", label: "IP Echo (Mock)", path: "/mock/ip", param: null, example: "" },
  { key: "echo_text", label: "Echo Text (Mock)", path: "/mock/echo", param: "text", example: "Hello Broken Lord" },
  { key: "status", label: "Hub Status", path: "/status", param: null, example: "" }
];

// ---------------- HOME PAGE (FULL SCREEN + RUN + COPY) ----------------
app.get("/", (req, res) => {
  const optionsHtml = apiList
    .map(
      (api) =>
        `<option value="${api.key}" data-path="${api.path}" data-param="${api.param || ""}" data-example="${api.example}">${api.label}</option>`
    )
    .join("");

  const apiBoxesHtml = apiList
    .map(
      (api) => `
      <div class="api-box">
        <div class="api-title">${api.label}</div>
        <div class="api-desc">${api.path}${api.param ? `?${api.param}=` : ""}</div>
        <code>${api.path}${api.param ? `?${api.param}=${api.example || "..."}` : ""}</code>
        <button onclick="copyText('${api.path}${api.param ? `?${api.param}=${api.example || ""}` : ""}')">Copy</button>
      </div>
    `
    )
    .join("");

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
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    header {
      padding: 16px 20px;
      border-bottom: 1px solid #111827;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand {
      font-size: 20px;
      font-weight: 700;
    }
    .tag {
      font-size: 11px;
      padding: 4px 10px;
      border-radius: 999px;
      border: 1px solid #1f2937;
      color: #9ca3af;
    }
    .container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 18px 20px 30px;
    }
    .runner {
      background: #020617;
      border: 1px solid #1f2937;
      border-radius: 12px;
      padding: 14px;
      margin-bottom: 20px;
    }
    .runner-title {
      font-size: 14px;
      margin-bottom: 8px;
      font-weight: 600;
    }
    select, input {
      width: 100%;
      padding: 8px;
      border-radius: 8px;
      border: 1px solid #1f2937;
      background: #020617;
      color: #e5e7eb;
      margin-bottom: 8px;
      font-size: 13px;
    }
    button {
      background: #38bdf8;
      border: none;
      padding: 7px 14px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      margin-right: 6px;
    }
    button:hover {
      background: #0ea5e9;
    }
    .output {
      margin-top: 10px;
      background: #020617;
      border-radius: 8px;
      border: 1px solid #1f2937;
      padding: 10px;
      font-size: 12px;
      white-space: pre-wrap;
      max-height: 260px;
      overflow: auto;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 14px;
      margin-top: 18px;
    }
    .api-box {
      background: #020617;
      border-radius: 10px;
      border: 1px solid #1f2937;
      padding: 10px 12px;
    }
    .api-title {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 4px;
    }
    .api-desc {
      font-size: 11px;
      color: #9ca3af;
      margin-bottom: 6px;
    }
    code {
      background: #020617;
      border-radius: 6px;
      border: 1px solid #1f2937;
      padding: 4px 6px;
      font-size: 11px;
      display: block;
      margin-bottom: 6px;
      color: #38bdf8;
    }
    @media (max-width: 600px) {
      header, .container { padding-left: 12px; padding-right: 12px; }
    }
  </style>
  <script>
    const apiMap = ${JSON.stringify(apiList)};

    function copyText(text) {
      navigator.clipboard.writeText(text);
      alert("Copied: " + text);
    }

    function onApiChange() {
      const select = document.getElementById("apiSelect");
      const selected = apiMap.find(a => a.key === select.value);
      const input = document.getElementById("apiInput");
      if (selected && selected.example) {
        input.value = selected.example;
      } else {
        input.value = "";
      }
    }

    async function runApi() {
      const select = document.getElementById("apiSelect");
      const input = document.getElementById("apiInput");
      const output = document.getElementById("output");

      const selected = apiMap.find(a => a.key === select.value);
      if (!selected) {
        output.textContent = "No API selected.";
        return;
      }

      let url = selected.path;
      if (selected.param && input.value) {
        const encoded = encodeURIComponent(input.value);
        url += "?" + selected.param + "=" + encoded;
      }

      output.textContent = "Running " + url + " ...";

      try {
        const res = await fetch(url);
        const data = await res.json();
        output.textContent = JSON.stringify(data, null, 2);
      } catch (e) {
        output.textContent = "Error calling " + url + ": " + e;
      }
    }
  </script>
</head>
<body>
  <header>
    <div class="brand">Broken Lord API Hub</div>
    <div class="tag">JSON • No Key • v1</div>
  </header>

  <div class="container">
    <div class="runner">
      <div class="runner-title">Test API live</div>
      <select id="apiSelect" onchange="onApiChange()">
        ${optionsHtml}
      </select>
      <input id="apiInput" placeholder="Optional text / prompt / url..." />
      <button onclick="runApi()">Run</button>
      <button onclick="copyText(location.origin + document.getElementById('apiSelect').selectedOptions[0].getAttribute('data-path'))">Copy Base URL</button>
      <div class="output" id="output">{}</div>
    </div>

    <div class="grid">
      ${apiBoxesHtml}
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
    message: "Broken Lord API Hub online",
    total_apis: apiList.length + 80,
    note: "20 real wrappers + 80 mock endpoints"
  });
});

// ---------------- REAL WRAPPERS ----------------

// AI: ChatGPT via NexRay
app.get("/ai/chatgpt", async (req, res) => {
  const text = req.query.text;
  if (!text) return res.status(400).json({ status: false, brand: "Broken Lord", error: "Missing text" });
  try {
    const r = await axios.get(`https://api.nexray.web.id/ai/chatgpt?text=${encodeURIComponent(text)}`);
    res.json({ status: true, brand: "Broken Lord", source: "NexRay", input: text, result: r.data });
  } catch {
    res.status(500).json({ status: false, brand: "Broken Lord", error: "Failed to reach NexRay chatgpt" });
  }
});

// AI: Text2Image via NexRay
app.get("/ai/text2image", async (req, res) => {
  const prompt = req.query.prompt;
  if (!prompt) return res.status(400).json({ status: false, brand: "Broken Lord", error: "Missing prompt" });
  try {
    const r = await axios.get(`https://api.nexray.web.id/ai/v1/text2image?prompt=${encodeURIComponent(prompt)}`);
    res.json({ status: true, brand: "Broken Lord", source: "NexRay", prompt, result: r.data });
  } catch {
    res.status(500).json({ status: false, brand: "Broken Lord", error: "Failed to reach NexRay text2image" });
  }
});

// Fun: Joke
app.get("/fun/joke", async (req, res) => {
  try {
    const r = await axios.get("https://v2.jokeapi.dev/joke/Any");
    res.json({ status: true, brand: "Broken Lord", source: "JokeAPI", joke: r.data });
  } catch {
    res.status(500).json({ status: false, brand: "Broken Lord", error: "Failed to fetch joke" });
  }
});

// Fun: Cat fact
app.get("/fun/catfact", async (req, res) => {
  try {
    const r = await axios.get("https://catfact.ninja/fact");
    res.json({ status: true, brand: "Broken Lord", source: "catfact.ninja", fact: r.data.fact });
  } catch {
    res.status(500).json({ status: false, brand: "Broken Lord", error: "Failed to fetch cat fact" });
  }
});

// Image: Dog
app.get("/img/dog", async (req, res) => {
  try {
    const r = await axios.get("https://dog.ceo/api/breeds/image/random");
    res.json({ status: true, brand: "Broken Lord", source: "dog.ceo", image_url: r.data.message });
  } catch {
    res.status(500).json({ status: false, brand: "Broken Lord", error: "Failed to fetch dog image" });
  }
});

// Image: Random photo
app.get("/img/random", (req, res) => {
  const w = req.query.w || 600;
  const h = req.query.h || 400;
  res.json({
    status: true,
    brand: "Broken Lord",
    source: "picsum.photos",
    image_url: `https://picsum.photos/${w}/${h}`
  });
});

// Data: Random user
app.get("/data/user", async (req, res) => {
  try {
    const r = await axios.get("https://randomuser.me/api/");
    res.json({ status: true, brand: "Broken Lord", source: "randomuser.me", user: r.data.results[0] });
  } catch {
    res.status(500).json({ status: false, brand: "Broken Lord", error: "Failed to fetch random user" });
  }
});

// Tools: IP info
app.get("/tools/ip", async (req, res) => {
  try {
    const r = await axios.get("https://ipapi.co/json/");
    res.json({ status: true, brand: "Broken Lord", source: "ipapi.co", ip: r.data });
  } catch {
    res.status(500).json({ status: false, brand: "Broken Lord", error: "Failed to fetch IP info" });
  }
});

// Fun: Quote
app.get("/fun/quote", async (req, res) => {
  try {
    const r = await axios.get("https://api.quotable.io/random");
    res.json({ status: true, brand: "Broken Lord", source: "quotable.io", quote: r.data });
  } catch {
    res.status(500).json({ status: false, brand: "Broken Lord", error: "Failed to fetch quote" });
  }
});

// Fun: Advice
app.get("/fun/advice", async (req, res) => {
  try {
    const r = await axios.get("https://api.adviceslip.com/advice");
    res.json({ status: true, brand: "Broken Lord", source: "adviceslip.com", advice: r.data.slip });
  } catch {
    res.status(500).json({ status: false, brand: "Broken Lord", error: "Failed to fetch advice" });
  }
});

// Fun: Anime quote
app.get("/fun/animequote", async (req, res) => {
  try {
    const r = await axios.get("https://animechan.xyz/api/random");
    res.json({ status: true, brand: "Broken Lord", source: "animechan", quote: r.data });
  } catch {
    res.status(500).json({ status: false, brand: "Broken Lord", error: "Failed to fetch anime quote" });
  }
});

// Fun: Bored
app.get("/fun/bored", async (req, res) => {
  try {
    const r = await axios.get("https://www.boredapi.com/api/activity");
    res.json({ status: true, brand: "Broken Lord", source: "boredapi.com", activity: r.data });
  } catch {
    res.status(500).json({ status: false, brand: "Broken Lord", error: "Failed to fetch activity" });
  }
});

// Tools: Gender by name
app.get("/tools/gender", async (req, res) => {
  const name = req.query.name;
  if (!name) return res.status(400).json({ status: false, brand: "Broken Lord", error: "Missing name" });
  try {
    const r = await axios.get(`https://api.genderize.io?name=${encodeURIComponent(name)}`);
    res.json({ status: true, brand: "Broken Lord", source: "genderize.io", result: r.data });
  } catch {
    res.status(500).json({ status: false, brand: "Broken Lord", error: "Failed to fetch gender" });
  }
});

// Tools: Age by name
app.get("/tools/age", async (req, res) => {
  const name = req.query.name;
  if (!name) return res.status(400).json({ status: false, brand: "Broken Lord", error: "Missing name" });
  try {
    const r = await axios.get(`https://api.agify.io?name=${encodeURIComponent(name)}`);
    res.json({ status: true, brand: "Broken Lord", source: "agify.io", result: r.data });
  } catch {
    res.status(500).json({ status: false, brand: "Broken Lord", error: "Failed to fetch age" });
  }
});

// Tools: Nationality by name
app.get("/tools/nationality", async (req, res) => {
  const name = req.query.name;
  if (!name) return res.status(400).json({ status: false, brand: "Broken Lord", error: "Missing name" });
  try {
    const r = await axios.get(`https://api.nationalize.io?name=${encodeURIComponent(name)}`);
    res.json({ status: true, brand: "Broken Lord", source: "nationalize.io", result: r.data });
  } catch {
    res.status(500).json({ status: false, brand: "Broken Lord", error: "Failed to fetch nationality" });
  }
});

// Data: Crypto price (simple wrapper)
app.get("/data/crypto", async (req, res) => {
  const symbol = req.query.symbol || "bitcoin";
  try {
    const r = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(symbol)}&vs_currencies=usd`
    );
    res.json({ status: true, brand: "Broken Lord", source: "coingecko", symbol, price: r.data });
  } catch {
    res.status(500).json({ status: false, brand: "Broken Lord", error: "Failed to fetch crypto price" });
  }
});

// Data: World time
app.get("/data/time", async (req, res) => {
  const zone = req.query.zone || "Africa/Nairobi";
  try {
    const r = await axios.get(`http://worldtimeapi.org/api/timezone/${encodeURIComponent(zone)}`);
    res.json({ status: true, brand: "Broken Lord", source: "worldtimeapi.org", time: r.data });
  } catch {
    res.status(500).json({ status: false, brand: "Broken Lord", error: "Failed to fetch time" });
  }
});

// ---------------- 80+ MOCK ENDPOINTS (ALIVE, SIMPLE JSON) ----------------
for (let i = 1; i <= 80; i++) {
  app.get(`/mock/api${i}`, (req, res) => {
    res.json({
      status: true,
      brand: "Broken Lord",
      type: "mock",
      id: i,
      message: `This is mock endpoint /mock/api${i}`,
      query: req.query
    });
  });
}

// Extra mock helpers
app.get("/mock/ip", (req, res) => {
  res.json({
    status: true,
    brand: "Broken Lord",
    type: "mock_ip",
    ip: req.ip || "0.0.0.0"
  });
});

app.get("/mock/echo", (req, res) => {
  res.json({
    status: true,
    brand: "Broken Lord",
    type: "mock_echo",
    text: req.query.text || ""
  });
});

app.listen(3000, () => console.log("Broken Lord API Hub running"));
