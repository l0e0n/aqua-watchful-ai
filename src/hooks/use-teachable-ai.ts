import * as tmImage from "@teachablemachine/image";
import { useEffect, useRef, useState } from "react";

const MODEL_URL = "https://teachablemachine.withgoogle.com/models/AIeD8hzch/";

export function useTeachableAI(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const modelRef = useRef<tmImage.CustomMobileNet | null>(null);
  const [status, setStatus] = useState("Loading...");
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const modelURL = MODEL_URL + "model.json";
        const metadataURL = MODEL_URL + "metadata.json";

        const model = await tmImage.load(modelURL, metadataURL);
        modelRef.current = model;

        setStatus("Ready");

        setInterval(async () => {
          if (!videoRef.current || !modelRef.current) return;

          const prediction = await modelRef.current.predict(videoRef.current);

          // نجيب أعلى نتيجة
          const best = prediction.sort((a, b) => b.probability - a.probability)[0];

          setStatus(best.className);
          setConfidence(Math.round(best.probability * 100));
        }, 1000);

      } catch (e) {
        setStatus("Error");
      }
    };

    load();
  }, []);

  return { status, confidence };
}