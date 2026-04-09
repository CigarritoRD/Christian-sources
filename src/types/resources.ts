export type ResourceListItem = {
  id: string
  title: string
  slug: string
  description: string | null
  short_description: string | null
  thumbnail_url: string | null
  resource_type: string
  contributor_id: string
  category_id: string | null
  is_featured: boolean
  is_public: boolean
  is_published: boolean
  created_at: string
  contributor: {
    id: string
    name: string
    slug: string
  } | null
  category: {
    id: string
    name: string
    slug: string
  } | null
}