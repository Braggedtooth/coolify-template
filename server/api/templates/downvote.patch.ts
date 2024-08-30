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

  const service = await event.context.prisma.service.findUnique({
    where: {
      id
    }
  })

  if (!service) {
    return sendError(event, createError({ statusCode: 404, statusMessage: 'Not Found' }))
  }

  const like = await event.context.prisma.like.findUnique({ where: { serviceId_userId: { serviceId: service.id, userId } } })
  if (service.requestedById === userId && like?.score === 0) {
    return sendError(event, createError({ statusCode: 403, statusMessage: 'You cannot downvote your own suggestion' }))
  }
  if (!like) {
    return await event.context.prisma.like.create({
      data: {
        userId,
        serviceId: service.id,
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
  const service = await event.context.prisma.service.findUnique({
    where: {
      id
    }
  })
  if (!service) {
    return sendError(event, createError({ statusCode: 404, statusMessage: 'Not Found' }))
  }
  if (service.status === 'ADDED' || service.status === 'DECLINED') {
    return sendError(event, createError({ statusCode: 400, message: 'Voting disabled for this suggestion, it had either been added or declined' }))
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

  await downVote(event, session.user.id)
})
