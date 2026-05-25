import heroPool from "@/assets/hero-pool.jpg";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, ShieldCheck } from "lucide-react";

export function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden bg-hero pt-28">
      <div className="absolute inset-0 water-grid opacity-60" aria-hidden />
      <div className="absolute inset-0">
        <img
          src={heroPool}
          alt="مسبح تحت المراقبة الذكية"
          width={1600}
          height={1100}
          className="h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-aqua pulse-ring" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-aqua" />
            </span>
            النظام نشط · يراقب المسبح الآن
          </div>

          <h1 className="text-balance text-4xl font-extrabold leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
            حماية ذكية تمنع
            <br />
            <span className="bg-aqua-gradient bg-clip-text text-transparent">غرق الأطفال</span>
            <br />
            قبل وقوع الكارثة.
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Aqua Guard</strong> نظام متكامل يدمج
            حساس المسافة، الكاميرا، والذكاء الاصطناعي لمراقبة المسبح لحظة بلحظة،
            ورصد أي مؤشر خطر خلال ثوانٍ.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Button size="lg" className="bg-aqua-gradient px-7 text-primary-foreground hover:opacity-90 shadow-glow">
              فعّل الحماية الآن
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-border/60 bg-card/40 backdrop-blur">
              <Play className="h-4 w-4" />
              شاهد العرض
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-aqua" />
              استجابة في أقل من ثانية
            </div>
            <div className="h-4 w-px bg-border" />
            <div>دقة كشف <span className="font-semibold text-foreground">99.2%</span></div>
            <div className="h-4 w-px bg-border" />
            <div>يعمل 24/7</div>
          </div>
        </div>

        {/* Live monitor card */}
        <div className="relative float-slow">
          <div className="absolute -inset-6 bg-aqua/20 blur-3xl" aria-hidden />
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card-gradient p-2 shadow-card-soft backdrop-blur-xl">
            <div className="relative overflow-hidden rounded-2xl">
              <div className="aspect-[4/3] w-full overflow-hidden bg-deep">
                <iframe
                  src="https://vdo.ninja/?view=FAiZgaS&cover&autostart&cleanoutput"
                  title="بث مباشر للمسبح"
                  allow="autoplay; camera; microphone; fullscreen"
                  className="h-full w-full border-0"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-deep/80 to-transparent pointer-events-none" />
              <div className="absolute right-3 top-3 flex items-center gap-2 rounded-full bg-danger/90 px-3 py-1 text-xs font-medium text-destructive-foreground">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                LIVE
              </div>
              <div className="absolute left-3 top-3 rounded-full bg-background/70 px-3 py-1 text-xs backdrop-blur">
                CAM · المسبح الرئيسي
              </div>
              {/* Detection box */}
              <div className="absolute bottom-12 left-1/2 h-24 w-24 -translate-x-1/2 rounded-md border-2 border-aqua shadow-glow">
                <div className="absolute -top-6 right-0 rounded bg-aqua px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                  CHILD · 98%
                </div>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl bg-background/70 px-3 py-2 text-xs backdrop-blur">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-aqua" />
                  مراقبة ذكية · 00:42
                </div>
                <span className="text-muted-foreground">الحركة طبيعية</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
