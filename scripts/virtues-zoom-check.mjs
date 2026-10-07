import { chromium } from 'playwright-core'

const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe' })
const report = []

const scaleOf = transform => transform === 'none' ? 1 : Number(transform.match(/^matrix\(([^,]+)/)?.[1] ?? 1)

for (const device of [
  { name: 'desktop', width: 1440, height: 1000, expectedScale: 3.2, distance: 2.5 },
  { name: 'mobile', width: 390, height: 844, expectedScale: 2.2, distance: 1.8 },
]) {
  const page = await browser.newPage({ viewport: { width: device.width, height: device.height } })
  const errors = []
  page.on('console', message => message.type() === 'error' && errors.push(message.text()))
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  const start = await page.locator('.virtues-zoom').evaluate(node => node.offsetTop)

  async function seek(y, wait = 1300) {
    await page.evaluate(value => scrollTo({ top: value, behavior: 'instant' }), y)
    await page.waitForTimeout(wait)
    return page.evaluate(() => ({
      transform: getComputedStyle(document.querySelector('.virtue-svg-scene')).transform,
      surroundingsOpacity: Number(getComputedStyle(document.querySelector('.virtue-surroundings')).opacity),
      anchorOpacity: Number(getComputedStyle(document.querySelector('.virtue-ring')).opacity),
      headingTransform: getComputedStyle(document.querySelector('.virtue-heading')).transform,
      controlsOpacity: Number(getComputedStyle(document.querySelector('.virtue-controls')).opacity),
      controlsHidden: document.querySelector('.virtue-controls').getAttribute('aria-hidden'),
      willChange: getComputedStyle(document.querySelector('.virtue-svg-scene')).willChange,
    }))
  }

  const initial = await seek(start)
  await page.screenshot({ path: `${device.name}-virtues-start.png` })
  const middle = await seek(start + device.height * device.distance * .5)
  await page.screenshot({ path: `${device.name}-virtues-middle.png` })
  const end = await seek(start + device.height * device.distance + 12)
  await page.screenshot({ path: `${device.name}-virtues-end.png` })
  await page.getByRole('button', { name: /Kiệm/ }).click()
  const selectedText = await page.locator('.virtue-detail').innerText()
  const reversed = await seek(start)

  report.push({
    device: device.name,
    initialScale: scaleOf(initial.transform),
    middleScale: scaleOf(middle.transform),
    endScale: scaleOf(end.transform),
    reversedScale: scaleOf(reversed.transform),
    end,
    selectedText,
    assertions: {
      startsAtOne: Math.abs(scaleOf(initial.transform) - 1) < .03,
      reachesExpectedScale: Math.abs(scaleOf(end.transform) - device.expectedScale) < .08,
      reversesToOne: Math.abs(scaleOf(reversed.transform) - 1) < .03,
      fadesSurroundings: end.surroundingsOpacity <= .16,
      ringIsClear: end.anchorOpacity >= .99,
      controlsEnabled: end.controlsHidden === 'false',
      buttonWorks: selectedText.toLocaleLowerCase('vi').includes('tiết kiệm'),
      willChangeRemoved: end.willChange === 'auto',
    },
    errors,
  })
  await page.close()
}

const reducedPage = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
await reducedPage.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' })
await reducedPage.waitForTimeout(400)
const reduced = await reducedPage.evaluate(() => ({
  scale: getComputedStyle(document.querySelector('.virtue-svg-scene')).transform,
  controlsOpacity: Number(getComputedStyle(document.querySelector('.virtue-controls')).opacity),
  controlsHidden: document.querySelector('.virtue-controls').getAttribute('aria-hidden'),
  hasPinSpacer: Boolean(document.querySelector('.virtues-zoom').parentElement?.classList.contains('pin-spacer')),
}))
report.push({ reducedMotion: reduced, assertions: { noZoom: Math.abs(scaleOf(reduced.scale) - 1) < .01, contentVisible: reduced.controlsOpacity === 1, noPin: !reduced.hasPinSpacer } })
await reducedPage.close()

console.log(JSON.stringify(report, null, 2))
await browser.close()
