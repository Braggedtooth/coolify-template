import type { H3Event } from 'h3'
import { z } from 'zod'
import { getServerSession } from '#auth'

const schema = z.object({
  id: z.string()
})

async function upVote(event: H3Event, userId: string) {
  const query = getQuery(event)

  const { id } = schema.parse(query)

  const like = await event.context.prisma.like.findUnique({ where: { serviceId_userId: { serviceId: id, userId } } })

  if (!like) {
    return await event.context.prisma.like.create({
      data: {
        userId,
        serviceId: id,
        score: 1
      },
    })
  }
  await event.context.prisma.like.update({
    where: {
      id: like.id
    },
    data: {
      score: like.score >= 0 ? 1 : 0
    },

  })
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { id } = schema.parse(query)

  const template = await event.context.prisma.service.findUnique({
    where: {
      id
    }
  })
  if (!template) {
    return sendError(event, createError({ statusCode: 404, statusMessage: 'Not Found' }))
  }
  if (template.status === 'ADDED' || template.status === 'DECLINED') {
    return sendError(event, createError({ statusCode: 400, message: 'Voting disabled for this suggestion, it had either been added or declined' }))
  }
  const session = await getServerSession(event)
  if (!session?.user) {
    return sendError(event, createError({ statusCode: 401, statusMessage: 'Unauthorized' }))
  }

  await upVote(event, session.user.id)
})
