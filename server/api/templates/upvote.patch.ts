import type { H3Event } from 'h3'
import { z } from 'zod'
import { getServerSession } from '#auth'

const schema = z.object({
  id: z.string()
})

async function upVote(event: H3Event, userId: string) {
  const query = getQuery(event)

  const { id } = schema.parse(query)

  const like = await event.context.prisma.like.findUnique({ where: { templateId_userId: { templateId: id, userId } } })

  if (!like) {
    return await event.context.prisma.like.create({
      data: {
        userId,
        templateId: id,
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

  // if (template.requestedById === user.id) {_
  //   return sendError(event, createError({ statusCode: 400, statusMessage: 'Cannot Vote on Your Own Template' }))
  // }
  switch (template.status) {
    case 'suggested':
      await upVote(event, session.user.id)
      break
    case 'issue':
      await upVote(event, session.user.id)
      break
    case 'pull request':
      await upVote(event, session.user.id)
      break
    case 'added':
      await upVote(event, session.user.id)
      break
    default:
      break
  }
})
