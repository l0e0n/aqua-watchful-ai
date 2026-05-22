import { useState } from "react";
import {
  Shield, Home, Bell, Settings, Video, BellRing,
  ThermometerSun, Activity, AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight,
  Wifi, Battery, Signal, Play, Pause, Maximize2, ScanFace, Brain,
  Radar, Camera, LifeBuoy, Globe, Lock, Mail, ArrowRight, Zap, Power,
} from "lucide-react";
import heroPool from "@/assets/hero-pool.jpg";

type Tab = "home" | "live" | "alerts" | "settings";
type Lang = "en" | "ar";

/* ---------- i18n ---------- */

const dict = {
  en: {
    appName: "Aqua Guard",
    home: "Home", live: "Live", alerts: "Alerts", settings: "Settings",
    chooseLang: "Choose your language",
    continue: "Continue",
    login: "Sign in",
    loginSub: "Protect what matters most.",
    email: "Email", password: "Password",
    signIn: "Sign in", forgot: "Forgot password?",
    or: "or", signUp: "Create new account",
    systemActive: "System active", lastCheck: "Last check just now",
    poolStatus: "Pool status", safe: "Fully safe",
    temp: "Temperature", motion: "Motion", camera: "Camera", calm: "Calm",
    watchLive: "Watch live stream", mainPool: "Main pool",
    ai: "Artificial intelligence", running: "Running",
    classify: "Person classification", childAdult: "Child + Adult",
    motionAnalysis: "Motion analysis", normal: "Within normal",
    distSensor: "Distance sensor",
    testAlert: "Test alert", testSub: "System self-check",
    hydraulic: "Hydraulic rescue system", hydraulicSub: "AI-triggered lift platform",
    armed: "Armed", standby: "Standby", deploy: "Deploy now",
    autoMode: "Auto-deploy by AI", manualOverride: "Manual override",
    liftStatus: "Lift status", retracted: "Retracted", riskLevel: "Risk level",
    low: "Low", instantAnalysis: "Live analysis",
    all: "All", critical: "Critical", warning: "Warning", info: "Info",
    cameraSettings: "Camera settings", enableCam: "Enable camera",
    rtsp: "Camera source (IP / RTSP)", aiSens: "AI detection sensitivity",
    high: "High", mid: "Medium",
    calibrateCam: "Calibrate camera →",
    distanceSensor: "Distance sensor", enableSensor: "Enable sensor",
    range: "Detection range", calibrate: "Calibrate →", replace: "Replace sensor →",
    alertsSettings: "Alert settings", aiAlert: "AI alert", soundAlert: "Sound alerts",
    volume: "Volume", alertType: "Alert type", push: "Push", sound: "Sound",
    save: "Save settings",
    hydraulicSettings: "Hydraulic system",
    enableHydraulic: "Enable hydraulic rescue",
    aiAutoTrigger: "AI auto-trigger on drowning",
    responseTime: "Response time",
    language: "Language",
    drowningSuspect: "Suspected drowning", drownDesc: "Abnormal motion pattern — alarm triggered.",
    childNear: "Child near pool", childNearDesc: "Distance sensor detected approach.",
    routineOk: "Routine check passed", routineDesc: "All sensors operational.",
    camStart: "Camera started", camStartDesc: "Streaming started after motion detected.",
    hydraulicFired: "Hydraulic deployed", hydraulicFiredDesc: "Rescue platform raised by AI.",
    yesterday: "Yesterday",
  },
  ar: {
    appName: "Aqua Guard",
    home: "الرئيسية", live: "البث", alerts: "التنبيهات", settings: "الإعدادات",
    chooseLang: "اختر لغتك",
    continue: "متابعة",
    login: "تسجيل الدخول",
    loginSub: "احمِ ما يهمك أكثر.",
    email: "البريد الإلكتروني", password: "كلمة المرور",
    signIn: "تسجيل الدخول", forgot: "نسيت كلمة المرور؟",
    or: "أو", signUp: "إنشاء حساب جديد",
    systemActive: "النظام نشط", lastCheck: "آخر فحص الآن",
    poolStatus: "حالة المسبح", safe: "آمن تماماً",
    temp: "الحرارة", motion: "الحركة", camera: "الكاميرا", calm: "هادئة",
    watchLive: "مشاهدة البث المباشر", mainPool: "المسبح الرئيسي",
    ai: "الذكاء الاصطناعي", running: "يعمل الآن",
    classify: "تصنيف الأشخاص", childAdult: "طفل + بالغ",
    motionAnalysis: "تحليل الحركة", normal: "ضمن المعدل",
    distSensor: "حساس المسافة",
    testAlert: "تنبيه تجريبي", testSub: "اختبار النظام",
    hydraulic: "النظام الهيدروليكي للإنقاذ", hydraulicSub: "منصة رفع يفعّلها الذكاء الاصطناعي",
    armed: "جاهز", standby: "وضع الانتظار", deploy: "تفعيل الآن",
    autoMode: "تفعيل تلقائي بالذكاء الاصطناعي", manualOverride: "تجاوز يدوي",
    liftStatus: "حالة المنصة", retracted: "مطوية", riskLevel: "مستوى الخطر",
    low: "منخفض", instantAnalysis: "تحليل لحظي",
    all: "الكل", critical: "حرجة", warning: "تحذيرية", info: "عادية",
    cameraSettings: "إعدادات الكاميرا", enableCam: "تفعيل الكاميرا",
    rtsp: "مصدر الكاميرا (IP / RTSP)", aiSens: "حساسية الكشف AI",
    high: "عالية", mid: "متوسطة",
    calibrateCam: "معايرة الكاميرا →",
    distanceSensor: "حساس المسافة", enableSensor: "تفعيل الحساس",
    range: "نطاق الكشف", calibrate: "معايرة →", replace: "استبدال الحساس →",
    alertsSettings: "إعدادات التنبيهات", aiAlert: "تنبيه الذكاء الاصطناعي", soundAlert: "تنبيهات صوتية",
    volume: "مستوى الصوت", alertType: "نوع التنبيه", push: "إشعار", sound: "صوت",
    save: "حفظ الإعدادات",
    hydraulicSettings: "النظام الهيدروليكي",
    enableHydraulic: "تفعيل نظام الإنقاذ الهيدروليكي",
    aiAutoTrigger: "تفعيل تلقائي عند رصد غرق",
    responseTime: "زمن الاستجابة",
    language: "اللغة",
    drowningSuspect: "اشتباه غرق", drownDesc: "نمط حركة غير طبيعي — تم تفعيل الإنذار.",
    childNear: "طفل بالقرب من المسبح", childNearDesc: "حساس المسافة رصد اقتراب.",
    routineOk: "فحص دوري ناجح", routineDesc: "جميع الحساسات تعمل بشكل سليم.",
    camStart: "تشغيل الكاميرا", camStartDesc: "بدء البث بعد رصد حركة.",
    hydraulicFired: "تفعيل المنصة الهيدروليكية", hydraulicFiredDesc: "تم رفع منصة الإنقاذ بأمر الذكاء الاصطناعي.",
    yesterday: "أمس",
  },
};

type Stage = "lang" | "login" | "app";

export function AquaApp() {
  const [stage, setStage] = useState<Stage>("lang");
  const [lang, setLang] = useState<Lang>("en");
  const [tab, setTab] = useState<Tab>("home");
  const t = dict[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <div className="min-h-screen bg-hero py-0 md:py-10" dir={dir} lang={lang}>
      <div className="mx-auto w-full max-w-[440px] md:max-w-[400px]">
        <div className="relative md:rounded-[3rem] md:border-[12px] md:border-card md:bg-deep md:p-2 md:shadow-card-soft">
          <div className="relative min-h-screen overflow-hidden bg-background md:min-h-[860px] md:rounded-[2.4rem]">
            <StatusBar />

            {stage === "lang" && (
              <LanguageScreen lang={lang} setLang={setLang} onNext={() => setStage("login")} />
            )}

            {stage === "login" && (
              <LoginScreen t={t} lang={lang} setLang={setLang} onSignIn={() => setStage("app")} />
            )}

            {stage === "app" && (
              <>
                <AppHeader tab={tab} t={t} />
                <div className="pb-28">
                  {tab === "home" && <HomeScreen t={t} onOpenLive={() => setTab("live")} />}
                  {tab === "live" && <LiveScreen t={t} />}
                  {tab === "alerts" && <AlertsScreen t={t} />}
                  {tab === "settings" && <SettingsScreen t={t} lang={lang} setLang={setLang} />}
                </div>
                <BottomNav tab={tab} setTab={setTab} t={t} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

type T = typeof dict["en"];

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

function AppHeader({ tab, t }: { tab: Tab; t: T }) {
  const titles: Record<Tab, string> = {
    home: t.home, live: t.live, alerts: t.alerts, settings: t.settings,
  };
  return (
    <div className="flex items-center justify-between px-5 pb-3 pt-5">
      <div className="flex items-center gap-2.5">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-aqua-gradient shadow-glow">
          <Shield className="h-4 w-4 text-primary-foreground" strokeWidth={2.6} />
        </div>
        <div className="leading-tight">
          <div className="text-[15px] font-bold tracking-tight">{t.appName}</div>
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

function BottomNav({ tab, setTab, t }: { tab: Tab; setTab: (t: Tab) => void; t: T }) {
  const items: { id: Tab; label: string; icon: any }[] = [
    { id: "home", label: t.home, icon: Home },
    { id: "live", label: t.live, icon: Video },
    { id: "alerts", label: t.alerts, icon: Bell },
    { id: "settings", label: t.settings, icon: Settings },
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
              <it.icon className="h-4 w-4" />
              <span className="text-[10px] font-semibold">{it.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Language Screen ---------- */

function LanguageScreen({ lang, setLang, onNext }: { lang: Lang; setLang: (l: Lang) => void; onNext: () => void }) {
  const t = dict[lang];
  return (
    <div className="flex min-h-[800px] flex-col items-center justify-center px-6 py-10">
      <div className="mb-8 grid h-20 w-20 place-items-center rounded-3xl bg-aqua-gradient shadow-glow">
        <Globe className="h-10 w-10 text-primary-foreground" strokeWidth={2.2} />
      </div>
      <div className="mb-2 text-2xl font-extrabold tracking-tight">{t.appName}</div>
      <div className="mb-10 text-sm text-muted-foreground">{t.chooseLang}</div>

      <div className="w-full max-w-xs space-y-3">
        <LangOption code="en" active={lang === "en"} onClick={() => setLang("en")} label="English" sub="EN" />
        <LangOption code="ar" active={lang === "ar"} onClick={() => setLang("ar")} label="العربية" sub="AR" />
      </div>

      <button
        onClick={onNext}
        className="mt-10 flex w-full max-w-xs items-center justify-center gap-2 rounded-2xl bg-aqua-gradient py-3.5 text-sm font-bold text-primary-foreground shadow-glow"
      >
        {t.continue} {lang === "ar" ? <ArrowRight className="h-4 w-4 rotate-180" /> : <ArrowRight className="h-4 w-4" />}
      </button>
    </div>
  );
}

function LangOption({ code, active, onClick, label, sub }: { code: Lang; active: boolean; onClick: () => void; label: string; sub: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 transition-all ${
        active ? "border-aqua/60 bg-aqua/10 shadow-glow" : "border-border/60 bg-card/40"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`grid h-10 w-10 place-items-center rounded-xl font-bold ${active ? "bg-aqua-gradient text-primary-foreground" : "bg-background/60 text-muted-foreground"}`}>
          {sub}
        </div>
        <span className="text-sm font-bold">{label}</span>
      </div>
      <div className={`grid h-5 w-5 place-items-center rounded-full border ${active ? "border-aqua bg-aqua" : "border-border"}`}>
        {active && <CheckCircle2 className="h-4 w-4 text-primary-foreground" />}
      </div>
    </button>
  );
}

/* ---------- Login Screen ---------- */

function LoginScreen({ t, lang, setLang, onSignIn }: { t: T; lang: Lang; setLang: (l: Lang) => void; onSignIn: () => void }) {
  return (
    <div className="relative flex min-h-[800px] flex-col px-6 pb-10 pt-8">
      <div className="absolute inset-0 water-grid opacity-30" aria-hidden />
      <div className="relative flex justify-end">
        <button
          onClick={() => setLang(lang === "ar" ? "en" : "ar")}
          className="flex items-center gap-1.5 rounded-full border border-border/60 bg-card/50 px-3 py-1.5 text-[11px] font-semibold text-muted-foreground"
        >
          <Globe className="h-3.5 w-3.5" />
          {lang === "ar" ? "EN" : "AR"}
        </button>
      </div>

      <div className="relative mt-10 flex flex-col items-center text-center">
        <div className="grid h-16 w-16 place-items-center rounded-3xl bg-aqua-gradient shadow-glow">
          <Shield className="h-8 w-8 text-primary-foreground" strokeWidth={2.4} />
        </div>
        <div className="mt-4 text-2xl font-extrabold tracking-tight">{t.appName}</div>
        <div className="mt-1 text-xs text-muted-foreground">{t.loginSub}</div>
      </div>

      <div className="relative mt-10 space-y-3">
        <LabeledInput icon={Mail} label={t.email} placeholder="name@example.com" />
        <LabeledInput icon={Lock} label={t.password} placeholder="••••••••" type="password" />
        <div className="flex justify-end">
          <button className="text-[11px] font-semibold text-aqua">{t.forgot}</button>
        </div>
      </div>

      <button
        onClick={onSignIn}
        className="relative mt-6 w-full rounded-2xl bg-aqua-gradient py-3.5 text-sm font-bold text-primary-foreground shadow-glow"
      >
        {t.signIn}
      </button>

      <div className="relative my-5 flex items-center gap-3 text-[10px] text-muted-foreground">
        <div className="h-px flex-1 bg-border/60" />
        {t.or}
        <div className="h-px flex-1 bg-border/60" />
      </div>

      <button className="relative w-full rounded-2xl border border-border/60 bg-card/40 py-3 text-xs font-semibold">
        {t.signUp}
      </button>
    </div>
  );
}

function LabeledInput({ icon: Icon, label, placeholder, type = "text" }: { icon: any; label: string; placeholder: string; type?: string }) {
  return (
    <div>
      <div className="mb-1.5 text-[11px] text-muted-foreground">{label}</div>
      <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-background/60 px-3 py-3 focus-within:border-aqua/60">
        <Icon className="h-4 w-4 text-aqua" />
        <input
          type={type}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground/60"
        />
      </div>
    </div>
  );
}

/* ---------- Home ---------- */

function HomeScreen({ t, onOpenLive }: { t: T; onOpenLive: () => void }) {
  return (
    <div className="space-y-5 px-5">
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card-gradient p-5 shadow-card-soft">
        <div className="absolute inset-0 water-grid opacity-50" aria-hidden />
        <div className="relative">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 rounded-full border border-aqua/30 bg-aqua/10 px-3 py-1 text-[11px] text-aqua">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-aqua pulse-ring" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-aqua" />
              </span>
              {t.systemActive}
            </span>
            <span className="text-[10px] text-muted-foreground">{t.lastCheck}</span>
          </div>

          <div className="mt-5 flex items-end gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-aqua-gradient shadow-glow">
              <CheckCircle2 className="h-7 w-7 text-primary-foreground" strokeWidth={2.4} />
            </div>
            <div>
              <div className="text-[11px] text-muted-foreground">{t.poolStatus}</div>
              <div className="text-2xl font-extrabold tracking-tight">{t.safe}</div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 text-center">
            <Stat label={t.motion} value={t.calm} icon={Activity} />
            <Stat label={t.camera} value="HD" icon={Camera} />
          </div>
        </div>
      </div>

      <button
        onClick={onOpenLive}
        className="block w-full overflow-hidden rounded-3xl border border-border/60 bg-card text-start shadow-card-soft"
      >
        <div className="relative">
          <img src={heroPool} alt="pool" className="aspect-[16/10] w-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-deep/90 via-deep/30 to-transparent" />
          <div className="absolute end-3 top-3 flex items-center gap-1.5 rounded-full bg-danger/90 px-2.5 py-1 text-[10px] font-bold text-destructive-foreground">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> LIVE
          </div>
          <div className="absolute start-3 top-3 rounded-full bg-background/60 px-2.5 py-1 text-[10px] backdrop-blur">
            CAM · {t.mainPool}
          </div>
          <div className="absolute bottom-1/3 left-1/2 h-16 w-16 -translate-x-1/2 rounded-md border-2 border-aqua shadow-glow">
            <span className="absolute -top-5 left-0 rounded bg-aqua px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">
              CHILD · 98%
            </span>
          </div>
          <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-xl bg-background/70 px-3 py-2 text-[11px] backdrop-blur">
            <span className="flex items-center gap-1.5">
              <Play className="h-3 w-3 text-aqua" /> {t.watchLive}
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground rtl:rotate-180" />
          </div>
        </div>
      </button>

      {/* Hydraulic system card */}
      <HydraulicCard t={t} />

      <div className="rounded-3xl border border-border/60 bg-card-gradient p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-aqua/15 text-aqua">
              <Brain className="h-4 w-4" />
            </div>
            <div className="text-sm font-bold">{t.ai}</div>
          </div>
          <span className="text-[10px] text-aqua">{t.running}</span>
        </div>
        <div className="mt-4 space-y-2.5">
          <AiRow icon={ScanFace} label={t.classify} value={t.childAdult} />
          <AiRow icon={Activity} label={t.motionAnalysis} value={t.normal} />
          <AiRow icon={Radar} label={t.distSensor} value="3.2m" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <QuickAction icon={BellRing} title={t.testAlert} sub={t.testSub} tone="aqua" />
      </div>
    </div>
  );
}

function HydraulicCard({ t }: { t: T }) {
  const [auto, setAuto] = useState(true);
  const [deployed, setDeployed] = useState(false);
  return (
    <div className="relative overflow-hidden rounded-3xl border border-aqua/30 bg-card-gradient p-5 shadow-card-soft">
      <div className="absolute inset-0 water-grid opacity-40" aria-hidden />
      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-aqua-gradient shadow-glow">
              <LifeBuoy className="h-5 w-5 text-primary-foreground" strokeWidth={2.4} />
            </div>
            <div>
              <div className="text-sm font-bold">{t.hydraulic}</div>
              <div className="text-[10px] text-muted-foreground">{t.hydraulicSub}</div>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
            deployed ? "bg-danger/20 text-danger" : "bg-aqua/15 text-aqua"
          }`}>
            <Zap className="h-3 w-3" /> {deployed ? t.deploy : t.armed}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <MiniStat label={t.liftStatus} value={deployed ? t.deploy : t.retracted} />
          <MiniStat label={t.responseTime} value="< 2s" />
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl bg-background/40 px-3 py-2.5">
          <span className="text-[11px]">{t.autoMode}</span>
          <Toggle on={auto} onChange={setAuto} />
        </div>

        <button
          onClick={() => setDeployed((d) => !d)}
          className={`mt-3 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-xs font-bold ${
            deployed
              ? "bg-danger/15 border border-danger/40 text-danger"
              : "bg-aqua-gradient text-primary-foreground shadow-glow"
          }`}
        >
          <Power className="h-4 w-4" />
          {deployed ? t.manualOverride : t.deploy}
        </button>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 px-3 py-2">
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-xs font-bold">{value}</div>
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

function QuickAction({ icon: Icon, title, sub, tone }: { icon: any; title: string; sub: string; tone: "danger" | "aqua" }) {
  const bg = tone === "danger" ? "bg-danger/15 border-danger/30 text-danger" : "bg-aqua/10 border-aqua/30 text-aqua";
  return (
    <button className={`flex items-center gap-3 rounded-2xl border p-4 text-start ${bg}`}>
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

function LiveScreen({ t }: { t: T }) {
  return (
    <div className="space-y-4 px-5">
      <div className="relative overflow-hidden rounded-3xl border border-border/60 shadow-card-soft">
        <img src={heroPool} alt="live" className="aspect-[3/4] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep/90 via-transparent to-deep/40" />
        <div className="absolute end-3 top-3 flex items-center gap-1.5 rounded-full bg-danger/90 px-2.5 py-1 text-[10px] font-bold text-destructive-foreground">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> LIVE · 00:42
        </div>
        <div className="absolute start-3 top-3 rounded-full bg-background/60 px-2.5 py-1 text-[10px] backdrop-blur">HD · 60fps</div>
        <div className="absolute bottom-1/3 left-1/2 h-24 w-24 -translate-x-1/2 rounded-md border-2 border-aqua shadow-glow">
          <span className="absolute -top-5 left-0 rounded bg-aqua px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">
            CHILD · 98%
          </span>
        </div>
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-2xl bg-background/70 px-3 py-2.5 backdrop-blur">
          <div className="flex items-center gap-2">
            <button className="grid h-9 w-9 place-items-center rounded-full bg-aqua-gradient text-primary-foreground">
              <Pause className="h-4 w-4" />
            </button>
            <div className="text-[11px]">
              <div className="font-semibold">{t.mainPool}</div>
              <div className="text-muted-foreground">HD · stable</div>
            </div>
          </div>
          <button className="grid h-9 w-9 place-items-center rounded-full bg-background/60">
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card-gradient p-4">
        <div className="text-xs font-bold">{t.instantAnalysis}</div>
        <div className="mt-3 space-y-2.5">
          <AiRow icon={Activity} label={t.riskLevel} value={t.low} />
        </div>
      </div>
    </div>
  );
}

/* ---------- Alerts ---------- */

function AlertsScreen({ t }: { t: T }) {
  const alerts = [
    { tone: "danger", icon: AlertTriangle, title: t.drowningSuspect, time: `${t.yesterday} · 18:32`, desc: t.drownDesc },
    { tone: "aqua", icon: LifeBuoy, title: t.hydraulicFired, time: `${t.yesterday} · 18:32`, desc: t.hydraulicFiredDesc },
    { tone: "aqua", icon: ScanFace, title: t.childNear, time: `${t.yesterday} · 16:10`, desc: t.childNearDesc },
    { tone: "muted", icon: CheckCircle2, title: t.routineOk, time: `${t.yesterday} · 12:00`, desc: t.routineDesc },
    { tone: "aqua", icon: Camera, title: t.camStart, time: `${t.yesterday} · 09:20`, desc: t.camStartDesc },
  ] as const;

  return (
    <div className="space-y-3 px-5">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[t.all, t.critical, t.warning, t.info].map((label, i) => (
          <button
            key={label}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold ${
              i === 0 ? "bg-aqua-gradient text-primary-foreground" : "border border-border/60 bg-card/50 text-muted-foreground"
            }`}
          >
            {label}
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
                <ChevronLeft className="h-4 w-4 text-muted-foreground rtl:rotate-180" />
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

function SettingsScreen({ t, lang, setLang }: { t: T; lang: Lang; setLang: (l: Lang) => void }) {
  const [camOn, setCamOn] = useState(true);
  const [sensorOn, setSensorOn] = useState(true);
  const [aiAlert, setAiAlert] = useState(true);
  const [soundAlert, setSoundAlert] = useState(true);
  const [hydOn, setHydOn] = useState(true);
  const [hydAuto, setHydAuto] = useState(true);
  const [sensitivity, setSensitivity] = useState<"low" | "mid" | "high">("mid");
  const [alertType, setAlertType] = useState<"all" | "push" | "sound">("all");
  const [range, setRange] = useState(120);
  const [volume, setVolume] = useState(80);

  return (
    <div className="space-y-5 px-5">
      {/* Language */}
      <SettingsCard icon={Globe} title={t.language}>
        <Segmented
          value={lang}
          onChange={(v) => setLang(v as Lang)}
          options={[
            { id: "en", label: "English" },
            { id: "ar", label: "العربية" },
          ]}
        />
      </SettingsCard>

      {/* Hydraulic */}
      <SettingsCard icon={LifeBuoy} title={t.hydraulicSettings}>
        <ToggleRow label={t.enableHydraulic} on={hydOn} onChange={setHydOn} />
        <ToggleRow label={t.aiAutoTrigger} on={hydAuto} onChange={setHydAuto} />
        <Field label={t.responseTime}>
          <Segmented
            value="fast"
            onChange={() => {}}
            options={[
              { id: "fast", label: "< 2s" },
              { id: "mid", label: "< 4s" },
              { id: "safe", label: "< 6s" },
            ]}
          />
        </Field>
        <button className="text-[11px] font-semibold text-aqua">{t.calibrate}</button>
      </SettingsCard>

      {/* Camera */}
      <SettingsCard icon={Camera} title={t.cameraSettings}>
        <ToggleRow label={t.enableCam} on={camOn} onChange={setCamOn} />
        <Field label={t.rtsp}>
          <input
            defaultValue="rtsp://192.168.1.42:554/stream"
            dir="ltr"
            className="w-full rounded-xl border border-border/60 bg-background/60 px-3 py-2.5 text-xs font-mono outline-none focus:border-aqua/60"
          />
        </Field>
        <Field label={t.aiSens}>
          <Segmented
            value={sensitivity}
            onChange={(v) => setSensitivity(v as any)}
            options={[
              { id: "high", label: t.high },
              { id: "mid", label: t.mid },
              { id: "low", label: t.low },
            ]}
          />
        </Field>
        <button className="text-[11px] font-semibold text-aqua">{t.calibrateCam}</button>
      </SettingsCard>

      {/* Distance sensor */}
      <SettingsCard icon={Radar} title={t.distanceSensor}>
        <ToggleRow label={t.enableSensor} on={sensorOn} onChange={setSensorOn} />
        <Field label={`${t.range}: ${range} cm`}>
          <Slider value={range} min={20} max={300} onChange={setRange} />
        </Field>
        <div className="flex gap-4 text-[11px] font-semibold">
          <button className="text-aqua">{t.calibrate}</button>
          <span className="text-muted-foreground/40">·</span>
          <button className="text-aqua">{t.replace}</button>
        </div>
      </SettingsCard>

      {/* Alerts */}
      <SettingsCard icon={Bell} title={t.alertsSettings}>
        <ToggleRow label={t.aiAlert} on={aiAlert} onChange={setAiAlert} />
        <ToggleRow label={t.soundAlert} on={soundAlert} onChange={setSoundAlert} />
        <Field label={`${t.volume}: ${volume}%`}>
          <Slider value={volume} min={0} max={100} onChange={setVolume} />
        </Field>
        <Field label={t.alertType}>
          <Segmented
            value={alertType}
            onChange={(v) => setAlertType(v as any)}
            options={[
              { id: "all", label: t.all },
              { id: "push", label: t.push },
              { id: "sound", label: t.sound },
            ]}
          />
        </Field>
      </SettingsCard>

      <button className="w-full rounded-2xl bg-aqua-gradient py-3.5 text-sm font-bold text-primary-foreground shadow-glow">
        {t.save}
      </button>
    </div>
  );
}

function SettingsCard({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border/60 bg-card-gradient p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="grid h-7 w-7 place-items-center rounded-lg bg-aqua/15 text-aqua">
          <Icon className="h-4 w-4" />
        </div>
        <div className="text-sm font-bold">{title}</div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      {children}
    </div>
  );
}

function ToggleRow({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs">{label}</span>
      <Toggle on={on} onChange={onChange} />
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-aqua-gradient" : "bg-muted"}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition-all ${
          on ? "end-0.5" : "start-0.5"
        }`}
      />
    </button>
  );
}

function Segmented({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { id: string; label: string }[] }) {
  return (
    <div className="flex gap-1.5 rounded-2xl border border-border/60 bg-background/60 p-1">
      {options.map((o) => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className={`flex-1 rounded-xl py-2 text-[11px] font-semibold transition-all ${
              active ? "bg-aqua-gradient text-primary-foreground shadow-glow" : "text-muted-foreground"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Slider({ value, min, max, onChange }: { value: number; min: number; max: number; onChange: (v: number) => void }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="relative h-6">
      <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-muted" />
      <div
        className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-aqua-gradient"
        style={{ insetInlineStart: 0, width: `${pct}%` }}
      />
      <div
        className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-aqua bg-background shadow-glow"
        style={{ insetInlineStart: `calc(${pct}% - 8px)` }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 w-full cursor-pointer opacity-0"
      />
    </div>
  );
}
