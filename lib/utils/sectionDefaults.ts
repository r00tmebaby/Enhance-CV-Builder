import { SectionTypeEnum, Section, EducationSectionItem, ProjectSectionItem, LanguageSectionItem, SkillSectionItem, AchievementSectionItem, VolunteeringItem, MyTimeItem, IndustryExpertiseItem, TrainingSectionItem, PublicationSectionItem, AwardSectionItem, ReferenceSectionItem, StrengthSectionItem, PhilosophyItem, BookSectionItem, CustomSectionItem, SignatureItem } from "@/lib/types"

export const getDefaultEntry = (sectionType: SectionTypeEnum) => {
  const timestamp = Date.now()

  switch (sectionType) {
    case SectionTypeEnum.EDUCATION:
      return {
        id: `edu-${timestamp}`,
        school: "School or University",
        degree: "Degree and Field of Study",
        location: "City, Country",
        gpa: "3.8 / 4.0",
        logo: "/placeholder.svg",
        period: "2018 – 2022",
        bullets: ["Graduated with honors", "Member of Coding Club"],
        visibility: {
          bullets: true,
          gpa: true,
          location: true,
          logo: true,
          period: true,
        },
      }

    case SectionTypeEnum.PROJECTS:
      return {
        id: `project-${timestamp}`,
        projectName: "Awesome Project",
        description: "Built a full-stack application using React and Node.js.",
        link: "https://github.com/yourusername/project",
        period: "Jan 2023 – Mar 2023",
        location: "Remote",
        bullets: ["Implemented real-time chat using WebSockets", "Integrated payment gateway"],
        visibility: {
          bullets: true,
          description: true,
          link: true,
          location: true,
          period: true,
        },
      }

    case SectionTypeEnum.LANGUAGES:
      return {
        id: `lang-${timestamp}`,
        name: "English",
        level: "Fluent",
        proficiency: 5,
        visibility: {
          proficiency: true,
          slider: true,
        },
      }

    case SectionTypeEnum.SKILLS:
      return {
        id: `group-${timestamp}`,
        groupName: "Technical Skills",
        skills: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
        borderStyle: "all",
        compactMode: true,
        visibility: {
          groupName: true,
          compactMode: true,
        },
      }

    case SectionTypeEnum.ACHIEVEMENTS:
      return {
        id: `achievement-${timestamp}`,
        title: "Winner - CodeSprint 2024",
        description: "Secured 1st place in a national-level coding competition among 5000+ participants.",
        icon: "award",
        visibility: {
          title: true,
          description: true,
          icon: true,
        },
      }   

    case SectionTypeEnum.VOLUNTEERING:
      return {
        id: `vol-${timestamp}`,
        role: "Executive Member",
        organization: "AIESEC",
        period: "09/2014 – Present",
        description: "Contributed to leadership development and cross‑cultural initiatives.",
        visibility: { period: true, description: true }
      } as VolunteeringItem

    case SectionTypeEnum.MY_TIME:
      return {
        id: `time-${timestamp}`,
        label: "Designing",
        value: 20,
        color: "#14b8a6"
      } as MyTimeItem

    case SectionTypeEnum.INDUSTRY_EXPERTISE:
      return {
        id: `ind-${timestamp}`,
        name: "Field or Industry",
        percent: 60,
        color: "#14b8a6",
        style: "solid",
        // gradientTo can be set when user selects Gradient style
      } as IndustryExpertiseItem

    case SectionTypeEnum.TRAINING:
      return {
        id: `training-${timestamp}`,
        title: "Creative Writing",
        institution: "Coursera",
        period: "2021 – 2022",
        description: "An intensive 8-week course covering narrative structure and editing.",
        visibility: { institution: true, period: true, description: true },
      } as TrainingSectionItem

    case SectionTypeEnum.PUBLICATIONS:
      return {
        id: `pub-${timestamp}`,
        title: "Dublin 101",
        publisher: "Dublin Globe",
        period: "2023",
        link: "www.dublinglobe.com/101",
        description: "An intro to the startup ecosystem of Dublin.",
        visibility: { publisher: true, period: true, link: true, description: true },
      } as PublicationSectionItem

    case SectionTypeEnum.AWARDS:
      return {
        id: `award-${timestamp}`,
        title: "Dean's List",
        issuer: "Cornell School of Engineering",
        icon: "award",
        visibility: { issuer: true, icon: true },
      } as AwardSectionItem

    case SectionTypeEnum.REFERENCES:
      return {
        id: `ref-${timestamp}`,
        name: "Thomas Brown",
        company: "Horowitz and Partners",
        email: "thomas.brown@gmail.com",
        phone: "1-503-254-1000",
        visibility: { company: true, email: true, phone: true },
      } as ReferenceSectionItem

    case SectionTypeEnum.STRENGTHS:
      return {
        id: `strength-${timestamp}`,
        title: "Go-getter",
        description: "10+ neighbours have taught me that with persistence, one can achieve anything.",
        icon: "zap",
        visibility: { description: true, icon: true },
      } as StrengthSectionItem

    case SectionTypeEnum.PHILOSOPHY:
      return {
        id: `phil-${timestamp}`,
        quote: "First they ignore you, then they laugh at you, then they fight you, then you win.",
        author: "Mahatma Gandhi",
        visibility: { author: true },
      } as PhilosophyItem

    case SectionTypeEnum.BOOKS:
      return {
        id: `book-${timestamp}`,
        title: "The Lean Startup",
        author: "Eric Ries",
        coverUrl: "",
        visibility: { author: true, cover: true },
      } as BookSectionItem

    case SectionTypeEnum.CUSTOM:
      return {
        id: `custom-${timestamp}`,
        title: "Inspired & Challenged",
        subtitle: "Self-employed",
        period: "10/2014 – 06/2015",
        description: "More than 1 million children to love science, nature, and engineering through #ScienceForAll.",
        icon: "award",
        visibility: { subtitle: true, period: true, description: true, icon: true },
      } as CustomSectionItem

    case SectionTypeEnum.SIGNATURE:
      return {
        id: `sign-${timestamp}`,
        imageUrl: "",
        width: 180,
      } as SignatureItem

    default:
      return null
  }
}

export const getDefaultSection = (sectionType: SectionTypeEnum, column: "left" | "right", title: string, inSSR?: boolean): Section | null => {
  const sectionId = inSSR
    ? `section-${sectionType.toLowerCase()}`
    : `section-${Date.now()}-${Math.floor(Math.random() * 1000)}`

  const entry = getDefaultEntry(sectionType)
  if (!entry) return null

  switch (sectionType) {
    case SectionTypeEnum.EDUCATION:
      return {
        id: sectionId,
        type: SectionTypeEnum.EDUCATION,
        column,
        title,
        content: {
          educations: [entry as EducationSectionItem],
        },
      }

    case SectionTypeEnum.PROJECTS:
      return {
        id: sectionId,
        type: SectionTypeEnum.PROJECTS,
        column,
        title,
        content: {
          projects: [entry as ProjectSectionItem],
        },
      }

    case SectionTypeEnum.LANGUAGES:
      return {
        id: sectionId,
        type: SectionTypeEnum.LANGUAGES,
        column,
        title,
        content: {
          languages: [entry as LanguageSectionItem],
        },
      }

    case SectionTypeEnum.SKILLS:
      return {
        id: sectionId,
        type: SectionTypeEnum.SKILLS,
        column,
        title,
        content: {
          skills: [entry as SkillSectionItem],
        },
      }

    case SectionTypeEnum.ACHIEVEMENTS:
      return {
        id: sectionId,
        type: SectionTypeEnum.ACHIEVEMENTS,
        column,
        title,
        content: {
          achievements: [entry as AchievementSectionItem]
        }
      }   

    case SectionTypeEnum.VOLUNTEERING:
      return {
        id: sectionId,
        type: SectionTypeEnum.VOLUNTEERING,
        column,
        title,
        content: {
          volunteering: [entry as VolunteeringItem],
        },
      }
    case SectionTypeEnum.MY_TIME:
      return {
        id: sectionId,
        type: SectionTypeEnum.MY_TIME,
        column,
        title,
        content: {
          my_time: [
            entry as MyTimeItem,
            { id: `time-${Date.now()}-2`, label: "Drawing", value: 15, color: "#f59e0b" },
            { id: `time-${Date.now()}-3`, label: "Brainstorming", value: 30, color: "#3b82f6" },
          ],
        },
      }

    case SectionTypeEnum.INDUSTRY_EXPERTISE:
      return {
        id: sectionId,
        type: SectionTypeEnum.INDUSTRY_EXPERTISE,
        column,
        title,
        content: {
          industry_expertise: [
            entry as IndustryExpertiseItem,
            { id: `ind-${Date.now()}-2`, name: "Consulting", percent: 40, color: "#3b82f6", style: "striped" },
          ],
        },
      }

    case SectionTypeEnum.TRAINING:
      return { id: sectionId, type: SectionTypeEnum.TRAINING, column, title, content: { training: [entry as TrainingSectionItem] } }

    case SectionTypeEnum.PUBLICATIONS:
      return { id: sectionId, type: SectionTypeEnum.PUBLICATIONS, column, title, content: { publications: [entry as PublicationSectionItem] } }

    case SectionTypeEnum.AWARDS:
      return {
        id: sectionId, type: SectionTypeEnum.AWARDS, column, title,
        content: {
          awards: [
            entry as AwardSectionItem,
            { id: `award-${Date.now()}-2`, title: "Valedictorian", issuer: "South Boston High School", icon: "globe", visibility: { issuer: true, icon: true } },
          ],
        },
      }

    case SectionTypeEnum.REFERENCES:
      return {
        id: sectionId, type: SectionTypeEnum.REFERENCES, column, title,
        content: {
          references: [
            entry as ReferenceSectionItem,
            { id: `ref-${Date.now()}-2`, name: "John Silver", company: "", email: "jj.silva@horowitzandpartners.com", phone: "", visibility: { company: true, email: true, phone: true } },
          ],
        },
      }

    case SectionTypeEnum.STRENGTHS:
      return {
        id: sectionId, type: SectionTypeEnum.STRENGTHS, column, title,
        content: {
          strengths: [
            entry as StrengthSectionItem,
            { id: `strength-${Date.now()}-2`, title: "Determined", description: "Developed comprehensive risk frameworks that reduced exposure across the board.", icon: "target", visibility: { description: true, icon: true } },
          ],
        },
      }

    case SectionTypeEnum.PHILOSOPHY:
      return { id: sectionId, type: SectionTypeEnum.PHILOSOPHY, column, title, content: { philosophy: [entry as PhilosophyItem] } }

    case SectionTypeEnum.BOOKS:
      return {
        id: sectionId, type: SectionTypeEnum.BOOKS, column, title,
        content: {
          books: [
            entry as BookSectionItem,
            { id: `book-${Date.now()}-2`, title: "Zero to One", author: "Peter Thiel", coverUrl: "", visibility: { author: true, cover: true } },
          ],
        },
      }

    case SectionTypeEnum.CUSTOM:
      return { id: sectionId, type: SectionTypeEnum.CUSTOM, column, title, content: { custom: [entry as CustomSectionItem] } }

    case SectionTypeEnum.SIGNATURE:
      return { id: sectionId, type: SectionTypeEnum.SIGNATURE, column, title, content: { signature: [entry as SignatureItem] } }

    default:
      return null
  }
}
