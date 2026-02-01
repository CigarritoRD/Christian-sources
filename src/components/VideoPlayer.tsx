function toEmbed(url: string) {
  // YouTube normal -> embed
  if (url.includes('youtube.com/watch')) {
    const u = new URL(url)
    const id = u.searchParams.get('v')
    if (id) return `https://www.youtube.com/embed/${id}`
  }
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split('?')[0]
    if (id) return `https://www.youtube.com/embed/${id}`
  }
  // si ya es embed o vimeo, lo devolvemos
  return url
}

export default function VideoPlayer({ url }: { url: string }) {
  const embed = toEmbed(url)
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden shadow-soft">
      <div className="aspect-video">
        <iframe
          title="Video"
          src={embed}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  )
}
