import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import PageHeader from '../components/PageHeader'
import PdfViewer from '../components/PdfViewer'

import { useAuth } from '../auth/AuthProvider'
import type { Resource } from '../types/resource'
import { fetchResourceBySlug, fetchSuggested } from '../lib/ResourcesApi'
 
import ResourceCard from '../components/ResourceCard'
import { getLibraryFlags, toggleLibrary } from '../lib/LibraryApi'
import VideoPlayer from '../components/VideoPlayer'
import { extractDriveFileId, driveDownloadUrl } from '../lib/drivePreview'
import { AppLayout } from '../components/AppLayout'

export default function ResourceDetail() {
  const { slug } = useParams()
  const { user } = useAuth()
  const [resource, setResource] = useState<Resource | null>(null)
  const [suggested, setSuggested] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [flags, setFlags] = useState({ saved: false, favorite: false })
  const [busy, setBusy] = useState<'saved' | 'favorite' | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        const r = await fetchResourceBySlug(slug!)
        if (!mounted) return
        setResource(r)

        if (r) {
          const sug = await fetchSuggested(r.topic ?? null, r.ministry ?? null, r.id)
          if (!mounted) return
          setSuggested(sug)

          const f = await getLibraryFlags(r.id)
          if (!mounted) return
          setFlags(f)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [slug])

  const right = useMemo(() => {
    if (!resource) return null
    return (
      <div className="flex items-center gap-2">
        <button
          disabled={busy !== null}
          onClick={async () => {
            if (!user) return alert('Inicia sesión para guardar.')
            try {
              setBusy('saved')
              const res = await toggleLibrary('saved', resource.id)
              setFlags((f) => ({ ...f, saved: res.active }))
            } finally {
              setBusy(null)
            }
          }}
          className={[
            'rounded-xl border px-4 py-2 text-sm font-semibold transition',
            flags.saved ? 'border-white/25 bg-white/10 text-white' : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10',
          ].join(' ')}
        >
          {flags.saved ? 'Guardado' : 'Guardar'}
        </button>

        <button
          disabled={busy !== null}
          onClick={async () => {
            if (!user) return alert('Inicia sesión para favorito.')
            try {
              setBusy('favorite')
              const res = await toggleLibrary('favorite', resource.id)
              setFlags((f) => ({ ...f, favorite: res.active }))
            } finally {
              setBusy(null)
            }
          }}
          className={[
            'rounded-xl border px-4 py-2 text-sm transition',
            flags.favorite ? 'border-rose-400/30 bg-rose-500/15 text-rose-200' : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10',
          ].join(' ')}
        >
          {flags.favorite ? '♥ Favorito' : '♡ Favorito'}
        </button>
      </div>
    )
  }, [resource, flags, user, busy])

  if (loading) {
    return (
      <AppLayout>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-white/70">Cargando…</div>
      </AppLayout>
    )
  }

  if (!resource) {
    return (
      <AppLayout>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-white/70">Recurso no encontrado.</div>
      </AppLayout>
    )
  }

  const isPdf = resource.type === 'pdf'
  const isVideo = resource.type === 'video'
  const driveId = extractDriveFileId(resource.pdf_url ?? null)
  const downloadUrl = driveId ? driveDownloadUrl(driveId) : (resource.pdf_url ?? resource.pdf_path ?? null)
  return (
    <AppLayout>
      <PageHeader title={resource.title} subtitle={resource.topic ?? resource.ministry ?? ''} right={right} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {isVideo && resource.video_url ? <VideoPlayer url={resource.video_url} /> : null}
          {isPdf && (resource.pdf_url || resource.pdf_path) ? (
            <PdfViewer url={resource.pdf_url ?? resource.pdf_path!} />
          ) : null}

          {resource.description ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm font-semibold text-white/90 mb-2">Descripción</div>
              <div className="text-sm text-white/70 leading-relaxed">{resource.description}</div>
            </div>
          ) : null}

          {suggested.length ? (
            <div>
              <div className="mb-3 text-sm font-semibold text-white/90">Sugeridos para ti</div>
              <div className="flex gap-4 overflow-x-auto pb-3">
                {suggested.map((r) => (
                  <ResourceCard key={r.id} resource={r} variant="carousel" showDescription={false} />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs text-white/60">DETALLES</div>
            <div className="mt-2 text-sm text-white/85">
              <div className="flex justify-between py-1"><span className="text-white/60">Tipo</span><span>{resource.type.toUpperCase()}</span></div>
              <div className="flex justify-between py-1"><span className="text-white/60">Verificado</span><span>{resource.is_verified ? 'Sí' : 'No'}</span></div>
              {resource.pages ? <div className="flex justify-between py-1"><span className="text-white/60">Páginas</span><span>{resource.pages}</span></div> : null}
              {resource.file_size_mb ? <div className="flex justify-between py-1"><span className="text-white/60">Tamaño</span><span>{Number(resource.file_size_mb).toFixed(1)} MB</span></div> : null}
            </div>

            {isPdf && (resource.pdf_url || resource.pdf_path) ? (
              <a
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold hover:bg-indigo-400"
                href={downloadUrl!}
                target="_blank"
                rel="noreferrer"
              >
                Descargar PDF
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
