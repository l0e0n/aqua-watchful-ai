import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-aqua-gradient">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold">Aqua Guard</span>
        </div>
        <p className="text-sm text-muted-foreground">© 2026 Aqua Guard · حماية ذكية للمسابح</p>
      </div>
    </footer>
  );
}
