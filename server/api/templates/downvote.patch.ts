import { z } from 'zod'
import type { H3Event } from 'h3'
import { createError, getQuery, sendError } from 'h3'
import { getServerSession } from '#auth'
import { sendZodErrorResponse } from '~/server/errors'

const schema = z.object({
  id: z.string()
})
export function validateQuery(event: H3Event) {
  const query = getQuery(event)
  try {
    const res = schema.parse(query)
    return res
  }
  catch (error) {
    return sendZodErrorResponse(event, error)
  }
}
async function downVote(event: H3Event, userId: string) {
  const query = getQuery(event)

  const { id } = schema.parse(query)

  const template = await event.context.prisma.template.findUnique({
    where: {
      id
    }
  })

  if (!template) {
    return sendError(event, createError({ statusCode: 404, statusMessage: 'Not Found' }))
  }

  const like = await event.context.prisma.like.findUnique({ where: { templateId_userId: { templateId: template.id, userId } } })
  if (template.requestedById === userId && like?.score === 0) {
    return sendError(event, createError({ statusCode: 401, statusMessage: 'You cannot downvote your own suggestion' }))
  }
  if (!like) {
    return await event.context.prisma.like.create({
      data: {
        userId,
        templateId: template.id,
        score: -1
      },
    })
  }
  await event.context.prisma.like.update({
    where: {
      id: like?.id
    },
    data: {
      score: like.score > 0 ? 0 : -1
    },

  })
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { id } = schema.parse(query)
  const template = await event.context.prisma.template.findUnique({
    where: {
      id
    }
  })
  if (!template) {
    return sendError(event, createError({ statusCode: 404, statusMessage: 'Not Found' }))
  }
  if (template.status === 'active') {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'Cannot Vote on Active Template' }))
  }
  if (template.status === 'inactive') {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'Cannot Vote on Inactive Template' }))
  }
  const session = await getServerSession(event)
  if (!session?.user) {
    return sendError(event, createError({ statusCode: 401, statusMessage: 'Unauthorized' }))
  }
  //   const user = await event.context.prisma.user.findUnique({
  //     where: {
  //       email: session.user.email as string
  //     }
  //   })
  //   if (!user) {
  //     return sendError(event, createError({ statusCode: 401, statusMessage: 'Unauthorized' }))
  //   }

  switch (template.status) {
    case 'suggested':
      await downVote(event, session.user.id)
      break
    case 'issue':
      await downVote(event, session.user.id)
      break
    case 'pull request':
      await downVote(event, session.user.id)
      break
    case 'added':
      await downVote(event, session.user.id)
      break
    default:
      break
  }
})
