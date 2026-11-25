import type { Metadata } from "next";
import { ModulePage } from "@/components/content/ModulePage";
import { getModuleDescriptor } from "@/modules/navigation/catalog";

export const metadata: Metadata = {
  title: "Stories of Prophets",
  description: "Prophet stories structured around Quranic evidence, reliable Hadith, and key lessons.",
};

export default function ProphetsPage() {
  return <ModulePage descriptor={getModuleDescriptor("prophets")} />;
}
