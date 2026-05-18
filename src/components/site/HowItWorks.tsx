import { Radar, Camera, Brain, Bell } from "lucide-react";

const steps = [
  {
    icon: Radar,
    title: "حساس المسافة",
    desc: "يكتشف اقتراب أي شخص من المسبح ويقوم بتفعيل النظام تلقائياً.",
  },
  {
    icon: Camera,
    title: "الكاميرا الذكية",
    desc: "تبدأ المراقبة المباشرة وترسل البث للذكاء الاصطناعي للتحليل.",
  },
  {
    icon: Brain,
    title: "تحليل الذكاء الاصطناعي",
    desc: "تصنيف الشخص (طفل / بالغ / حيوان) وتحليل الحركة داخل الماء.",
  },
  {
    icon: Bell,
    title: "الاستجابة الفورية",
    desc: "إنذار صوتي وتنبيه على الجوال، وتفعيل آلية الإنقاذ في النموذج المتقدم.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-aqua">آلية العمل</span>
          <h2 className="mt-3 text-balance text-4xl font-bold tracking-tight md:text-5xl">
            أربع طبقات حماية تعمل في تناغم تام
          </h2>
          <p className="mt-4 text-muted-foreground">
            من لحظة اقتراب الطفل من المسبح وحتى إصدار الإنذار، يستغرق النظام أجزاءً من الثانية.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card-gradient p-6 shadow-card-soft transition-all hover:-translate-y-1 hover:border-aqua/40"
            >
              <div className="absolute right-4 top-4 text-7xl font-black text-aqua/5 transition-colors group-hover:text-aqua/10">
                0{i + 1}
              </div>
              <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-aqua-gradient text-primary-foreground shadow-glow">
                <s.icon className="h-6 w-6" strokeWidth={2.2} />
              </div>
              <h3 className="relative mt-5 text-lg font-bold">{s.title}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
