import type { Metadata } from "next";
import { ModulePage } from "@/components/content/ModulePage";
import { getModuleDescriptor } from "@/modules/navigation/catalog";

export const metadata: Metadata = {
  title: "Prophet's Teachings",
  description: "Sunnah, character, mercy, honesty, justice, and social responsibility with reference driven structure.",
};

export default function TeachingsPage() {
  return <ModulePage descriptor={getModuleDescriptor("teachings")} />;
}
