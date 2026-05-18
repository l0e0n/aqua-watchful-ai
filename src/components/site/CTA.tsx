import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function CTA() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-border/60 bg-card-gradient p-12 text-center shadow-card-soft md:p-16">
          <div className="absolute inset-0 water-grid opacity-50" aria-hidden />
          <div className="relative">
            <h2 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
              لا تنتظر وقوع الحادث.
              <br />
              <span className="bg-aqua-gradient bg-clip-text text-transparent">احمِ من تحب اليوم.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
              انضم لقائمة الانتظار واحصل على Aqua Guard في منزلك قبل غيرك.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button size="lg" className="bg-aqua-gradient px-8 text-primary-foreground hover:opacity-90 shadow-glow">
                احجز نظامك
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-border/60 bg-card/40">
                تواصل معنا
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
