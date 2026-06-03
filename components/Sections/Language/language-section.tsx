"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
    updateEntryLanguage,
    upsertActiveSection,
} from "@/lib/features/resume/resumeSlice"
import EditableText from "@/components/Shared/editable-text"
import { cn } from "@/lib/utils"
import { proficiencyLabels, SectionProps, type LanguageSectionItem, type Section } from "@/lib/types"
import { RootState } from "@/lib/store"

export default function LanguageSection({ section, isActive, darkMode = false, handleEntryToggle, handleContextMenu }: SectionProps) {
    const dispatch = useDispatch()
    const activeSection = useSelector((state: RootState) => state.resume.activeSection)
    const primaryColor = useSelector((state: RootState) => state.settings.primaryColor)

    const handleEntryUpdate = (langId: string, field: string, value: string | number) => {
        dispatch(
            updateEntryLanguage({
                sectionId: section.id,
                langId,
                field,
                value,
            }),
        )

        if (field === "proficiency") {
            const proficiencyIndex = Math.min(Math.max(1, Number(value)), 5) - 1
            dispatch(
                updateEntryLanguage({
                    sectionId: section.id,
                    langId,
                    field: "level",
                    value: proficiencyLabels[proficiencyIndex],
                }),
            )
        }
    }

    return (
        <div className="Language-Section space-y-1">
            {section.content.languages?.map((item: LanguageSectionItem) => (
                <div
                    key={item.id}
                    className={cn(
                        "resume-item-holder p-2 -mx-2 group/entry",
                        activeSection?.entryId === item.id
                            ? (darkMode && section.column === 'right'
                                ? 'selected-resume-item--dark p-[7px]'
                                : 'selected-resume-item p-[7px]')
                            : ''
                    )}
                    onContextMenu={(e) => handleContextMenu(e, item.id)}
                    onClick={(e) => handleEntryToggle(e, item.id)}
                >

                    <div className={cn(
                        "flex items-center justify-between gap-2",
                        darkMode && section.column === 'right' && "flex-col items-start gap-1"
                    )}>
                        <EditableText
                            value={item.name}
                            onChange={(value) => handleEntryUpdate(item.id, "name", value)}
                            className={cn("editable-field whitespace-nowrap", darkMode && section.column === 'right' && "!text-white")}
                            placeholder="Language"
                        />

                        <div className={cn(
                            "flex items-center justify-end gap-2 shrink-0",
                            darkMode && section.column === 'right' && "justify-start"
                        )}>
                            {item.visibility?.proficiency !== false && (
                                <EditableText
                                    value={item.level}
                                    onChange={(value) => handleEntryUpdate(item.id, "level", value)}
                                    className={cn("text-sm", darkMode && section.column === 'right' && "!text-white")}
                                />
                            )}
                            {item.visibility?.slider !== false && (
                                <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <div
                                            key={rating}
                                            className={cn(
                                                "w-4 h-4 rounded-full mx-0.5 cursor-pointer",
                                                rating > item.proficiency && "bg-gray-200",
                                                rating <= item.proficiency && darkMode && section.column === 'right' && "bg-white",
                                            )}
                                            style={rating <= item.proficiency && !(darkMode && section.column === 'right') ? { backgroundColor: primaryColor } : undefined}
                                            onClick={() => handleEntryUpdate(item.id, "proficiency", rating)}
                                        ></div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
