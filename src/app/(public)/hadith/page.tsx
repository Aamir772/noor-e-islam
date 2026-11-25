import type { Metadata } from "next";
import { ModulePage } from "@/components/content/ModulePage";
import { getModuleDescriptor } from "@/modules/navigation/catalog";

export const metadata: Metadata = {
  title: "Hadith",
  description: "Hadith collection architecture with grading provenance and structured references.",
};

export default function HadithPage() {
  return <ModulePage descriptor={getModuleDescriptor("hadith")} />;
}
