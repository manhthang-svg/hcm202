import { chromium } from 'playwright-core'

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
})

const report = []
for (const width of [360, 768, 1280, 1920]) {
  const page = await browser.newPage({ viewport: { width, height: width < 900 ? 900 : 1080 } })
  const errors = []
  page.on('console', message => message.type() === 'error' && errors.push(message.text()))
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(300)
  const sections = await page.locator('header, main, footer').evaluateAll(nodes => nodes.map(node => ({
    name: node.tagName.toLowerCase(),
    right: Math.ceil(node.getBoundingClientRect().right),
    width: Math.ceil(node.getBoundingClientRect().width),
  })))
  await page.evaluate(() => {
    const journey = document.querySelector('.journey')
    scrollTo({ top: journey.offsetTop + (journey.offsetHeight - innerHeight) * .56, behavior: 'instant' })
  })
  await page.waitForTimeout(120)
  const scene = await page.evaluate(() => ({
    cardRight: Math.ceil(document.querySelector('.chapter-card').getBoundingClientRect().right),
    cardLeft: Math.floor(document.querySelector('.chapter-card').getBoundingClientRect().left),
    cardOpacity: Number(getComputedStyle(document.querySelector('.chapter-card')).opacity),
  }))
  const pageWidth = await page.evaluate(() => document.documentElement.scrollWidth)
  report.push({ width, pageWidth, horizontalOverflow: pageWidth > width, sections, scene, errors })
  await page.close()
}

console.log(JSON.stringify(report, null, 2))
await browser.close()
