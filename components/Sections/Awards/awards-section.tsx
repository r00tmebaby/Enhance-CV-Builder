"use client"
import { cn } from "@/lib/utils"
import EditableText from "@/components/Shared/editable-text"
import { useDispatch, useSelector } from "react-redux"
import { updateSectionContent } from "@/lib/features/resume/resumeSlice"
import type { SectionProps, AwardSectionItem } from "@/lib/types"
import { RootState } from "@/lib/store"
import SectionIcon from "@/components/Sections/Shared/section-icon"

export default function AwardsSection({ section, isActive, darkMode = false, handleEntryToggle, handleContextMenu }: SectionProps) {
  const dispatch = useDispatch()
  const activeSection = useSelector((s: RootState) => s.resume.activeSection)
  const { primaryColor } = useSelector((s: RootState) => s.settings)
  const items = section.content.awards ?? []

  const updateItem = (id: string, patch: Partial<AwardSectionItem>) => {
    const next = items.map((i) => (i.id === id ? { ...i, ...patch } : i))
    dispatch(updateSectionContent({ sectionId: section.id, content: { ...section.content, awards: next } }))
  }

  return (
    <div className="Awards-Section grid grid-cols-2 gap-x-6 gap-y-4">
      {items.map((a) => (
        <div
          key={a.id}
          className={cn(
            "resume-item-holder p-2 -mx-2 group/entry flex items-start",
            isActive && activeSection?.entryId === a.id ? "selected-resume-item p-[7px]" : "",
            darkMode && section.column === "right" && isActive && "!bg-[#ffffff1f]"
          )}
          onContextMenu={(e) => handleContextMenu(e, a.id)}
          onClick={(e) => handleEntryToggle(e, a.id)}
        >
          {a.visibility?.icon !== false && (
            <div className="rounded-full p-2 mr-3 flex-shrink-0" style={{ backgroundColor: `${primaryColor}22`, color: primaryColor }}>
              <SectionIcon name={a.icon} size={16} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <EditableText
              value={a.title}
              onChange={(value) => updateItem(a.id, { title: value })}
              className={cn("editable-field font-medium", darkMode && section.column === "right" && "!text-white")}
              placeholder="Award title"
            />
            {a.visibility?.issuer !== false && (
              <EditableText
                value={a.issuer}
                onChange={(value) => updateItem(a.id, { issuer: value })}
                className={cn("editable-field para-text-field !w-full text-left", darkMode && section.column === "right" && "!text-white")}
                placeholder="Issuer"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
