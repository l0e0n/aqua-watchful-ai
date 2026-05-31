const express = require("express");
const cors = require("cors");
const multer = require("multer");
const tf = require("@tensorflow/tfjs-node");
const tmImage = require("@teachablemachine/image");
const path = require("path");

const app = express();
app.use(cors());

// 📦 تخزين الصورة في الذاكرة
const upload = multer({ storage: multer.memoryStorage() });

// 📁 مسار الموديل
app.use("/model", express.static(path.join(__dirname, "public/model")));

const MODEL_URL =
  "file://" + path.join(__dirname, "public/model/model.json");

const METADATA_URL =
  "file://" + path.join(__dirname, "public/model/metadata.json");

let model = null;

// 🧠 تحميل الموديل مرة واحدة فقط
async function getModel() {
  if (!model) {
    console.log("⏳ Loading AI model...");
    model = await tmImage.load(MODEL_URL, METADATA_URL);
    console.log("✅ Model loaded");
  }
  return model;
}

// ❤️ اختبار السيرفر
app.get("/", (req, res) => {
  res.json({
    status: "server running",
  });
});

// 🧠 AI ANALYZE (هذا أهم جزء)
app.get("/status", upload.single("image"), async (req, res) => {
  try {
    const model = await getModel();

    if (!req.file) {
      return res.status(400).json({ error: "No image received" });
    }

    // تحويل الصورة إلى Tensor
    const imageTensor = tf.node.decodeImage(req.file.buffer, 3);

    // prediction
    const prediction = await model.predict(imageTensor);

    imageTensor.dispose();

    // ترتيب النتائج
    prediction.sort((a, b) => b.probability - a.probability);

    const top = prediction[0];

    res.json({
      status: top.className,
      confidence: Math.round(top.probability * 100),
    });
  } catch (err) {
    console.error("❌ ERROR:", err.message);
    res.status(500).json({
      error: err.message,
    });
  }
});

// 🚀 تشغيل السيرفر
const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});