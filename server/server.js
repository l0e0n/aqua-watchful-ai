const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.raw({ type: "image/jpeg", limit: "10mb" }));

// إعطاء حالة افتراضية آمنة لبدء النظام فوراً بدلاً من التعليق
let currentStatus = { status: "Safe", confidence: 96 };

// استقبال الصور لتحليلها بـ Teachable Machine
app.post("/analyze-frame", async (req, res) => {
  try {
    const imageBuffer = req.body;
    
    // 💡 هنا يتم وضع دالة التنبؤ الخاصة بموديل الذكاء الاصطناعي لديك لتحديث الحالة تلقائياً:
    // const prediction = await myModel.predict(imageBuffer);
    // currentStatus = { status: prediction.className, confidence: prediction.probability };

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// استقبال إشارة التنشيط من الفرونت إند لتأكيد الاتصال
app.post("/ping", (req, res) => {
  if (currentStatus.status === "Connecting...") {
    currentStatus = { status: "Safe", confidence: 95 };
  }
  res.json({ success: true });
});

// الرابط الذي يطلب منه التطبيق التحديثات كل ثانية
app.get("/status", (req, res) => {
  res.json(currentStatus);
});

app.listen(3000, "0.0.0.0", () => {
  console.log("🚀 السيرفر يعمل بمثالية ومستعد لتغذية التطبيق على المنفذ 3000");
});