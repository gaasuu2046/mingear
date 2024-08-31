// types/next-auth.d.ts
import { DefaultUser } from "next-auth"

// import 'next-auth'
import type { AuthOptions } from "next-auth"


declare module "next-auth" {
  interface User extends DefaultUser {
    id: string
  }
  interface Session extends DefaultSession {
    user: User;
  }
  export type NextAuthOptions = AuthOptions;

}
