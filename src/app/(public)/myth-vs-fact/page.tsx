import type { Metadata } from "next";
import { ModulePage } from "@/components/content/ModulePage";
import { getModuleDescriptor } from "@/modules/navigation/catalog";

export const metadata: Metadata = {
  title: "Myth vs Fact",
  description: "Evidence based clarification of misconceptions, scholarly differences, and Islamic practices.",
};

export default function MythVsFactPage() {
  return <ModulePage descriptor={getModuleDescriptor("myth-vs-fact")} />;
}
