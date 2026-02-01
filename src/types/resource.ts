export type ResourceType = 'video' | 'pdf' | 'program'

export interface Resource {
  id: string
  title: string
  slug: string
  type: ResourceType

  description?: string | null
  ministry?: string | null
  topic?: string | null

  thumbnail_url?: string | null

  // --- media fields (para ResourceDetail) ---
  video_url?: string | null
  pdf_url?: string | null
  pdf_path?: string | null

  // extras que ya usas
  duration_seconds?: number | null
  pages?: number | null
  file_size_mb?: number | null
  views_count?: number | null
  rating_avg?: number | null
  rating_count?: number | null
  is_verified?: boolean | null
  is_premium?: boolean | null
  is_featured?: boolean | null
  
}
