import { NextResponse } from "next/server"
import path from "path"
import { promises as fs } from "fs"
import crypto from "crypto"
import { isAuthorized, CvBodySchema } from "@/lib/server/cv"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const dataDir = path.join(process.cwd(), "data", "cv")
const unauthorized = () => NextResponse.json({ error: "Unauthorized" }, { status: 401 })
const errorMessage = (err: unknown) => (err instanceof Error ? err.message : undefined)

async function ensureDir() {
  await fs.mkdir(dataDir, { recursive: true })
}

export async function GET(req: Request) {
  try {
    if (!isAuthorized(req)) return unauthorized()
    await ensureDir()
    const files = await fs.readdir(dataDir).catch(() => [])
    const docs: Array<{ id: string; createdAt: number; updatedAt: number; name?: string; timestamp: number; sectionsCount: number }> = []
    for (const f of files) {
      if (!f.endsWith(".json")) continue
      try {
        const raw = await fs.readFile(path.join(dataDir, f), "utf-8")
        const doc = JSON.parse(raw)
        // Only include documents that have been manually saved and named
        if (doc?.current?.name) {
          docs.push({
            id: doc.id,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
            name: doc.current?.name,
            timestamp: doc.current?.timestamp,
            sectionsCount: Array.isArray(doc.current?.resume?.sections) ? doc.current.resume.sections.length : 0,
          })
        }
      } catch {}
    }
    docs.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0))
    return NextResponse.json({ documents: docs })
  } catch (err) {
    return NextResponse.json({ error: errorMessage(err) || "Failed to list documents" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    if (!isAuthorized(req)) return unauthorized()

    const parsed = CvBodySchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 })
    }
    const { resume, settings, name, resumeHistory } = parsed.data

    await ensureDir()
    const id = crypto.randomUUID()
    const now = Date.now()

    const snapshot: Record<string, unknown> = {
      id: crypto.randomUUID(),
      timestamp: now,
      name: name || undefined,
      resume: { header: resume.header, sections: resume.sections },
      settings: settings ?? {},
    }
    if (resumeHistory && Array.isArray(resumeHistory.past) && Array.isArray(resumeHistory.future)) {
      snapshot.editHistory = { past: resumeHistory.past.slice(-50), future: resumeHistory.future.slice(-50) }
    }

    const doc = { id, createdAt: now, updatedAt: now, current: snapshot, history: [] }
    await fs.writeFile(path.join(dataDir, `${id}.json`), JSON.stringify(doc, null, 2), "utf-8")
    return NextResponse.json({ id, doc })
  } catch (err) {
    return NextResponse.json({ error: errorMessage(err) || "Failed to create CV" }, { status: 500 })
  }
}
