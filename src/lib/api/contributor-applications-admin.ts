import { supabase } from '@/lib/supabaseClient'

export type ContributorApplicationRecord = {
  id: string
  user_id: string | null
  full_name: string
  email: string | null
  avatar_url: string | null
  country: string | null
  organization: string | null
  specialty: string | null
  short_bio: string | null
  full_bio: string | null
  website_url: string | null
  instagram_url: string | null
  facebook_url: string | null
  linkedin_url: string | null
  youtube_url: string | null
  status: 'pending_review' | 'approved' | 'rejected'
  admin_notes: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
  updated_at: string
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

async function ensureUniqueContributorSlug(baseName: string) {
  const baseSlug = slugify(baseName) || 'contributor'

  const { data, error } = await supabase
    .from('contributors')
    .select('slug')
    .ilike('slug', `${baseSlug}%`)

  if (error) {
    throw error
  }

  const existing = new Set((data ?? []).map((item) => item.slug))

  if (!existing.has(baseSlug)) {
    return baseSlug
  }

  let counter = 2
  while (existing.has(`${baseSlug}-${counter}`)) {
    counter += 1
  }

  return `${baseSlug}-${counter}`
}

export async function getContributorApplications(status?: string) {
  let query = supabase
    .from('contributor_applications')
    .select(
      `
      id,
      user_id,
      full_name,
      email,
      avatar_url,
      country,
      organization,
      specialty,
      short_bio,
      full_bio,
      website_url,
      instagram_url,
      facebook_url,
      linkedin_url,
      youtube_url,
      status,
      admin_notes,
      reviewed_by,
      reviewed_at,
      created_at,
      updated_at
    `,
    )
    .order('created_at', { ascending: false })

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  return (data ?? []) as ContributorApplicationRecord[]
}

export async function getContributorApplicationById(id: string) {
  const { data, error } = await supabase
    .from('contributor_applications')
    .select(
      `
      id,
      user_id,
      full_name,
      email,
      avatar_url,
      country,
      organization,
      specialty,
      short_bio,
      full_bio,
      website_url,
      instagram_url,
      facebook_url,
      linkedin_url,
      youtube_url,
      status,
      admin_notes,
      reviewed_by,
      reviewed_at,
      created_at,
      updated_at
    `,
    )
    .eq('id', id)
    .single()

  if (error) {
    throw error
  }

  return data as ContributorApplicationRecord
}

export async function approveContributorApplication(
  applicationId: string,
  adminUserId: string,
  adminNotes?: string,
) {
  const application = await getContributorApplicationById(applicationId)

  const slug = await ensureUniqueContributorSlug(application.full_name)

  const { error: contributorError } = await supabase.from('contributors').insert({
    user_id: application.user_id,
    name: application.full_name,
    slug,
    short_bio: application.short_bio,
    full_bio: application.full_bio,
    specialty: application.specialty,
    avatar_url: application.avatar_url,
    website_url: application.website_url,
    instagram_url: application.instagram_url,
    facebook_url: application.facebook_url,
    linkedin_url: application.linkedin_url,
    youtube_url: application.youtube_url,
    country: application.country,
    organization: application.organization,
    is_featured: false,
    is_active: true,
  })

  if (contributorError) {
    throw contributorError
  }

  const { error: updateError } = await supabase
    .from('contributor_applications')
    .update({
      status: 'approved',
      admin_notes: adminNotes ?? null,
      reviewed_by: adminUserId,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', applicationId)

  if (updateError) {
    throw updateError
  }
}

export async function rejectContributorApplication(
  applicationId: string,
  adminUserId: string,
  adminNotes?: string,
) {
  const { error } = await supabase
    .from('contributor_applications')
    .update({
      status: 'rejected',
      admin_notes: adminNotes ?? null,
      reviewed_by: adminUserId,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', applicationId)

  if (error) {
    throw error
  }
}