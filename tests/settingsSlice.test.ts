import { describe, it, expect } from "vitest"
import reducer, { setTemplate, toggleBranding, setPrimaryColor } from "@/lib/features/settings/settingsSlice"

const init = () => reducer(undefined, { type: "@@INIT" })

describe("settingsSlice.setTemplate", () => {
  it("applies a classic colour variant's baseline (accent, margins, heading)", () => {
    const s = reducer(init(), setTemplate({ template: "classic-navy" }))
    expect(s.template).toBe("classic-navy")
    expect(s.primaryColor).toBe("#22405c")
    expect(s.pageMargins).toBe(40)
    expect(s.sectionSpacing).toBe(22)
    expect(s.headingColor).toBe("#1f2937")
  })

  it("applies the sidebar background for sidebar templates", () => {
    const s = reducer(init(), setTemplate({ template: "left-sidebar" }))
    expect(s.template).toBe("left-sidebar")
    expect(s.leftSidebarBgColor).toBe("#22405c")
  })
})

describe("settingsSlice basic reducers", () => {
  it("toggles branding", () => {
    const s0 = init()
    const s1 = reducer(s0, toggleBranding())
    expect(s1.branding).toBe(!s0.branding)
  })

  it("sets the primary color", () => {
    const s = reducer(init(), setPrimaryColor("#abcdef"))
    expect(s.primaryColor).toBe("#abcdef")
  })
})
