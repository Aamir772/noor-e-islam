import { assertProductionSecrets } from "@/lib/config/env";

export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    assertProductionSecrets();
  }
}
