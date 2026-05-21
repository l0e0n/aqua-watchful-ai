import { createFileRoute } from "@tanstack/react-router";
import { AquaApp } from "@/components/app/AquaApp";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Aqua Guard — تطبيق حماية الأطفال من الغرق" },
      { name: "description", content: "تطبيق Aqua Guard لمراقبة المسبح ذكياً وحماية الأطفال من الغرق." },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-deep">
      <AquaApp />
    </div>
  );
}
