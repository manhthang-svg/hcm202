import { chromium } from 'playwright-core'

const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe' })
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
const errors = []
page.on('console', message => message.type() === 'error' && errors.push(message.text()))
page.on('pageerror', error => errors.push(error.message))
await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' })

async function seek(chapter, local) {
  await page.evaluate(({ chapter, local }) => {
    const journey = document.querySelector('.journey')
    scrollTo({ top: journey.offsetTop + (journey.offsetHeight - innerHeight) * ((chapter + local) / 8), behavior: 'instant' })
  }, { chapter, local })
  await page.waitForTimeout(120)
  return page.evaluate(() => ({
    viewBox: document.querySelector('.growth-tree').getAttribute('viewBox').split(' ').map(Number),
    cardOpacity: Number(getComputedStyle(document.querySelector('.chapter-card')).opacity),
    branchOffset: Number.parseFloat(getComputedStyle(document.querySelector('[data-branch="0"]')).getPropertyValue('stroke-dashoffset')),
    firstLeafOpacity: Number(getComputedStyle(document.querySelector('[data-leaf="0"]')).opacity),
  }))
}

const grow = await seek(0, .06)
const content = await seek(0, .48)
const leaf = await seek(0, .97)
const persisted = await seek(1, .08)
const dom = await page.evaluate(() => ({
  chapters: document.querySelectorAll('.chapter-progress > div').length,
  cards: document.querySelectorAll('.chapter-card').length,
  interactiveContentControls: document.querySelectorAll('details, [role="dialog"], .toggle, .choices').length,
  hasPractice: Boolean(document.querySelector('#practice')),
}))

const width = state => state.viewBox[2]
console.log(JSON.stringify({
  grow, content, leaf, persisted,
  assertions: {
    cameraZoomsIn: width(content) < width(grow) * .5,
    cameraZoomsBackOut: width(leaf) > width(content) * 1.8,
    contentAppears: content.cardOpacity > .9,
    branchGrows: leaf.branchOffset < grow.branchOffset,
    leafAppears: leaf.firstLeafOpacity > .9,
    leafPersists: persisted.firstLeafOpacity > .9,
  },
  ...dom,
  errors,
}, null, 2))
await browser.close()
