import { Brain, ScanFace, Activity, AlertCircle } from "lucide-react";

const items = [
  { icon: ScanFace, title: "تصنيف الأشخاص", text: "طفل / بالغ / حيوان أليف بدقة عالية." },
  { icon: Activity, title: "تحليل الحركة", text: "متابعة سلوك الجسم داخل الماء بشكل مستمر." },
  { icon: Brain, title: "اكتشاف أنماط الغرق", text: "تعلّم آلي على مئات السيناريوهات الحقيقية." },
  { icon: AlertCircle, title: "قرار التنبيه", text: "تأكيد الحالة قبل إصدار الإنذار لتجنب الإنذارات الكاذبة." },
];

export function AISection() {
  return (
    <section id="ai" className="relative overflow-hidden py-28">
      <div className="absolute inset-0 water-grid opacity-50" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-aqua/30 bg-aqua/10 px-4 py-1.5 text-xs text-aqua">
            <Brain className="h-3.5 w-3.5" /> دور الذكاء الاصطناعي
          </div>
          <h2 className="mt-5 text-balance text-4xl font-bold tracking-tight md:text-5xl">
            عقل النظام الذي يقرر متى يوجد خطر فعلي
          </h2>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div key={it.title} className="rounded-3xl border border-border/60 bg-card-gradient p-6 transition-all hover:border-aqua/40">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-aqua-gradient text-primary-foreground">
                <it.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-bold">{it.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{it.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
