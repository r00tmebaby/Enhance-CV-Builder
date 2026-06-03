"use client"
import { cn } from "@/lib/utils"
import EditableText from "@/components/Shared/editable-text"
import { useDispatch, useSelector } from "react-redux"
import { updateSectionContent } from "@/lib/features/resume/resumeSlice"
import type { SectionProps, ReferenceSectionItem } from "@/lib/types"
import { RootState } from "@/lib/store"

export default function ReferencesSection({ section, isActive, darkMode = false, handleEntryToggle, handleContextMenu }: SectionProps) {
  const dispatch = useDispatch()
  const activeSection = useSelector((s: RootState) => s.resume.activeSection)
  const items = section.content.references ?? []

  const updateItem = (id: string, patch: Partial<ReferenceSectionItem>) => {
    const next = items.map((i) => (i.id === id ? { ...i, ...patch } : i))
    dispatch(updateSectionContent({ sectionId: section.id, content: { ...section.content, references: next } }))
  }

  return (
    <div className="References-Section grid grid-cols-2 gap-x-6 gap-y-4">
      {items.map((r) => (
        <div
          key={r.id}
          className={cn(
            "resume-item-holder p-2 -mx-2 group/entry",
            isActive && activeSection?.entryId === r.id ? "selected-resume-item p-[7px]" : "",
            darkMode && section.column === "right" && isActive && "!bg-[#ffffff1f]"
          )}
          onContextMenu={(e) => handleContextMenu(e, r.id)}
          onClick={(e) => handleEntryToggle(e, r.id)}
        >
          <EditableText
            value={r.name}
            onChange={(value) => updateItem(r.id, { name: value })}
            className={cn("editable-field font-medium", darkMode && section.column === "right" && "!text-white")}
            placeholder="Reference name"
          />
          {r.visibility?.company !== false && (
            <EditableText
              value={r.company}
              onChange={(value) => updateItem(r.id, { company: value })}
              className={cn("editable-field para-text-field !w-full text-left", darkMode && section.column === "right" && "!text-white")}
              placeholder="Company"
            />
          )}
          {r.visibility?.email !== false && (
            <EditableText
              value={r.email}
              onChange={(value) => updateItem(r.id, { email: value })}
              className={cn("editable-field para-text-field !w-full text-left", darkMode && section.column === "right" && "!text-white")}
              placeholder="Email"
            />
          )}
          {r.visibility?.phone !== false && (
            <EditableText
              value={r.phone}
              onChange={(value) => updateItem(r.id, { phone: value })}
              className={cn("editable-field para-text-field !w-full text-left", darkMode && section.column === "right" && "!text-white")}
              placeholder="Phone"
            />
          )}
        </div>
      ))}
    </div>
  )
}
