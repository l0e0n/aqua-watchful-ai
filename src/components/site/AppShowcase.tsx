import { BellRing, Video, History, Settings2, Waves } from "lucide-react";

export function AppShowcase() {
  return (
    <section id="app" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          {/* Phone mockup */}
          <div className="relative mx-auto">
            <div className="absolute -inset-10 bg-aqua/20 blur-3xl" aria-hidden />
            <div className="relative w-[300px] rounded-[3rem] border-[10px] border-card bg-deep p-3 shadow-card-soft">
              <div className="overflow-hidden rounded-[2.2rem] bg-background">
                <div className="bg-aqua-gradient p-5 text-primary-foreground">
                  <div className="text-xs opacity-80">مرحباً 👋</div>
                  <div className="mt-1 text-lg font-bold">المسبح آمن</div>
                  <div className="mt-1 text-xs opacity-80">آخر تحديث الآن</div>
                </div>
                <div className="space-y-3 p-4">
                  <div className="rounded-2xl bg-card p-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">البث المباشر</span>
                      <span className="rounded-full bg-danger px-2 py-0.5 text-[10px] text-destructive-foreground">LIVE</span>
                    </div>
                    <div className="mt-2 aspect-video rounded-xl bg-aqua/20 water-grid" />
                  </div>
                  <Item icon={BellRing} title="لا تنبيهات حالياً" sub="آخر تنبيه: أمس 18:30" />
                  <Item icon={Waves} title="درجة حرارة الماء" sub="27°C — مثالية" />
                  <Item icon={History} title="سجل الحوادث" sub="3 أحداث هذا الأسبوع" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <span className="text-sm font-semibold text-aqua">تطبيق الجوال</span>
            <h2 className="mt-3 text-balance text-4xl font-bold tracking-tight md:text-5xl">
              المسبح في جيبك أينما كنت
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              تابع حالة المسبح لحظة بلحظة، استقبل التنبيهات الفورية، وتحكم بالحساس والكاميرا من تطبيق واحد.
            </p>

            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              <Feat icon={Video} title="بث مباشر HD" />
              <Feat icon={BellRing} title="تنبيهات فورية" />
              <Feat icon={History} title="سجل كامل للحوادث" />
              <Feat icon={Settings2} title="تحكم في الإعدادات" />
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Item({ icon: Icon, title, sub }: { icon: any; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-card p-3">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-aqua/10 text-aqua">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 text-xs">
        <div className="font-semibold">{title}</div>
        <div className="text-muted-foreground">{sub}</div>
      </div>
    </div>
  );
}

function Feat({ icon: Icon, title }: { icon: any; title: string }) {
  return (
    <li className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/40 p-4">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-aqua-gradient text-primary-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <span className="font-semibold">{title}</span>
    </li>
  );
}
