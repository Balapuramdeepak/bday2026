import { AnimatePresence, motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useEffect, useRef, useState } from 'react'
import './App.css'

const chapters = [
  {
    eyebrow: 'Chapter One',
    title: 'A little star was born',
    tag: 'August 4, 2002',
    copy: 'On August 4, 2002, a beautiful little girl named Thrisha entered the world.\n\nIntelligent, kind-hearted, and destined to brighten countless lives—she was the beginning of a beautiful story.',
    icon: '✦',
    image: '/photos/thrisha-baby.jpeg',
    imageLabel: 'Baby Thrisha smiling',
  },
  {
    eyebrow: 'Chapter Two',
    title: 'She grew with grace and strength',
    copy: 'As the years passed, she grew into a strong, thoughtful, and compassionate person.\n\nEvery challenge shaped her, every experience made her wiser, and every smile reflected the beautiful soul she carries.',
    icon: '♡',
    image: '/photos/thrisha-childhood.jpeg',
    imageLabel: 'Thrisha’s childhood or teen photo',
  },
  {
    eyebrow: 'Today',
    title: 'Still writing her beautiful story',
    copy: 'Today, she’s building her dreams in Bangalore, working hard, embracing new challenges, and creating a life of her own.\n\nThrough every busy day and every obstacle, she continues to move forward—with courage, determination, and the same beautiful smile.',
    icon: '☀',
    image: '/photos/thrisha-latest.jpeg',
    imageLabel: 'Thrisha’s latest photo',
  },
]

const memories = [
  { src: '/photos/memory-1.jpeg', title: 'Memory 1', caption: 'A smile worth remembering' },
  { src: '/photos/memory-2.jpeg', title: 'Memory 2', caption: 'An adventure held forever' },
  { src: '/photos/memory-3.jpeg', title: 'Memory 3', caption: 'One beautiful chapter' },
]

const birthdayMelody = [
  [392, 0.28], [392, 0.18], [440, 0.48], [392, 0.48], [523.25, 0.48], [493.88, 0.9],
  [392, 0.28], [392, 0.18], [440, 0.48], [392, 0.48], [587.33, 0.48], [523.25, 0.9],
  [392, 0.28], [392, 0.18], [783.99, 0.48], [659.25, 0.48], [523.25, 0.48], [493.88, 0.48], [440, 0.85],
  [698.46, 0.28], [698.46, 0.18], [659.25, 0.48], [523.25, 0.48], [587.33, 0.48], [523.25, 1.05],
]

function playChime(notes = [523.25, 659.25, 783.99]) {
  const AudioContext = window.AudioContext || window.webkitAudioContext
  if (!AudioContext) return
  const context = new AudioContext()
  notes.forEach((frequency, index) => {
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.value = frequency
    gain.gain.setValueAtTime(0, context.currentTime)
    gain.gain.linearRampToValueAtTime(0.055, context.currentTime + index * 0.09 + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + index * 0.09 + 0.55)
    oscillator.connect(gain).connect(context.destination)
    oscillator.start(context.currentTime + index * 0.09)
    oscillator.stop(context.currentTime + index * 0.09 + 0.6)
  })
  window.setTimeout(() => context.close(), 1300)
}

function scheduleBirthdaySong(context, startAt = context.currentTime + 0.08) {
  const songStart = startAt
  let cursor = startAt
  birthdayMelody.forEach(([frequency, duration]) => {
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = 'triangle'
    oscillator.frequency.setValueAtTime(frequency, cursor)
    gain.gain.setValueAtTime(0.0001, cursor)
    gain.gain.exponentialRampToValueAtTime(0.045, cursor + 0.025)
    gain.gain.setValueAtTime(0.045, cursor + Math.max(0.04, duration - 0.08))
    gain.gain.exponentialRampToValueAtTime(0.0001, cursor + duration)
    oscillator.connect(gain).connect(context.destination)
    oscillator.start(cursor)
    oscillator.stop(cursor + duration + 0.02)
    cursor += duration + 0.055
  })
  return (cursor - songStart) * 1000
}

function Snowfall({ count = 42 }) {
  const flakes = useRef(
    Array.from({ length: count }, (_, index) => ({
      id: index,
      left: `${(index * 37 + 11) % 100}%`,
      size: 3 + ((index * 7) % 8),
      duration: 7 + ((index * 13) % 9),
      delay: -((index * 17) % 12),
      drift: `${-35 + ((index * 19) % 70)}px`,
      opacity: 0.35 + ((index % 5) * 0.12),
    })),
  ).current

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden" aria-hidden="true">
      {flakes.map((flake) => (
        <span
          key={flake.id}
          className="snowflake"
          style={{
            '--left': flake.left,
            '--size': `${flake.size}px`,
            '--duration': `${flake.duration}s`,
            '--delay': `${flake.delay}s`,
            '--drift': flake.drift,
            '--opacity': flake.opacity,
          }}
        />
      ))}
    </div>
  )
}

function PhotoFrame({ src, alt, caption, compact = false }) {
  const [failed, setFailed] = useState(false)

  return (
    <div className={`photo-frame ${compact ? 'photo-frame-compact' : ''}`}>
      {!failed ? (
        <img src={src} alt={alt} onError={() => setFailed(true)} />
      ) : (
        <div className="photo-placeholder">
          <span>📷</span>
          <small>Add photo here</small>
        </div>
      )}
      {caption && <p>{caption}</p>}
    </div>
  )
}

function Penguin({ size = 'md', accessory, dancing = false }) {
  return (
    <motion.div
      className={`penguin penguin-${size}`}
      animate={dancing ? { y: [0, -14, 0], rotate: [-4, 5, -4] } : { y: [0, -5, 0] }}
      transition={{ duration: dancing ? 0.75 : 3, repeat: Infinity, ease: 'easeInOut' }}
      aria-label="A cute penguin"
      role="img"
    >
      <div className="penguin-wing wing-left" />
      <div className="penguin-wing wing-right" />
      <div className="penguin-body">
        <div className="penguin-belly" />
        <span className="penguin-eye eye-left" />
        <span className="penguin-eye eye-right" />
        <span className="penguin-blush blush-left" />
        <span className="penguin-blush blush-right" />
        <span className="penguin-beak" />
      </div>
      <span className="penguin-foot foot-left" />
      <span className="penguin-foot foot-right" />
      {accessory && <span className="penguin-accessory">{accessory}</span>}
    </motion.div>
  )
}

function PrimaryButton({ children, onClick, className = '' }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -3, scale: 1.025 }}
      whileTap={{ scale: 0.96 }}
      className={`group relative overflow-hidden rounded-full border border-white/70 bg-white/80 px-7 py-3.5 font-semibold text-slate-700 shadow-[0_16px_40px_rgba(80,120,160,.18)] backdrop-blur-xl transition-colors hover:bg-white ${className}`}
    >
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/80 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      <span className="relative flex items-center justify-center gap-2">{children}</span>
    </motion.button>
  )
}

function ProgressDots({ scene }) {
  if (scene === 'loading' || scene === 'finale') return null
  const steps = ['welcome', 'story', 'cake', 'gifts']
  const current = steps.indexOf(scene)
  return (
    <div className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/50 bg-white/35 px-4 py-2 backdrop-blur-xl">
      {steps.map((step, index) => (
        <span
          key={step}
          className={`h-1.5 rounded-full transition-all duration-500 ${index === current ? 'w-7 bg-sky-500' : index < current ? 'w-2 bg-sky-300' : 'w-2 bg-white/80'}`}
        />
      ))}
    </div>
  )
}

function App() {
  const [scene, setScene] = useState('loading')
  const [chapter, setChapter] = useState(0)
  const [candlesLit, setCandlesLit] = useState(true)
  const [openGift, setOpenGift] = useState(null)
  const [memory, setMemory] = useState(0)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const finaleTimer = useRef(null)
  const musicContext = useRef(null)
  const musicTimer = useRef(null)
  const musicActive = useRef(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setScene('welcome'), 2600)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => () => {
    window.clearInterval(finaleTimer.current)
    window.clearTimeout(musicTimer.current)
    musicContext.current?.close()
  }, [])

  useEffect(() => {
    document.body.style.overflow = openGift ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [openGift])

  const stopMusic = () => {
    musicActive.current = false
    window.clearTimeout(musicTimer.current)
    musicContext.current?.close()
    musicContext.current = null
    setMusicPlaying(false)
  }

  const startMusic = () => {
    stopMusic()
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    musicActive.current = true
    setMusicPlaying(true)

    const context = new AudioContext()
    musicContext.current = context
    let nextStart = context.currentTime + 0.08

    const queueMelody = () => {
      if (!musicActive.current || musicContext.current !== context) return
      const duration = scheduleBirthdaySong(context, nextStart)
      nextStart += duration / 1000
      musicTimer.current = window.setTimeout(queueMelody, Math.max(250, duration - 700))
    }

    queueMelody()
  }

  const toggleMusic = () => {
    if (musicActive.current) stopMusic()
    else startMusic()
  }

  const advanceStory = () => {
    if (chapter < chapters.length - 1) setChapter((value) => value + 1)
    else setScene('cake')
  }

  const makeWish = () => {
    setCandlesLit(false)
    playChime([783.99, 659.25, 523.25])
    confetti({
      particleCount: 90,
      spread: 75,
      startVelocity: 32,
      origin: { y: 0.68 },
      colors: ['#ffffff', '#bde8ff', '#ffc8dc', '#ffe5a8'],
    })
    window.setTimeout(() => setScene('gifts'), 1900)
  }

  const launchFinale = () => {
    setOpenGift(null)
    setScene('finale')
    playChime([523.25, 659.25, 783.99, 1046.5])
    const end = Date.now() + 9000
    finaleTimer.current = window.setInterval(() => {
      confetti({
        particleCount: 8,
        angle: 60,
        spread: 62,
        startVelocity: 52,
        origin: { x: 0, y: 0.7 },
        colors: ['#ffc8dc', '#fff0a8', '#a9e7ff', '#ffffff'],
      })
      confetti({
        particleCount: 8,
        angle: 120,
        spread: 62,
        startVelocity: 52,
        origin: { x: 1, y: 0.7 },
        colors: ['#ffc8dc', '#fff0a8', '#a9e7ff', '#ffffff'],
      })
      if (Date.now() > end) window.clearInterval(finaleTimer.current)
    }, 240)
  }

  const resetExperience = () => {
    window.clearInterval(finaleTimer.current)
    setChapter(0)
    setCandlesLit(true)
    setOpenGift(null)
    setMemory(0)
    setScene('welcome')
  }

  const changeMemory = (direction) => {
    setMemory((current) => (current + direction + memories.length) % memories.length)
    playChime([direction > 0 ? 659.25 : 523.25])
  }

  const sceneVariants = {
    initial: { opacity: 0, scale: 1.06, filter: 'blur(10px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, scale: 0.96, filter: 'blur(8px)' },
  }

  return (
    <main className={`relative min-h-screen overflow-x-hidden text-slate-700 scene-${scene}`}>
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
      <div className="absolute inset-x-0 bottom-0 h-[34vh] rounded-[50%_50%_0_0/18%_18%_0_0] bg-gradient-to-b from-white/80 to-[#dff5ff]" />
      <div className="iceberg iceberg-left" />
      <div className="iceberg iceberg-right" />
      <Snowfall count={scene === 'finale' ? 26 : 46} />
      <ProgressDots scene={scene} />
      {scene !== 'loading' && (
        <motion.button
          type="button"
          className="music-toggle"
          onClick={toggleMusic}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          aria-label={musicPlaying ? 'Pause birthday song' : 'Play birthday song'}
          title={musicPlaying ? 'Pause birthday song' : 'Play Happy Birthday'}
        >
          <span className={musicPlaying ? 'music-note-playing' : ''}>{musicPlaying ? '♫' : '♪'}</span>
          <small>{musicPlaying ? 'Music on' : 'Play song'}</small>
        </motion.button>
      )}

      <AnimatePresence mode="wait">
        {scene === 'loading' && (
          <motion.section
            key="loading"
            className="relative z-20 flex min-h-screen flex-col items-center justify-center px-6"
            variants={sceneVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.9 }}
          >
            <div className="relative mb-8 h-24 w-24">
              {[0, 1, 2, 3, 4].map((star) => (
                <motion.span
                  key={star}
                  className="absolute text-2xl text-white drop-shadow-[0_0_14px_white]"
                  style={{ left: `${10 + ((star * 31) % 75)}%`, top: `${(star * 47) % 70}%` }}
                  animate={{ scale: [0.5, 1.2, 0.5], opacity: [0.3, 1, 0.3], rotate: [0, 90, 180] }}
                  transition={{ duration: 1.8, delay: star * 0.15, repeat: Infinity }}
                >
                  ✦
                </motion.span>
              ))}
            </div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.38em] text-sky-700/60">Preparing a little magic</p>
            <div className="h-1 w-48 overflow-hidden rounded-full bg-white/45">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-sky-300 via-pink-300 to-amber-200"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.25, ease: 'easeInOut' }}
              />
            </div>
          </motion.section>
        )}

        {scene === 'welcome' && (
          <motion.section
            key="welcome"
            className="relative z-20 flex min-h-screen flex-col items-center justify-center px-6 text-center"
            variants={sceneVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.9 }}
          >
            <motion.div initial={{ y: 100, rotate: -8 }} animate={{ y: 0, rotate: 0 }} transition={{ type: 'spring', delay: 0.25, stiffness: 90 }}>
              <Penguin size="lg" accessory="🎈" />
            </motion.div>
            <motion.div
              className="glass-panel mt-3 max-w-xl px-7 py-6 sm:px-10"
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.65 }}
            >
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.34em] text-sky-600">Psst... over here!</p>
              <h1 className="storybook-title text-4xl text-slate-700 sm:text-6xl">A magical day awaits</h1>
              <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-600 sm:text-base">
                I waddled all the way from the South Pole to tell you a very special story.
              </p>
            </motion.div>
            <PrimaryButton
              className="mt-6"
              onClick={() => {
                startMusic()
                setScene('story')
              }}
            >
              Begin the story <span aria-hidden="true">→</span>
            </PrimaryButton>
          </motion.section>
        )}

        {scene === 'story' && (
          <motion.section
            key={`story-${chapter}`}
            className="story-scene relative z-20 flex min-h-screen items-center justify-center px-5 py-16"
            variants={sceneVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.7 }}
          >
            <div className="story-panel glass-panel relative w-full max-w-4xl overflow-hidden px-7 py-9 text-center sm:px-14 sm:py-11">
              <motion.span
                className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/60 text-4xl text-pink-400 shadow-inner"
                initial={{ scale: 0, rotate: -40 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', delay: 0.2 }}
              >
                {chapters[chapter].icon}
              </motion.span>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-sky-600">{chapters[chapter].eyebrow}</p>
              <h2 className="storybook-title mx-auto mt-3 max-w-2xl text-4xl text-slate-700 sm:text-6xl">{chapters[chapter].title}</h2>
              {chapters[chapter].tag && (
                <span className="mt-5 inline-block rounded-full bg-pink-100/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.22em] text-pink-500">
                  {chapters[chapter].tag}
                </span>
              )}
              {chapters[chapter].image && (
                <div className="chapter-photo-row">
                  <Penguin size="sm" accessory={chapter === 0 ? '🎈' : chapter === 1 ? '🌸' : '⭐'} />
                  <PhotoFrame src={chapters[chapter].image} alt={chapters[chapter].imageLabel} compact />
                  <Penguin size="sm" accessory={chapter === 0 ? '🧸' : chapter === 1 ? '💖' : '❄️'} />
                </div>
              )}
              <p className="mx-auto mt-5 max-w-2xl whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-base">{chapters[chapter].copy}</p>
              <div className="mt-8 flex items-center justify-center gap-2">
                {chapters.map((_, index) => (
                  <span key={index} className={`h-1.5 rounded-full transition-all ${index === chapter ? 'w-8 bg-pink-400' : 'w-2 bg-slate-300/60'}`} />
                ))}
              </div>
              <PrimaryButton className="mt-7" onClick={advanceStory}>
                {chapter === chapters.length - 1 ? 'There’s one more thing' : 'Turn the page'} <span>✦</span>
              </PrimaryButton>
            </div>
          </motion.section>
        )}

        {scene === 'cake' && (
          <motion.section
            key="cake"
            className="cake-scene relative z-20 flex min-h-screen flex-col items-center justify-center px-5 text-center"
            variants={sceneVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.8 }}
          >
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-sky-600">Close your eyes...</p>
            <h2 className="storybook-title text-4xl sm:text-6xl">It&apos;s wish o&apos;clock</h2>
            <div className="cake mt-28" aria-label="A birthday cake with three candles">
              <div className="cake-candles">
                {[0, 1, 2].map((candle) => (
                  <span key={candle} className="candle">
                    <motion.i
                      className="flame"
                      animate={candlesLit ? { scale: [1, 1.18, 0.9, 1], x: [-1, 1, 0] } : { scale: 0, opacity: 0 }}
                      transition={{ duration: 0.5, repeat: candlesLit ? Infinity : 0 }}
                    />
                  </span>
                ))}
              </div>
              <div className="cake-top">♡ &nbsp; ♡ &nbsp; ♡</div>
              <div className="cake-layer cake-layer-one">
                <span>HAPPY BIRTHDAY<strong>THRISHA</strong></span>
              </div>
              <div className="cake-layer cake-layer-two" />
              <div className="cake-plate" />
            </div>
            <p className="mt-10 max-w-md whitespace-pre-line text-sm leading-7 text-slate-600">
              Make a wish that makes your heart smile.{'\n'}May every candle carry a dream that comes true.
            </p>
            <PrimaryButton className="mt-4 bg-pink-50/90" onClick={makeWish}>
              Make a wish <span>♡</span>
            </PrimaryButton>
          </motion.section>
        )}

        {scene === 'gifts' && (
          <motion.section
            key="gifts"
            className="gifts-scene relative z-20 flex min-h-screen flex-col items-center justify-center px-5 py-16 text-center"
            variants={sceneVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-sky-600">A little birthday mission</p>
            <h2 className="storybook-title mt-2 max-w-3xl text-4xl sm:text-6xl">Three little penguins brought something special just for you...</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
              Each one has been protecting a surprise.<br />Pick one and discover a little piece of today&apos;s magic. ✨
            </p>
            <div className="gift-grid mt-8 grid w-full max-w-5xl grid-cols-3 gap-4">
              {[
                { id: 'letter', gift: '💌', label: 'A Letter From The Heart ❤️', ribbon: 'from-pink-300 to-rose-400' },
                { id: 'memories', gift: '📸', label: 'A Pocket Full of Memories', ribbon: 'from-sky-300 to-indigo-400' },
                { id: 'surprise', gift: '🎉', label: 'One Last Surprise', ribbon: 'from-amber-300 to-pink-400' },
              ].map((item, index) => (
                <motion.button
                  type="button"
                  key={item.id}
                  className="gift-card glass-panel group flex min-h-64 flex-col items-center justify-end px-4 py-6"
                  initial={{ y: 80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.16, type: 'spring' }}
                  whileHover={{ y: -10, rotate: index === 1 ? 0 : index === 0 ? -1.5 : 1.5 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    playChime([523.25 + index * 130])
                    item.id === 'surprise' ? launchFinale() : setOpenGift(item.id)
                  }}
                >
                  <Penguin size="sm" accessory={item.gift} />
                  <span className={`mt-5 rounded-full bg-gradient-to-r ${item.ribbon} px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-lg`}>
                    {item.label}
                  </span>
                  <span className="mt-3 text-xs text-slate-500 opacity-0 transition-opacity group-hover:opacity-100">Tap to unwrap ✦</span>
                </motion.button>
              ))}
            </div>
          </motion.section>
        )}

        {scene === 'finale' && (
          <motion.section
            key="finale"
            className="finale relative z-20 flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-14 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <span
                key={`firework-${item}`}
                className="firework"
                style={{ left: `${8 + ((item * 37) % 84)}%`, top: `${8 + ((item * 23) % 42)}%`, animationDelay: `${item * 0.42}s` }}
              />
            ))}
            {[...Array(11)].map((_, index) => (
              <motion.span
                key={index}
                className="balloon"
                style={{ '--balloon-color': ['#ffc2da', '#b8e8ff', '#ffe199', '#d8c5ff'][index % 4], left: `${3 + ((index * 29) % 92)}%` }}
                initial={{ y: '110vh', rotate: -8 + (index % 4) * 6 }}
                animate={{ y: '-130vh' }}
                transition={{ duration: 8 + (index % 5), delay: index * 0.25, repeat: Infinity, ease: 'linear' }}
              />
            ))}
            <motion.p
              className="text-xs font-bold uppercase tracking-[0.45em] text-white/75"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              One last surprise
            </motion.p>
            <motion.h1
              className="finale-title mt-4 text-5xl leading-none text-white sm:text-8xl lg:text-9xl"
              initial={{ scale: 0.35, opacity: 0, rotate: -4 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 75, delay: 0.2 }}
            >
              Happy Birthday, Thrisha! 🎂❤️
            </motion.h1>
            <motion.p
              className="mt-5 max-w-xl text-base leading-7 text-white/85 sm:text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              May this year bring you happiness that never fades,<br />
              strength for every challenge,<br />
              success in everything you chase,<br />
              and countless beautiful moments worth remembering.
            </motion.p>
            <motion.p
              className="mt-4 text-sm font-semibold leading-6 text-white/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              Keep smiling. Keep shining. Keep being you. ❤️
            </motion.p>
            <div className="mt-9 flex items-end justify-center gap-1 sm:gap-7">
              <Penguin size="md" accessory="⭐" dancing />
              <Penguin size="lg" accessory="🎂" dancing />
              <Penguin size="md" accessory="💖" dancing />
            </div>
            <motion.p
              className="mt-6 max-w-xl text-sm leading-6 text-white/75"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              The world became a little brighter on August 4, 2002...<br />
              and it continues to shine because you&apos;re in it.
            </motion.p>
            <PrimaryButton className="mt-8" onClick={resetExperience}>Replay the magic ↻</PrimaryButton>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {openGift && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-700/20 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenGift(null)}
          >
            <motion.article
              className={`gift-modal glass-panel relative w-full max-w-2xl p-7 text-center sm:p-12 ${openGift === 'memories' ? 'memory-modal' : ''}`}
              initial={{ y: 60, scale: 0.9 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 30, scale: 0.95 }}
              transition={{ type: 'spring', damping: 24 }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setOpenGift(null)}
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/60 text-slate-500 transition-transform hover:rotate-90"
                aria-label="Close gift"
              >
                ×
              </button>
              {openGift === 'letter' && (
                <>
                  <span className="text-5xl">💌</span>
                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.3em] text-pink-500">A Letter From The Heart ❤️</p>
                  <h3 className="storybook-title mt-2 text-4xl">Dear Thrisha,</h3>
                  <div className="mx-auto mt-6 max-w-lg space-y-4 text-left font-serif text-base leading-8 text-slate-600 sm:text-lg">
                    <p>Happy Birthday to one of the most wonderful people I&apos;ve ever known.</p>
                    <p>I hope this year brings you endless happiness, countless reasons to smile, and dreams that turn into beautiful memories.</p>
                    <p>Never stop believing in yourself, because you&apos;re capable of far more than you realize.</p>
                    <p>May your heart always stay as kind as it is today.</p>
                    <p className="pt-3 text-right italic text-pink-500">Happy Birthday. ❤️</p>
                  </div>
                </>
              )}
              {openGift === 'memories' && (
                <>
                  <span className="text-5xl">🎞️</span>
                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.3em] text-sky-500">A Pocket Full of Memories 📸</p>
                  <h3 className="storybook-title mt-2 text-4xl">Every picture tells a story...</h3>
                  <p className="mt-2 text-sm text-slate-500">Every smile holds a memory.</p>
                  <div className="memory-carousel relative mx-auto mt-7 max-w-md rounded-[2rem]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={memory}
                        className="memory-slide"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.22}
                        onDragEnd={(_, info) => {
                          if (info.offset.x < -55) changeMemory(1)
                          if (info.offset.x > 55) changeMemory(-1)
                        }}
                      >
                        <PhotoFrame
                          src={memories[memory].src}
                          alt={`${memories[memory].title}: ${memories[memory].caption}`}
                          caption={memories[memory].caption}
                        />
                      </motion.div>
                    </AnimatePresence>
                    <button
                      type="button"
                      className="memory-arrow memory-arrow-left"
                      onClick={() => changeMemory(-1)}
                      aria-label="Previous memory"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      className="memory-arrow memory-arrow-right"
                      onClick={() => changeMemory(1)}
                      aria-label="Next memory"
                    >
                      ›
                    </button>
                  </div>
                  <div className="mt-5 flex justify-center gap-3">
                    {memories.map((item, index) => (
                      <button
                        type="button"
                        key={item.title}
                        onClick={() => setMemory(index)}
                        className={`h-2 rounded-full transition-all ${memory === index ? 'w-8 bg-sky-400' : 'w-2 bg-slate-300'}`}
                        aria-label={`View ${item.title}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

export default App
