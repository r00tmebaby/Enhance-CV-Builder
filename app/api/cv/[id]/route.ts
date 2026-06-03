import { NextResponse } from "next/server"
import path from "path"
import { promises as fs } from "fs"
import crypto from "crypto"
import { isValidId, isAuthorized, withLock, CvBodySchema, PatchBodySchema } from "@/lib/server/cv"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const dataDir = path.join(process.cwd(), "data", "cv")
const fileFor = (id: string) => path.join(dataDir, `${id}.json`)

const unauthorized = () => NextResponse.json({ error: "Unauthorized" }, { status: 401 })
const invalidId = () => NextResponse.json({ error: "Invalid document id" }, { status: 400 })
const errorCode = (err: unknown) => (err as NodeJS.ErrnoException)?.code
const errorMessage = (err: unknown) => (err instanceof Error ? err.message : undefined)

async function readDoc(id: string) {
  const raw = await fs.readFile(fileFor(id), "utf-8")
  return JSON.parse(raw)
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!isAuthorized(req)) return unauthorized()
    const { id } = await params
    if (!isValidId(id)) return invalidId()
    const doc = await readDoc(id)
    return NextResponse.json(doc)
  } catch (err) {
    const status = errorCode(err) === "ENOENT" ? 404 : 500
    return NextResponse.json({ error: errorMessage(err) || "Failed to read CV" }, { status })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!isAuthorized(req)) return unauthorized()
    const { id } = await params
    if (!isValidId(id)) return invalidId()

    const parsed = CvBodySchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 })
    }
    const { resume, settings, resumeHistory, name, snapshot } = parsed.data

    // Serialize per-document writes so concurrent autosaves can't clobber each other.
    return await withLock(id, async () => {
      const raw = await fs.readFile(fileFor(id), "utf-8").catch((e) => {
        if (errorCode(e) === "ENOENT") return null
        throw e
      })
      if (!raw) return NextResponse.json({ error: "Document not found" }, { status: 404 })

      const doc = JSON.parse(raw)
      const now = Date.now()
      const editHistory = resumeHistory && Array.isArray(resumeHistory.past) && Array.isArray(resumeHistory.future)
        ? { past: resumeHistory.past.slice(-50), future: resumeHistory.future.slice(-50) }
        : undefined
      const resumePayload = { header: resume.header, sections: resume.sections }

      // Update the live "current" version in place, preserving id and name so
      // autosaves never strip the document name (which would drop it from the list).
      doc.current = {
        id: doc.current?.id || crypto.randomUUID(),
        timestamp: now,
        name: name ?? doc.current?.name,
        resume: resumePayload,
        settings: settings ?? {},
        ...(editHistory ? { editHistory } : {}),
      }
      doc.updatedAt = now

      // Manual Save (snapshot=true) also records a frozen restore point in history.
      if (snapshot) {
        doc.history = doc.history || []
        doc.history.unshift({
          id: crypto.randomUUID(),
          timestamp: now,
          name: name || undefined,
          resume: resumePayload,
          settings: settings ?? {},
          ...(editHistory ? { editHistory } : {}),
        })
        if (doc.history.length > 50) doc.history = doc.history.slice(0, 50)
      }

      await fs.writeFile(fileFor(id), JSON.stringify(doc, null, 2), "utf-8")
      return NextResponse.json(doc)
    })
  } catch (err) {
    return NextResponse.json({ error: errorMessage(err) || "Failed to update CV" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!isAuthorized(req)) return unauthorized()
    const { id } = await params
    if (!isValidId(id)) return invalidId()

    const parsed = PatchBodySchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 })
    }
    const { action, snapshotId, name } = parsed.data

    return await withLock(id, async () => {
      const raw = await fs.readFile(fileFor(id), "utf-8").catch((e) => {
        if (errorCode(e) === "ENOENT") return null
        throw e
      })
      if (!raw) return NextResponse.json({ error: "Document not found" }, { status: 404 })
      const doc = JSON.parse(raw)

      if (action === "rename") {
        if (!snapshotId || !name) return NextResponse.json({ error: "snapshotId and name required" }, { status: 400 })
        if (doc.current?.id === snapshotId) {
          doc.current.name = name
        } else {
          const s = (doc.history || []).find((x: { id: string }) => x.id === snapshotId)
          if (!s) return NextResponse.json({ error: "Snapshot not found" }, { status: 404 })
          s.name = name
        }
      } else if (action === "delete") {
        if (!snapshotId) return NextResponse.json({ error: "snapshotId required" }, { status: 400 })
        if (doc.current?.id === snapshotId) {
          const next = (doc.history || []).shift()
          if (!next) return NextResponse.json({ error: "Cannot delete last remaining snapshot" }, { status: 400 })
          doc.current = next
        } else {
          doc.history = (doc.history || []).filter((x: { id: string }) => x.id !== snapshotId)
        }
      } else if (action === "clear-edit-history") {
        if (doc.current) {
          doc.current.editHistory = { past: [], future: [] }
          doc.updatedAt = Date.now()
        }
      }

      await fs.writeFile(fileFor(id), JSON.stringify(doc, null, 2), "utf-8")
      return NextResponse.json(doc)
    })
  } catch (err) {
    return NextResponse.json({ error: errorMessage(err) || "Failed to update snapshot" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!isAuthorized(req)) return unauthorized()
    const { id } = await params
    if (!isValidId(id)) return invalidId()
    return await withLock(id, async () => {
      await fs.unlink(fileFor(id))
      return NextResponse.json({ ok: true })
    })
  } catch (err) {
    const status = errorCode(err) === "ENOENT" ? 404 : 500
    return NextResponse.json({ error: errorMessage(err) || "Failed to delete CV" }, { status })
  }
}
