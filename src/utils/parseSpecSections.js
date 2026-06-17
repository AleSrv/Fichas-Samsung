export default function parseSpecSections(md) {
  const cleaned = md.replace(/<!--\s*image\s*-->/gi, '').trim()
  const parts = cleaned.split(/(?=^## )/m)

  const sections = []

  for (const part of parts) {
    const lines = part.trim().split('\n')
    const headingMatch = lines[0].match(/^## (.+)/)
    if (headingMatch) {
      sections.push({
        id: headingMatch[1].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'section',
        title: headingMatch[1],
        content: lines.slice(1).join('\n').trim(),
      })
    } else if (part.trim()) {
      sections.unshift({
        id: 'destacados',
        title: 'Destacados',
        content: part.trim(),
      })
    }
  }

  const hasHeadings = parts.some(p => /^## /.test(p.trim()))

  if (sections.length === 0) {
    sections.push({ id: 'detalles', title: 'Detalles', content: cleaned || '' })
  } else if (hasHeadings) {
    const last = sections[sections.length - 1]
    if (last.id !== 'accesorios') {
      last.title = 'Tamaño'
      last.id = 'tamano'
    }
  }

  return sections
}
