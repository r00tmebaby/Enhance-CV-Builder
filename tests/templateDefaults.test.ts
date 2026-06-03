import { describe, it, expect } from "vitest"
import { getTemplateLayout, getTemplateDefaults } from "@/lib/features/settings/templateDefaults"

describe("templateDefaults", () => {
  it("resolves layout families for colour variants and falls back safely", () => {
    expect(getTemplateLayout("classic-teal")).toBe("classic")
    expect(getTemplateLayout("classic-navy")).toBe("classic")
    expect(getTemplateLayout("elegant")).toBe("elegant")
    expect(getTemplateLayout("left-sidebar")).toBe("left-sidebar")
    expect(getTemplateLayout("does-not-exist")).toBe("double-column")
  })

  it("exposes the accent colour for each classic variant", () => {
    expect(getTemplateDefaults("classic-teal")?.primaryColor).toBe("#0e9488")
    expect(getTemplateDefaults("classic-navy")?.primaryColor).toBe("#22405c")
    expect(getTemplateDefaults("classic-burgundy")?.primaryColor).toBe("#7b1f3a")
    expect(getTemplateDefaults("classic-charcoal")?.primaryColor).toBe("#374151")
  })

  it("returns undefined for an unknown template", () => {
    expect(getTemplateDefaults("nope")).toBeUndefined()
  })
})
