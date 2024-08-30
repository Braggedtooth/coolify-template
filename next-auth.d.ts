// file: ~/next-auth.d.ts
import type { DefaultSession, } from 'next-auth'
import type { Role } from '@prisma/client'

declare module 'next-auth' {
  /* Returned by `useAuth`, `getSession` and `getServerSession` */
  interface Session extends DefaultSession {
    user: {
      name: string
      email: string
      id: string
      image: string
      role: Role

    }

  }
  interface User {
    role: Role
  }
}
