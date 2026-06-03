"use client"
import { cn } from "@/lib/utils"
import EditableText from "@/components/Shared/editable-text"
import { useDispatch, useSelector } from "react-redux"
import { updateSectionContent } from "@/lib/features/resume/resumeSlice"
import type { SectionProps, CustomSectionItem } from "@/lib/types"
import { RootState } from "@/lib/store"
import SectionIcon from "@/components/Sections/Shared/section-icon"

export default function CustomSection({ section, isActive, darkMode = false, handleEntryToggle, handleContextMenu }: SectionProps) {
  const dispatch = useDispatch()
  const activeSection = useSelector((s: RootState) => s.resume.activeSection)
  const { primaryColor } = useSelector((s: RootState) => s.settings)
  const items = section.content.custom ?? []

  const updateItem = (id: string, patch: Partial<CustomSectionItem>) => {
    const next = items.map((i) => (i.id === id ? { ...i, ...patch } : i))
    dispatch(updateSectionContent({ sectionId: section.id, content: { ...section.content, custom: next } }))
  }

  return (
    <div className="Custom-Section space-y-4">
      {items.map((c) => (
        <div
          key={c.id}
          className={cn(
            "resume-item-holder p-2 -mx-2 group/entry flex items-start",
            isActive && activeSection?.entryId === c.id ? "selected-resume-item p-[7px]" : "",
            darkMode && section.column === "right" && isActive && "!bg-[#ffffff1f]"
          )}
          onContextMenu={(e) => handleContextMenu(e, c.id)}
          onClick={(e) => handleEntryToggle(e, c.id)}
        >
          {c.visibility?.icon !== false && (
            <div className="rounded-full p-2 mr-3 flex-shrink-0" style={{ backgroundColor: `${primaryColor}22`, color: primaryColor }}>
              <SectionIcon name={c.icon} size={16} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <EditableText
                value={c.title}
                onChange={(value) => updateItem(c.id, { title: value })}
                className={cn("editable-field font-medium", darkMode && section.column === "right" && "!text-white")}
                placeholder="Title"
              />
              {c.visibility?.period !== false && (
                <EditableText
                  value={c.period}
                  onChange={(value) => updateItem(c.id, { period: value })}
                  className={cn("editable-field para-text-field text-right", darkMode && section.column === "right" && "!text-white")}
                  placeholder="Date period"
                />
              )}
            </div>
            {c.visibility?.subtitle !== false && (
              <EditableText
                value={c.subtitle}
                onChange={(value) => updateItem(c.id, { subtitle: value })}
                className={cn("editable-field", darkMode && section.column === "right" && "!text-white")}
                style={{ color: darkMode && section.column === "right" ? undefined : primaryColor }}
                placeholder="Subtitle"
              />
            )}
            {c.visibility?.description !== false && (
              <EditableText
                value={c.description}
                onChange={(value) => updateItem(c.id, { description: value })}
                className={cn("editable-field para-text-field !w-full text-left pt-1", darkMode && section.column === "right" && "!text-white")}
                multiline
                placeholder="Short description"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
