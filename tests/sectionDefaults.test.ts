import { describe, it, expect } from "vitest"
import { getDefaultSection, getDefaultEntry } from "@/lib/utils/sectionDefaults"
import { SectionTypeEnum } from "@/lib/types"

describe("getDefaultSection", () => {
  it("builds an Awards section seeded with entries under the matching content key", () => {
    const s = getDefaultSection(SectionTypeEnum.AWARDS, "left", "AWARDS")
    expect(s).not.toBeNull()
    expect(s!.type).toBe(SectionTypeEnum.AWARDS)
    expect(s!.column).toBe("left")
    expect(Array.isArray(s!.content.awards)).toBe(true)
    expect(s!.content.awards!.length).toBeGreaterThan(0)
  })

  it("builds a References section", () => {
    const s = getDefaultSection(SectionTypeEnum.REFERENCES, "right", "REFERENCES")
    expect(s!.content.references!.length).toBeGreaterThan(0)
  })

  it("builds a single-entry Signature section", () => {
    const s = getDefaultSection(SectionTypeEnum.SIGNATURE, "left", "SIGNATURE")
    expect(s!.content.signature!.length).toBe(1)
  })
})

describe("getDefaultEntry", () => {
  it("returns null for an unknown section type", () => {
    expect(getDefaultEntry("not-a-section" as SectionTypeEnum)).toBeNull()
  })
})
