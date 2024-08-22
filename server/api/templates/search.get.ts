import { z } from 'zod'
import type { H3Event } from 'h3'
import { sendZodErrorResponse } from '../../errors'

const schema = z.object({
  search: z.string(),
  precise: z.string().transform(val => val === 'true').optional()
})
export async function validateQuery(event: H3Event) {
  const query = getQuery(event)
  try {
    const res = await schema.parseAsync(query)
    return res
  }
  catch (error) {
    return sendZodErrorResponse(event, error)
  }
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  console.info(query)
  const { search, precise } = schema.parse(query)

  const hits = await event.context.prisma.template.findMany({
    where: {
      name: precise
        ? {
            equals: search
          }
        : { contains: search }
    },
    include: {
      likes: true
    }
  })

  return hits
})
