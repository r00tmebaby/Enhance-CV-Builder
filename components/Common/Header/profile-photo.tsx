"use client"

import type React from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { updateHeaderPhotoLayout } from "@/lib/features/resume/resumeSlice"
import { cn } from "@/lib/utils"
import { Camera } from "lucide-react"

interface ProfilePhotoProps {
  defaultSize: number
  className?: string
}

// Renders the profile photo and, when "Move / resize photo" is enabled in the
// header settings, lets the user drag to move, drag a corner to resize, and
// Shift+drag to pan the image inside its frame. When empty it shows nothing in
// the actual CV - only an upload placeholder revealed on hover of a parent
// marked with the `group/photobox` class.
export default function ProfilePhoto({ defaultSize, className }: ProfilePhotoProps) {
  const dispatch = useDispatch()
  const header = useSelector((s: RootState) => s.resume.header)
  const editMode = useSelector((s: RootState) => s.settings.photoPositioning)

  const size = header.photoSize ?? defaultSize
  const posX = header.photoPosX ?? 0
  const posY = header.photoPosY ?? 0
  const offX = header.photoOffsetX ?? 50
  const offY = header.photoOffsetY ?? 50

  const requestUpload = () => window.dispatchEvent(new CustomEvent("openPhotoUpload", {}))

  const startDrag = (e: React.MouseEvent, mode: "move" | "pan") => {
    e.preventDefault(); e.stopPropagation()
    const startX = e.clientX, startY = e.clientY
    const baseX = mode === "move" ? posX : offX
    const baseY = mode === "move" ? posY : offY
    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX, dy = ev.clientY - startY
      if (mode === "move") {
        dispatch(updateHeaderPhotoLayout({ photoPosX: Math.round(baseX + dx), photoPosY: Math.round(baseY + dy) }))
      } else {
        const nx = Math.max(0, Math.min(100, baseX - (dx / size) * 100))
        const ny = Math.max(0, Math.min(100, baseY - (dy / size) * 100))
        dispatch(updateHeaderPhotoLayout({ photoOffsetX: Math.round(nx), photoOffsetY: Math.round(ny) }))
      }
    }
    const onUp = () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    const startX = e.clientX
    const base = size
    const onMove = (ev: MouseEvent) => {
      const next = Math.max(48, Math.min(420, Math.round(base + (ev.clientX - startX))))
      dispatch(updateHeaderPhotoLayout({ photoSize: next }))
    }
    const onUp = () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }

  const onBodyMouseDown = (e: React.MouseEvent) => {
    if (!editMode) return
    startDrag(e, e.shiftKey ? "pan" : "move")
  }

  const onBodyClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (editMode) return // editing: a click shouldn't trigger an upload
    requestUpload()
  }

  const frameShape = header.roundPhoto ? "rounded-full" : "rounded-md"

  // Empty and not editing: reveal the upload placeholder only on parent hover.
  if (!header.photoUrl && !editMode) {
    return (
      <div className={cn("hidden group-hover/photobox:block", className)}>
        <div
          className={cn("overflow-hidden bg-gray-200 text-gray-400 flex items-center justify-center cursor-pointer", frameShape)}
          style={{ width: size, height: size }}
          onClick={onBodyClick}
        >
          <Camera size={24} />
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div
        className={cn("relative", editMode && "ring-2 ring-teal-400/80 cursor-move")}
        style={{ width: size, height: size, transform: `translate(${posX}px, ${posY}px)` }}
        onMouseDown={onBodyMouseDown}
        onClick={onBodyClick}
        title={editMode ? "Drag to move - Shift+drag to pan - drag corner to resize" : undefined}
      >
        <div className={cn("w-full h-full overflow-hidden bg-gray-200", frameShape)}>
          {header.photoUrl ? (
            <img
              src={header.photoUrl}
              alt="Profile"
              className="w-full h-full object-cover select-none"
              style={{ objectPosition: `${offX}% ${offY}%` }}
              draggable={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400"><Camera size={24} /></div>
          )}
        </div>
        {editMode && (
          <div
            onMouseDown={startResize}
            className="absolute -bottom-1 -right-1 w-4 h-4 bg-teal-500 rounded-full border-2 border-white cursor-nwse-resize"
            title="Drag to resize"
          />
        )}
      </div>
    </div>
  )
}
