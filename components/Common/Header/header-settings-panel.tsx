"use client"

import { useRef, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface HeaderSettingsPanelProps {
    visibility: {
        title: boolean
        phone: boolean
        email: boolean
        link: boolean
        extraLink: boolean
        location: boolean
        photo: boolean
        extraField: boolean
    }
    uppercaseName: boolean
    roundPhoto: boolean
    photoPositioning: boolean
    photoAlign: "left" | "center" | "right"
    onToggleVisibility: (field: string, value: boolean) => void
    onToggleUppercase: (value: boolean) => void
    onTogglePhotoStyle: (value: boolean) => void
    onTogglePhotoPositioning: (value: boolean) => void
    onSetPhotoAlign: (value: "left" | "center" | "right") => void
    onResetPhotoLayout: () => void
    onClose: () => void
}

export default function HeaderSettingsPanel({
    visibility,
    uppercaseName,
    roundPhoto,
    photoPositioning,
    photoAlign,
    onToggleVisibility,
    onToggleUppercase,
    onTogglePhotoStyle,
    onTogglePhotoPositioning,
    onSetPhotoAlign,
    onResetPhotoLayout,
    onClose,
}: HeaderSettingsPanelProps) {
    const panelRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                onClose()
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [onClose])

    return (
        <div ref={panelRef} className="bg-white rounded-md shadow-lg border border-gray-200 w-64 p-4 space-y-3">
            <div className="flex items-center justify-between">
                <Label htmlFor="show-title" className="text-sm">
                    Show Title
                </Label>
                <Switch
                    id="show-title"
                    checked={visibility.title}
                    onCheckedChange={(checked) => onToggleVisibility("title", checked)}
                    className="data-[state=checked]:bg-teal-500"
                />
            </div>

            <div className="flex items-center justify-between">
                <Label htmlFor="show-phone" className="text-sm">
                    Show Phone
                </Label>
                <Switch
                    id="show-phone"
                    checked={visibility.phone}
                    onCheckedChange={(checked) => onToggleVisibility("phone", checked)}
                    className="data-[state=checked]:bg-teal-500"
                />
            </div>

            <div className="flex items-center justify-between">
                <Label htmlFor="show-link" className="text-sm">
                    Show Link
                </Label>
                <Switch
                    id="show-link"
                    checked={visibility.link}
                    onCheckedChange={(checked) => onToggleVisibility("link", checked)}
                    className="data-[state=checked]:bg-teal-500"
                />
            </div>

            <div className="flex items-center justify-between">
                <Label htmlFor="show-extra-link" className="text-sm">
                    Show Extra Link
                </Label>
                <Switch
                    id="show-extra-link"
                    checked={visibility.extraLink}
                    onCheckedChange={(checked) => onToggleVisibility("extraLink", checked)}
                    className="data-[state=checked]:bg-teal-500"
                />
            </div>

            <div className="flex items-center justify-between">
                <Label htmlFor="show-email" className="text-sm">
                    Show Email
                </Label>
                <Switch
                    id="show-email"
                    checked={visibility.email}
                    onCheckedChange={(checked) => onToggleVisibility("email", checked)}
                    className="data-[state=checked]:bg-teal-500"
                />
            </div>

            <div className="flex items-center justify-between">
                <Label htmlFor="show-location" className="text-sm">
                    Show Location
                </Label>
                <Switch
                    id="show-location"
                    checked={visibility.location}
                    onCheckedChange={(checked) => onToggleVisibility("location", checked)}
                    className="data-[state=checked]:bg-teal-500"
                />
            </div>

            <div className="flex items-center justify-between">
                <Label htmlFor="uppercase-name" className="text-sm">
                    Uppercase name
                </Label>
                <Switch
                    id="uppercase-name"
                    checked={uppercaseName}
                    onCheckedChange={(checked) => onToggleUppercase(checked)}
                    className="data-[state=checked]:bg-teal-500"
                />
            </div>

            <div className="flex items-center justify-between">
                <Label htmlFor="show-photo" className="text-sm">
                    Show Photo
                </Label>
                <Switch
                    id="show-photo"
                    checked={visibility.photo}
                    onCheckedChange={(checked) => onToggleVisibility("photo", checked)}
                    className="data-[state=checked]:bg-teal-500"
                />
            </div>

            <div className="flex items-center justify-between">
                <Label htmlFor="show-extra-field" className="text-sm">
                    Show Extra Field
                </Label>
                <Switch
                    id="show-extra-field"
                    checked={visibility.extraField}
                    onCheckedChange={(checked) => onToggleVisibility("extraField", checked)}
                    className="data-[state=checked]:bg-teal-500"
                />
            </div>

            <div className="border-t border-gray-200 pt-3">
                <div className="flex items-center justify-between">
                    <Label className="text-sm">Photo Style</Label>
                    <div className="flex items-center space-x-2">
                        <div
                            className={`w-6 h-6 rounded-full border ${roundPhoto ? "border-teal-500 bg-teal-100" : "border-gray-300"}`}
                            onClick={() => onTogglePhotoStyle(true)}
                        >
                            {roundPhoto && <div className="w-4 h-4 bg-teal-500 rounded-full m-auto mt-1"></div>}
                        </div>
                        <div
                            className={`w-6 h-6 rounded-md border ${!roundPhoto ? "border-teal-500 bg-teal-100" : "border-gray-300"}`}
                            onClick={() => onTogglePhotoStyle(false)}
                        >
                            {!roundPhoto && <div className="w-4 h-4 bg-teal-500 rounded-sm m-auto mt-1"></div>}
                        </div>
                    </div>
                </div>

                {visibility.photo && (
                    <div className="mt-3 space-y-3">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="move-photo" className="text-sm">Move / resize photo</Label>
                            <Switch
                                id="move-photo"
                                checked={photoPositioning}
                                onCheckedChange={(checked) => onTogglePhotoPositioning(checked)}
                                className="data-[state=checked]:bg-teal-500"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label className="text-sm">Align</Label>
                            <div className="flex items-center gap-1">
                                {(["left", "center", "right"] as const).map((a) => (
                                    <button
                                        key={a}
                                        type="button"
                                        onClick={() => onSetPhotoAlign(a)}
                                        className={`px-2 py-1 text-xs rounded border capitalize ${photoAlign === a ? "border-teal-500 bg-teal-50 text-teal-600" : "border-gray-300 text-gray-600"}`}
                                    >
                                        {a}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {photoPositioning && (
                            <p className="text-xs text-gray-500">Drag the photo to move, drag its corner to resize, hold Shift and drag to reposition the image inside the frame.</p>
                        )}

                        <button type="button" onClick={onResetPhotoLayout} className="text-xs text-gray-500 underline hover:text-gray-700">
                            Reset photo position &amp; size
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
