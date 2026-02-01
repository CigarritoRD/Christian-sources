export function getResourceImage(resource: {
  id?: string | number
  type?: string
  topic?: string
  ministry?: string
}) {
  const key = resource.topic || resource.ministry || resource.type || 'church'

  const seed =
    typeof resource.id === 'number'
      ? resource.id
      : typeof resource.id === 'string'
      ? resource.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
      : key.split('').reduce((a, c) => a + c.charCodeAt(0), 0)

  // Picsum: estable y sin rate limit molesto
  return `https://picsum.photos/seed/${seed % 10000}/900/600`
}
