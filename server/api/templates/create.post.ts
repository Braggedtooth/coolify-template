import { createError, defineEventHandler, readValidatedBody, sendError } from 'h3'
import { z } from 'zod'

import { getServerSession } from '#auth'
import prisma from '~/lib/prisma'

const schema = z.object({
  name: z.string().refine(async (val) => {
    const exist = await prisma.template.count({ where: { name: val } })
    return exist === 0
  }, { message: 'Template has already been suggested' }),
  description: z.string(),
  appUrl: z.string().url(),
  discussionUrl: z.string().url(),
})
export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, body => schema.parseAsync(body))

  //   if (!result.success) {
  //     return sendZodErrorResponse(event, result.error)
  //   }

  const session = await getServerSession(event)
  if (!session?.user) {
    return sendError(event, createError({ statusCode: 401, statusMessage: 'Unauthorized' }))
  }
  try {
    return await event.context.prisma.template.create({
      data: {
        name: result.name,
        description: result.description,
        appUrl: result.appUrl,
        discussionUrl: result.discussionUrl,
        requestedById: session.user.id,
        status: 'suggested'
      }
    })
  }
  catch (error) {
    if (error instanceof Error) { return sendError(event, createError({ statusCode: 500, statusMessage: error?.message ?? 'Failed to create Template' })) }
  }
})
