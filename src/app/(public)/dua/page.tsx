import type { Metadata } from "next";
import { ModulePage } from "@/components/content/ModulePage";
import { getModuleDescriptor } from "@/modules/navigation/catalog";

export const metadata: Metadata = {
  title: "Dua",
  description: "Dua library structure with Arabic text, transliteration, translation, meaning, occasion, and reference.",
};

export default function DuaPage() {
  return <ModulePage descriptor={getModuleDescriptor("dua")} />;
}
