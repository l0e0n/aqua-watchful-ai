import { Clock, Activity, AlertTriangle, CheckCircle2 } from "lucide-react";

export function DrowningDetection() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-sm font-semibold text-aqua">نظام كشف الغرق</span>
            <h2 className="mt-3 text-balance text-4xl font-bold tracking-tight md:text-5xl">
              مراقبة ذكية لمدة دقيقة قبل الإنذار
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              عند دخول طفل إلى المسبح، لا يصدر النظام إنذاراً فورياً.
              بل يفعّل نظام مراقبة ذكي لمتابعة الحركة خلال أول دقيقة،
              لأن الطفل قد يكون يسبح بشكل طبيعي.
            </p>

            <div className="mt-8 space-y-4">
              <Row icon={CheckCircle2} color="text-aqua" title="حركة طبيعية" text="السباحة والحركة المستمرة → لا يوجد خطر." />
              <Row icon={AlertTriangle} color="text-danger" title="مؤشرات خطر" text="توقف مفاجئ أو اختفاء تحت الماء → اشتباه غرق." />
            </div>
          </div>

          {/* Timeline visualization */}
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card-gradient p-8 shadow-card-soft">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-aqua" /> الجدول الزمني للتحليل</span>
              <span>60 ثانية</span>
            </div>

            <div className="mt-8 space-y-6">
              <Stage time="00:00" label="دخول الطفل" icon={Activity} active />
              <div className="relative mr-6 h-12 border-r-2 border-dashed border-aqua/40">
                <span className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md bg-aqua/10 px-2 py-0.5 text-xs text-aqua">
                  مراقبة الحركة
                </span>
              </div>
              <Stage time="00:30" label="تحليل النمط بالذكاء الاصطناعي" icon={Activity} active />
              <div className="relative mr-6 h-12 border-r-2 border-dashed border-aqua/40" />
              <Stage time="01:00" label="قرار الحالة" icon={AlertTriangle} danger />
            </div>

            <div className="mt-8 rounded-2xl border border-danger/30 bg-danger/10 p-4 text-sm">
              <div className="flex items-center gap-2 font-semibold text-danger">
                <AlertTriangle className="h-4 w-4" /> اشتباه غرق
              </div>
              <p className="mt-1 text-muted-foreground">
                يتم إطلاق الإنذار وإرسال التنبيه الفوري للهاتف وتفعيل آلية الإنقاذ.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ icon: Icon, color, title, text }: { icon: any; color: string; title: string; text: string }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card/40 p-4">
      <Icon className={`mt-0.5 h-5 w-5 ${color}`} />
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}

function Stage({ time, label, icon: Icon, active, danger }: { time: string; label: string; icon: any; active?: boolean; danger?: boolean }) {
  return (
    <div className="flex items-center gap-4">
      <div className={`grid h-10 w-10 place-items-center rounded-full ${danger ? "bg-danger text-destructive-foreground" : active ? "bg-aqua-gradient text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <div className="text-xs text-muted-foreground">{time}</div>
        <div className="font-semibold">{label}</div>
      </div>
    </div>
  );
}
