export type Section = 'research' | 'field'

export type ResearchCategory = 'foundational' | 'educational' | 'practical'
export type FieldCategory = 'classroom' | 'multicultural'

export type LicenseType = 'cc-by' | 'cc-by-nc' | 'cc-by-nd' | 'copyright'

export type ResourceCategory = 'lesson-plan' | 'worksheet' | 'assessment' | 'research' | 'reference'
export type Level = 'beginner' | 'intermediate' | 'advanced' | 'mixed'

export type GroupType = 'online' | 'offline'
export type GroupTopic = 'grammar' | 'pronunciation' | 'culture' | 'assessment' | 'pedagogy'

export interface Resource {
  id: string
  title: string
  description: string
  category: ResourceCategory
  level: Level
  tags: string[]
  license: LicenseType
  uploadedBy: string
  uploadedAt: number
  downloads: number
  fileSize: string
  privacy: 'public' | 'members' | 'group' | 'private'
  groupId?: string
}

export interface Post {
  id: string
  title: string
  content: string
  section: Section
  category: ResearchCategory | FieldCategory
  topic: string
  author: string
  authorAvatar: string
  createdAt: number
  views: number
  likes: number
  comments: number
  resourceIds: string[]
}

export interface Group {
  id: string
  name: string
  description: string
  type: GroupType
  topics: GroupTopic[]
  region?: string
  schedule: string
  members: number
  maxMembers?: number
  isActive: boolean
  createdAt: number
}

export interface Announcement {
  id: string
  title: string
  isImportant: boolean
  createdAt: number
}

export interface Event {
  id: string
  title: string
  date: string
  type: 'workshop' | 'seminar' | 'meetup'
}

export interface Activity {
  id: string
  type: 'comment' | 'upload' | 'post'
  userName: string
  action: string
  timestamp: number
}
