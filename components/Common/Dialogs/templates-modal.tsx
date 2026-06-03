"use client"

import { useDispatch, useSelector } from "react-redux"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Check } from "lucide-react"
import { setTemplate, setTemplatesModal } from "@/lib/features/settings/settingsSlice"
import type { RootState } from "@/lib/store"

type TemplatesModalProps = {}

const templates = [
    {
        id: "double-column",
        name: "Double Column",
        description: "Classic two-column layout",
        image: "/templates/Double Column.png",
    },
    {
        id: "elegant",
        name: "Elegant",
        description: "Professional design with sidebar",
        image: "/templates/Elegent.png",
    },
    {
        id: "left-sidebar",
        name: "Left Sidebar",
        description: "Sidebar on the left with main content on right",
        image: "/templates/modern.png",
    },
    {
        id: "classic-teal",
        name: "Classic Teal",
        description: "Single column, centered header, teal accents",
        image: "/templates/classic-teal.png",
    },
    {
        id: "classic-navy",
        name: "Classic Navy",
        description: "Single column, centered header, navy accents",
        image: "/templates/classic-navy.png",
    },
    {
        id: "classic-burgundy",
        name: "Classic Burgundy",
        description: "Single column, centered header, burgundy accents",
        image: "/templates/classic-burgundy.png",
    },
    {
        id: "classic-charcoal",
        name: "Classic Charcoal",
        description: "Single column, centered header, charcoal accents",
        image: "/templates/classic-charcoal.png",
    },
]

export default function TemplatesModal({ }: TemplatesModalProps) {
    const dispatch = useDispatch()
    const { template, showTemplatesModal } = useSelector((state: RootState) => state.settings)

    // Selecting a template applies it immediately and closes the modal.
    const handleSelectTemplate = (templateId: string) => {
        dispatch(setTemplate({ template: templateId }))
        dispatch(setTemplatesModal(false))
    }

    return (
        <Dialog open={showTemplatesModal} onOpenChange={(open) => dispatch(setTemplatesModal(open))}>
            <DialogContent className="w-[98%] max-w-md sm:max-w-2xl lg:max-w-3/4 max-h-[90vh] p-0 overflow-auto scrollbar-none drop-shadow-2xl border-none shadow-none">
                <DialogHeader className="p-4 sm:p-6 lg:p-7 xl:p-10 !pb-1">
                    <DialogTitle className="font-normal text-center text-lg md:text-xl lg:text-2xl xl:text-3xl">Choose a template</DialogTitle>
                    <p className="text-gray-600 text-center text-sm md:text-base">Select a template to change the look of your resume</p>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 sm:p-6 lg:p-7 xl:p-10 !pt-1">
                    {templates.map((tpl) => (
                        <div
                            key={tpl.id}
                            className={`border rounded-md overflow-hidden cursor-pointer transition-colors ${template === tpl.id
                                ? "border-teal-500 ring-1 ring-teal-500"
                                : "border-gray-200 hover:border-teal-500"
                                }`}
                            onClick={() => handleSelectTemplate(tpl.id)}
                        >
                            <div className="relative">
                                <img src={tpl.image || "/placeholder.svg"} alt={tpl.name} className="w-full h-auto" />
                                {template === tpl.id && (
                                    <div className="absolute top-2 right-2 bg-teal-500 text-white rounded-full p-1">
                                        <Check size={16} />
                                    </div>
                                )}
                            </div>
                            <div className="p-3 border-t border-gray-200">
                                <h3 className="font-medium">{tpl.name}</h3>
                                <p className="text-sm text-gray-500">{tpl.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}
