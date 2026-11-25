import type { Metadata } from "next";
import { ModulePage } from "@/components/content/ModulePage";
import { getModuleDescriptor } from "@/modules/navigation/catalog";

export const metadata: Metadata = {
  title: "Daily Life Teachings",
  description: "Islamic guidance for family, business ethics, cleanliness, and everyday conduct.",
};

export default function DailyLifePage() {
  return <ModulePage descriptor={getModuleDescriptor("daily-life")} />;
}
