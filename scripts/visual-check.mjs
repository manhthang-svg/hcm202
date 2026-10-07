import { chromium } from 'playwright-core'

const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe' })
const report = []

async function seek(page, chapter, local) {
  await page.evaluate(({ chapter, local }) => {
    const journey = document.querySelector('.journey')
    const range = journey.offsetHeight - innerHeight
    scrollTo({ top: journey.offsetTop + range * ((chapter + local) / 8), behavior: 'instant' })
  }, { chapter, local })
  await page.waitForTimeout(180)
}

for (const item of [{ name: 'mobile', width: 390, height: 844 }, { name: 'desktop', width: 1440, height: 1000 }]) {
  const page = await browser.newPage({ viewport: { width: item.width, height: item.height } })
  const errors = []
  page.on('console', message => message.type() === 'error' && errors.push(message.text()))
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(350)
  await page.screenshot({ path: `${item.name}-hero.png` })

  for (const shot of [
    { name: 'grow', chapter: 0, local: .1 },
    { name: 'content', chapter: 0, local: .48 },
    { name: 'leaf', chapter: 0, local: .96 },
    { name: 'story', chapter: 4, local: .48 },
    { name: 'final-tree', chapter: 7, local: .98 },
  ]) {
    await seek(page, shot.chapter, shot.local)
    await page.screenshot({ path: `${item.name}-${shot.name}.png` })
  }
  const metrics = await page.evaluate(() => ({
    viewport: innerWidth,
    pageWidth: document.documentElement.scrollWidth,
    details: document.querySelectorAll('details').length,
    dialogs: document.querySelectorAll('[role="dialog"]').length,
    practice: Boolean(document.querySelector('#practice')),
    chapters: document.querySelectorAll('.chapter-progress > div').length,
  }))
  report.push({ name: item.name, ...metrics, horizontalOverflow: metrics.pageWidth > metrics.viewport, errors })
  await page.close()
}
console.log(JSON.stringify(report, null, 2))
await browser.close()
