import { describe, it, expect, afterEach } from "vitest"
import { isValidId, CvBodySchema, PatchBodySchema, withLock, isAuthorized } from "@/lib/server/cv"

describe("isValidId", () => {
  it("accepts UUIDs and rejects everything else", () => {
    expect(isValidId("00000000-0000-0000-0000-000000000000")).toBe(true)
    expect(isValidId("not-a-uuid")).toBe(false)
    expect(isValidId("../../etc/passwd")).toBe(false)
    expect(isValidId("")).toBe(false)
  })
})

describe("CvBodySchema", () => {
  const valid = { resume: { header: {}, sections: [] } }
  it("accepts a minimal valid body", () => {
    expect(CvBodySchema.safeParse(valid).success).toBe(true)
  })
  it("rejects a missing header", () => {
    expect(CvBodySchema.safeParse({ resume: { sections: [] } }).success).toBe(false)
  })
  it("rejects non-array sections", () => {
    expect(CvBodySchema.safeParse({ resume: { header: {}, sections: "nope" } }).success).toBe(false)
  })
  it("allows optional name/snapshot/settings", () => {
    expect(CvBodySchema.safeParse({ ...valid, name: "My CV", snapshot: true, settings: { template: "elegant" } }).success).toBe(true)
  })
})

describe("PatchBodySchema", () => {
  it("accepts known actions and rejects unknown", () => {
    expect(PatchBodySchema.safeParse({ action: "rename", snapshotId: "x", name: "y" }).success).toBe(true)
    expect(PatchBodySchema.safeParse({ action: "explode" }).success).toBe(false)
  })
})

describe("withLock", () => {
  it("serializes operations sharing a key", async () => {
    const order: number[] = []
    const p1 = withLock("k", async () => { await new Promise((r) => setTimeout(r, 20)); order.push(1) })
    const p2 = withLock("k", async () => { order.push(2) })
    await Promise.all([p1, p2])
    expect(order).toEqual([1, 2])
  })
})

describe("isAuthorized", () => {
  afterEach(() => { delete process.env.CV_API_TOKEN })
  const reqWith = (auth?: string) => new Request("http://x", auth ? { headers: { authorization: auth } } : undefined)

  it("is open when no token is configured", () => {
    expect(isAuthorized(reqWith())).toBe(true)
  })
  it("requires a matching bearer token when configured", () => {
    process.env.CV_API_TOKEN = "secret"
    expect(isAuthorized(reqWith("Bearer secret"))).toBe(true)
    expect(isAuthorized(reqWith("Bearer wrong"))).toBe(false)
    expect(isAuthorized(reqWith())).toBe(false)
  })
})
