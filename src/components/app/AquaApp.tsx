import { useState, useCallback, useEffect, useRef } from "react";
import {
  Shield, Home, Bell, Settings, Video,
  Activity, AlertTriangle, CheckCircle2, ChevronRight,
  Wifi, Battery, Signal, Play, Pause, Maximize2, ScanFace, Brain,
  Radar, Camera, LifeBuoy, Globe, Lock, Mail, ArrowRight, Zap, Power,
  Eye, EyeOff, KeyRound, ArrowLeft, Smartphone, Volume2,
} from "lucide-react";
import heroPool from "@/assets/hero-pool.jpg";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useTeachableAI } from "@/hooks/use-teachable-ai";

type Tab = "home" | "live" | "alerts" | "settings";
type Lang = "en" | "ar";
type IncidentSeverity = "danger" | "warning" | "info";
type IncidentKind = "drowning_suspect" | "drowning_critical" | "child_near" | "routine" | "cam_start";
type ActionKey = "platform" | "alarm" | "notification";

interface Incident {
  id: string;
  kind: IncidentKind;
  severity: IncidentSeverity;
  timestamp: number; // ms epoch
  actions: ActionKey[];
  confidence?: number; // 0..100
}

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
    or: "or", signUp: "Create new account", continueWithGoogle: "Continue with Google",
    // validation
    errEmailRequired: "Email is required.",
    errEmailInvalid: "Please enter a valid email address.",
    errPasswordRequired: "Password is required.",
    errPasswordShort: "Password must be at least 8 characters.",
    errLoginFailed: "Invalid email or password. Please try again.",
    // forgot password
    forgotTitle: "Reset your password",
    forgotSub: "Enter your account email and we'll send you a secure reset link.",
    sendLink: "Send reset link",
    backToLogin: "Back to sign in",
    resetSentTitle: "Check your inbox",
    resetSentSub: "If an account exists for that email, a reset link is on the way. The link expires in 30 minutes.",
    resending: "Sending…",
    resend: "Resend",
    // home
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
    armed: "Armed", standby: "Standby", deploy: "Deploy now", deployed: "Deployed",
    autoMode: "Auto-deploy by AI", manualOverride: "Manual override", retract: "Retract platform",
    liftStatus: "Lift status", retracted: "Retracted", riskLevel: "Risk level",
    low: "Low", instantAnalysis: "Live analysis",
    simulate: "Simulate drowning detection", simulateSub: "Trigger AI → hydraulic chain (demo)",
    // alerts
    all: "All", critical: "Critical", warning: "Warning", info: "Info",
    incidentType: "Type", actionsTaken: "Actions executed",
    actPlatform: "Hydraulic platform", actAlarm: "Audible alarm", actNotification: "Push notification",
    autoChain: "AI → Hydraulic auto chain executed",
    noIncidents: "No incidents in this category.",
    // settings
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
    aiAutoTriggerSub: "Activates platform instantly with zero delay.",
    responseTime: "Response time",
    language: "Language",
    // incident titles
    titleDrownSuspect: "Suspected drowning",
    titleDrownCritical: "Drowning detected — rescue executed",
    titleChildNear: "Child near pool",
    titleRoutine: "Routine check passed",
    titleCamStart: "Camera started",
    descChildNear: "Distance sensor detected approach.",
    descRoutine: "All sensors operational.",
    descCamStart: "Streaming started after motion detected.",
    yesterday: "Yesterday", justNow: "Just now",
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
    or: "أو", signUp: "إنشاء حساب جديد", continueWithGoogle: "المتابعة باستخدام جوجل",
    errEmailRequired: "البريد الإلكتروني مطلوب.",
    errEmailInvalid: "الرجاء إدخال بريد إلكتروني صالح.",
    errPasswordRequired: "كلمة المرور مطلوبة.",
    errPasswordShort: "يجب أن تكون كلمة المرور 8 أحرف على الأقل.",
    errLoginFailed: "البريد الإلكتروني أو كلمة المرور غير صحيحة، حاول مرة أخرى.",
    forgotTitle: "استعادة كلمة المرور",
    forgotSub: "أدخل بريدك الإلكتروني وسنرسل لك رابطاً آمناً لإعادة التعيين.",
    sendLink: "إرسال رابط الاستعادة",
    backToLogin: "العودة لتسجيل الدخول",
    resetSentTitle: "تفقّد بريدك الإلكتروني",
    resetSentSub: "إذا كان لديك حساب بهذا البريد فستصلك رسالة بها رابط إعادة التعيين. ينتهي الرابط خلال 30 دقيقة.",
    resending: "جارٍ الإرسال…",
    resend: "إعادة إرسال",
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
    armed: "جاهز", standby: "وضع الانتظار", deploy: "تفعيل الآن", deployed: "تم التفعيل",
    autoMode: "تفعيل تلقائي بالذكاء الاصطناعي", manualOverride: "تجاوز يدوي", retract: "إعادة طيّ المنصة",
    liftStatus: "حالة المنصة", retracted: "مطوية", riskLevel: "مستوى الخطر",
    low: "منخفض", instantAnalysis: "تحليل لحظي",
    simulate: "محاكاة اكتشاف غرق", simulateSub: "تفعيل سلسلة AI → الهيدروليك (تجريبي)",
    all: "الكل", critical: "حرجة", warning: "تحذيرية", info: "عادية",
    incidentType: "نوع الحالة", actionsTaken: "الإجراءات المنفّذة",
    actPlatform: "المنصة الهيدروليكية", actAlarm: "إنذار صوتي", actNotification: "إشعار فوري",
    autoChain: "تم تنفيذ سلسلة AI → الهيدروليك تلقائياً",
    noIncidents: "لا توجد حوادث في هذه الفئة.",
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
    aiAutoTriggerSub: "يرفع المنصة فوراً وبدون أي تأخير.",
    responseTime: "زمن الاستجابة",
    language: "اللغة",
    titleDrownSuspect: "اشتباه غرق",
    titleDrownCritical: "تم اكتشاف غرق — تنفيذ الإنقاذ",
    titleChildNear: "طفل بالقرب من المسبح",
    titleRoutine: "فحص دوري ناجح",
    titleCamStart: "تشغيل الكاميرا",
    descChildNear: "حساس المسافة رصد اقتراب.",
    descRoutine: "جميع الحساسات تعمل بشكل سليم.",
    descCamStart: "بدء البث بعد رصد حركة.",
    yesterday: "أمس", justNow: "الآن",
  },
};

type Stage = "lang" | "login" | "forgot" | "app";
type T = typeof dict["en"];

/* ---------- Seed incidents ---------- */

const seedIncidents = (): Incident[] => {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  return [
    { id: "s1", kind: "child_near", severity: "warning", timestamp: now - day + 2 * 3600 * 1000, actions: ["notification"], confidence: 92 },
    { id: "s2", kind: "routine", severity: "info", timestamp: now - day - 4 * 3600 * 1000, actions: [] },
    { id: "s3", kind: "cam_start", severity: "info", timestamp: now - 2 * day, actions: ["notification"] },
  ];
};

/* ---------- Root ---------- */

export function AquaApp() {
  const [stage, setStage] = useState<Stage>("lang");
  const [lang, setLang] = useState<Lang>("en");
  const [tab, setTab] = useState<Tab>("home");

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) setStage("app");
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setStage("app");
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // shared state
  const [incidents, setIncidents] = useState<Incident[]>(seedIncidents);
  const [hydAuto, setHydAuto] = useState(true);
  const [hydEnabled, setHydEnabled] = useState(true);
  const [platformDeployed, setPlatformDeployed] = useState(false);
  const [riskCritical, setRiskCritical] = useState(false);

  const t = dict[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  const logIncident = useCallback((inc: Omit<Incident, "id" | "timestamp">) => {
    setIncidents((prev) => [
      { ...inc, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, timestamp: Date.now() },
      ...prev,
    ]);
  }, []);

  // Core link: AI drowning decision → hydraulic auto-trigger (zero delay)
  const triggerDrowningDetection = useCallback((confidence = 96) => {
    setRiskCritical(true);
    const actions: ActionKey[] = ["alarm", "notification"];
    const willAutoDeploy = hydEnabled && hydAuto;
    if (willAutoDeploy) {
      // immediate, synchronous activation — no setTimeout
      setPlatformDeployed(true);
      actions.unshift("platform");
    }
    logIncident({
      kind: willAutoDeploy ? "drowning_critical" : "drowning_suspect",
      severity: "danger",
      actions,
      confidence,
    });
    // auto-clear risk after short demo window
    window.setTimeout(() => setRiskCritical(false), 6000);
  }, [hydEnabled, hydAuto, logIncident]);

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
              <LoginScreen
                t={t}
                lang={lang}
                setLang={setLang}
                onSignIn={() => setStage("app")}
                onForgot={() => setStage("forgot")}
              />
            )}

            {stage === "forgot" && (
              <ForgotScreen t={t} onBack={() => setStage("login")} />
            )}

            {stage === "app" && (
              <>
                <AppHeader tab={tab} t={t} hasUnread={incidents.some((i) => i.severity === "danger")} />
                <div className="pb-28">
                  {tab === "home" && (
                    <HomeScreen
                      t={t}
                      onOpenLive={() => setTab("live")}
                      hydAuto={hydAuto}
                      setHydAuto={setHydAuto}
                      hydEnabled={hydEnabled}
                      platformDeployed={platformDeployed}
                      setPlatformDeployed={setPlatformDeployed}
                      riskCritical={riskCritical}
                    />
                  )}
                  {tab === "live" && (
                    <LiveScreen
                      t={t}
                      riskCritical={riskCritical}
                      onDangerDetected={triggerDrowningDetection}
                    />
                  )}


                  {tab === "alerts" && <AlertsScreen t={t} incidents={incidents} lang={lang} />}
                  {tab === "settings" && (
                    <SettingsScreen
                      t={t}
                      lang={lang}
                      setLang={setLang}
                      hydEnabled={hydEnabled}
                      setHydEnabled={setHydEnabled}
                      hydAuto={hydAuto}
                      setHydAuto={setHydAuto}
                    />
                  )}
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

function AppHeader({ tab, t, hasUnread }: { tab: Tab; t: T; hasUnread: boolean }) {
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
        {hasUnread && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger" />}
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
        <LangOption active={lang === "en"} onClick={() => setLang("en")} label="English" sub="EN" />
        <LangOption active={lang === "ar"} onClick={() => setLang("ar")} label="العربية" sub="AR" />
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

function LangOption({ active, onClick, label, sub }: { active: boolean; onClick: () => void; label: string; sub: string }) {
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Demo credentials — any other combo "fails" auth to demonstrate failure handling.
const DEMO_EMAIL = "demo@aquaguard.app";
const DEMO_PASSWORD = "aquaguard2026";

function LoginScreen({
  t, lang, setLang, onSignIn, onForgot,
}: {
  t: T; lang: Lang; setLang: (l: Lang) => void; onSignIn: () => void; onForgot: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [pwdErr, setPwdErr] = useState<string | null>(null);
  const [formErr, setFormErr] = useState<string | null>(null);

  const validate = () => {
    let ok = true;
    const e = email.trim();
    if (!e) { setEmailErr(t.errEmailRequired); ok = false; }
    else if (!EMAIL_RE.test(e) || e.length > 254) { setEmailErr(t.errEmailInvalid); ok = false; }
    else setEmailErr(null);

    if (!password) { setPwdErr(t.errPasswordRequired); ok = false; }
    else if (password.length < 8) { setPwdErr(t.errPasswordShort); ok = false; }
    else setPwdErr(null);

    return ok;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErr(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        // Try sign-up as a fallback for new users (demo convenience)
        if (/invalid login credentials/i.test(error.message)) {
          const { error: signUpErr } = await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: { emailRedirectTo: `${window.location.origin}/` },
          });
          if (signUpErr) {
            setFormErr(signUpErr.message);
            return;
          }
          onSignIn();
          return;
        }
        setFormErr(error.message);
        return;
      }
      onSignIn();
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setFormErr(null);
    setSubmitting(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setFormErr(result.error.message || "Google sign-in failed");
      setSubmitting(false);
      return;
    }
    if (result.redirected) return; // browser will navigate
    onSignIn();
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex min-h-[800px] flex-col px-6 pb-10 pt-8">
      <div className="absolute inset-0 water-grid opacity-30" aria-hidden />
      <div className="relative flex justify-end">
        <button
          type="button"
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

      <div className="relative mt-8 space-y-3">
        <ValidatedInput
          icon={Mail}
          label={t.email}
          placeholder="name@example.com"
          type="email"
          value={email}
          onChange={(v) => { setEmail(v); if (emailErr) setEmailErr(null); if (formErr) setFormErr(null); }}
          error={emailErr}
          autoComplete="email"
          inputMode="email"
        />
        <ValidatedInput
          icon={Lock}
          label={t.password}
          placeholder="••••••••"
          type={showPwd ? "text" : "password"}
          value={password}
          onChange={(v) => { setPassword(v); if (pwdErr) setPwdErr(null); if (formErr) setFormErr(null); }}
          error={pwdErr}
          autoComplete="current-password"
          trailing={
            <button type="button" onClick={() => setShowPwd((s) => !s)} className="text-muted-foreground hover:text-aqua">
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />
        <div className="flex justify-end">
          <button type="button" onClick={onForgot} className="text-[11px] font-semibold text-aqua">
            {t.forgot}
          </button>
        </div>
      </div>

      {formErr && (
        <div className="relative mt-4 flex items-start gap-2 rounded-xl border border-danger/40 bg-danger/10 px-3 py-2.5 text-[11px] text-danger">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span className="leading-relaxed">{formErr}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="relative mt-5 w-full rounded-2xl bg-aqua-gradient py-3.5 text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-60"
      >
        {submitting ? "..." : t.signIn}
      </button>

      <div className="relative my-5 flex items-center gap-3 text-[10px] text-muted-foreground">
        <div className="h-px flex-1 bg-border/60" />
        {t.or}
        <div className="h-px flex-1 bg-border/60" />
      </div>

      <button
        type="button"
        onClick={handleGoogle}
        disabled={submitting}
        className="relative flex w-full items-center justify-center gap-2.5 rounded-2xl border border-border/60 bg-card/60 py-3 text-xs font-semibold disabled:opacity-60"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.56c2.08-1.92 3.28-4.74 3.28-8.1z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.56-2.77c-.99.67-2.26 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.11A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.11V7.05H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.95l3.66-2.84z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.2 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
        </svg>
        {t.continueWithGoogle}
      </button>

      <button type="button" className="relative mt-3 w-full rounded-2xl border border-border/60 bg-card/40 py-3 text-xs font-semibold">
        {t.signUp}
      </button>
    </form>
  );
}

function ValidatedInput({
  icon: Icon, label, placeholder, type = "text", value, onChange, error, trailing, autoComplete, inputMode,
}: {
  icon: any; label: string; placeholder: string; type?: string;
  value: string; onChange: (v: string) => void; error?: string | null;
  trailing?: React.ReactNode; autoComplete?: string; inputMode?: any;
}) {
  return (
    <div>
      <div className="mb-1.5 text-[11px] text-muted-foreground">{label}</div>
      <div
        className={`flex items-center gap-2 rounded-2xl border bg-background/60 px-3 py-3 transition-colors ${
          error ? "border-danger/60" : "border-border/60 focus-within:border-aqua/60"
        }`}
      >
        <Icon className={`h-4 w-4 ${error ? "text-danger" : "text-aqua"}`} />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={type === "password" ? 128 : 254}
          className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground/60"
        />
        {trailing}
      </div>
      {error && (
        <div className="mt-1.5 flex items-center gap-1 text-[10px] text-danger">
          <AlertTriangle className="h-3 w-3" />
          {error}
        </div>
      )}
    </div>
  );
}

/* ---------- Forgot Password Screen ---------- */

function ForgotScreen({ t, onBack }: { t: T; onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = email.trim();
    if (!v) return setErr(t.errEmailRequired);
    if (!EMAIL_RE.test(v) || v.length > 254) return setErr(t.errEmailInvalid);
    setErr(null);
    setSending(true);
    await new Promise((r) => setTimeout(r, 900));
    setSending(false);
    setSent(true);
  };

  return (
    <div className="relative flex min-h-[800px] flex-col px-6 pb-10 pt-8">
      <div className="absolute inset-0 water-grid opacity-30" aria-hidden />

      <button
        type="button"
        onClick={onBack}
        className="relative flex w-fit items-center gap-1.5 rounded-full border border-border/60 bg-card/50 px-3 py-1.5 text-[11px] font-semibold text-muted-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" />
        {t.backToLogin}
      </button>

      <div className="relative mt-10 flex flex-col items-center text-center">
        <div className="grid h-16 w-16 place-items-center rounded-3xl bg-aqua-gradient shadow-glow">
          <KeyRound className="h-8 w-8 text-primary-foreground" strokeWidth={2.2} />
        </div>
        <div className="mt-4 text-xl font-extrabold tracking-tight">
          {sent ? t.resetSentTitle : t.forgotTitle}
        </div>
        <div className="mt-1.5 max-w-xs text-xs leading-relaxed text-muted-foreground">
          {sent ? t.resetSentSub : t.forgotSub}
        </div>
      </div>

      {!sent ? (
        <form onSubmit={submit} className="relative mt-8 space-y-4">
          <ValidatedInput
            icon={Mail}
            label={t.email}
            placeholder="name@example.com"
            type="email"
            value={email}
            onChange={(v) => { setEmail(v); if (err) setErr(null); }}
            error={err}
            autoComplete="email"
            inputMode="email"
          />
          <button
            type="submit"
            disabled={sending}
            className="w-full rounded-2xl bg-aqua-gradient py-3.5 text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-60"
          >
            {sending ? t.resending : t.sendLink}
          </button>
        </form>
      ) : (
        <div className="relative mt-8 space-y-3">
          <div className="flex items-start gap-3 rounded-2xl border border-aqua/30 bg-aqua/10 p-4">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-aqua-gradient text-primary-foreground">
              <Mail className="h-5 w-5" />
            </div>
            <div className="flex-1 text-[11px] leading-relaxed text-foreground/80">
              <div className="font-bold text-foreground">{email}</div>
              <div className="mt-0.5 text-muted-foreground">{t.resetSentSub}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => { setSent(false); }}
            className="w-full rounded-2xl border border-border/60 bg-card/40 py-3 text-xs font-semibold"
          >
            {t.resend}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="w-full rounded-2xl bg-aqua-gradient py-3 text-xs font-bold text-primary-foreground shadow-glow"
          >
            {t.backToLogin}
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- Home ---------- */

function HomeScreen({
  t, onOpenLive, hydAuto, setHydAuto, hydEnabled, platformDeployed, setPlatformDeployed, riskCritical,
}: {
  t: T; onOpenLive: () => void;
  hydAuto: boolean; setHydAuto: (v: boolean) => void;
  hydEnabled: boolean;
  platformDeployed: boolean; setPlatformDeployed: (v: boolean) => void;
  riskCritical: boolean;
}) {
  return (
    <div className="space-y-5 px-5">
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card-gradient p-5 shadow-card-soft">
        <div className="absolute inset-0 water-grid opacity-50" aria-hidden />
        <div className="relative">
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] ${
              riskCritical ? "border-danger/40 bg-danger/15 text-danger" : "border-aqua/30 bg-aqua/10 text-aqua"
            }`}>
              <span className="relative flex h-1.5 w-1.5">
                <span className={`absolute inline-flex h-full w-full rounded-full pulse-ring ${riskCritical ? "bg-danger" : "bg-aqua"}`} />
                <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${riskCritical ? "bg-danger" : "bg-aqua"}`} />
              </span>
              {t.systemActive}
            </span>
            <span className="text-[10px] text-muted-foreground">{t.lastCheck}</span>
          </div>

          <div className="mt-5 flex items-end gap-3">
            <div className={`grid h-14 w-14 place-items-center rounded-2xl shadow-glow ${riskCritical ? "bg-danger" : "bg-aqua-gradient"}`}>
              {riskCritical
                ? <AlertTriangle className="h-7 w-7 text-primary-foreground" strokeWidth={2.4} />
                : <CheckCircle2 className="h-7 w-7 text-primary-foreground" strokeWidth={2.4} />}
            </div>
            <div>
              <div className="text-[11px] text-muted-foreground">{t.poolStatus}</div>
              <div className="text-2xl font-extrabold tracking-tight">
                {riskCritical ? t.titleDrownCritical : t.safe}
              </div>
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
          
          {/* <img src={heroPool} alt="pool" className="aspect-[16/10] w-full object-cover opacity-70" /> */}
        <div className="relative overflow-hidden rounded-3xl border border-border/60 shadow-card-soft">
          <div className="aspect-[3/4] w-full bg-deep">
            <iframe
              src="https://vdo.ninja/?view=FAiZgaS&cleanoutput=1&autostart=1"
              title="iPad live camera"
              allow="autoplay; camera; microphone; fullscreen"
              allowFullScreen
              className="h-full w-full border-0"
            />
          </div>
          <div className="pointer-events-none absolute end-3 top-3 flex items-center gap-1.5 rounded-full bg-danger/90 px-2.5 py-1 text-[10px] font-bold text-destructive-foreground">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> LIVE
          </div>
          <div className="pointer-events-none absolute start-3 top-3 rounded-full bg-background/60 px-2.5 py-1 text-[10px] backdrop-blur">
            iPad · HD
          </div>
        </div>


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

      <HydraulicCard
        t={t}
        auto={hydAuto}
        setAuto={setHydAuto}
        enabled={hydEnabled}
        deployed={platformDeployed}
        setDeployed={setPlatformDeployed}
      />

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
    </div>
  );
}

function HydraulicCard({
  t, auto, setAuto, enabled, deployed, setDeployed,
}: {
  t: T; auto: boolean; setAuto: (v: boolean) => void; enabled: boolean;
  deployed: boolean; setDeployed: (v: boolean) => void;
}) {
  return (
    <div className={`relative overflow-hidden rounded-3xl border bg-card-gradient p-5 shadow-card-soft ${
      deployed ? "border-danger/50" : "border-aqua/30"
    }`}>
      <div className="absolute inset-0 water-grid opacity-40" aria-hidden />
      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`grid h-10 w-10 place-items-center rounded-xl shadow-glow ${deployed ? "bg-danger" : "bg-aqua-gradient"}`}>
              <LifeBuoy className="h-5 w-5 text-primary-foreground" strokeWidth={2.4} />
            </div>
            <div>
              <div className="text-sm font-bold">{t.hydraulic}</div>
              <div className="text-[10px] text-muted-foreground">{t.hydraulicSub}</div>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
            deployed ? "bg-danger/20 text-danger" : enabled ? "bg-aqua/15 text-aqua" : "bg-muted/40 text-muted-foreground"
          }`}>
            <Zap className="h-3 w-3" />
            {deployed ? t.deployed : enabled ? t.armed : t.standby}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <MiniStat label={t.liftStatus} value={deployed ? t.deployed : t.retracted} />
          <MiniStat label={t.responseTime} value="< 2s" />
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl bg-background/40 px-3 py-2.5">
          <div className="flex-1 pe-2">
            <div className="text-[11px] font-semibold">{t.autoMode}</div>
            <div className="text-[10px] text-muted-foreground">{t.aiAutoTriggerSub}</div>
          </div>
          <Toggle on={auto} onChange={setAuto} />
        </div>

        <button
          onClick={() => setDeployed(!deployed)}
          disabled={!enabled}
          className={`mt-3 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-xs font-bold disabled:opacity-50 ${
            deployed
              ? "bg-danger/15 border border-danger/40 text-danger"
              : "bg-aqua-gradient text-primary-foreground shadow-glow"
          }`}
        >
          <Power className="h-4 w-4" />
          {deployed ? t.retract : t.deploy}
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

function AiRow({ icon: Icon, label, value, tone }: { icon: any; label: string; value: string; tone?: "danger" | "default" }) {
  return (
    <div className={`flex items-center justify-between rounded-xl px-3 py-2.5 ${
      tone === "danger" ? "bg-danger/15 border border-danger/30" : "bg-background/40"
    }`}>
      <div className="flex items-center gap-2.5">
        <Icon className={`h-4 w-4 ${tone === "danger" ? "text-danger" : "text-aqua"}`} />
        <span className="text-xs">{label}</span>
      </div>
      <span className={`text-xs font-semibold ${tone === "danger" ? "text-danger" : ""}`}>{value}</span>
    </div>
  );
}

/* ---------- Live ---------- */
function LiveScreen({
  t,
  riskCritical,
  onDangerDetected,
}: {
  t: any;
  riskCritical: boolean;
  onDangerDetected: (confidence?: number) => void;
}) {
  const [aiStatus, setAiStatus] = useState<string>("—");
  const [aiConfidence, setAiConfidence] = useState<number>(0);
  const [aiError, setAiError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // 🎥 تشغيل بث VDO.Ninja داخل video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.src = "https://vdo.ninja/?view=FAiZgaS&cleanoutput&autostart";
    video.play().catch(() => {});
  }, []);

  // 🧠 AI Loop
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const video = videoRef.current;
        if (!video) return;

        if (video.readyState < 2) return;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = 640;
        canvas.height = 480;

        if (!ctx) return;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(async (blob) => {
          if (!blob) return;

          const formData = new FormData();
          formData.append("image", blob, "frame.jpg");

          const res = await fetch(
            "https://sneezing-folk-cosponsor.ngrok-free.dev/analyze",
            {
              method: "POST",
              body: formData,
            }
          );

          const data = await res.json();

          setAiStatus(data.status);
          setAiConfidence(data.confidence);

          if (data.status?.toLowerCase() === "danger") {
            onDangerDetected(data.confidence);
          }
        }, "image/jpeg");
      } catch (err) {
        setAiError("AI feed offline");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [onDangerDetected]);

  const statusKey = aiStatus.toLowerCase();
  const isDanger = statusKey === "danger";

  const statusTone =
    isDanger
      ? "text-danger"
      : statusKey === "swimming"
      ? "text-aqua"
      : "text-foreground";

  return (
    <div className="space-y-4 px-5">
      <div className="relative overflow-hidden rounded-3xl border border-border/60 shadow-card-soft">
        <div className="aspect-[3/4] w-full bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover"
          />
        </div>

        <div className="pointer-events-none absolute end-3 top-3 rounded-full bg-red-600 px-2 py-1 text-[10px] text-white">
          LIVE
        </div>

        <div className="pointer-events-none absolute start-3 top-3 rounded-full bg-black/50 px-2 py-1 text-[10px] text-white">
          iPad Camera
        </div>

        <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center justify-between rounded-xl bg-black/60 px-3 py-2 text-white">
          <div>
            <div className="text-xs font-bold">{t?.mainPool}</div>
            <div className="text-xs">
              {aiStatus} · {aiConfidence}%
            </div>
          </div>

          <div className="text-xs">
            {riskCritical || isDanger ? "CRITICAL" : "SAFE"}
          </div>
        </div>
      </div>

      <div className="rounded-xl border p-3 text-sm">
        <div className="font-bold">AI Status</div>

        <div>Status: {aiStatus}</div>
        <div>Confidence: {aiConfidence}%</div>

        {aiError && (
          <div className="text-red-500 text-xs mt-2">{aiError}</div>
        )}
      </div>
    </div>
  );
}


/* ---------- Alerts (detailed incidents log) ---------- */

function AlertsScreen({ t, incidents, lang }: { t: T; incidents: Incident[]; lang: Lang }) {
  const [filter, setFilter] = useState<"all" | IncidentSeverity>("all");
  const filters: { id: "all" | IncidentSeverity; label: string }[] = [
    { id: "all", label: t.all },
    { id: "danger", label: t.critical },
    { id: "warning", label: t.warning },
    { id: "info", label: t.info },
  ];
  const filtered = filter === "all" ? incidents : incidents.filter((i) => i.severity === filter);

  return (
    <div className="space-y-3 px-5">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold ${
                active ? "bg-aqua-gradient text-primary-foreground shadow-glow" : "border border-border/60 bg-card/50 text-muted-foreground"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-border/60 bg-card-gradient p-6 text-center text-xs text-muted-foreground">
          {t.noIncidents}
        </div>
      )}

      {filtered.map((inc) => (
        <IncidentCard key={inc.id} inc={inc} t={t} lang={lang} />
      ))}
    </div>
  );
}

function IncidentCard({ inc, t, lang }: { inc: Incident; t: T; lang: Lang }) {
  const meta = incidentMeta(inc.kind, t);
  const sevCls =
    inc.severity === "danger" ? "bg-danger/15 text-danger border-danger/40"
    : inc.severity === "warning" ? "bg-aqua/15 text-aqua border-aqua/40"
    : "bg-muted/40 text-muted-foreground border-border/60";

  const sevLabel =
    inc.severity === "danger" ? t.critical : inc.severity === "warning" ? t.warning : t.info;

  return (
    <div className={`rounded-2xl border bg-card-gradient p-4 ${
      inc.severity === "danger" ? "border-danger/40" : "border-border/60"
    }`}>
      <div className="flex items-start gap-3">
        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${sevCls}`}>
          <meta.icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm font-bold truncate">{meta.title}</div>
            <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase ${sevCls}`}>
              {sevLabel}
            </span>
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground">
            <span>{formatTimestamp(inc.timestamp, t, lang)}</span>
            {typeof inc.confidence === "number" && (
              <>
                <span>·</span>
                <span>AI {inc.confidence}%</span>
              </>
            )}
          </div>

          {meta.desc && <div className="mt-2 text-xs text-muted-foreground">{meta.desc}</div>}

          {/* incident type */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground">{t.incidentType}:</span>
            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${sevCls}`}>
              {meta.typeLabel}
            </span>
          </div>

          {/* actions executed */}
          {inc.actions.length > 0 && (
            <div className="mt-3 rounded-xl border border-border/60 bg-background/40 p-2.5">
              <div className="mb-1.5 text-[10px] font-semibold text-muted-foreground">{t.actionsTaken}</div>
              <div className="flex flex-wrap gap-1.5">
                {inc.actions.map((a) => <ActionChip key={a} action={a} t={t} />)}
              </div>
              {inc.severity === "danger" && inc.actions.includes("platform") && (
                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-aqua">
                  <Zap className="h-3 w-3" /> {t.autoChain}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ActionChip({ action, t }: { action: ActionKey; t: T }) {
  const map = {
    platform: { icon: LifeBuoy, label: t.actPlatform, cls: "bg-aqua/15 text-aqua border-aqua/40" },
    alarm: { icon: Volume2, label: t.actAlarm, cls: "bg-danger/15 text-danger border-danger/40" },
    notification: { icon: Smartphone, label: t.actNotification, cls: "bg-muted/40 text-foreground border-border/60" },
  } as const;
  const a = map[action];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${a.cls}`}>
      <a.icon className="h-3 w-3" />
      {a.label}
    </span>
  );
}

function incidentMeta(kind: IncidentKind, t: T): { icon: any; title: string; desc?: string; typeLabel: string } {
  switch (kind) {
    case "drowning_critical":
      return { icon: AlertTriangle, title: t.titleDrownCritical, typeLabel: t.titleDrownCritical };
    case "drowning_suspect":
      return { icon: AlertTriangle, title: t.titleDrownSuspect, typeLabel: t.titleDrownSuspect };
    case "child_near":
      return { icon: ScanFace, title: t.titleChildNear, desc: t.descChildNear, typeLabel: t.titleChildNear };
    case "cam_start":
      return { icon: Camera, title: t.titleCamStart, desc: t.descCamStart, typeLabel: t.titleCamStart };
    case "routine":
    default:
      return { icon: CheckCircle2, title: t.titleRoutine, desc: t.descRoutine, typeLabel: t.titleRoutine };
  }
}

function formatTimestamp(ts: number, t: T, lang: Lang): string {
  const d = new Date(ts);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const yesterday = new Date(now.getTime() - 86400000).toDateString() === d.toDateString();
  const time = d.toLocaleTimeString(lang === "ar" ? "ar-EG" : "en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  if (sameDay) {
    const diffMin = Math.round((now.getTime() - ts) / 60000);
    if (diffMin < 1) return t.justNow;
    return `${time}`;
  }
  if (yesterday) return `${t.yesterday} · ${time}`;
  return d.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", { day: "2-digit", month: "short" }) + ` · ${time}`;
}

/* ---------- Settings ---------- */

function SettingsScreen({
  t, lang, setLang, hydEnabled, setHydEnabled, hydAuto, setHydAuto,
}: {
  t: T; lang: Lang; setLang: (l: Lang) => void;
  hydEnabled: boolean; setHydEnabled: (v: boolean) => void;
  hydAuto: boolean; setHydAuto: (v: boolean) => void;
}) {
  const [camOn, setCamOn] = useState(true);
  const [sensorOn, setSensorOn] = useState(true);
  const [aiAlert, setAiAlert] = useState(true);
  const [soundAlert, setSoundAlert] = useState(true);
  const [sensitivity, setSensitivity] = useState<"low" | "mid" | "high">("mid");
  const [alertType, setAlertType] = useState<"all" | "push" | "sound">("all");
  const [range, setRange] = useState(120);
  const [volume, setVolume] = useState(80);

  return (
    <div className="space-y-5 px-5">
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

      <SettingsCard icon={LifeBuoy} title={t.hydraulicSettings}>
        <ToggleRow label={t.enableHydraulic} on={hydEnabled} onChange={setHydEnabled} />
        <div>
          <ToggleRow label={t.aiAutoTrigger} on={hydAuto} onChange={setHydAuto} />
          <div className="mt-1 text-[10px] leading-relaxed text-muted-foreground">{t.aiAutoTriggerSub}</div>
        </div>
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
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 w-full cursor-pointer appearance-none bg-transparent opacity-0"
      />
    </div>
  );
}
