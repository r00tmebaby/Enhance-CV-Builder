"use client"
import { useRef } from "react"
import { cn } from "@/lib/utils"
import { useDispatch, useSelector } from "react-redux"
import { updateSectionContent } from "@/lib/features/resume/resumeSlice"
import type { SectionProps, SignatureItem } from "@/lib/types"
import { RootState } from "@/lib/store"
import { PenLine } from "lucide-react"

export default function SignatureSection({ section, isActive, handleEntryToggle, handleContextMenu }: SectionProps) {
  const dispatch = useDispatch()
  const activeSection = useSelector((s: RootState) => s.resume.activeSection)
  const item = (section.content.signature ?? [])[0]
  const fileInput = useRef<HTMLInputElement | null>(null)

  if (!item) return null

  const updateItem = (patch: Partial<SignatureItem>) => {
    dispatch(updateSectionContent({ sectionId: section.id, content: { ...section.content, signature: [{ ...item, ...patch }] } }))
  }

  const handleImageChange = (file?: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => updateItem({ imageUrl: String(reader.result) })
    reader.readAsDataURL(file)
  }

  return (
    <div className="Signature-Section">
      <div
        className={cn(
          "resume-item-holder p-2 -mx-2 group/entry",
          isActive && activeSection?.entryId === item.id ? "selected-resume-item p-[7px]" : ""
        )}
        onContextMenu={(e) => handleContextMenu(e, item.id)}
        onClick={(e) => handleEntryToggle(e, item.id)}
      >
        <div
          className="inline-flex items-center justify-center cursor-pointer text-gray-400"
          onClick={(e) => { e.stopPropagation(); fileInput.current?.click() }}
        >
          {item.imageUrl ? (
            <img src={item.imageUrl} alt="Signature" style={{ width: `${item.width}px` }} className="h-auto object-contain" />
          ) : (
            <span className="inline-flex items-center gap-2 border border-dashed border-gray-300 rounded-md px-4 py-3">
              <PenLine size={16} /> Upload signature
            </span>
          )}
        </div>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImageChange(e.target.files?.[0])}
        />
      </div>
    </div>
  )
}
