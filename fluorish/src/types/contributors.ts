export type ContributorListItem = {
  id: string
  name: string
  slug: string
  short_bio: string | null
  specialty: string | null
  avatar_url: string | null
  website_url: string | null
  is_featured: boolean
  is_active: boolean
  created_at: string
}