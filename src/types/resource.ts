// src/types/resource.ts
export type ResourceType = 'video' | 'pdf' | 'program' | 'mixed'

export type Resource = {
  id: string
  title: string
  slug: string

  description?: string | null
  thumbnail_url?: string | null

  type: ResourceType
  is_verified?: boolean | null

  ministry?: string | null
  topic?: string | null

  // métricas (pueden ser mock en demo)
  rating_avg?: number | null
  rating_count?: number | null
  views_count?: number | null

  // video/pdf meta
  duration_seconds?: number | null
  pages?: number | null
  file_size_mb?: number | null

  // flags opcionales
  is_featured?: boolean | null
  is_premium?: boolean | null
}
