"use client"
import { useRef } from "react"
import { cn } from "@/lib/utils"
import EditableText from "@/components/Shared/editable-text"
import { useDispatch, useSelector } from "react-redux"
import { updateSectionContent } from "@/lib/features/resume/resumeSlice"
import type { SectionProps, BookSectionItem } from "@/lib/types"
import { RootState } from "@/lib/store"
import { BookOpen } from "lucide-react"

export default function BooksSection({ section, isActive, darkMode = false, handleEntryToggle, handleContextMenu }: SectionProps) {
  const dispatch = useDispatch()
  const activeSection = useSelector((s: RootState) => s.resume.activeSection)
  const items = section.content.books ?? []
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({})

  const updateItem = (id: string, patch: Partial<BookSectionItem>) => {
    const next = items.map((i) => (i.id === id ? { ...i, ...patch } : i))
    dispatch(updateSectionContent({ sectionId: section.id, content: { ...section.content, books: next } }))
  }

  const handleCoverChange = (id: string, file?: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => updateItem(id, { coverUrl: String(reader.result) })
    reader.readAsDataURL(file)
  }

  return (
    <div className="Books-Section grid grid-cols-3 gap-4">
      {items.map((b) => (
        <div
          key={b.id}
          className={cn(
            "resume-item-holder p-2 -mx-1 group/entry text-center",
            isActive && activeSection?.entryId === b.id ? "selected-resume-item p-[7px]" : "",
            darkMode && section.column === "right" && isActive && "!bg-[#ffffff1f]"
          )}
          onContextMenu={(e) => handleContextMenu(e, b.id)}
          onClick={(e) => handleEntryToggle(e, b.id)}
        >
          {b.visibility?.cover !== false && (
            <>
              <div
                className="mx-auto mb-2 w-20 h-28 rounded-sm overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer text-gray-400"
                onClick={(e) => { e.stopPropagation(); fileInputs.current[b.id]?.click() }}
              >
                {b.coverUrl ? (
                  <img src={b.coverUrl} alt={b.title} className="w-full h-full object-cover" />
                ) : (
                  <BookOpen size={20} />
                )}
              </div>
              <input
                ref={(el) => { fileInputs.current[b.id] = el }}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleCoverChange(b.id, e.target.files?.[0])}
              />
            </>
          )}
          <EditableText
            value={b.title}
            onChange={(value) => updateItem(b.id, { title: value })}
            className={cn("editable-field font-medium text-center !w-full", darkMode && section.column === "right" && "!text-white")}
            placeholder="Book title"
          />
          {b.visibility?.author !== false && (
            <EditableText
              value={b.author}
              onChange={(value) => updateItem(b.id, { author: value })}
              className={cn("editable-field para-text-field text-center !w-full", darkMode && section.column === "right" && "!text-white")}
              placeholder="Author"
            />
          )}
        </div>
      ))}
    </div>
  )
}
