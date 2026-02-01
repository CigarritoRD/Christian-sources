// src/components/SearchBar.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SearchBar() {
  const [q, setQ] = useState('')
  const nav = useNavigate()

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        nav(`/buscar?q=${encodeURIComponent(q.trim())}`)
      }}
      style={{ display: 'flex', gap: 10, marginTop: 12 }}
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar por tema, ministerio, palabra clave…"
        style={{
          flex: 1,
          padding: '12px 14px',
          borderRadius: 12,
          border: '1px solid rgba(0,0,0,0.15)',
          outline: 'none',
        }}
      />
      <button
        type="submit"
        style={{
          padding: '12px 14px',
          borderRadius: 12,
          border: 'none',
          background: 'black',
          color: 'white',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        Buscar
      </button>
    </form>
  )
}
