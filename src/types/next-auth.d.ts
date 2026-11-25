import type { Role } from "@/modules/auth/roles";

declare module "next-auth" {
  interface User {
    roles?: Role[];
  }

  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      roles: Role[];
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    roles?: Role[];
  }
}
