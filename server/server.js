const express = require("express");
const cors = require("cors");
const multer = require("multer");
const tf = require("@tensorflow/tfjs-node");
const tmImage = require("@teachablemachine/image");
const path = require("path");

const app = express();
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

// 📁 الموديل المحلي
const MODEL_URL =
  "file://" + path.join(__dirname, "public/model/model.json");

const METADATA_URL =
  "file://" + path.join(__dirname, "public/model/metadata.json");

let model = null;

// 🧠 تحميل الموديل
async function getModel() {
  if (!model) {
    console.log("Loading model...");
    model = await tmImage.load(MODEL_URL, METADATA_URL);
    console.log("Model loaded");
  }
  return model;
}

// ❤️ اختبار السيرفر
app.get("/", (req, res) => {
  res.json({ status: "server running" });
});

// 🧠 AI ANALYZE (الأساسي)
app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    const model = await getModel();

    if (!req.file) {
      return res.status(400).json({ error: "No image received" });
    }

    console.log("Image received size:", req.file.size);

    const imageTensor = tf.node.decodeImage(req.file.buffer, 3);

    const prediction = await model.predict(imageTensor);

    imageTensor.dispose();

    prediction.sort((a, b) => b.probability - a.probability);

    const top = prediction[0];

    res.json({
      status: top.className,
      confidence: Math.round(top.probability * 100),
    });

  } catch (err) {
    console.error("ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 🚀 تشغيل السيرفر
app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on http://localhost:3000");
});