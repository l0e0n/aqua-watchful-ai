import { useState } from "react";
import {
  Shield, Home, Bell, History, Settings, Waves, Video, BellRing,
  ThermometerSun, Activity, AlertTriangle, CheckCircle2, ChevronLeft,
  Wifi, Battery, Signal, Play, Pause, Maximize2, ScanFace, Brain,
  Radar, Camera, ChevronRight, User, LifeBuoy,
} from "lucide-react";
import heroPool from "@/assets/hero-pool.jpg";

type Tab = "home" | "live" | "alerts" | "settings";

export function AquaApp() {
  const [tab, setTab] = useState<Tab>("home");

  return (
    <div className="min-h-screen bg-hero py-0 md:py-10">
      {/* Phone frame */}
      <div className="mx-auto w-full max-w-[440px] md:max-w-[400px]">
        <div className="relative md:rounded-[3rem] md:border-[12px] md:border-card md:bg-deep md:p-2 md:shadow-card-soft">
          <div className="relative min-h-screen overflow-hidden bg-background md:min-h-[860px] md:rounded-[2.4rem]">
            <StatusBar />
            <AppHeader tab={tab} />

            <div className="pb-28">
              {tab === "home" && <HomeScreen onOpenLive={() => setTab("live")} />}
              {tab === "live" && <LiveScreen />}
              {tab === "alerts" && <AlertsScreen />}
              {tab === "settings" && <SettingsScreen />}
            </div>

            <BottomNav tab={tab} setTab={setTab} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Chrome ---------- */

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-4 text-xs text-foreground/80">
      <span className="font-semibold">9:41</span>
      <div className="flex items-center gap-1.5">
        <Signal className="h-3.5 w-3.5" />
        <Wifi className="h-3.5 w-3.5" />
        <Battery className="h-4 w-4" />
      </div>
    </div>
  );
}

function AppHeader({ tab }: { tab: Tab }) {
  const titles: Record<Tab, string> = {
    home: "الرئيسية",
    live: "البث المباشر",
    alerts: "التنبيهات",
    settings: "الإعدادات",
  };
  return (
    <div className="flex items-center justify-between px-5 pb-3 pt-5">
      <div className="flex items-center gap-2.5">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-aqua-gradient shadow-glow">
          <Shield className="h-4.5 w-4.5 text-primary-foreground" strokeWidth={2.6} />
        </div>
        <div className="leading-tight">
          <div className="text-[15px] font-bold tracking-tight">Aqua Guard</div>
          <div className="text-[10px] text-muted-foreground">{titles[tab]}</div>
        </div>
      </div>
      <button className="relative grid h-10 w-10 place-items-center rounded-xl border border-border/60 bg-card/50">
        <Bell className="h-4 w-4 text-foreground/80" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger" />
      </button>
    </div>
  );
}

function BottomNav({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const items: { id: Tab; label: string; icon: any }[] = [
    { id: "home", label: "الرئيسية", icon: Home },
    { id: "live", label: "البث", icon: Video },
    { id: "alerts", label: "التنبيهات", icon: Bell },
    { id: "settings", label: "الإعدادات", icon: Settings },
  ];
  return (
    <div className="absolute inset-x-3 bottom-3 z-20">
      <div className="flex items-center justify-around rounded-2xl border border-border/60 bg-card/80 px-2 py-2 shadow-card-soft backdrop-blur-xl">
        {items.map((it) => {
          const active = tab === it.id;
          return (
            <button
              key={it.id}
              onClick={() => setTab(it.id)}
              className={`flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 transition-all ${
                active ? "bg-aqua-gradient text-primary-foreground shadow-glow" : "text-muted-foreground"
              }`}
            >
              <it.icon className="h-4.5 w-4.5" />
              <span className="text-[10px] font-semibold">{it.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Home ---------- */

function HomeScreen({ onOpenLive }: { onOpenLive: () => void }) {
  return (
    <div className="space-y-5 px-5">
      {/* Status hero */}
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card-gradient p-5 shadow-card-soft">
        <div className="absolute inset-0 water-grid opacity-50" aria-hidden />
        <div className="relative">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 rounded-full border border-aqua/30 bg-aqua/10 px-3 py-1 text-[11px] text-aqua">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-aqua pulse-ring" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-aqua" />
              </span>
              النظام نشط
            </span>
            <span className="text-[10px] text-muted-foreground">آخر فحص الآن</span>
          </div>

          <div className="mt-5 flex items-end gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-aqua-gradient shadow-glow">
              <CheckCircle2 className="h-7 w-7 text-primary-foreground" strokeWidth={2.4} />
            </div>
            <div>
              <div className="text-[11px] text-muted-foreground">حالة المسبح</div>
              <div className="text-2xl font-extrabold tracking-tight">آمن تماماً</div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            <Stat label="الحرارة" value="27°" icon={ThermometerSun} />
            <Stat label="الحركة" value="هادئة" icon={Activity} />
            <Stat label="الكاميرا" value="HD" icon={Camera} />
          </div>
        </div>
      </div>

      {/* Live preview card */}
      <button
        onClick={onOpenLive}
        className="block w-full overflow-hidden rounded-3xl border border-border/60 bg-card text-right shadow-card-soft"
      >
        <div className="relative">
          <img src={heroPool} alt="مسبح" className="aspect-[16/10] w-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-deep/90 via-deep/30 to-transparent" />
          <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-danger/90 px-2.5 py-1 text-[10px] font-bold text-destructive-foreground">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> LIVE
          </div>
          <div className="absolute left-3 top-3 rounded-full bg-background/60 px-2.5 py-1 text-[10px] backdrop-blur">
            CAM · المسبح الرئيسي
          </div>
          <div className="absolute bottom-1/3 right-1/2 h-16 w-16 translate-x-1/2 rounded-md border-2 border-aqua shadow-glow">
            <span className="absolute -top-5 right-0 rounded bg-aqua px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">
              CHILD · 98%
            </span>
          </div>
          <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-xl bg-background/70 px-3 py-2 text-[11px] backdrop-blur">
            <span className="flex items-center gap-1.5">
              <Play className="h-3 w-3 text-aqua" /> مشاهدة البث المباشر
            </span>
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </button>

      {/* AI insights */}
      <div className="rounded-3xl border border-border/60 bg-card-gradient p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-aqua/15 text-aqua">
              <Brain className="h-4 w-4" />
            </div>
            <div className="text-sm font-bold">الذكاء الاصطناعي</div>
          </div>
          <span className="text-[10px] text-aqua">يعمل الآن</span>
        </div>
        <div className="mt-4 space-y-2.5">
          <AiRow icon={ScanFace} label="تصنيف الأشخاص" value="طفل + بالغ" />
          <AiRow icon={Activity} label="تحليل الحركة" value="ضمن المعدل" />
          <AiRow icon={Radar} label="حساس المسافة" value="3.2م" />
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <QuickAction icon={LifeBuoy} title="إنقاذ يدوي" sub="تفعيل فوري" tone="danger" />
        <QuickAction icon={BellRing} title="تنبيه تجريبي" sub="اختبار النظام" tone="aqua" />
      </div>
    </div>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/40 p-3">
      <Icon className="mx-auto h-4 w-4 text-aqua" />
      <div className="mt-1.5 text-sm font-bold">{value}</div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}

function AiRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-background/40 px-3 py-2.5">
      <div className="flex items-center gap-2.5">
        <Icon className="h-4 w-4 text-aqua" />
        <span className="text-xs">{label}</span>
      </div>
      <span className="text-xs font-semibold">{value}</span>
    </div>
  );
}

function QuickAction({
  icon: Icon, title, sub, tone,
}: { icon: any; title: string; sub: string; tone: "danger" | "aqua" }) {
  const bg = tone === "danger" ? "bg-danger/15 border-danger/30 text-danger" : "bg-aqua/10 border-aqua/30 text-aqua";
  return (
    <button className={`flex items-center gap-3 rounded-2xl border p-4 text-right ${bg}`}>
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-background/40">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-bold text-foreground">{title}</div>
        <div className="text-[10px] text-muted-foreground">{sub}</div>
      </div>
    </button>
  );
}

/* ---------- Live ---------- */

function LiveScreen() {
  return (
    <div className="space-y-4 px-5">
      <div className="relative overflow-hidden rounded-3xl border border-border/60 shadow-card-soft">
        <img src={heroPool} alt="بث" className="aspect-[3/4] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep/90 via-transparent to-deep/40" />
        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-danger/90 px-2.5 py-1 text-[10px] font-bold text-destructive-foreground">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> LIVE · 00:42
        </div>
        <div className="absolute left-3 top-3 rounded-full bg-background/60 px-2.5 py-1 text-[10px] backdrop-blur">HD · 60fps</div>
        <div className="absolute bottom-1/3 right-1/2 h-24 w-24 translate-x-1/2 rounded-md border-2 border-aqua shadow-glow">
          <span className="absolute -top-5 right-0 rounded bg-aqua px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">
            CHILD · 98%
          </span>
        </div>
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-2xl bg-background/70 px-3 py-2.5 backdrop-blur">
          <div className="flex items-center gap-2">
            <button className="grid h-9 w-9 place-items-center rounded-full bg-aqua-gradient text-primary-foreground">
              <Pause className="h-4 w-4" />
            </button>
            <div className="text-[11px]">
              <div className="font-semibold">المسبح الرئيسي</div>
              <div className="text-muted-foreground">جودة عالية · مستقر</div>
            </div>
          </div>
          <button className="grid h-9 w-9 place-items-center rounded-full bg-background/60">
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card-gradient p-4">
        <div className="text-xs font-bold">تحليل لحظي</div>
        <div className="mt-3 space-y-2.5">
          <AiRow icon={ScanFace} label="عدد الأشخاص" value="2" />
          <AiRow icon={Waves} label="حالة الماء" value="هادئ" />
          <AiRow icon={Activity} label="مستوى الخطر" value="منخفض" />
        </div>
      </div>
    </div>
  );
}

/* ---------- Alerts ---------- */

function AlertsScreen() {
  const alerts = [
    { tone: "danger", icon: AlertTriangle, title: "اشتباه غرق", time: "أمس · 18:32", desc: "نمط حركة غير طبيعي — تم تفعيل الإنذار." },
    { tone: "aqua", icon: ScanFace, title: "طفل بالقرب من المسبح", time: "أمس · 16:10", desc: "حساس المسافة رصد اقتراب." },
    { tone: "muted", icon: CheckCircle2, title: "فحص دوري ناجح", time: "أمس · 12:00", desc: "جميع الحساسات تعمل بشكل سليم." },
    { tone: "aqua", icon: Camera, title: "تشغيل الكاميرا", time: "أمس · 09:20", desc: "بدء البث بعد رصد حركة." },
  ] as const;

  return (
    <div className="space-y-3 px-5">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {["الكل", "حرجة", "تحذيرية", "عادية"].map((t, i) => (
          <button
            key={t}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold ${
              i === 0 ? "bg-aqua-gradient text-primary-foreground" : "border border-border/60 bg-card/50 text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {alerts.map((a, i) => {
        const toneCls =
          a.tone === "danger" ? "bg-danger/15 text-danger border-danger/30" :
          a.tone === "aqua" ? "bg-aqua/10 text-aqua border-aqua/30" :
          "bg-muted/40 text-muted-foreground border-border/60";
        return (
          <div key={i} className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card-gradient p-4">
            <div className={`grid h-10 w-10 place-items-center rounded-xl border ${toneCls}`}>
              <a.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold">{a.title}</div>
                <ChevronLeft className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">{a.time}</div>
              <div className="mt-1.5 text-xs text-muted-foreground">{a.desc}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Settings ---------- */

function SettingsScreen() {
  return (
    <div className="space-y-5 px-5">
      <div className="flex items-center gap-3 rounded-3xl border border-border/60 bg-card-gradient p-4">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-aqua-gradient text-primary-foreground">
          <User className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold">عبدالله العتيبي</div>
          <div className="text-[11px] text-muted-foreground">المسبح الرئيسي · المنزل</div>
        </div>
        <ChevronLeft className="h-4 w-4 text-muted-foreground" />
      </div>

      <SettingsGroup title="الأجهزة">
        <SettingsRow icon={Radar} label="حساس المسافة" value="نشط" />
        <SettingsRow icon={Camera} label="الكاميرا" value="HD · 60fps" />
        <SettingsRow icon={Wifi} label="الاتصال" value="WiFi · ممتاز" />
      </SettingsGroup>

      <SettingsGroup title="التنبيهات">
        <Toggle label="إشعارات فورية" on />
        <Toggle label="إنذار صوتي" on />
        <Toggle label="اتصال بالطوارئ" on={false} />
      </SettingsGroup>

      <SettingsGroup title="الذكاء الاصطناعي">
        <SettingsRow icon={Brain} label="حساسية الكشف" value="عالية" />
        <SettingsRow icon={ScanFace} label="تصنيف الأشخاص" value="مفعّل" />
      </SettingsGroup>
    </div>
  );
}

function SettingsGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 px-1 text-[11px] font-semibold text-muted-foreground">{title}</div>
      <div className="divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/60 bg-card/40">
        {children}
      </div>
    </div>
  );
}

function SettingsRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <div className="grid h-8 w-8 place-items-center rounded-lg bg-aqua/10 text-aqua">
        <Icon className="h-4 w-4" />
      </div>
      <span className="flex-1 text-xs">{label}</span>
      <span className="text-[11px] text-muted-foreground">{value}</span>
      <ChevronLeft className="h-4 w-4 text-muted-foreground" />
    </div>
  );
}

function Toggle({ label, on }: { label: string; on: boolean }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <span className="text-xs">{label}</span>
      <span className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-aqua-gradient" : "bg-muted"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition-all ${on ? "right-0.5" : "right-[calc(100%-1.375rem)]"}`} />
      </span>
    </div>
  );
}
