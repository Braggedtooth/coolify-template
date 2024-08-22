import type { H3Event } from 'h3'
import { createError, sendError } from 'h3'

export async function sendZodErrorResponse(event: H3Event, errorData: any) {
  const parsedErrors = getMappedZodErrors(errorData)
  return sendError(event, createError({ statusCode: 422, statusMessage: 'Invalid Data Provided', data: parsedErrors }))
}

// export default async function sendDefaultErrorResponse(event: H3Event, errorType: string, statusCode: number, error: any) {
//   const parsedErrors = getMappedError(errorType, error)
//   return sendError(event, createError({ statusCode, statusMessage: 'Invalid Data Provided', data: parsedErrors }))
// }

export function getMappedZodErrors(zodError: any) {
  const errors = new Map<string, { message: string }>()
  JSON.parse(zodError).forEach((zodError: any) => {
    errors.set(zodError.path[0], { message: zodError.message })
  })
  return JSON.stringify(Object.fromEntries(errors))
}

export function getMappedError(errorType: string, message: string) {
  const errors = new Map<string, { message: string }>()
  errors.set(errorType, { message })
  return JSON.stringify(Object.fromEntries(errors))
}
