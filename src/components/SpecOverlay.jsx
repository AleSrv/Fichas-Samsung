import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const specModules = import.meta.glob('/src/data/specs/*.md', { query: '?raw', import: 'default', eager: true })

export default function SpecOverlay({ catalogId, onClose }) {
  const [content, setContent] = useState('')

  useEffect(() => {
    const path = `/src/data/specs/${catalogId}.md`
    const mod = specModules[path]
    if (mod) {
      setContent(mod.replace(/<!--\s*image\s*-->/gi, '').trim())
    }
  }, [catalogId])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-surface-high border border-white/10 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between px-5 py-3 bg-surface-high/90 backdrop-blur-sm border-b border-white/5 z-10 rounded-t-2xl">
          <span className="text-xs uppercase tracking-widest font-semibold text-primary">Ficha técnica</span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-surface-highest transition-colors text-on-surface-variant hover:text-on-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
        <div className="p-5 text-sm text-on-surface leading-relaxed prose prose-invert prose-sm max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              table: ({ children }) => (
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-xs border-collapse">{children}</table>
                </div>
              ),
              tr: ({ children }) => (
                <tr className="border-b border-white/5 even:bg-white/[0.02]">{children}</tr>
              ),
              th: ({ children }) => (
                <th className="text-left px-3 py-2 font-semibold text-primary whitespace-nowrap">{children}</th>
              ),
              td: ({ children }) => (
                <td className="px-3 py-2 text-on-surface-variant whitespace-nowrap">{children}</td>
              ),
              h2: ({ children }) => (
                <h2 className="text-sm font-bold text-on-surface mt-5 mb-2 pb-1 border-b border-white/5">{children}</h2>
              ),
              p: ({ children }) => {
                const text = typeof children === 'string' ? children : ''
                if (text.match(/^(Samsung|HW-)/i)) {
                  return (
                    <p className="text-xs text-tertiary font-semibold mt-2 mb-1">{children}</p>
                  )
                }
                return <p className="text-xs text-outline my-1">{children}</p>
              },
            }}
          >
            {content || 'Cargando...'}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
