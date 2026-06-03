"use client"
import { cn } from "@/lib/utils"
import EditableText from "@/components/Shared/editable-text"
import { useDispatch, useSelector } from "react-redux"
import { updateSectionContent } from "@/lib/features/resume/resumeSlice"
import type { SectionProps, PhilosophyItem } from "@/lib/types"
import { RootState } from "@/lib/store"

export default function PhilosophySection({ section, isActive, darkMode = false, handleEntryToggle, handleContextMenu }: SectionProps) {
  const dispatch = useDispatch()
  const activeSection = useSelector((s: RootState) => s.resume.activeSection)
  const { primaryColor } = useSelector((s: RootState) => s.settings)
  const items = section.content.philosophy ?? []

  const updateItem = (id: string, patch: Partial<PhilosophyItem>) => {
    const next = items.map((i) => (i.id === id ? { ...i, ...patch } : i))
    dispatch(updateSectionContent({ sectionId: section.id, content: { ...section.content, philosophy: next } }))
  }

  return (
    <div className="Philosophy-Section space-y-4">
      {items.map((p) => (
        <div
          key={p.id}
          className={cn(
            "resume-item-holder p-2 -mx-2 group/entry",
            isActive && activeSection?.entryId === p.id ? "selected-resume-item p-[7px]" : "",
            darkMode && section.column === "right" && isActive && "!bg-[#ffffff1f]"
          )}
          onContextMenu={(e) => handleContextMenu(e, p.id)}
          onClick={(e) => handleEntryToggle(e, p.id)}
        >
          <EditableText
            value={p.quote}
            onChange={(value) => updateItem(p.id, { quote: value })}
            className={cn("editable-field font-semibold italic", darkMode && section.column === "right" && "!text-white")}
            style={{ color: darkMode && section.column === "right" ? undefined : primaryColor }}
            multiline
            placeholder="Your guiding quote"
          />
          {p.visibility?.author !== false && (
            <EditableText
              value={p.author}
              onChange={(value) => updateItem(p.id, { author: value })}
              className={cn("editable-field para-text-field text-right !w-full", darkMode && section.column === "right" && "!text-white")}
              placeholder="Author"
            />
          )}
        </div>
      ))}
    </div>
  )
}
