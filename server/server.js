const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const tf = require("@tensorflow/tfjs-node");
const tmImage = require("@teachablemachine/image");

const app = express();
app.use(cors());

// استقبال الصور
const upload = multer({ storage: multer.memoryStorage() });

// موديل Teachable Machine المحلي
const MODEL_URL =
  "file://" + path.join(__dirname, "public/model/model.json");

const METADATA_URL =
  "file://" + path.join(__dirname, "public/model/metadata.json");

let model = null;

// تحميل الموديل مرة واحدة
async function loadModel() {
  if (!model) {
    console.log("⏳ Loading AI model...");
    model = await tmImage.load(MODEL_URL, METADATA_URL);
    console.log("✅ Model loaded");
  }
  return model;
}

// اختبار السيرفر
app.get("/", (req, res) => {
  res.json({ status: "server running" });
});

// 🔥 أهم endpoint: تحليل صورة من البث
app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    const model = await loadModel();

    if (!req.file) {
      return res.status(400).json({ error: "No image received" });
    }

    // تحويل الصورة إلى Tensor
    const imageTensor = tf.node.decodeImage(req.file.buffer, 3);

    // تشغيل AI
    const prediction = await model.predict(imageTensor);

    // تنظيف الذاكرة
    imageTensor.dispose();

    // ترتيب النتائج
    prediction.sort((a, b) => b.probability - a.probability);
    const top = prediction[0];

    // رجوع النتيجة للواجهة
    res.json({
      status: top.className,
      confidence: Math.round(top.probability * 100),
    });

  } catch (err) {
    console.error("❌ AI Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// تشغيل السيرفر
app.listen(3000, "0.0.0.0", () => {
  console.log("🚀 Server running on http://localhost:3000");
});