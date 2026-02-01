import type { ResourceType } from "../types/resource"

export type ExploreFilters = {
  types: ResourceType[] // ['video','pdf']
  ministries: string[]
  topics: string[]
  verifiedOnly: boolean
  sort: 'recent' | 'most_viewed'
  page: number
  pageSize: number
  q?: string
}

export const defaultExploreFilters: ExploreFilters = {
  types: ['video', 'pdf'],
  ministries: [],
  topics: [],
  verifiedOnly: false,
  sort: 'recent',
  page: 1,
  pageSize: 12,
  q: '',
}
