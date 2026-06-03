// Per-template baseline settings. A template defines a layout family plus
// baseline spacing and accent colors that are applied when the user picks it.
// Color "variants" (e.g. classic-navy) share a layout but seed a different
// accent/heading color; users can still recolor afterwards via the Design panel.

export type TemplateLayout =
  | "double-column"
  | "elegant"
  | "left-sidebar"
  | "classic"

export type TemplateDefaults = {
  layout: TemplateLayout
  baseFontSizeRem: number
  baseLineHeight: number
  pageMargins: number
  sectionSpacing: number
  headingColor: string
  primaryColor?: string
  sidebar?: {
    widthPx: number
    bgColor: string
    textColor: string
    position: "left" | "right"
  }
}

const DEFAULTS: Record<string, TemplateDefaults> = {
  "double-column": {
    layout: "double-column",
    baseFontSizeRem: 1,
    baseLineHeight: 1.4,
    pageMargins: 36,
    sectionSpacing: 24,
    headingColor: "#3e3e3e",
  },
  elegant: {
    layout: "elegant",
    baseFontSizeRem: 1,
    baseLineHeight: 1.4,
    pageMargins: 12, // tighter margins by design
    sectionSpacing: 22, // slightly tighter spacing
    headingColor: "#3e3e3e",
    sidebar: {
      widthPx: 220,
      bgColor: "#22405c",
      textColor: "#ffffff",
      position: "right",
    },
  },
  "left-sidebar": {
    layout: "left-sidebar",
    baseFontSizeRem: 1,
    baseLineHeight: 1.4,
    pageMargins: 36,
    sectionSpacing: 24,
    headingColor: "#3e3e3e",
    sidebar: {
      widthPx: 240,
      bgColor: "#22405c",
      textColor: "#ffffff",
      position: "left",
    },
  },
  // Classic single-column variants. Same layout, different accent colors.
  "classic-teal": {
    layout: "classic",
    baseFontSizeRem: 1,
    baseLineHeight: 1.4,
    pageMargins: 40,
    sectionSpacing: 22,
    headingColor: "#1f2937",
    primaryColor: "#0e9488",
  },
  "classic-navy": {
    layout: "classic",
    baseFontSizeRem: 1,
    baseLineHeight: 1.4,
    pageMargins: 40,
    sectionSpacing: 22,
    headingColor: "#1f2937",
    primaryColor: "#22405c",
  },
  "classic-burgundy": {
    layout: "classic",
    baseFontSizeRem: 1,
    baseLineHeight: 1.4,
    pageMargins: 40,
    sectionSpacing: 22,
    headingColor: "#1f2937",
    primaryColor: "#7b1f3a",
  },
  "classic-charcoal": {
    layout: "classic",
    baseFontSizeRem: 1,
    baseLineHeight: 1.4,
    pageMargins: 40,
    sectionSpacing: 22,
    headingColor: "#1f2937",
    primaryColor: "#374151",
  },
}

export function getTemplateDefaults(key: string): TemplateDefaults | undefined {
  return DEFAULTS[key]
}

// Resolve the layout family for a template id, falling back to double-column.
export function getTemplateLayout(key: string): TemplateLayout {
  return DEFAULTS[key]?.layout ?? "double-column"
}
