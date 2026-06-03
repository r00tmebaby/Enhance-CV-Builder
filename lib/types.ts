export interface Header {
  name: string
  title: string
  phone: string
  email: string
  link: string
  extraLink: string
  location: string
  extraField: string
  photoUrl: string
  visibility: HeaderVisibility
  uppercaseName: boolean
  roundPhoto: boolean
  // Profile photo layout (all optional; sensible defaults applied at render)
  photoSize?: number        // frame width/height in px
  photoPosX?: number        // free-move translate X in px from the default slot
  photoPosY?: number        // free-move translate Y in px
  photoOffsetX?: number     // object-position X (0-100) to pan image inside frame
  photoOffsetY?: number     // object-position Y (0-100)
  photoAlign?: "left" | "center" | "right" // horizontal placement preset
}

export interface HeaderVisibility {
  title: boolean
  phone: boolean
  email: boolean
  link: boolean
  extraLink: boolean
  location: boolean
  photo: boolean
  extraField: boolean
}

export interface EducationSectionItem {
  id: string
  degree: string
  school: string
  gpa: string
  location: string
  period: string
  bullets: string[]
  logo: string
  visibility?: EducationContentVisibility
}

export interface EducationContentVisibility {
  gpa: boolean
  location: boolean
  period: boolean
  bullets: boolean
  logo: boolean
}

export const EducationFields: { key: keyof EducationContentVisibility; label: string }[] = [
  { key: "bullets", label: "Show Bullets" },
  { key: "location", label: "Show Location" },
  { key: "period", label: "Show Period" },
  { key: "logo", label: "Show Company Logo" },
  { key: "gpa", label: "Show GPA" },
];

export interface ProjectSectionItem {
  id: string
  projectName: string
  description: string
  bullets: string[]
  location: string
  period: string
  link: string
  visibility?: ProjectContentVisibility
}

export interface ProjectContentVisibility {
  description: boolean
  bullets: boolean
  location: boolean
  period: boolean
  link: boolean
}

export interface LanguageSectionItem {
  id: string
  name: string
  level: string
  proficiency: number // 1-5
  visibility?: LanguageContentVisibility
}

export interface LanguageContentVisibility {
  proficiency: boolean
  slider: boolean
}

// Labels for language proficiency (1-5)
export const proficiencyLabels = [
  "Beginner",
  "Elementary",
  "Intermediate",
  "Upper Intermediate",
  "Advanced",
]

export interface SkillSectionItem {
  id: string
  groupName?: string
  skills: string[]
  visibility?: SkillVisibility
}

export interface SkillVisibility {
  groupName: boolean
  compactMode: boolean
}

export interface AchievementSectionItem {
  id: string
  title: string
  description: string
  icon: string // e.g., "info", "award", etc.
  visibility?: AchievementContentVisibility
}

export interface AchievementContentVisibility {
  description: boolean
  icon: boolean
}

// Training / Courses entries (title + provider + period + description)
export interface TrainingSectionItem {
  id: string
  title: string
  institution: string
  period: string
  description: string
  visibility?: { institution: boolean; period: boolean; description: boolean }
}

// Publications (title + publisher + period + link + description)
export interface PublicationSectionItem {
  id: string
  title: string
  publisher: string
  period: string
  link: string
  description: string
  visibility?: { publisher: boolean; period: boolean; link: boolean; description: boolean }
}

// Awards (icon + title + issuer), typically laid out two per row
export interface AwardSectionItem {
  id: string
  title: string
  issuer: string
  icon: string
  visibility?: { issuer: boolean; icon: boolean }
}

// References (name + email + phone), typically laid out two per row
export interface ReferenceSectionItem {
  id: string
  name: string
  company: string
  email: string
  phone: string
  visibility?: { company: boolean; email: boolean; phone: boolean }
}

// Strengths (icon + title + description) - same shape as achievements
export interface StrengthSectionItem {
  id: string
  title: string
  description: string
  icon: string
  visibility?: { description: boolean; icon: boolean }
}

// My Life Philosophy (a highlighted quote + attribution)
export interface PhilosophyItem {
  id: string
  quote: string
  author: string
  visibility?: { author: boolean }
}

// Books (cover image + title + author)
export interface BookSectionItem {
  id: string
  title: string
  author: string
  coverUrl: string
  visibility?: { author: boolean; cover: boolean }
}

// Custom (flexible entry: icon + title + subtitle + period + description)
export interface CustomSectionItem {
  id: string
  title: string
  subtitle: string
  period: string
  description: string
  icon: string
  visibility?: { subtitle: boolean; period: boolean; description: boolean; icon: boolean }
}

// Your Signature (single uploaded signature image)
export interface SignatureItem {
  id: string
  imageUrl: string
  width: number // rendered width in px
}

export enum SectionTypeEnum {
  EDUCATION = "educations",
  PROJECTS = "projects",
  SKILLS = "skills",
  LANGUAGES = "languages",
  ACHIEVEMENTS = "achievements",
  VOLUNTEERING = "volunteering",
  MY_TIME = "my_time",
  INDUSTRY_EXPERTISE = "industry_expertise",
  TRAINING = "training",
  PUBLICATIONS = "publications",
  AWARDS = "awards",
  REFERENCES = "references",
  STRENGTHS = "strengths",
  PHILOSOPHY = "philosophy",
  BOOKS = "books",
  CUSTOM = "custom",
  SIGNATURE = "signature",
}

export interface VolunteeringItem {
  id: string
  role: string
  organization: string
  period: string
  description: string
  visibility?: {
    period: boolean
    description: boolean
  }
}

export interface MyTimeItem {
  id: string
  label: string
  value: number
  color?: string
}

export interface IndustryExpertiseItem {
  id: string
  name: string // Field or Industry
  percent: number // 0-100
  color?: string
  style?: "solid" | "striped" | "dashed" | "diagonal" | "gradient"
  gradientTo?: string // used when style = 'gradient'
}

export type SectionType =
  | SectionTypeEnum.EDUCATION
  | SectionTypeEnum.PROJECTS
  | SectionTypeEnum.LANGUAGES
  | SectionTypeEnum.SKILLS
  | SectionTypeEnum.ACHIEVEMENTS
  | SectionTypeEnum.VOLUNTEERING
  | SectionTypeEnum.MY_TIME
  | SectionTypeEnum.INDUSTRY_EXPERTISE
  | SectionTypeEnum.TRAINING
  | SectionTypeEnum.PUBLICATIONS
  | SectionTypeEnum.AWARDS
  | SectionTypeEnum.REFERENCES
  | SectionTypeEnum.STRENGTHS
  | SectionTypeEnum.PHILOSOPHY
  | SectionTypeEnum.BOOKS
  | SectionTypeEnum.CUSTOM
  | SectionTypeEnum.SIGNATURE

export type SectionContent = EducationSectionItem | ProjectSectionItem | LanguageSectionItem | SkillSectionItem | AchievementSectionItem

export interface ActiveSection {
  id: string;
  type: SectionType
  column: "left" | "right"
  title: string
  entryId: string | null
}

export interface SectionProps {
  section: Section
  isActive: boolean
  darkMode?: boolean
  handleEntryToggle: (e: React.MouseEvent, entryId: string) => void
  handleContextMenu: (e: React.MouseEvent, entryId?: string, groupId?: string) => void
}

export interface Section {
  id: string;
  type: SectionType
  column: "left" | "right"
  title: string
  backgroundColor?: string | null
  content: {
    educations?: EducationSectionItem[];
    projects?: ProjectSectionItem[];
    languages?: LanguageSectionItem[];
    skills?: SkillSectionItem[];
    achievements?: AchievementSectionItem[];
    volunteering?: VolunteeringItem[];
    my_time?: MyTimeItem[];
    industry_expertise?: IndustryExpertiseItem[];
    training?: TrainingSectionItem[];
    publications?: PublicationSectionItem[];
    awards?: AwardSectionItem[];
    references?: ReferenceSectionItem[];
    strengths?: StrengthSectionItem[];
    philosophy?: PhilosophyItem[];
    books?: BookSectionItem[];
    custom?: CustomSectionItem[];
    signature?: SignatureItem[];
  }
}

export type SectionContentMap = {
  educations: EducationSectionItem[];
  projects: ProjectSectionItem[];
  skills: SkillSectionItem[];
  languages: LanguageSectionItem[];
  achievements: AchievementSectionItem[];
  volunteering: VolunteeringItem[];
  my_time: MyTimeItem[];
  industry_expertise: IndustryExpertiseItem[];
  training: TrainingSectionItem[];
  publications: PublicationSectionItem[];
  awards: AwardSectionItem[];
  references: ReferenceSectionItem[];
  strengths: StrengthSectionItem[];
  philosophy: PhilosophyItem[];
  books: BookSectionItem[];
  custom: CustomSectionItem[];
  signature: SignatureItem[];
};

export type VisibilityActionPayload = {
  sectionId: string
  entryId: string
  field: any
  value: boolean
}

export type VisibilityDispatchMap = {
  [SectionTypeEnum.EDUCATION]: (payload: {
    sectionId: string
    entryId: string
    field: keyof EducationContentVisibility
    value: boolean
  }) => any
  [SectionTypeEnum.PROJECTS]: (payload: {
    sectionId: string
    entryId: string
    field: keyof ProjectContentVisibility
    value: boolean
  }) => any
  [SectionTypeEnum.LANGUAGES]: (payload: {
    sectionId: string
    entryId: string
    field: keyof LanguageContentVisibility
    value: boolean
  }) => any
  [SectionTypeEnum.SKILLS]: (payload: {
    sectionId: string
    entryId: string
    field: keyof SkillVisibility
    value: boolean
  }) => any
  [SectionTypeEnum.ACHIEVEMENTS]: (payload: {
    sectionId: string
    entryId: string
    field: keyof AchievementContentVisibility
    value: boolean
  }) => any
}

export type ActiveSkillData = {
  sectionId: string;
  groupId: string;
  skillIndex: number;
} | null;

export interface ResumeState {
  header: Header
  sections: Section[]
  activeSection: ActiveSection | null
  activeSkillData: ActiveSkillData
  history: {
    past: Array<{
      header: Header
      sections: Section[]
    }>
    future: Array<{
      header: Header
      sections: Section[]
    }>
  }
}

export interface SettingsState {
  branding: boolean
  theme: "light" | "dark"
  fontSize: number
  fontFamily: string
  template: string
  editorZoom: number
  pageMargins: number
  sectionSpacing: number
  lineHeight: number
  primaryColor: string
  headingColor: string
  leftSidebarBgColor?: string
  pageBackgroundColor: string
  pageBackgroundMode: 'solid' | 'pattern' | 'gradient'
  pageBackgroundPattern: "none" | "dots" | "diagonal-stripes" | "grid" | "crosshatch"
  pageBackgroundGradientTo?: string
  pageBackgroundGradientAngle?: number
  // Image overlay pattern settings
  overlayEnabled?: boolean
  overlayImage?: string | null
  overlayOpacity?: number // 0..1
  overlayScale?: number // multiplier e.g. 1 = 100%
  overlayX?: number // percent 0..100 from left
  overlayY?: number // percent 0..100 from top
  overlayPositioning?: boolean // enable drag to position in editor
  photoPositioning?: boolean // enable drag/resize of the profile photo
  showDesignPanel: boolean
  showTemplatesModal: boolean
  showAddSectionModal: boolean
  addSectionColumn: "left" | "right"
  currentCvId: string | null
  showHistoryModal: boolean
}

export interface RootState {
  resume: ResumeState
  settings: SettingsState
}
