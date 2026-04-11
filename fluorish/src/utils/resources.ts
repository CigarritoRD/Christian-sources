import type { ResourceListItem } from '@/types/resources'

type RawRelation<T> = T | T[] | null

type RawResourceListItem = Omit<ResourceListItem, 'contributor' | 'category'> & {
  contributor: RawRelation<NonNullable<ResourceListItem['contributor']>>
  category: RawRelation<NonNullable<ResourceListItem['category']>>
}

export function normalizeResource(
  resource: RawResourceListItem,
): ResourceListItem {
  return {
    ...resource,
    contributor: Array.isArray(resource.contributor)
      ? (resource.contributor[0] ?? null)
      : resource.contributor,
    category: Array.isArray(resource.category)
      ? (resource.category[0] ?? null)
      : resource.category,
  }
}