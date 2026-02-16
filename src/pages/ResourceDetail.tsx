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
    return () => {
      mounted = false
    }
  }, [slug])

  const right = useMemo(() => {
    if (!resource) return null

    const baseBtn =
      'rounded-xl border border-app bg-card px-4 py-2 text-sm font-semibold transition shadow-sm hover:shadow-md'
    const ghostBtn =
      'rounded-xl border border-app bg-card px-4 py-2 text-sm transition shadow-sm hover:shadow-md'

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
            baseBtn,
            flags.saved
              ? 'bg-[rgb(var(--surface2))]/10 border-[rgb(var(--surface))]/25'
              : 'hover:bg-[rgb(var(--surface2))]/10',
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
            ghostBtn,
            flags.favorite
              ? 'border-rose-500/30 bg-rose-500/10 text-rose-700'
              : 'text-app hover:bg-rose-500/10 hover:border-rose-500/20',
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
        <div className="rounded-2xl border border-app bg-card p-8 text-muted shadow-sm">
          Cargando…
        </div>
      </AppLayout>
    )
  }

  if (!resource) {
    return (
      <AppLayout>
        <div className="rounded-2xl border border-app bg-card p-8 text-muted shadow-sm">
          Recurso no encontrado.
        </div>
      </AppLayout>
    )
  }

  const isPdf = resource.type === 'pdf'
  const isVideo = resource.type === 'video'
  const driveId = extractDriveFileId(resource.pdf_url ?? null)
  const downloadUrl = driveId
    ? driveDownloadUrl(driveId)
    : resource.pdf_url ?? resource.pdf_path ?? null

  return (
    <AppLayout>
      <PageHeader
        title={resource.title}
        subtitle={resource.topic ?? resource.ministry ?? ''}
        right={right}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        {/* MAIN */}
        <div className="space-y-6">
          {isVideo && resource.video_url ? <VideoPlayer url={resource.video_url} /> : null}

          {isPdf && (resource.pdf_url || resource.pdf_path) ? (
            <div className="rounded-2xl border border-app bg-card shadow-sm overflow-hidden">
              <PdfViewer url={resource.pdf_url ?? resource.pdf_path!} />
            </div>
          ) : null}

          {resource.description ? (
            <div className="rounded-2xl border border-app bg-card p-5 shadow-sm">
              <div className="font-heading text-sm font-extrabold text-app mb-2">
                Descripción
              </div>
              <div className="text-[15px] text-muted leading-relaxed font-body">
                {resource.description}
              </div>
            </div>
          ) : null}

          {suggested.length ? (
            <div className="space-y-3">
              <div className="font-heading text-sm font-extrabold text-app">
                Sugeridos para ti
              </div>
              <div className="flex gap-4 overflow-x-auto pb-3 no-scrollbar">
                {suggested.map((r) => (
                  <ResourceCard key={r.id} resource={r} variant="carousel" showDescription={false} />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* SIDEBAR */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-app bg-card p-5 shadow-sm">
            <div className="text-xs text-muted font-heading tracking-wide">DETALLES</div>

            <div className="mt-3 text-sm text-app">
              <Row label="Tipo" value={resource.type.toUpperCase()} />
              <Row label="Verificado" value={resource.is_verified ? 'Sí' : 'No'} />
              {resource.pages ? <Row label="Páginas" value={`${resource.pages}`} /> : null}
              {resource.file_size_mb ? (
                <Row label="Tamaño" value={`${Number(resource.file_size_mb).toFixed(1)} MB`} />
              ) : null}
            </div>

            {isPdf && downloadUrl ? (
              <a
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[rgb(var(--surface))] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition"
                href={downloadUrl}
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-1.5">
      <span className="text-muted">{label}</span>
      <span className="text-app font-medium">{value}</span>
    </div>
  )
}