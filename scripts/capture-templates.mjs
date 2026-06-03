// One-off utility: renders each live resume template and saves a screenshot
// into public/templates so the picker previews match what actually renders.
// Run with the dev server up: node scripts/capture-templates.mjs
import { chromium } from "playwright"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, "..", "public", "templates")
const BASE = process.env.BASE_URL || "http://localhost:3000"

// Each template uses a different wrapper element for the rendered A4 page.
const targets = [
  { id: "double-column", name: "Double Column", file: "Double Column.png", selector: ".resume-page" },
  { id: "elegant", name: "Elegant", file: "Elegent.png", selector: "#resume-container > div" },
  { id: "left-sidebar", name: "Left Sidebar", file: "modern.png", selector: "#resume-container > div" },
  { id: "classic-teal", name: "Classic Teal", file: "classic-teal.png", selector: ".resume-page" },
  { id: "classic-navy", name: "Classic Navy", file: "classic-navy.png", selector: ".resume-page" },
  { id: "classic-burgundy", name: "Classic Burgundy", file: "classic-burgundy.png", selector: ".resume-page" },
  { id: "classic-charcoal", name: "Classic Charcoal", file: "classic-charcoal.png", selector: ".resume-page" },
]

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1600, height: 1600 }, deviceScaleFactor: 2 })
await page.goto(BASE, { waitUntil: "networkidle", timeout: 60000 })
await page.waitForTimeout(2500)

// The fixed left toolbar and right Design panel overlap the page; hide them only
// while capturing. This selector doesn't match the Templates dialog markup.
const HIDE_PANELS = '[class*="md:left-0"],[class*="md:right-0"]{display:none !important}'

for (const t of targets) {
  await page.getByRole("button", { name: "Templates" }).click()
  await page.waitForSelector("[role=dialog]")
  await page.locator("[role=dialog]").getByText(t.name, { exact: true }).click()
  await page.waitForSelector("[role=dialog]", { state: "hidden" })

  // Let the template re-render and any pagination measuring settle.
  await page.waitForTimeout(1500)

  const styleTag = await page.addStyleTag({ content: HIDE_PANELS })
  const el = page.locator(t.selector).first()
  await el.waitFor({ state: "visible", timeout: 15000 })
  await page.waitForTimeout(300)
  await el.screenshot({ path: join(outDir, t.file) })
  await styleTag.evaluate((node) => node.remove())
  console.log("captured", t.file)
}

await browser.close()
console.log("done")
