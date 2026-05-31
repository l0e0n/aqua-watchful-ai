const express = require("express");
const cors = require("cors");
const NodeWebcam = require("node-webcam");
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

// إعدادات التقاط الصور - تم تعديلها لإجبار الماك على اختيار OBS Virtual Camera
const webcamOptions = {
  width: 640,
  height: 480,
  quality: 60,
  output: "jpeg",
  callbackReturn: "buffer",
  verbose: false,
  // تحديد اسم الكاميرا الافتراضية لـ OBS في نظام الماك
  device: "2" 
};

const webcam = NodeWebcam.create(webcamOptions);

// دالة التقاط الصور وتحليلها كل ثانية
function startCameraAnalysis() {
  setInterval(() => {
    webcam.capture("frame_cache", async (err, buffer) => {
      if (err) {
        console.log("⚠️ تعذر القراءة من OBS. تأكدي من الضغط على Start Virtual Camera في برنامج OBS:", err.message);
        return;
      }

      if (!model) return;

      try {
        // تحويل الـ buffer إلى صورة يفهمها TensorFlow
        const tfImage = tf.node.decodeImage(buffer, 3);
        
        // إجراء التنبؤ عبر الموديل
        const predictions = await model.predict(tfImage);
        
        // ترتيب النتائج للحصول على أعلى نسبة يقين
        predictions.sort((a, b) => b.probability - a.probability);
        const topResult = predictions[0];

        // تحديث الحالة التي يقرأها التطبيق فوراً
        currentStatus = {
          status: topResult.className, // الاسم المكتوب في موقع Teachable Machine (مثل Drowning أو Safe)
          confidence: Math.round(topResult.probability * 100)
        };

        // تنظيف الذاكرة
        tfImage.dispose();

      } catch (aiErr) {
        console.error("خطأ أثناء تحليل الفريم:", aiErr.message);
      }
    });
  }, 1000); 
}

// الرابط الذي يطلبه تطبيق بلوفيبل لتحديث البيانات
app.get("/status", (req, res) => {
  res.json(currentStatus);
});

// تشغيل السيرفر
app.listen(3000, "0.0.0.0", () => {
  console.log("🚀 السيرفر يعمل الآن ومستعد على المنفذ 3000");
  loadModel();
});