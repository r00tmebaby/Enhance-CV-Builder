"use client"

import type React from "react"
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

type ConfirmOpts = { title?: string; message: string; confirmLabel?: string; cancelLabel?: string; destructive?: boolean }
type PromptOpts = { title?: string; label?: string; defaultValue?: string; placeholder?: string; confirmLabel?: string }
type Toast = { id: number; msg: string; error?: boolean }

interface DialogApi {
  confirm: (opts: ConfirmOpts) => Promise<boolean>
  promptText: (opts: PromptOpts) => Promise<string | null>
  toast: (msg: string, opts?: { error?: boolean; duration?: number }) => void
}

const Ctx = createContext<DialogApi | null>(null)

// App-wide replacement for window.alert / confirm / prompt with styled modals.
export function useDialogs(): DialogApi {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useDialogs must be used within DialogProvider")
  return ctx
}

export default function DialogProvider({ children }: { children: React.ReactNode }) {
  const [confirmReq, setConfirmReq] = useState<{ opts: ConfirmOpts; resolve: (v: boolean) => void } | null>(null)
  const [promptReq, setPromptReq] = useState<{ opts: PromptOpts; resolve: (v: string | null) => void } | null>(null)
  const [promptValue, setPromptValue] = useState("")
  const [toasts, setToasts] = useState<Toast[]>([])
  const idRef = useRef(0)

  const confirm = useCallback((opts: ConfirmOpts) => new Promise<boolean>((resolve) => setConfirmReq({ opts, resolve })), [])
  const promptText = useCallback((opts: PromptOpts) => new Promise<string | null>((resolve) => {
    setPromptValue(opts.defaultValue ?? "")
    setPromptReq({ opts, resolve })
  }), [])
  const toast = useCallback((msg: string, opts?: { error?: boolean; duration?: number }) => {
    const id = ++idRef.current
    setToasts((t) => [...t, { id, msg, error: opts?.error }])
    const dur = opts?.duration ?? 2200
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), dur)
  }, [])

  const api = useMemo(() => ({ confirm, promptText, toast }), [confirm, promptText, toast])

  const resolveConfirm = (v: boolean) => { confirmReq?.resolve(v); setConfirmReq(null) }
  const resolvePrompt = (v: string | null) => { promptReq?.resolve(v); setPromptReq(null) }

  return (
    <Ctx.Provider value={api}>
      {children}

      <Dialog open={!!confirmReq} onOpenChange={(o) => { if (!o) resolveConfirm(false) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-normal text-lg md:text-xl">{confirmReq?.opts.title ?? "Are you sure?"}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 px-1 whitespace-pre-wrap">{confirmReq?.opts.message}</p>
          <div className="flex justify-end gap-2 pt-3">
            <Button variant="outline" onClick={() => resolveConfirm(false)} className="text-base py-2.5 px-4 rounded-sm font-rubik font-medium cursor-pointer">
              {confirmReq?.opts.cancelLabel ?? "Cancel"}
            </Button>
            <Button
              onClick={() => resolveConfirm(true)}
              className={`text-base py-2.5 px-4 rounded-sm font-rubik font-medium text-white border-none cursor-pointer ${confirmReq?.opts.destructive ? "bg-red-600 hover:bg-red-700" : "bg-[#2dc08d] hover:bg-[#57cda4]"}`}
            >
              {confirmReq?.opts.confirmLabel ?? "Confirm"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!promptReq} onOpenChange={(o) => { if (!o) resolvePrompt(null) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-normal text-lg md:text-xl">{promptReq?.opts.title ?? "Enter a value"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 px-1">
            {promptReq?.opts.label && <label htmlFor="dlg-prompt-input" className="text-sm text-gray-600">{promptReq.opts.label}</label>}
            <input
              id="dlg-prompt-input"
              autoFocus
              value={promptValue}
              onChange={(e) => setPromptValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); resolvePrompt(promptValue.trim() || null) } }}
              placeholder={promptReq?.opts.placeholder}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3">
            <Button variant="outline" onClick={() => resolvePrompt(null)} className="text-base py-2.5 px-4 rounded-sm font-rubik font-medium cursor-pointer">Cancel</Button>
            <Button onClick={() => resolvePrompt(promptValue.trim() || null)} className="text-base py-2.5 px-4 rounded-sm font-rubik font-medium text-white bg-[#2dc08d] hover:bg-[#57cda4] border-none cursor-pointer">
              {promptReq?.opts.confirmLabel ?? "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className={`flex items-center gap-2 px-4 py-2 rounded-md shadow-lg text-sm text-white ${t.error ? "bg-red-600" : "bg-[#2dc08d]"}`}>
            {!t.error && <Check size={16} />}{t.msg}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}
