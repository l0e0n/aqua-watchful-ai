const express = require("express");
const cors = require("cors");
const tf = require("@tensorflow/tfjs-node");
const path = require("path");

const app = express();

// تفعيل CORS عشان الفرونت إند يقدر يتصل بالسيرفر عبر الآيبي الجديد بدون مشاكل أمان
app.use(cors({ origin: "*" })); 

// استقبال الصور الخام بأقصى سرعة
app.use(express.raw({ type: "image/jpeg", limit: "10mb" }));

const MODEL_URL = "file://" + path.join(__dirname, "public/model/model.json");
let model = null;

// المتغيرات الحية التي سيقرأها التطبيق
let currentStatus = "Connecting...";
let currentConfidence = 0;

// أسماء الكلاسات بنفس الترتيب الذي ظهر لك في موقع Teachable Machine
// (عدل الترتيب هنا لو كان "طفل يسبح" هو الأول أو الثاني عندك في الموقع)
const LABELS = ["Safe_Swimming", "Danger_Drowning"]; 

async function getModel() {
  if (!model) {
    console.log("Loading model...");
    model = await tf.loadLayersModel(MODEL_URL);
    console.log("Model ready");
  }
  return model;
}

// استقبال الفريمات الحقيقية وتحليلها
app.post("/analyze-frame", async (req, res) => {
  try {
    const aiModel = await getModel();
    if (!req.body || req.body.length === 0) {
      return res.status(400).json({ error: "No data received" });
    }

    // معالجة بايتات الصورة وتحويلها لتنسيق 224x224 يدعمه المودل
    let imageTensor = tf.node.decodeImage(req.body, 3);
    imageTensor = tf.image.resizeBilinear(imageTensor, [224, 224]).div(127.5).sub(1).expandDims(0);

    const prediction = aiModel.predict(imageTensor);
    const scores = await prediction.data(); // مصفوفة تحتوي على نسب الكلاسات

    imageTensor.dispose();
    prediction.dispose();

    // البحث عن أعلى نسبة كلاس تم التعرف عليها
    let maxScoreIndex = scores.indexOf(Math.max(...scores));
    
    currentStatus = LABELS[maxScoreIndex];
    currentConfidence = Math.round(scores[maxScoreIndex] * 100);

    console.log(`التحليل الحالي: ${currentStatus} (${currentConfidence}%)`);
    res.json({ status: currentStatus, confidence: currentConfidence });

  } catch (err) {
    console.error("Error analyzing frame:", err);
    res.status(500).json({ error: err.message });
  }
});

// الرابط المباشر لتحديث الحالة في التطبيق (لوفيبيل)
app.get("/status", (req, res) => {
  res.json({ status: currentStatus, confidence: currentConfidence });
});

// تشغيل السيرفر على الشبكة المحلية
getModel().then(() => {
  app.listen(3000, "0.0.0.0", () => {
    console.log("------------------------------------------------------");
    console.log("سيرفر تحليل الكاميرا يعمل بنجاح!");
    console.log("الرابط المحلي للفرونت إند: http://192.168.8.101:3000/status");
    console.log("------------------------------------------------------");
  });
});