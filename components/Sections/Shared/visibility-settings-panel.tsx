"use client"

import { useRef, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface Field { key: string; label: string }

interface Props {
  fields: Field[]
  visibility: Record<string, boolean> | undefined
  onToggle: (key: string, value: boolean) => void
  onClose: () => void
}

// Generic show/hide panel for section entries whose visibility is a flat map of
// boolean flags. Reused by Training, Publications, Awards, References, etc.
export default function VisibilitySettingsPanel({ fields, visibility, onToggle, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) onClose()
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  return (
    <div ref={panelRef} className="bg-white rounded-md shadow-lg border border-gray-200 w-auto p-4 space-y-3 mt-2">
      {fields.map((f) => (
        <div key={f.key} className="flex items-center justify-between gap-6">
          <Label htmlFor={`vis-${f.key}`} className="text-sm">{f.label}</Label>
          <Switch
            id={`vis-${f.key}`}
            checked={visibility?.[f.key] !== false}
            onCheckedChange={(checked) => onToggle(f.key, checked)}
            className="data-[state=checked]:bg-teal-500 cursor-pointer"
          />
        </div>
      ))}
    </div>
  )
}
