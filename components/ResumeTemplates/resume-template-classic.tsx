"use client"

import type React from "react"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import type { Section } from "@/lib/types"
import ResumeHeader from "@/components/resume-header"
import ResumeSection from "@/components/resume-section"
import { cn, resolveFontFamily, getPageBackgroundStyle, getOverlayStyle } from "@/lib/utils"
import { reorderSections, upsertActiveSection } from "@/lib/features/resume/resumeSlice"
import { setOverlayPosition } from "@/lib/features/settings/settingsSlice"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

interface Props { resumeRef: React.RefObject<HTMLDivElement | null> }

// Classic single-column layout: centered header and full-width sections.
// Section-title styling (centered, accent rule) comes from the `.tpl-classic`
// scope in globals.css. Accent colour is driven by the Design panel.
export default function ResumeTemplateClassic({ resumeRef }: Props) {
  const dispatch = useDispatch()
  const activeSection = useSelector((s: RootState) => s.resume.activeSection)
  const { sections } = useSelector((s: RootState) => s.resume)
  const { editorZoom, pageMargins, sectionSpacing, fontSize, lineHeight, fontFamily, pageBackgroundColor, pageBackgroundPattern, pageBackgroundMode, pageBackgroundGradientTo, pageBackgroundGradientAngle, overlayEnabled, overlayImage, overlayOpacity, overlayScale, overlayX, overlayY, overlayPositioning, headingColor, primaryColor } = useSelector((s: RootState) => s.settings)
  const [, setDraggedSection] = useState<string | null>(null)

  const handleHeaderClick = () => dispatch(upsertActiveSection({ activeSection: null }))

  // Single column: render every section in array order regardless of column.
  const handleDragStart = (result: any) => setDraggedSection(result.draggableId)
  const handleDragEnd = (result: any) => {
    setDraggedSection(null)
    if (!result.destination) return
    const ordered = [...sections]
    const [moved] = ordered.splice(result.source.index, 1)
    if (!moved) return
    ordered.splice(result.destination.index, 0, moved)
    dispatch(reorderSections({ sections: ordered }))
  }

  return (
    <div id="resume-container" className={cn("resume-container resume-page-wrapper tpl-classic h-full", activeSection?.id !== null && "resume-editor-overlay-later")} ref={resumeRef}>
      <div
        className="resume-page relative mx-auto bg-white"
        style={{
          transform: `scale(${editorZoom})`,
          transformOrigin: 'top center',
          width: '794px',
          minHeight: '1123px',
          padding: `${pageMargins}px`,
          fontSize: `${fontSize}rem`,
          lineHeight: lineHeight,
          fontFamily: resolveFontFamily(fontFamily),
          ['--resume-heading-color' as any]: headingColor,
          ['--resume-accent-color' as any]: primaryColor,
          ...getPageBackgroundStyle(pageBackgroundColor, pageBackgroundPattern, pageBackgroundMode, pageBackgroundGradientTo, pageBackgroundGradientAngle),
        }}
      >
        <div onClick={handleHeaderClick}>
          <ResumeHeader isActive={activeSection?.id === null} centered />
        </div>

        <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <Droppable droppableId="single-column">
            {(provided) => (
              <div className="mt-2" ref={provided.innerRef} {...provided.droppableProps} style={{ display: 'grid', rowGap: `${sectionSpacing}px` }}>
                {sections.map((section: Section, index) => (
                  <Draggable key={section.id} draggableId={section.id} index={index}>
                    {(p, snapshot) => (
                      <div ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps} className={snapshot.isDragging ? "opacity-50" : ""}>
                        <ResumeSection section={section} isActive={section.id === activeSection?.id} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {overlayEnabled && overlayImage && (
          <div
            aria-label="overlay-pattern"
            onMouseDown={(e) => {
              if (!overlayPositioning) return
              const pageEl = (e.currentTarget.parentElement as HTMLElement)
              const rect = pageEl.getBoundingClientRect()
              const move = (evt: MouseEvent) => {
                const nx = ((evt.clientX - rect.left) / rect.width) * 100
                const ny = ((evt.clientY - rect.top) / rect.height) * 100
                dispatch(setOverlayPosition({ x: nx, y: ny }))
              }
              const up = () => {
                window.removeEventListener('mousemove', move)
                window.removeEventListener('mouseup', up)
              }
              window.addEventListener('mousemove', move)
              window.addEventListener('mouseup', up)
            }}
            style={{ ...(getOverlayStyle({ enabled: overlayEnabled, image: overlayImage, opacity: overlayOpacity, scale: overlayScale, x: overlayX, y: overlayY }) as any), pointerEvents: overlayPositioning ? 'auto' : 'none', cursor: overlayPositioning ? 'move' : 'default' }}
          />
        )}
      </div>
    </div>
  )
}
