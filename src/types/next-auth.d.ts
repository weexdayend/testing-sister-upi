// types/next-auth.d.ts

import NextAuth from "next-auth";

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;
    name: string;
    type?: string;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      type: string;  // Add type here
    };
  }

  interface User {
    id: string;
    name: string;
    type: string;  // Add type here
  }
}
