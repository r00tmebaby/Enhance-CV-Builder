"use client"
import { cn } from "@/lib/utils"
import EditableText from "@/components/Shared/editable-text"
import { useDispatch, useSelector } from "react-redux"
import { updateSectionContent } from "@/lib/features/resume/resumeSlice"
import type { SectionProps, TrainingSectionItem } from "@/lib/types"
import { RootState } from "@/lib/store"

export default function TrainingSection({ section, isActive, darkMode = false, handleEntryToggle, handleContextMenu }: SectionProps) {
  const dispatch = useDispatch()
  const activeSection = useSelector((s: RootState) => s.resume.activeSection)
  const { primaryColor } = useSelector((s: RootState) => s.settings)
  const items = section.content.training ?? []

  const updateItem = (id: string, patch: Partial<TrainingSectionItem>) => {
    const next = items.map((i) => (i.id === id ? { ...i, ...patch } : i))
    dispatch(updateSectionContent({ sectionId: section.id, content: { ...section.content, training: next } }))
  }

  return (
    <div className="Training-Section space-y-4">
      {items.map((t) => (
        <div
          key={t.id}
          className={cn(
            "resume-item-holder p-2 -mx-2 group/entry",
            isActive && activeSection?.entryId === t.id ? "selected-resume-item p-[7px]" : "",
            darkMode && section.column === "right" && isActive && "!bg-[#ffffff1f]"
          )}
          onContextMenu={(e) => handleContextMenu(e, t.id)}
          onClick={(e) => handleEntryToggle(e, t.id)}
        >
          <div className="flex items-start justify-between">
            <EditableText
              value={t.title}
              onChange={(value) => updateItem(t.id, { title: value })}
              className={cn("editable-field", darkMode && section.column === "right" && "!text-white")}
              placeholder="Course / Training"
            />
            {t.visibility?.period !== false && (
              <EditableText
                value={t.period}
                onChange={(value) => updateItem(t.id, { period: value })}
                className={cn("editable-field para-text-field text-right", darkMode && section.column === "right" && "!text-white")}
                placeholder="Date period"
              />
            )}
          </div>

          {t.visibility?.institution !== false && (
            <EditableText
              value={t.institution}
              onChange={(value) => updateItem(t.id, { institution: value })}
              className={cn("editable-field", darkMode && section.column === "right" && "!text-white")}
              style={{ color: darkMode && section.column === "right" ? undefined : primaryColor }}
              placeholder="Institution"
            />
          )}

          {t.visibility?.description !== false && (
            <EditableText
              value={t.description}
              onChange={(value) => updateItem(t.id, { description: value })}
              className={cn("editable-field para-text-field !w-full text-left", darkMode && section.column === "right" && "!text-white")}
              multiline
              placeholder="Short description"
            />
          )}
        </div>
      ))}
    </div>
  )
}
