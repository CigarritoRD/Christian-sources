// src/lib/drivePreview.ts
export function extractDriveFileId(input?: string | null): string | null {
  if (!input) return null

  // /file/d/<ID>/view or /preview
  const m1 = input.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (m1?.[1]) return m1[1]

  // ?id=<ID>
  const m2 = input.match(/[?&]id=([a-zA-Z0-9_-]+)/)
  if (m2?.[1]) return m2[1]

  // already an ID
  if (/^[a-zA-Z0-9_-]{10,}$/.test(input) && !input.includes('/')) return input

  return null
}

export function driveThumbUrl(fileId: string, w = 900) {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${w}`
}

export function driveDownloadUrl(fileId: string) {
  return `https://drive.google.com/uc?export=download&id=${fileId}`
}