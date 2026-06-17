import { createContext, useContext, useState, useMemo, useRef, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import parseSpecSections from '../utils/parseSpecSections'
import remoteModels from '../data/remoteModels'

const specModules = import.meta.glob('/src/data/specs/*.md', { query: '?raw', import: 'default', eager: true })

const SpecCtx = createContext(null)

export function SpecRoot({ catalogId, children }) {
  const [hoveredId, setHoveredId] = useState(null)
  const clearTimer = useRef(null)

  const keepHover = useCallback(() => {
    clearTimeout(clearTimer.current)
  }, [])

  const delayClear = useCallback(() => {
    clearTimeout(clearTimer.current)
    clearTimer.current = setTimeout(() => setHoveredId(null), 300)
  }, [])

  const sections = useMemo(() => {
    const path = `/src/data/specs/${catalogId}.md`
    const mod = specModules[path]
    return mod ? parseSpecSections(mod) : []
  }, [catalogId])

  return (
    <SpecCtx.Provider value={{ sections, hoveredId, setHoveredId, keepHover, delayClear, catalogId }}>
      {children}
    </SpecCtx.Provider>
  )
}

function useSpec() {
  const ctx = useContext(SpecCtx)
  if (!ctx) throw new Error('Spec components must be used within <SpecRoot>')
  return ctx
}

export function SpecTOC({ horizontal }) {
  const { sections, hoveredId, setHoveredId, keepHover, delayClear } = useSpec()

  if (sections.length === 0) return null

  if (horizontal) {
    return (
      <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar px-3 py-1.5" onMouseLeave={delayClear}>
        {sections.map((s) => (
          <button
            key={s.id}
            onMouseEnter={() => { keepHover(); setHoveredId(s.id) }}
            className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
              hoveredId === s.id
                ? 'bg-primary/15 text-primary shadow-[0_0_12px_rgba(192,193,255,0.08)]'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-high'
            }`}
          >
            {s.title}
          </button>
        ))}
      </nav>
    )
  }

  return (
    <nav className="flex flex-col gap-0.5 p-2 pr-4">
      {sections.map((s) => (
        <button
          key={s.id}
          onMouseEnter={() => setHoveredId(s.id)}
          onMouseLeave={() => setHoveredId(null)}
          className={`relative w-full text-left px-2 py-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
            hoveredId === s.id
              ? 'bg-primary/10 text-primary shadow-[0_0_12px_rgba(192,193,255,0.08)]'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-high'
          }`}
        >
          {hoveredId === s.id && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-full" />
          )}
          {s.title}
        </button>
      ))}
    </nav>
  )
}

function MarkdownContent({ content }) {
  return (
    <div className="text-sm text-on-surface leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ children }) => (
            <div className="mb-4">
              <table className="w-full text-xs border-collapse table-fixed">{children}</table>
            </div>
          ),
          tr: ({ children }) => (
            <tr className="border-b border-white/5 even:bg-white/[0.02]">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="text-left px-2 py-1.5 text-on-surface-variant font-medium">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-2 py-1.5 text-on-surface-variant">{children}</td>
          ),
          h2: ({ children }) => (
            <h2 className="text-xs font-bold text-on-surface mt-3 mb-1.5 pb-1 border-b border-white/5">{children}</h2>
          ),
          p: ({ children }) => {
            const text = typeof children === 'string' ? children : ''
            if (text.match(/^(Samsung|HW-)/i)) {
              return <p className="text-xs text-tertiary font-semibold mt-2 mb-1">{children}</p>
            }
            return <p className="text-xs text-outline my-1">{children}</p>
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export function SpecContent() {
  const { sections, hoveredId, keepHover, catalogId } = useSpec()

  const activeId = hoveredId || (sections.length > 0 ? sections[0].id : null)
  const active = sections.find((s) => s.id === activeId)

  if (!active) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <span className="material-symbols-outlined text-3xl text-outline/30 mb-3">description</span>
        <p className="text-xs text-outline/50">Pasa el cursor sobre una sección</p>
      </div>
    )
  }

  const remote = active.id === 'accesorios' ? remoteModels[catalogId] : null

  return (
    <div key={active.id} className="p-3 animate-fade-up overflow-x-hidden" onMouseEnter={keepHover}>
      <h3 className="text-xs uppercase tracking-widest font-semibold text-primary mb-2">{active.title}</h3>
      <MarkdownContent content={remote ? `Mando\n${remote.model}${remote.partNumber ? ` (${remote.partNumber})` : ''} — ${remote.description}\n\n${active.content}` : active.content} />
      {remote && (
        <div className="mt-4 flex flex-col items-center gap-2">
          <img
            src={`/images/remotes/${remote.model}.png`}
            alt={`Mando ${remote.model}`}
            className="max-h-64 w-auto object-contain rounded-xl"
            onError={(e) => e.target.style.display = 'none'}
          />
        </div>
      )}
    </div>
  )
}

export function SpecMobile() {
  const { sections, catalogId } = useSpec()

  if (sections.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-outline/50">
        No hay ficha técnica disponible
      </div>
    )
  }

  return (
    <div className="divide-y divide-white/5">
      {sections.map((s) => {
        const remote = s.id === 'accesorios' ? remoteModels[catalogId] : null
        return (
          <section key={s.id} className="p-4">
            <h3 className="text-xs uppercase tracking-widest font-semibold text-primary mb-3">{s.title}</h3>
            <MarkdownContent content={remote ? `Mando\n${remote.model}${remote.partNumber ? ` (${remote.partNumber})` : ''} — ${remote.description}\n\n${s.content}` : s.content} />
            {remote && (
              <div className="mt-4 flex flex-col items-center gap-2">
                <img
                  src={`/images/remotes/${remote.model}.png`}
                  alt={`Mando ${remote.model}`}
                  className="max-h-48 w-auto object-contain rounded-xl"
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}
