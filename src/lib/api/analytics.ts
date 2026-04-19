import { supabase } from '@/lib/supabaseClient'

export type ResourceEventType = 'open' | 'download'

export type ContributorEventType =
  | 'profile_view'
  | 'website_click'
  | 'instagram_click'
  | 'facebook_click'
  | 'linkedin_click'
  | 'youtube_click'

function getCountryHint() {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale || ''
    return locale.split('-')[1] || null
  } catch {
    return null
  }
}

export async function trackResourceEvent(
  resourceId: string,
  eventType: ResourceEventType,
) {
  const { error } = await supabase.from('resource_events').insert({
    resource_id: resourceId,
    event_type: eventType,
    country: getCountryHint(),
  })

  if (error) {
    console.error('trackResourceEvent error:', error.message)
  }
}

export async function trackContributorEvent(
  contributorId: string,
  eventType: ContributorEventType,
) {
  const { error } = await supabase.from('contributor_events').insert({
    contributor_id: contributorId,
    event_type: eventType,
    country: getCountryHint(),
  })

  if (error) {
    console.error('trackContributorEvent error:', error.message)
  }
}