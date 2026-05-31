const express = require("express");
const cors = require("cors");
const tf = require("@tensorflow/tfjs-node");
const tmImage = require("@teachablemachine/image");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const fs = require("fs");

const app = express();
app.use(cors());

ffmpeg.setFfmpegPath(ffmpegPath);

// 🧠 موديل AI
const MODEL_URL = "file://public/model/model.json";
const METADATA_URL = "file://public/model/metadata.json";

let model;

async function loadModel() {
  if (!model) {
    console.log("⏳ Loading AI model...");
    model = await tmImage.load(MODEL_URL, METADATA_URL);
    console.log("✅ Model loaded");
  }
  return model;
}

// 🎥 هنا رابط البث من VDO.Ninja
const STREAM_URL =
  "https://vdo.ninja/?view=FAiZgaS&cleanoutput=1&autostart=1";

// 📸 نسحب صورة من الفيديو
function captureFrame() {
  return new Promise((resolve, reject) => {
    const output = "./frame.jpg";

    ffmpeg(STREAM_URL)
      .frames(1)
      .output(output)
      .on("end", () => resolve(output))
      .on("error", reject)
      .run();
  });
}

// 🧠 تحليل مباشر
app.get("/analyze-stream", async (req, res) => {
  try {
    const model = await loadModel();

    const imagePath = await captureFrame();

    const imageBuffer = fs.readFileSync(imagePath);
    const tensor = tf.node.decodeImage(imageBuffer);

    const prediction = await model.predict(tensor);

    tensor.dispose();

    prediction.sort((a, b) => b.probability - a.probability);
    const top = prediction[0];

    res.json({
      status: top.className,
      confidence: Math.round(top.probability * 100),
    });
  } catch (err) {
    console.error("❌ ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 🔥 اختبار السيرفر
app.get("/", (req, res) => {
  res.json({ status: "server running" });
});

app.listen(3000, "0.0.0.0", () => {
  console.log("🚀 Server running on http://localhost:3000");
});