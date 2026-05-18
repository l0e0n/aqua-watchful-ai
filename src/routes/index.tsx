import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { HowItWorks } from "@/components/site/HowItWorks";
import { DrowningDetection } from "@/components/site/DrowningDetection";
import { Features } from "@/components/site/Features";
import { AISection } from "@/components/site/AISection";
import { AppShowcase } from "@/components/site/AppShowcase";
import { CTA } from "@/components/site/CTA";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Aqua Guard — نظام ذكي لحماية الأطفال من الغرق" },
      { name: "description", content: "Aqua Guard نظام متكامل يدمج الحساسات والكاميرا والذكاء الاصطناعي لحماية الأطفال من خطر الغرق في المسابح." },
    ],
  }),
});

function Index() {
  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <DrowningDetection />
        <Features />
        <AISection />
        <AppShowcase />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
