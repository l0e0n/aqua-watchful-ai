import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="#top" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-aqua-gradient shadow-glow">
            <Shield className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-tight">Aqua Guard</span>
            <span className="text-[10px] text-muted-foreground">حماية ذكية للمسابح</span>
          </div>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#how" className="transition-colors hover:text-foreground">آلية العمل</a>
          <a href="#features" className="transition-colors hover:text-foreground">المميزات</a>
          <a href="#ai" className="transition-colors hover:text-foreground">الذكاء الاصطناعي</a>
          <a href="#app" className="transition-colors hover:text-foreground">التطبيق</a>
        </nav>
        <Button className="bg-aqua-gradient text-primary-foreground hover:opacity-90">
          ابدأ الحماية
        </Button>
      </div>
    </header>
  );
}
