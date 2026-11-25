import type { Metadata } from "next";
import { ModulePage } from "@/components/content/ModulePage";
import { getModuleDescriptor } from "@/modules/navigation/catalog";

export const metadata: Metadata = {
  title: "Islamic Concepts",
  description: "Clear structure for Tawheed, Iman, Islam, Ihsan, worship, and Islamic terminology.",
};

export default function ConceptsPage() {
  return <ModulePage descriptor={getModuleDescriptor("concepts")} />;
}
