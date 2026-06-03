import { NextResponse } from "next/server"
import path from "path"
import { promises as fs } from "fs"
import crypto from "crypto"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const dataDir = path.join(process.cwd(), "data", "cv")

async function readDoc(id: string) {
  const filePath = path.join(dataDir, `${id}.json`)
  const raw = await fs.readFile(filePath, "utf-8")
  return JSON.parse(raw)
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const doc = await readDoc(id)
    return NextResponse.json(doc)
  } catch (err: any) {
    const status = err?.code === 'ENOENT' ? 404 : 500
    return NextResponse.json({ error: err?.message || "Failed to read CV" }, { status })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const filePath = path.join(dataDir, `${id}.json`)
    const raw = await fs.readFile(filePath, "utf-8").catch((e) => {
      if (e?.code === 'ENOENT') return null
      throw e
    })
    if (!raw) return NextResponse.json({ error: "Document not found" }, { status: 404 })

  const doc = JSON.parse(raw)
  const body = await req.json()
  const { resume, settings, resumeHistory, name, snapshot } = body || {}
    if (!resume?.header || !Array.isArray(resume?.sections)) {
      return NextResponse.json({ error: "Invalid payload: missing resume.header or resume.sections" }, { status: 400 })
    }

    const now = Date.now()
    const editHistory = (resumeHistory && Array.isArray(resumeHistory.past) && Array.isArray(resumeHistory.future))
      ? { past: resumeHistory.past.slice(-50), future: resumeHistory.future.slice(-50) }
      : undefined
    const resumePayload = { header: resume.header, sections: resume.sections }

    // Always update the live "current" version in place. We keep its id and its
    // name so autosaves never strip the document's name (which would drop it from
    // the saved documents list). A new name, if provided, updates the document name.
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
      // Keep the 50 most recent restore points.
      if (doc.history.length > 50) doc.history = doc.history.slice(0, 50)
    }

    await fs.writeFile(filePath, JSON.stringify(doc, null, 2), "utf-8")
    return NextResponse.json(doc)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to update CV" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const filePath = path.join(dataDir, `${id}.json`)
    const raw = await fs.readFile(filePath, "utf-8")
    const doc = JSON.parse(raw)
    const { action, snapshotId, name } = await req.json()
    if (action === 'rename') {
      if (!snapshotId || !name) return NextResponse.json({ error: 'snapshotId and name required' }, { status: 400 })
      if (doc.current?.id === snapshotId) {
        doc.current.name = name
      } else {
        const s = (doc.history || []).find((x: any) => x.id === snapshotId)
        if (!s) return NextResponse.json({ error: 'Snapshot not found' }, { status: 404 })
        s.name = name
      }
    } else if (action === 'delete') {
      if (!snapshotId) return NextResponse.json({ error: 'snapshotId required' }, { status: 400 })
      if (doc.current?.id === snapshotId) {
        // Deleting current promotes most recent history as current
        const next = (doc.history || []).shift()
        if (!next) return NextResponse.json({ error: 'Cannot delete last remaining snapshot' }, { status: 400 })
        doc.current = next
      } else {
        doc.history = (doc.history || []).filter((x: any) => x.id !== snapshotId)
      }
    } else if (action === 'clear-edit-history') {
      // Clear persisted edit steps for the current snapshot only
      if (doc.current) {
        doc.current.editHistory = { past: [], future: [] }
        doc.updatedAt = Date.now()
      }
    } else {
      return NextResponse.json({ error: 'Unsupported action' }, { status: 400 })
    }
    await fs.writeFile(filePath, JSON.stringify(doc, null, 2), 'utf-8')
    return NextResponse.json(doc)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to update snapshot" }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const filePath = path.join(dataDir, `${id}.json`)
    await fs.unlink(filePath)
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    const status = err?.code === 'ENOENT' ? 404 : 500
    return NextResponse.json({ error: err?.message || "Failed to delete CV" }, { status })
  }
}
