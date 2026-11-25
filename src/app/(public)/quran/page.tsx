import type { Metadata } from "next";
import { ModulePage } from "@/components/content/ModulePage";
import { getModuleDescriptor } from "@/modules/navigation/catalog";

export const metadata: Metadata = {
  title: "Quran",
  description: "Structured Quran exploration with source aware translation architecture and references.",
};

export default function QuranPage() {
  return <ModulePage descriptor={getModuleDescriptor("quran")} />;
}
