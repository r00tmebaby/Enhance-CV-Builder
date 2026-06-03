import { defineConfig } from "vitest/config"
import path from "node:path"

export default defineConfig({
  resolve: {
    // Mirror the "@/*" path alias from tsconfig so tests can import app modules.
    alias: { "@": path.resolve(".") },
  },
  // Tests cover pure logic only; skip the app's Tailwind/PostCSS pipeline.
  css: { postcss: { plugins: [] } },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    css: false,
  },
})
