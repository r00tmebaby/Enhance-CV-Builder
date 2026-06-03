"use client"
import { cn } from "@/lib/utils"
import EditableText from "@/components/Shared/editable-text"
import { useDispatch, useSelector } from "react-redux"
import { updateSectionContent } from "@/lib/features/resume/resumeSlice"
import type { SectionProps, StrengthSectionItem } from "@/lib/types"
import { RootState } from "@/lib/store"
import SectionIcon from "@/components/Sections/Shared/section-icon"

export default function StrengthsSection({ section, isActive, darkMode = false, handleEntryToggle, handleContextMenu }: SectionProps) {
  const dispatch = useDispatch()
  const activeSection = useSelector((s: RootState) => s.resume.activeSection)
  const { primaryColor } = useSelector((s: RootState) => s.settings)
  const items = section.content.strengths ?? []

  const updateItem = (id: string, patch: Partial<StrengthSectionItem>) => {
    const next = items.map((i) => (i.id === id ? { ...i, ...patch } : i))
    dispatch(updateSectionContent({ sectionId: section.id, content: { ...section.content, strengths: next } }))
  }

  return (
    <div className="Strengths-Section space-y-4">
      {items.map((st) => (
        <div
          key={st.id}
          className={cn(
            "resume-item-holder p-2 -mx-2 group/entry flex items-start",
            isActive && activeSection?.entryId === st.id ? "selected-resume-item p-[7px]" : "",
            darkMode && section.column === "right" && isActive && "!bg-[#ffffff1f]"
          )}
          onContextMenu={(e) => handleContextMenu(e, st.id)}
          onClick={(e) => handleEntryToggle(e, st.id)}
        >
          {st.visibility?.icon !== false && (
            <div className="rounded-full p-2 mr-3 flex-shrink-0" style={{ backgroundColor: `${primaryColor}22`, color: primaryColor }}>
              <SectionIcon name={st.icon} size={16} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <EditableText
              value={st.title}
              onChange={(value) => updateItem(st.id, { title: value })}
              className={cn("editable-field font-medium", darkMode && section.column === "right" && "!text-white")}
              placeholder="Strength"
            />
            {st.visibility?.description !== false && (
              <EditableText
                value={st.description}
                onChange={(value) => updateItem(st.id, { description: value })}
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
