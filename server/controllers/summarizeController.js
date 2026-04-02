require("dotenv").config();

const axios = require("axios");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const XLSX = require("xlsx");
const unzipper = require("unzipper");
const xml2js = require("xml2js");
const fs = require("fs");
const path = require("path");

/* =========================
   🔥 EXTRACT TEXT
========================= */
const extractText = async (file) => {
  try {
    const ext = path.extname(file.originalname).toLowerCase();

    if (ext === ".pdf") {
      const data = await pdfParse(fs.readFileSync(file.path));
      return data.text || "";
    }

    if (ext === ".docx") {
      const result = await mammoth.extractRawText({ path: file.path });
      return result.value || "";
    }

    if (ext === ".pptx") {
      const directory = await unzipper.Open.file(file.path);
      let text = "";

      for (const fileEntry of directory.files) {
        if (fileEntry.path.includes("ppt/slides/slide")) {
          const content = await fileEntry.buffer();
          const parsed = await xml2js.parseStringPromise(content);

          const slideText = JSON.stringify(parsed)
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ");

          text += slideText + " ";
        }
      }

      return text;
    }

    if (ext === ".xlsx" || ext === ".xls") {
      const workbook = XLSX.readFile(file.path);
      let text = "";

      workbook.SheetNames.forEach((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        data.forEach((row) => {
          if (row.length > 0) {
            text += row.join(" ") + "\n";
          }
        });
      });

      return text;
    }

    return fs.readFileSync(file.path, "utf-8");

  } catch (error) {
    console.error("EXTRACT ERROR:", error.message);
    return "";
  }
};

/* =========================
   🔥 FORMAT BULLETS
========================= */
const toBullets = (text) => {
  return text
    .split(". ")
    .map((s) => `• ${s.trim()}`)
    .join("\n");
};

/* =========================
   🔥 SPLIT TEXT
========================= */
const splitText = (text, size = 2500) => {
  const chunks = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
};

/* =========================
   🔥 SLEEP
========================= */
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

/* =========================
   🔥 GROQ CALL (RETRY + BACKOFF)
========================= */
const callGroq = async (prompt, retries = 3) => {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are a summarization assistant." },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;

  } catch (err) {
    const msg = err.response?.data?.error?.message || "";

    // 🔥 Rate limit handling
    if (msg.includes("Rate limit") && retries > 0) {
      const waitTime = 8000 + Math.random() * 4000; // 8–12 sec
      console.log(`⏳ Rate limit... retrying in ${Math.floor(waitTime / 1000)}s`);

      await sleep(waitTime);
      return callGroq(prompt, retries - 1);
    }

    console.error("GROQ ERROR:", msg);
    return "";
  }
};

/* =========================
   🔥 SUMMARIZER (SAFE FLOW)
========================= */
const summarizeText = async (text, length, mode) => {
  try {
    const chunks = splitText(text, 2500);
    const summaries = [];

    for (let i = 0; i < chunks.length; i++) {
      console.log(`Processing chunk ${i + 1}/${chunks.length}`);

      const s = await callGroq(`Summarize this:\n${chunks[i]}`);
      summaries.push(s);

      // 🔥 Delay between requests (prevents rate limit)
      await sleep(2500 + Math.random() * 1500);
    }

    const combined = summaries.join(" ");

    let final = await callGroq(
      `Create a ${length} summary in ${mode} format:\n${combined}`
    );

    if (mode === "bullets") {
      final = toBullets(final);
    }

    return final;

  } catch (err) {
    console.error("SUMMARY ERROR:", err.message);
    return "Summarization failed";
  }
};

/* =========================
   🔥 LENGTH CONTROL
========================= */
const getLength = (length) => {
  if (length === "short") return "short";
  if (length === "medium") return "medium";
  if (length === "long") return "long";
  return "short";
};

/* =========================
   🔥 TEXT SUMMARY
========================= */
exports.generateSummary = async (req, res) => {
  try {
    let { text, mode = "paragraph", length = "short" } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Text is required" });
    }

    text = text.slice(0, 20000);

    const finalLength = getLength(length);
    const summary = await summarizeText(text, finalLength, mode);

    res.json({ summary });

  } catch (err) {
    console.error("TEXT ERROR:", err.message);
    res.status(500).json({ message: "Text summarization failed" });
  }
};

/* =========================
   🔥 FILE SUMMARY
========================= */
exports.summarizeFile = async (req, res) => {
  try {
    const { mode = "paragraph", length = "short" } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let text = await extractText(file);

    if (!text || text.trim().length < 20) {
      return res.status(400).json({
        message: "File has no meaningful content",
      });
    }

    text = text.slice(0, 20000);

    const finalLength = getLength(length);
    const summary = await summarizeText(text, finalLength, mode);

    res.json({ summary });

  } catch (err) {
    console.error("FILE ERROR:", err.message);
    res.status(500).json({ message: "File summarization failed" });
  }
};