import { pdfToPng } from 'pdf-to-png-converter'
import sharp from 'sharp'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outputDir = resolve(__dirname, '..', 'public', 'images')
if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true })

const entries = [
  { id: 'm72h-2026',         fileId: '1YOdeFw1xDs2Q9Dhne2RVSRSmlasOCLWC', pages: 2 },
  { id: 'm73h-2026',         fileId: '1Gg1XnQmK1niDJtF4wJEJ70nx7WbDGqD9', pages: 2 },
  { id: 'm80h-2026',         fileId: '1MKeEbs_N9FrtmdZY59xOhMh_lBKjiIR3', pages: 2 },
  { id: 'm90h-2026',         fileId: '1PZKIHXLpIUtCmwZyuDTPI4PPFJqdCFwN', pages: 2 },
  { id: 'f6005f-2026',       fileId: '1FZltqkEU9pl9IPUz1yQ4GCshBExkbGUN', pages: 2 },
  { id: 'h5005f-2026',       fileId: '1Illjcemk4F8z70gSZzeEd5axvW8UWcqF', pages: 2 },
  { id: 'microled-2024',     fileId: '1GBqhloZBLD6dPcCmMUwF30qWcX9TKm3S', pages: 2 },
  { id: 'moving-style-2025', fileId: '18pQZwwGYAi74_XXs0HuWxtXzImECfbpB', pages: 2 },
  { id: 'one-connect-2026',  fileId: '1OcEmo0pmf1nxVlY3wrVGXfDmo0u6TEiB', pages: 2 },
  { id: 'q5f-2026',          fileId: '1RFBoS8Lj3p1B0u0gxEg2mpfD7RbBTXoA', pages: 2 },
  { id: 'qn1eh-2026',        fileId: '1Hp7tj_EqajIBgMaOto_yQ4ZNd6eFH9fQ', pages: 2 },
  { id: 'qn70h-2026',        fileId: '1tXUNkhPRQk1PiOIYChbzRLjRgDz7R2kD', pages: 2 },
  { id: 'qn73h-2026',        fileId: '1d7e-oaFiP5M5Qi5fLse2IK8fDtqzwopt', pages: 2 },
  { id: 'qn80h-2026',        fileId: '1EDpTV0DBewUCFjxFni0cZIQq_JA_CV9a', pages: 2 },
  { id: 'qn90f-2026',        fileId: '15tN0Zcqc0GqvVp3tWIA-f7W0LkGGoCKz', pages: 2 },
  { id: 'r85h-2026',         fileId: '1crS-_hfbOVw5tyZ5rGpOcVzR4IBL--9X', pages: 2 },
  { id: 'r95h-2026',         fileId: '1yBrrrfWkZYttHjkkNWB07kQW1Mtwoaqi', pages: 2 },
  { id: 's83h-2026',         fileId: '1xs3vZnfraea9a62Lwj0sMB5sE-r05Va9', pages: 2 },
  { id: 's90h-2026',         fileId: '1ZoEJzWyP-dqiCBZ_IWhxR5MnT_RKtnDm', pages: 2 },
  { id: 's93h-2026',         fileId: '1O7_-uZ6yopXVxzLyxXAaDMGqdAXkOjKU', pages: 2 },
  { id: 's95h-2026',         fileId: '1tFiI2bmyop_YvYfehNTEgCi6N7FpfZn7', pages: 2 },
  { id: 's99h-2026',         fileId: '1dr6A7ZTAJwMzX0fUi3ji--8Gj8Yo5Btb', pages: 2 },
  { id: 'the-frame-2026',    fileId: '1EwUBCHfQjosO2ilo6SXksD1ivdwyD05D', pages: 2 },
  { id: 'marcos-the-frame',  fileId: '1YwgT7jULp-tbsn4-7MA3EFKJXtf1coj7', pages: 2 },
  { id: 'the-frame-pro-2026', fileId: '1D1wrSzsoZGPi36i32x_khfCWmJjHsJPI', pages: 2 },
  { id: 'the-premiere-5-2025', fileId: '1MSSDGqcvBnqXGyUg26feAywdMHFVvTnJ', pages: 2 },
  { id: 'u7005h-2026',       fileId: '1x72aNaroTGZ0hXtPLzYCCCgd4G07HwsI', pages: 2 },
  { id: 'u8075h-2026',       fileId: '1xwTqq0o4miychijQ3YI6GSZ7xo8zjpSU', pages: 2 },
  { id: 'u9005h-2026',       fileId: '1T71Bp74IZQHWMmIivUYBXDCbZcqXCyfD', pages: 2 },
  { id: 'hw-q600h-2026',     fileId: '1VSj4zqyN4nCCrj7g3uErXHjd2rhGEob-', pages: 2 },
  { id: 'hw-q800h-2026',     fileId: '1ucMjraIIeMLrAX3YOr5d0AoSZqDnBCWJ', pages: 2 },
  { id: 'hw-q930h-2026',     fileId: '1d9SrhmgF8p1Tu6W8dsR3-a1TbW2mj1CJ', pages: 2 },
  { id: 'hw-q990h-2026',     fileId: '1K2GxFD4BTXnLBcbdOMzfxPeGBSepWYFx', pages: 2 },
  { id: 'hw-qs90h-2026',     fileId: '1-a6CgcJMm5FlA3w7eODPUUdYKfq48jty', pages: 2 },
  { id: 'ls50-51h-2026',     fileId: '1LlyIqU_7fso3iOYje_tWyTLxceEoZqEx', pages: 2 },
  { id: 'ls70-71h-2026',     fileId: '1zN_gDY_mYE3_GqFTJvPzHeDAO_gQzhjj', pages: 2 },
]

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function downloadWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const resp = await fetch(url)
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
      return Buffer.from(await resp.arrayBuffer())
    } catch (e) {
      if (i < retries - 1) {
        const delay = (i + 1) * 3000
        console.log(`  retry in ${delay}ms (${i + 1}/${retries})`)
        await sleep(delay)
      } else throw e
    }
  }
}

let ok = 0, fail = 0

for (const entry of entries) {
  const webp1 = resolve(outputDir, `${entry.id}-1.webp`)
  if (existsSync(webp1)) {
    console.log(`${entry.id} ... already exists, skipping`)
    ok++
    continue
  }

  process.stdout.write(`${entry.id} ... `)
  try {
    const url = `https://drive.google.com/uc?export=download&id=${entry.fileId}&confirm=t`
    const pdfBuf = await downloadWithRetry(url)
    const pages = await pdfToPng(pdfBuf, { viewportScale: 2.0 })

    for (let i = 0; i < entry.pages; i++) {
      if (!pages[i]) throw new Error(`Page ${i + 1} not rendered`)
      const outPath = resolve(outputDir, `${entry.id}-${i + 1}.webp`)
      await sharp(pages[i].content).webp({ quality: 90 }).toFile(outPath)
    }
    ok++
    console.log('OK')
  } catch (e) {
    fail++
    console.log(`FAIL: ${e.message}`)
  }

  await sleep(1000)
}

console.log(`\nDone: ${ok} OK, ${fail} FAIL`)
