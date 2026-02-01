// src/lib/resourceImages.ts
export function getResourceImage(resource: {
  type?: string | null
  topic?: string | null
  ministry?: string | null
}) {
  const key = resource.topic || resource.ministry || resource.type || 'church'
  // usa picsum si te funciona bien:
  return `https://picsum.photos/seed/${encodeURIComponent(String(key))}/900/600`
}