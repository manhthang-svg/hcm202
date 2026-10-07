import { chromium } from 'playwright-core'

const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe' })
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' })
await page.waitForTimeout(500)

const result = await page.evaluate(async () => {
  const section = document.querySelector('.virtues-zoom')
  const start = section.offsetTop
  const end = start + innerHeight * 2.5
  const longTasks = []
  const observer = new PerformanceObserver(list => {
    for (const entry of list.getEntries()) longTasks.push(entry.duration)
  })
  try { observer.observe({ entryTypes: ['longtask'] }) } catch { /* unsupported browsers */ }
  const frameTimes = []
  let previous = performance.now()
  await new Promise(resolve => {
    let frame = 0
    const tick = now => {
      frameTimes.push(now - previous)
      previous = now
      scrollTo(0, start + (end - start) * (frame / 180))
      frame += 1
      if (frame <= 180) requestAnimationFrame(tick)
      else resolve()
    }
    requestAnimationFrame(tick)
  })
  await new Promise(resolve => setTimeout(resolve, 1100))
  observer.disconnect()
  const stable = frameTimes.slice(5).sort((a, b) => a - b)
  const average = stable.reduce((sum, value) => sum + value, 0) / stable.length
  return {
    frames: stable.length,
    averageFrameMs: Number(average.toFixed(2)),
    p95FrameMs: Number(stable[Math.floor(stable.length * .95)].toFixed(2)),
    framesOver25ms: stable.filter(value => value > 25).length,
    longTasks: longTasks.map(value => Number(value.toFixed(2))),
  }
})

console.log(JSON.stringify({ ...result, targetFrameBudgetMs: 16.67 }, null, 2))
await browser.close()
