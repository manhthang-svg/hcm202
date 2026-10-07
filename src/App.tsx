import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type Chapter = {
  id: string
  eyebrow: string
  title: string
  body: ReactNode
  target: [number, number]
  tone: string
  art: string
}

const chapters: Chapter[] = [
  {
    id: 'cai-goc', eyebrow: 'Nền tảng', title: 'Đạo đức là cái gốc', target: [500, 690], tone: '#17251d', art: 'roots',
    body: <><blockquote>“Cũng như sông thì có nguồn mới có nước, không có nguồn thì sông cạn. Cây phải có gốc, không có gốc thì cây héo.”</blockquote><p><strong>Tài</strong> giúp ta làm được việc. <strong>Đức</strong> giúp ta biết việc nào nên làm và làm vì ai.</p><div className="mini-list"><span>Truyền thống dân tộc</span><span>Tinh hoa văn hóa nhân loại</span><span>Lý luận và thực tiễn cách mạng</span></div></>,
  },
  {
    id: 'bon-duc', eyebrow: 'Thân cây', title: 'Bốn đức giữ một con người đứng vững', target: [365, 545], tone: '#d9e3dc', art: 'compass',
    body: <><p className="quote-line">“Trời có bốn mùa… Người có bốn đức: Cần, Kiệm, Liêm, Chính.”</p><div className="virtue-grid"><span><b>Cần</b> Chăm làm, chăm học.</span><span><b>Kiệm</b> Quý thời gian và của chung.</span><span><b>Liêm</b> Trong sạch, không tham phần hơn.</span><span><b>Chính</b> Ngay thẳng và có trách nhiệm.</span></div></>,
  },
  {
    id: 'quan-he', eyebrow: 'Cành cây', title: 'Từ sửa mình, vươn ra cách đối xử với người khác', target: [675, 455], tone: '#20382b', art: 'relations',
    body: <div className="relation-list"><p><b>Chí công vô tư</b> — đặt việc chung trước lợi ích riêng.</p><p><b>Yêu thương con người</b> — sống có tình, có nghĩa.</p><p><b>Tinh thần quốc tế trong sáng</b> — tôn trọng hòa bình và công lý.</p><p><b>Nói đi đôi với làm</b> — tự mình thực hành trước.</p></div>,
  },
  {
    id: 'cau-chuyen-can', eyebrow: 'Nêu gương · Cần', title: 'Mảnh vườn 36 mét vuông', target: [280, 355], tone: '#243a2d', art: 'garden',
    body: <><p>Năm 1952, Bác nhận thi đua tăng gia với người phụ trách vườn trên cùng diện tích 36 m². Người trực tiếp theo dõi giống, công chăm, phân và nước.</p><p>Lời kêu gọi lao động bắt đầu bằng việc tự mình làm.</p><Source href="https://baotanghochiminh.vn/bac-ho-tang-gia-rau-cai.htm">Bảo tàng Hồ Chí Minh</Source></>,
  },
  {
    id: 'cau-chuyen-kiem', eyebrow: 'Nêu gương · Kiệm', title: 'Mặt sau một tờ bản tin', target: [755, 300], tone: '#27406b', art: 'paper',
    body: <><p>Bản Di chúc được Bác viết, sửa qua nhiều năm. Có bản thảo được viết trên mặt sau một tờ bản tin cũ để tiết kiệm giấy.</p><p>Chi tiết nhỏ ấy nhất quán với lời nhắc phải quý từng tờ giấy và từng giờ làm việc.</p><Source href="https://hochiminh.vn/tin-tuc/chu-tich-ho-chi-minh-tam-guong-sang-ve-noi-di-doi-voi-lam-521">Cổng thông tin Hồ Chí Minh</Source></>,
  },
  {
    id: 'cau-chuyen-liem', eyebrow: 'Nêu gương · Liêm', title: 'Quà không dành cho riêng mình', target: [220, 225], tone: '#3f6d68', art: 'sharing',
    body: <><p>Khi được biếu hai chai nước mắm, Bác san sẻ để người khác cùng hưởng. Khi nhận hộp mật ong quý, Người đề nghị nấu chè cho mọi người.</p><p>Quà tặng không trở thành một đặc quyền cá nhân.</p><Source href="https://hochiminh.vn/tin-tuc/chu-tich-ho-chi-minh-tam-guong-sang-ve-noi-di-doi-voi-lam-521">Cổng thông tin Hồ Chí Minh</Source></>,
  },
  {
    id: 'cau-chuyen-chinh', eyebrow: 'Nêu gương · Chính', title: 'Tự mình làm trước', target: [800, 170], tone: '#2c4736', art: 'steps',
    body: <><p>Hồ Chí Minh nhấn mạnh sự thống nhất giữa lời nói với việc làm. Điều mình yêu cầu người khác cũng là điều mình tự thực hành trước.</p><p>Sức thuyết phục đến từ hành động người khác có thể nhìn thấy.</p><Source href="https://tulieuvankien.dangcongsan.vn/print/2535/dao-duc-ho-chi-minh-mot-cach-nhin-duong-dai">Tư liệu – Văn kiện</Source></>,
  },
  {
    id: 'hom-nay', eyebrow: 'Tán cây', title: 'Đạo đức bắt đầu từ một việc rất nhỏ', target: [505, 105], tone: '#e8eeea', art: 'canopy',
    body: <><div className="action-list"><p><b>01</b> Trả lời một lời hứa bạn đang để dở.</p><p><b>02</b> Dùng ít hơn một thứ mà không làm khó mình.</p><p><b>03</b> Nhận rõ phần việc của mình trong việc chung.</p></div><p className="quote-line">“Việc thiện thì dù nhỏ mấy cũng làm. Việc ác thì dù nhỏ mấy cũng tránh.”</p></>,
  },
]

const branches = [
  'M500 735C498 680 501 635 499 580',
  'M499 582C430 565 390 540 340 515',
  'M499 545C570 525 620 490 690 452',
  'M499 476C420 445 355 403 275 355',
  'M500 414C585 380 670 335 760 294',
  'M500 348C405 310 315 260 220 216',
  'M500 280C602 245 695 205 805 158',
  'M500 218C500 170 502 127 505 76M500 182C435 151 392 127 340 103M503 145C566 121 616 94 670 70',
]

const leaves = [
  [500, 575, -18], [330, 510, 18], [698, 447, -14], [265, 350, 22],
  [768, 289, -20], [210, 210, 16], [814, 153, -18], [507, 70, 5],
] as const

const virtues = [
  { name: 'Cần', label: 'Siêng năng', description: 'Lao động và học tập có kế hoạch, bền bỉ, sáng tạo; làm việc bằng tinh thần tự giác.' },
  { name: 'Kiệm', label: 'Tiết kiệm', description: 'Quý trọng thời gian, sức lao động và của công; không xa xỉ, không phô trương.' },
  { name: 'Liêm', label: 'Trong sạch', description: 'Không tham địa vị, tiền tài hay phần hơn; giữ mình ngay thẳng trước lợi ích riêng.' },
  { name: 'Chính', label: 'Ngay thẳng', description: 'Đối với mình, với người và với việc đều chân thành, có trách nhiệm, đặt điều đúng lên trước.' },
] as const

function Source({ href, children }: { href: string; children: ReactNode }) {
  return <a className="chapter-source" href={href} target="_blank" rel="noreferrer">Nguồn: {children}<span className="sr-only">, mở trong thẻ mới</span></a>
}

const clamp = (n: number) => Math.min(1, Math.max(0, n))
const smooth = (n: number) => { const t = clamp(n); return t * t * (3 - 2 * t) }

function zoomCurve(local: number) {
  if (local < .24) return smooth(local / .24)
  if (local < .7) return 1
  if (local < .92) return smooth(1 - (local - .7) / .22)
  return 0
}

function contentCurve(local: number) {
  const enter = smooth((local - .2) / .12)
  const exit = smooth((.82 - local) / .12)
  return Math.min(enter, exit)
}

function useGrowthJourney(journeyRef: React.RefObject<HTMLElement | null>) {
  const [state, setState] = useState({ index: 0, local: 0, page: 0, hero: 0 })
  useEffect(() => {
    let frame = 0
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const journey = journeyRef.current
        if (!journey) return
        const max = document.documentElement.scrollHeight - innerHeight
        const heroRange = Math.max(1, journey.offsetTop - innerHeight)
        const hero = clamp(scrollY / heroRange)
        const range = Math.max(1, journey.offsetHeight - innerHeight)
        const journeyProgress = clamp((scrollY - journey.offsetTop) / range)
        const raw = journeyProgress * chapters.length
        const index = Math.min(chapters.length - 1, Math.floor(raw))
        const local = index === chapters.length - 1 && journeyProgress === 1 ? 1 : raw - index
        setState({ index, local: reduced ? Math.max(local, .52) : local, page: max > 0 ? scrollY / max : 0, hero })
      })
    }
    update()
    addEventListener('scroll', update, { passive: true })
    addEventListener('resize', update)
    return () => { cancelAnimationFrame(frame); removeEventListener('scroll', update); removeEventListener('resize', update) }
  }, [journeyRef])
  return state
}

function Tree({ index, local, viewBox }: { index: number; local: number; viewBox: string }) {
  return <svg className="growth-tree" viewBox={viewBox} role="img" aria-labelledby="tree-title tree-desc">
    <title id="tree-title">Cây đạo đức lớn dần theo hành trình</title>
    <desc id="tree-desc">Mỗi nội dung hoàn thành làm một cành và một chiếc lá mới xuất hiện.</desc>
    <g className="tree-shadow" aria-hidden="true"><path d="M500 790C485 720 511 653 500 582C488 499 505 407 500 310C496 214 505 135 505 76" />{branches.slice(1).map((d, i) => <path d={d} key={i} />)}</g>
    <g className="tree-live">
      <path className="tree-base" d="M500 790C485 720 511 653 500 582" />
      {branches.map((d, i) => {
        const drawn = i < index ? 1 : i === index ? clamp(local / .18) : 0
        return <path key={d} data-branch={i} pathLength="1" d={d} style={{ strokeDashoffset: 1 - drawn }} />
      })}
    </g>
    <g className="tree-leaves">
      {leaves.map(([x, y, rotate], i) => {
        const shown = i < index ? 1 : i === index ? smooth((local - .82) / .14) : 0
        return <g key={`${x}-${y}`} data-leaf={i} className="leaf-cluster" style={{ opacity: shown, transform: `translate(${x}px, ${y}px) rotate(${rotate}deg) scale(${shown})` }}>
          <path className="leaf-blade" d="M0 0C18-24 52-25 72 0C51 24 18 24 0 0Z" />
          <path className="leaf-blade leaf-small" d="M0 0C15-20 42-20 58 0C42 20 15 20 0 0Z" transform="translate(-28 -30) rotate(-52)" />
          <path className="leaf-blade leaf-small" d="M0 0C15-20 42-20 58 0C42 20 15 20 0 0Z" transform="translate(22 27) rotate(42)" />
          <path className="leaf-vein" d="M8 0H62" />
        </g>
      })}
    </g>
    <g className="tree-roots"><path d="M500 790C444 786 403 803 352 826M500 790C540 810 591 821 653 822M500 790C495 819 486 844 468 869M500 790C459 768 421 755 377 748M500 790C552 774 593 755 629 731" /></g>
  </svg>
}

function Illustration({ kind }: { kind: string }) {
  if (kind === 'compass') return <div className="illustration compass-art"><i /><i /><i /><i /><span /></div>
  if (kind === 'relations') return <div className="illustration relations-art"><i /><i /><i /><i /><span /></div>
  if (kind === 'garden') return <div className="illustration garden-art"><i /><i /><span /></div>
  if (kind === 'paper') return <div className="illustration paper-art"><i /><span /></div>
  if (kind === 'sharing') return <div className="illustration sharing-art"><i /><i /><span /></div>
  if (kind === 'steps') return <div className="illustration steps-art"><i /><i /><i /><span /></div>
  if (kind === 'canopy') return <div className="illustration canopy-art"><i /><i /><i /><i /><span /></div>
  return <div className="illustration roots-art"><i /><i /><i /><span /></div>
}

function Progress({ index, local }: { index: number; local: number }) {
  return <aside className="chapter-progress" aria-label={`Phần ${index + 1} trong ${chapters.length}: ${chapters[index].title}`}>
    {chapters.map((chapter, i) => <div key={chapter.id} className={i < index || (i === index && local > .5) ? 'done' : i === index ? 'active' : ''}><span /><small>{chapter.eyebrow}</small></div>)}
  </aside>
}

function VirtuesZoom() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<SVGGElement>(null)
  const anchorRef = useRef<SVGGElement>(null)
  const controlsRef = useRef<HTMLDivElement>(null)
  const [activeVirtue, setActiveVirtue] = useState(0)

  useGSAP(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    const scene = sceneRef.current
    const anchor = anchorRef.current
    const controls = controlsRef.current
    if (!section || !stage || !scene || !anchor || !controls) return

    const surroundings = section.querySelector('.virtue-surroundings')
    const backdrop = section.querySelector('.virtue-backdrop')
    const heading = section.querySelector('.virtue-heading')
    let controlsEnabled = false
    const setControlsEnabled = (enabled: boolean) => {
      if (controlsEnabled === enabled) return
      controlsEnabled = enabled
      controls.toggleAttribute('inert', !enabled)
      controls.setAttribute('aria-hidden', String(!enabled))
    }
    setControlsEnabled(false)

    const setRealOrigin = () => {
      const sceneRect = scene.getBoundingClientRect()
      const anchorRect = anchor.getBoundingClientRect()
      const x = anchorRect.left + anchorRect.width / 2 - sceneRect.left
      const y = anchorRect.top + anchorRect.height / 2 - sceneRect.top
      gsap.set(scene, {
        transformOrigin: `${(x / sceneRect.width) * 100}% ${(y / sceneRect.height) * 100}%`,
      })
    }

    const media = gsap.matchMedia()
    media.add({
      desktop: '(min-width: 801px) and (prefers-reduced-motion: no-preference)',
      mobile: '(max-width: 800px) and (prefers-reduced-motion: no-preference)',
      reduce: '(prefers-reduced-motion: reduce)',
    }, context => {
      const { desktop, mobile, reduce } = context.conditions as Record<string, boolean>
      if (reduce) {
        gsap.set(scene, { scale: 1, clearProps: 'willChange' })
        gsap.set([surroundings, backdrop], { opacity: .15 })
        gsap.set(anchor, { opacity: 1 })
        setControlsEnabled(true)
        gsap.fromTo([heading, controls], { opacity: 0 }, { opacity: 1, duration: .2, ease: 'power2.inOut' })
        return
      }

      setRealOrigin()
      const maxScale = desktop ? 3.2 : mobile ? 2.2 : 3.2
      const pinDistance = desktop ? 2.5 : 1.8
      const timeline = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          id: 'virtues-zoom',
          trigger: section,
          pin: stage,
          start: 'top top',
          end: () => `+=${innerHeight * pinDistance}`,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onRefreshInit: setRealOrigin,
          onEnter: () => { scene.style.willChange = 'transform' },
          onEnterBack: () => { scene.style.willChange = 'transform' },
          onLeave: () => { scene.style.willChange = 'auto'; setControlsEnabled(true) },
          onLeaveBack: () => { scene.style.willChange = 'auto'; setControlsEnabled(false) },
          onUpdate: self => setControlsEnabled(self.progress >= .82),
        },
      })
      timeline
        .to(scene, { scale: maxScale, duration: 1 }, 0)
        .to([surroundings, backdrop], { opacity: .15, duration: .82 }, 0)
        .fromTo(anchor, { opacity: .4 }, { opacity: 1, duration: .76 }, .08)
        .fromTo(heading, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: .3 }, .52)
        .fromTo(controls, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .24 }, .74)
    })

    const refresh = () => ScrollTrigger.refresh()
    document.fonts.ready.then(refresh)
    addEventListener('load', refresh, { once: true })
    return () => {
      removeEventListener('load', refresh)
      media.revert()
    }
  }, { scope: sectionRef })

  return <section ref={sectionRef} className="virtues-zoom" aria-labelledby="virtues-title">
    <div ref={stageRef} className="virtue-stage">
      <div className="virtue-backdrop" aria-hidden="true" />
      <svg className="virtue-tree" viewBox="0 0 1000 800" role="img" aria-labelledby="virtue-tree-title virtue-tree-desc">
        <title id="virtue-tree-title">Toàn cảnh cây đạo đức và vòng Bốn đức</title>
        <desc id="virtue-tree-desc">Cần, Kiệm, Liêm, Chính hợp thành một vòng tròn trên thân cây.</desc>
        <g ref={sceneRef} className="virtue-svg-scene">
          <g className="virtue-surroundings" aria-hidden="true">
            <path className="virtue-trunk-shadow" d="M500 805C485 720 511 653 500 582C488 499 505 407 500 310C496 214 505 135 505 38" />
            {branches.map((path, index) => <path className="virtue-branch" d={path} key={index} />)}
            <path className="virtue-roots" d="M500 790C444 786 403 803 332 842M500 790C540 810 591 821 674 842M500 790C495 819 486 844 468 879M500 790C459 768 421 755 355 744M500 790C552 774 593 755 650 720" />
            {leaves.map(([x, y, rotate], index) => <path className="virtue-leaf" key={index} transform={`translate(${x} ${y}) rotate(${rotate})`} d="M0 0C18-24 52-25 72 0C51 24 18 24 0 0Z" />)}
          </g>
          <g ref={anchorRef} className="virtue-ring" data-virtue-anchor transform="translate(500 455)">
            <circle className="ring-halo" r="154" />
            <circle className="ring-track" r="126" />
            <path className="ring-axis" d="M-126 0H126M0-126V126" />
            <text x="-62" y="-52">CẦN</text><text x="62" y="-52">KIỆM</text>
            <text x="-62" y="66">LIÊM</text><text x="62" y="66">CHÍNH</text>
            <circle className="ring-core" r="19" />
          </g>
        </g>
      </svg>

      <header className="virtue-heading">
        <p>Phẩm chất nền tảng</p>
        <h2 id="virtues-title">Bốn đức<br />giữ cây đứng vững</h2>
      </header>

      <div ref={controlsRef} className="virtue-controls" aria-hidden="true" inert>
        <div className="virtue-tabs" role="group" aria-label="Chọn một trong bốn đức">
          {virtues.map((virtue, index) => <button key={virtue.name} type="button" aria-pressed={activeVirtue === index} onClick={() => setActiveVirtue(index)}><b>{virtue.name}</b><span>{virtue.label}</span></button>)}
        </div>
        <div className="virtue-detail" aria-live="polite">
          <p>{virtues[activeVirtue].name}</p>
          <strong>{virtues[activeVirtue].label}</strong>
          <span>{virtues[activeVirtue].description}</span>
        </div>
      </div>
    </div>
  </section>
}

function App() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, syncTouch: false })
    const update = (time: number) => lenis.raf(time * 1000)
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(update)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
    }
  }, [])

  const journeyRef = useRef<HTMLElement>(null)
  const { index, local, page, hero } = useGrowthJourney(journeyRef)
  const chapter = chapters[index]
  const zoom = zoomCurve(local)
  const contentOpacity = contentCurve(local)
  const viewBox = useMemo(() => {
    const scale = 1 + zoom * 3.4
    const width = 1000 / scale
    const height = 800 / scale
    const [tx, ty] = chapter.target
    return `${tx - width / 2} ${ty - height / 2} ${width} ${height}`
  }, [chapter, zoom])

  const stageStyle = {
    '--chapter-tone': chapter.tone,
    '--zoom': zoom,
    '--content-opacity': contentOpacity,
    '--local': local,
    '--page': page,
  } as CSSProperties

  return <>
    <a className="skip-link" href="#journey">Bỏ qua tới hành trình</a>
    <header className="intro" style={{ '--hero': hero } as CSSProperties}>
      <div className="intro-sticky">
        <div className="intro-grain" aria-hidden="true" />
        <svg className="stump" viewBox="0 0 700 700" aria-hidden="true"><path className="stump-shadow" d="M350 630C329 546 357 478 349 383M350 630C287 625 223 647 165 678M350 630C411 631 474 648 537 682M350 630C337 658 323 679 296 696" /><path className="stump-live" pathLength="1" style={{ strokeDashoffset: 1 - hero }} d="M350 630C329 546 357 478 349 383M350 630C287 625 223 647 165 678M350 630C411 631 474 648 537 682M350 630C337 658 323 679 296 696" /></svg>
        <div className="intro-copy"><p>HCM202 · Tư tưởng Hồ Chí Minh</p><h1>Mọi tán cây<br />đều bắt đầu<br />từ một cái gốc.</h1><span>Cuộn để cây bắt đầu lớn</span></div>
      </div>
    </header>

    <VirtuesZoom />

    <main id="journey" ref={journeyRef} className="journey" style={{ '--chapters': chapters.length } as CSSProperties}>
      <div className="journey-stage" style={stageStyle}>
        <div className="stage-atmosphere" aria-hidden="true" />
        <div className="tree-camera" style={{ opacity: 1 - contentOpacity * .72 }}><Tree index={index} local={local} viewBox={viewBox} /></div>
        <div className={`chapter-world world-${chapter.art}`} style={{ opacity: contentOpacity }} aria-hidden="true"><Illustration kind={chapter.art} /></div>
        <article className={`chapter-card ${chapter.tone === '#d9e3dc' || chapter.tone === '#e8eeea' ? 'on-light' : ''}`} style={{ opacity: contentOpacity, transform: `translateY(${(1 - contentOpacity) * 34}px)` }}>
          <p className="chapter-count">{String(index + 1).padStart(2, '0')} / {String(chapters.length).padStart(2, '0')}</p>
          <p className="chapter-eyebrow">{chapter.eyebrow}</p><h2>{chapter.title}</h2><div className="chapter-body">{chapter.body}</div>
        </article>
        <div className="growth-caption" style={{ opacity: 1 - contentOpacity }} aria-hidden="true"><span>{local < .22 ? 'Cây đang lớn thêm một nhánh' : local > .82 ? 'Một chiếc lá mới đã mọc' : 'Đi sâu vào câu chuyện'}</span><i /></div>
        <Progress index={index} local={local} />
      </div>
    </main>

    <footer className="sources">
      <div><p>Kết thúc hành trình</p><h2>Một cây đã đủ tán.<br />Một việc nhỏ có thể bắt đầu.</h2></div>
      <div><h3>Nguồn tham khảo</h3><p>Các trích dẫn nên được đối chiếu lại với văn bản gốc khi dùng trong bài nộp.</p><a href="https://baotanghochiminh.vn/chu-tich-ho-chi-minh-voi-but-danh-le-quyet-thang-viet-xong-cuon-sach-can-kiem-liem-chinh.htm" target="_blank" rel="noreferrer">Cần Kiệm Liêm Chính, 1949</a><a href="https://tulieuvankien.dangcongsan.vn/c-mac-angghen-lenin-ho-chi-minh/ho-chi-minh/nghien-cuu-hoc-tap-tu-tuong/tu-tuong-ho-chi-minh-ve-dao-duc-cach-mang-can-kiem-liem-chinh-chi-cong-vo-tu-1785" target="_blank" rel="noreferrer">Tư tưởng Hồ Chí Minh về đạo đức cách mạng</a></div>
    </footer>
  </>
}

export default App
