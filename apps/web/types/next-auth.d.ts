import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      plan?: string;
      role?: string;
    } & DefaultSession["user"];
  }

  interface User {
    plan?: string;
    role?: string;
  }
}
