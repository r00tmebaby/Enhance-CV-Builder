"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface SaveDialogProps {
  open: boolean
  defaultName?: string
  saving?: boolean
  onCancel: () => void
  onConfirm: (name: string) => void
}

export default function SaveDialog({ open, defaultName = "", saving = false, onCancel, onConfirm }: SaveDialogProps) {
  const [name, setName] = useState(defaultName)

  useEffect(() => { if (open) setName(defaultName) }, [open, defaultName])

  const submit = () => onConfirm(name.trim() || defaultName || "My Resume")

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onCancel() }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-normal text-center text-lg md:text-xl">Save resume</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 px-1">
          <label htmlFor="save-name" className="text-sm text-gray-600">Name</label>
          <input
            id="save-name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); submit() } }}
            placeholder="My Resume"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          />
          <p className="text-xs text-gray-500">Your resume auto-saves as you edit. Saving also adds a restore point you can return to from History.</p>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={saving}
            className="text-base py-2.5 px-4 cursor-pointer rounded-sm font-rubik font-medium"
          >
            Cancel
          </Button>
          <Button
            onClick={submit}
            disabled={saving}
            className="text-base py-2.5 px-4 text-white bg-[#2dc08d] hover:bg-[#57cda4] border-none cursor-pointer rounded-sm font-rubik font-medium"
          >
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
