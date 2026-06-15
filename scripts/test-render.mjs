import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs'
import { createCanvas } from 'canvas'
import sharp from 'sharp'
import { writeFileSync } from 'fs'

// Test with a small PDF from Drive
const fileId = '1YOdeFw1xDs2Q9Dhne2RVSRSmlasOCLWC' // M72H
const url = `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`

console.log('Downloading PDF...')
const resp = await fetch(url)
const buffer = Buffer.from(await resp.arrayBuffer())
console.log(`Downloaded ${buffer.length} bytes`)

console.log('Loading PDF...')
const doc = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise
console.log(`Pages: ${doc.numPages}`)

const page = await doc.getPage(1)
const scale = 2
const viewport = page.getViewport({ scale })

const canvas = createCanvas(viewport.width, viewport.height)
const ctx = canvas.getContext('2d')

await page.render({ canvasContext: ctx, viewport }).promise
console.log(`Rendered page: ${viewport.width}x${viewport.height}`)

const buf = canvas.toBuffer('image/png')
writeFileSync('test-output.png', buf)
console.log('Saved test-output.png')

// Also try WebP via sharp
await sharp(buf).webp({ quality: 90 }).toFile('test-output.webp')
console.log('Saved test-output.webp')
