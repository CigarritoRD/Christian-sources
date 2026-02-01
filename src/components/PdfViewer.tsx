export default function PdfViewer({ url }: { url: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden shadow-soft">
      <iframe title="PDF" src={url} className="h-[70vh] w-full" />
    </div>
  )
}
