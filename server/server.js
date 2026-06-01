const express = require("express");
const cors = require("cors");
const NodeWebcam = require("node-webcam");

// 💡 حل مشكلة الدوال الناقصة لنسخ Node.js والبيئة المزيفة
const util = require("util");
util.isNullOrUndefined = (val) => val === undefined || val === null;

global.document = {
  createElement: () => ({
    getContext: () => ({
      drawImage: () => {},
      getImageData: () => ({ data: new Uint8ClampedArray() })
    })
  })
};
global.HTMLVideoElement = class {};
global.HTMLImageElement = class {};
global.HTMLCanvasElement = class {};

const tf = require("@tensorflow/tfjs-node");
const tmImage = require("@teachablemachine/image");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// 🔴 ضعي هنا رابط الموديل الخاص بكِ من موقع Teachable Machine
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/AIeD8hzch/"; 

let model;
let labels = []; // لتخزين أسماء التصنيفات (مثل Safe و Drowning)
let currentStatus = { status: "Model Loading...", confidence: 0 };

// استبدلي دالة loadModel القديمة بهذه الدالة بالكامل:
async function loadModel() {
  try {
    // 💡 تعديل المسار ليقرأ من مجلد public/model الذي يحتوي على ملفاتك
    const modelURL = tf.io.fileSystem("./public/model/model.json");
    
    // تحميل الموديل باستخدام تينسورفلو المحلي
    model = await tf.loadLayersModel(modelURL);
    
    // قراءة التصنيفات من ملف metadata المحلي في نفس المجلد الصحيح
    const metadata = require("./public/model/metadata.json");
    labels = metadata.labels; 

    currentStatus = { status: "Waiting for First Frame...", confidence: 0 };
    console.log("✅ تم تحميل موديل الذكاء الاصطناعي محلياً من المجلد الصحيح وتجهيز التصنيفات!");
    startCameraAnalysis(); 
  } catch (err) {
    console.error("❌ فشل تحميل الموديل محلياً، تأكدي من مسار الملفات:", err.message);
  }
}

const webcamOptions = {
  width: 640,
  height: 480,
  quality: 60,
  output: "jpeg",
  callbackReturn: "buffer",
  verbose: false,
  device: "OBS Virtual Camera" 
};

const webcam = NodeWebcam.create(webcamOptions);

function startCameraAnalysis() {
  setInterval(() => {
    webcam.capture("frame_cache", async (err, buffer) => {
      if (err) {
        console.log("⚠️ خطأ في التقاط الكاميرا:", err.message);
        return;
      }

      if (!buffer || buffer.length === 0) return;
      if (!model) return;

      try {
        // 1. تحويل الـ buffer إلى تينسور بالمعايير المطلوبة للموديل (تغيير الحجم لـ 224x224 وتطبيع الألوان)
        const tfImage = tf.node.decodeImage(buffer, 3)
          .resizeBilinear([224, 224])
          .expandDims(0)
          .toFloat()
          .div(127.5)
          .sub(1);

        // 2. التنبؤ عبر المحرك الأساسي مباشرة لتجنب أخطاء المتصفح
        // ✅ السطر الجديد الصحيح
        const logits = model.predict(tfImage);
        const probabilities = await logits.data();

        // 3. دمج التصنيفات مع النسب المستخرجة وترتيبها
        const predictions = labels.map((label, index) => ({
          className: label,
          probability: probabilities[index]
        }));

        predictions.sort((a, b) => b.probability - a.probability);
        const topResult = predictions[0];

        // طباعة النتيجة الحقيقية فوراً في التيرمنال
        console.log(`🤖 نتيجة التحليل الحالية: ${topResult.className} (${Math.round(topResult.probability * 100)}%)`);

        // 4. تحديث الحالة للتطبيق
        currentStatus = {
          status: topResult.className, 
          confidence: Math.round(topResult.probability * 100)
        };

        // تنظيف الذاكرة بالكامل لمنع أي تعليق في الجهاز
        tfImage.dispose();
        logits.dispose();

      } catch (aiErr) {
        console.error("❌ خطأ داخلي أثناء معالجة التنبؤ المباشر:", aiErr.message);
      }
    });
  }, 1000); 
}

app.get("/status", (req, res) => {
  res.json(currentStatus);
});

app.listen(3000, "0.0.0.0", () => {
  console.log("🚀 السيرفر يعمل الآن ومستعد على المنفذ 3000");
  loadModel();
});