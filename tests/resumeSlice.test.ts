import { describe, it, expect } from "vitest"
import reducer, { addSection, removeSection, reorderSections, updateSectionContent } from "@/lib/features/resume/resumeSlice"
import { getDefaultSection } from "@/lib/utils/sectionDefaults"
import { SectionTypeEnum, type AwardSectionItem } from "@/lib/types"

const init = () => reducer(undefined, { type: "@@INIT" })

describe("resumeSlice sections", () => {
  it("adds a section to the requested column", () => {
    const s0 = init()
    const before = s0.sections.length
    const section = getDefaultSection(SectionTypeEnum.AWARDS, "left", "AWARDS")!
    const s1 = reducer(s0, addSection({ section, column: "right" }))
    expect(s1.sections.length).toBe(before + 1)
    expect(s1.sections[s1.sections.length - 1].column).toBe("right")
  })

  it("removes a section by id", () => {
    const s0 = init()
    const id = s0.sections[0].id
    const s1 = reducer(s0, removeSection({ sectionId: id }))
    expect(s1.sections.find((x) => x.id === id)).toBeUndefined()
  })

  it("reorders sections", () => {
    const s0 = init()
    const reversed = [...s0.sections].reverse()
    const s1 = reducer(s0, reorderSections({ sections: reversed }))
    expect(s1.sections.map((x) => x.id)).toEqual(reversed.map((x) => x.id))
  })

  it("updates section content generically", () => {
    const s0 = init()
    const section = getDefaultSection(SectionTypeEnum.AWARDS, "left", "AWARDS")!
    const added = reducer(s0, addSection({ section, column: "left" }))
    const target = added.sections[added.sections.length - 1]
    const newAwards: AwardSectionItem[] = [{ id: "a1", title: "Test Award", issuer: "X", icon: "award" }]
    const s1 = reducer(added, updateSectionContent({ sectionId: target.id, content: { ...target.content, awards: newAwards } }))
    const updated = s1.sections.find((x) => x.id === target.id)!
    expect(updated.content.awards).toEqual(newAwards)
  })
})
