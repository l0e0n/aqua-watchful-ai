import { Users, Waves, Zap, Eye, BellRing, LifeBuoy } from "lucide-react";

const features = [
  { icon: Users, title: "تصنيف ذكي", desc: "تمييز فوري بين الطفل والبالغ والحيوان الأليف." },
  { icon: Waves, title: "تحليل حركة الماء", desc: "رصد أنماط السباحة الطبيعية والتغيرات المفاجئة." },
  { icon: Eye, title: "بث مباشر", desc: "مشاهدة المسبح من تطبيق الجوال في أي وقت." },
  { icon: BellRing, title: "تنبيهات فورية", desc: "إشعارات وإنذار صوتي قوي عند الاشتباه." },
  { icon: LifeBuoy, title: "آلية إنقاذ متقدمة", desc: "رفع جزء من أرضية المسبح في النموذج المتقدم." },
  { icon: Zap, title: "استجابة فورية", desc: "من الكشف إلى الإنذار في أقل من ثانية." },
];

export function Features() {
  return (
    <section id="features" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold text-aqua">المميزات</span>
            <h2 className="mt-3 text-balance text-4xl font-bold tracking-tight md:text-5xl">
              كل ما تحتاجه لحماية متكاملة
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            نظام مصمم خصيصاً للمسابح المنزلية والعامة، يعمل بصمت تام إلى أن تظهر الحاجة.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card-gradient p-7 transition-all hover:border-aqua/40 hover:shadow-glow"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-aqua/10 text-aqua transition-colors group-hover:bg-aqua-gradient group-hover:text-primary-foreground">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
