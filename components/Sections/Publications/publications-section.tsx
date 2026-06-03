"use client"
import { cn } from "@/lib/utils"
import EditableText from "@/components/Shared/editable-text"
import { useDispatch, useSelector } from "react-redux"
import { updateSectionContent } from "@/lib/features/resume/resumeSlice"
import type { SectionProps, PublicationSectionItem } from "@/lib/types"
import { RootState } from "@/lib/store"
import { Link as LinkIcon } from "lucide-react"

export default function PublicationsSection({ section, isActive, darkMode = false, handleEntryToggle, handleContextMenu }: SectionProps) {
  const dispatch = useDispatch()
  const activeSection = useSelector((s: RootState) => s.resume.activeSection)
  const { primaryColor } = useSelector((s: RootState) => s.settings)
  const items = section.content.publications ?? []

  const updateItem = (id: string, patch: Partial<PublicationSectionItem>) => {
    const next = items.map((i) => (i.id === id ? { ...i, ...patch } : i))
    dispatch(updateSectionContent({ sectionId: section.id, content: { ...section.content, publications: next } }))
  }

  return (
    <div className="Publications-Section space-y-4">
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
            value={p.title}
            onChange={(value) => updateItem(p.id, { title: value })}
            className={cn("editable-field font-medium", darkMode && section.column === "right" && "!text-white")}
            placeholder="Publication title"
          />

          {p.visibility?.publisher !== false && (
            <EditableText
              value={p.publisher}
              onChange={(value) => updateItem(p.id, { publisher: value })}
              className={cn("editable-field", darkMode && section.column === "right" && "!text-white")}
              style={{ color: darkMode && section.column === "right" ? undefined : primaryColor }}
              placeholder="Publisher"
            />
          )}

          <div className="flex items-center gap-3 text-sm text-gray-500">
            {p.visibility?.period !== false && (
              <EditableText
                value={p.period}
                onChange={(value) => updateItem(p.id, { period: value })}
                className={cn("editable-field para-text-field", darkMode && section.column === "right" && "!text-white")}
                placeholder="Date period"
              />
            )}
            {p.visibility?.link !== false && (
              <div className="flex items-center gap-1 min-w-0">
                <LinkIcon size={12} className="flex-shrink-0" />
                <EditableText
                  value={p.link}
                  onChange={(value) => updateItem(p.id, { link: value })}
                  className={cn("editable-field para-text-field", darkMode && section.column === "right" && "!text-white")}
                  placeholder="Link"
                />
              </div>
            )}
          </div>

          {p.visibility?.description !== false && (
            <EditableText
              value={p.description}
              onChange={(value) => updateItem(p.id, { description: value })}
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
