"use client"

import { Award, Globe, Zap, Target, Star, Info, BookOpen, Trophy, Heart, Lightbulb } from "lucide-react"

// Resolves a named icon used by Awards / Strengths / Custom sections.
const ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  award: Award,
  globe: Globe,
  zap: Zap,
  target: Target,
  star: Star,
  info: Info,
  book: BookOpen,
  trophy: Trophy,
  heart: Heart,
  lightbulb: Lightbulb,
}

export default function SectionIcon({ name, size = 16 }: { name: string; size?: number }) {
  const Icon = ICONS[name] ?? Award
  return <Icon size={size} />
}
