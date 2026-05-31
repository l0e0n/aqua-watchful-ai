const express = require("express");
const cors = require("cors");
const tf = require("@tensorflow/tfjs-node");
const path = require("path");

const app = express();
app.use(cors());

// استقبال الصور الخام بأقصى سرعة
app.use(express.raw({ type: "image/jpeg", limit: "10mb" }));

const MODEL_URL = "file://" + path.join(__dirname, "public/model/model.json");
let model = null;

let currentStatus = "Safe";
let currentConfidence = 100;

async function getModel() {
  if (!model) {
    console.log("Loading model...");
    model = await tf.loadLayersModel(MODEL_URL);
    console.log("Model ready");
  }
  return model;
}

// استقبال الفريمات الحقيقية من متصفح الآيباد وتحليلها فوراً
app.post("/analyze-frame", async (req, res) => {
  try {
    const aiModel = await getModel();
    if (!req.body || req.body.length === 0) {
      return res.status(400).json({ error: "No data" });
    }

    // معالجة بايتات الصورة وتحويلها لتنسيق يدعمه المودل
    let imageTensor = tf.node.decodeImage(req.body, 3);
    imageTensor = tf.image.resizeBilinear(imageTensor, [224, 224]).div(127.5).sub(1).expandDims(0);

    const prediction = aiModel.predict(imageTensor);
    const scores = await prediction.data();

    imageTensor.dispose();
    prediction.dispose();

    // حساب النتيجة الحقيقية (تأكد من ترتيب المصفوفة لديك)
    if (scores[1] > 0.80) { // كلاس الخطر
      currentStatus = "Danger";
      currentConfidence = Math.round(scores[1] * 100);
    } else {
      currentStatus = "Safe";
      currentConfidence = Math.round(scores[0] * 100);
    }

    console.log(`التحليل المباشر لكاميرا الآيباد: ${currentStatus} (${currentConfidence}%)`);
    res.json({ status: currentStatus, confidence: currentConfidence });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// الرابط الذي سيقرأ منه الأردوينو أو التطبيق للتحديث
app.get("/status", (req, res) => {
  res.json({ status: currentStatus, confidence: currentConfidence });
});

getModel().then(() => {
  app.listen(3000, "0.0.0.0", () => {
    console.log("سيرفر تحليل كاميرا الآيباد يعمل على منفذ 3000");
  });
});