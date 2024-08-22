import GithubProvider from 'next-auth/providers/github'
import { PrismaAdapter } from '@auth/prisma-adapter'

import { NuxtAuthHandler, } from '#auth'
import prisma from '~/lib/prisma'

const config = useRuntimeConfig()

export default NuxtAuthHandler({
  secret: config.authSecret,
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    GithubProvider.default({
      clientId: config.githubClientId,
      clientSecret: config.githubClientSecret,
    }),
  ],
  // @ts-expect-error  ts error
  adapter: PrismaAdapter(prisma),
  callbacks: {
    session: async ({ session, user }) => {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    }
  }
})
