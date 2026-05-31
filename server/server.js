const express = require("express");
const cors = require("cors");
const NodeWebcam = require("node-webcam");

// 💡 حل مشكلة الدالة الناقصة لنسخ Node.js الحديثة
const util = require("util");
util.isNullOrUndefined = (val) => val === undefined || val === null;

const tf = require("@tensorflow/tfjs-node");
const tmImage = require("@teachablemachine/image");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// 🔴 ضعي هنا رابط الموديل الخاص بكِ من موقع Teachable Machine
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/AIeD8hzch/"; 

let model;
let currentStatus = { status: "Initializing AI...", confidence: 0 };

// دالة تحميل الموديل عند بدء تشغيل السيرفر
async function loadModel() {
  try {
    const modelURL = MODEL_URL + "model.json";
    const metadataURL = MODEL_URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    currentStatus = { status: "Safe", confidence: 100 };
    console.log("✅ تم تحميل موديل الذكاء الاصطناعي بنجاح!");
    startCameraAnalysis(); 
  } catch (err) {
    console.error("❌ فشل تحميل الموديل، تأكدي من الرابط:", err.message);
  }
}

// إعدادات التقاط الصور من OBS Virtual Camera
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

// دالة التقاط الصور وتحليلها كل ثانية مع فحص أمان البيانات
function startCameraAnalysis() {
  setInterval(() => {
    webcam.capture("frame_cache", async (err, buffer) => {
      if (err) {
        console.log("⚠️ تعذر القراءة من OBS. تأكدي من تفعيل الكاميرا الافتراضية وصلاحياتها:", err.message);
        return;
      }

      // 🛡️ فحص إضافي: إذا كان الـ buffer فاضي أو لم يكتمل تحميله، نتخطى الفريم الحالي وننتظر التالي
      if (!buffer || buffer.length === 0) {
        return;
      }

      if (!model) return;

      try {
        // تحويل الـ buffer إلى صورة يفهمها تينسورفلو
        const tfImage = tf.node.decodeImage(buffer, 3);
        
        // إجراء التنبؤ عبر الموديل
        const predictions = await model.predict(tfImage);
        
        // ترتيب النتائج للحصول على أعلى نسبة يقين
        predictions.sort((a, b) => b.probability - a.probability);
        const topResult = predictions[0];

        // تحديث الحالة التي يقرأها تطبيق بلوفيبل
        currentStatus = {
          status: topResult.className, 
          confidence: Math.round(topResult.probability * 100)
        };

        // تنظيف الذاكرة فوراً لمنع البطء
        tfImage.dispose();

      } catch (aiErr) {
        // تم كتم تفاصيل الخطأ الداخلي العابر لكي لا يمتلئ التيرمنال، السيرفر سيتجاوزه تلقائياً بالفريم التالي
      }
    });
  }, 1000); // التقاط وتحليل فريم كل ثانية
}

// الرابط المخصص لتغذية تطبيق بلوفيبل بالتحديثات
app.get("/status", (req, res) => {
  res.json(currentStatus);
});

app.listen(3000, "0.0.0.0", () => {
  console.log("🚀 السيرفر يعمل الآن ومستعد على المنفذ 3000");
  loadModel();
});