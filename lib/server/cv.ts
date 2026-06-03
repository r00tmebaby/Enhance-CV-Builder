import { z } from "zod"

// Shared helpers for the CV API routes: id validation, request-body validation,
// per-document write serialization, and optional bearer-token auth.

// Document ids are server-generated UUIDs. Validating before using an id in a
// filesystem path prevents path traversal outside the data directory.
const UUID_RE = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
export const isValidId = (id: string): boolean => UUID_RE.test(id)

// Permissive-but-structured schemas: reject malformed payloads while allowing
// the rich, evolving resume/settings content through (extra keys pass through).
const ResumeSchema = z
  .object({
    header: z.object({}).passthrough(),
    sections: z.array(z.unknown()),
  })
  .passthrough()

const EditHistorySchema = z
  .object({ past: z.array(z.unknown()), future: z.array(z.unknown()) })
  .partial()

export const CvBodySchema = z.object({
  resume: ResumeSchema,
  settings: z.record(z.string(), z.unknown()).optional(),
  name: z.string().max(200).optional(),
  snapshot: z.boolean().optional(),
  resumeHistory: EditHistorySchema.optional(),
})
export type CvBody = z.infer<typeof CvBodySchema>

export const PatchBodySchema = z.object({
  action: z.enum(["rename", "delete", "clear-edit-history"]),
  snapshotId: z.string().optional(),
  name: z.string().max(200).optional(),
})
export type PatchBody = z.infer<typeof PatchBodySchema>

// Serialize read-modify-write operations per document id so concurrent autosaves
// (same Node process) can't clobber each other. Single-instance scope.
const tails = new Map<string, Promise<unknown>>()
export function withLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const run = (tails.get(key) ?? Promise.resolve()).then(fn, fn)
  // Keep an error-swallowing tail so one failure doesn't break the chain.
  tails.set(key, run.then(() => {}, () => {}))
  return run
}

// Optional auth: when CV_API_TOKEN is set, require a matching bearer token.
// When unset (default, e.g. local single-user), the API is open as before.
export function isAuthorized(req: Request): boolean {
  const token = process.env.CV_API_TOKEN
  if (!token) return true
  return req.headers.get("authorization") === `Bearer ${token}`
}
