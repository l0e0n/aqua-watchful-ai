const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const tf = require("@tensorflow/tfjs-node");
const tmImage = require("@teachablemachine/image");

const app = express();
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

app.use("/model", express.static(path.join(__dirname, "public/model")));

const MODEL_URL =
  "file://" + path.join(__dirname, "public/model/model.json");

const METADATA_URL =
  "file://" + path.join(__dirname, "public/model/metadata.json");

let model = null;

// 🟢 تحميل المودل أول مرة عند الحاجة فقط (LAZY LOAD FIX)
async function getModel() {
  if (!model) {
    console.log("⏳ Loading AI model...");

    model = await tmImage.load(MODEL_URL, METADATA_URL);

    console.log("✅ AI Model loaded");
  }
  return model;
}

// 🟢 status
app.get("/status", (req, res) => {
  res.json({
    status: model ? "ready" : "not_loaded",
    confidence: 0,
  });
});

// 🧠 analyze
app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    const model = await getModel();

    if (!req.file) {
      return res.status(400).json({ error: "No image" });
    }

    const imageTensor = tf.node.decodeImage(req.file.buffer);

    const prediction = await model.predict(imageTensor);

    prediction.sort((a, b) => b.probability - a.probability);

    const top = prediction[0];

    res.json({
      status: top.className,
      confidence: Math.round(top.probability * 100),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 🚀 start
app.listen(3000, "0.0.0.0", () => {
  console.log("🚀 Server running on http://localhost:3000");
});