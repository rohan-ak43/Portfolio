// Frontend/src/App.tsx
import {
    useState,
    useEffect,
    useRef,
    useContext,
    createContext,
    type FormEvent,
    type CSSProperties,
} from 'react'
import {
    motion,
    useInView,
    AnimatePresence,
    useMotionValue,
    useSpring,
} from 'framer-motion'

// Theme Context
const ThemeContext = createContext<{ dark: boolean; toggleDark: () => void }>({
    dark: false,
    toggleDark: () => { },
})

// Data 

const NAV_LINKS = ['Home', 'About', 'Resume', 'Portfolio', 'Skills', 'Contact']

const PROJECTS = [
    {
        title: 'CrickIQ - AI Cricket Analytics',
        description:
            'CrickIQ is a computer vision and NLP platform that extracts 33-point pose landmarks from batting/bowling footage using MediaPipe, then computes biomechanical metrics like joint angles, swing arc, and release point. These structured features are fed into CrickLM, a custom-trained language model (not a general-purpose VLM) that generates weakness reports, tactical vulnerabilities, and corrective drills. Built with FastAPI + React/TypeScript, with comparison mode using cosine similarity and Euclidean distance against professional player benchmarks.',
        tags: ['Python', 'OpenCV', 'YOLO', 'FastAPI', 'React'],
        accent: '#0a1a1a',
        img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop&auto=format',
        imgAlt: 'Performance analytics dashboard on laptop screen',
        github: 'https://github.com/rohan-ak43/Cricket-Analytics-',
    },
    {
        title: 'Cinematch - Movie Recommendation Engine',
        description:
            'CineMatch is a hybrid movie recommendation system combining six ML modules - TF-IDF + cosine similarity for content-based filtering, KNN for collaborative filtering, and a weighted hybrid recommender for final ranking. It also layers in NLP features like mood detection and sentiment analysis (Logistic Regression) and rating prediction via Random Forest Regression. Built with a Flask REST API (JWT-authenticated, 10+ endpoints), MySQL for persistence, and a vanilla HTML/JS frontend for the dashboard and history views.',
        tags: ['Python', 'PyTorch', 'FastAPI', 'PostgreSQL'],
        accent: '#071515',
        img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=400&fit=crop&auto=format',
        imgAlt: 'Cinema theater interior',
        github: 'https://github.com/rohan-ak43/Cinematch',
    },
    {
        title: 'RemoRehab - Remote Rehabilitation Platform',
        description:
            'Remo Rehab is a real-time remote physiotherapy system combining MediaPipe Pose for webcam-based rep counting and form-accuracy tracking with an ESP32 + FSR sensor streaming live muscle activation data. A NestJS backend with Socket.IO handles WebSocket streaming between a 1-doctor-to-1-patient session, while local computation handles rep counting and pose tracking to minimize load. The Google Gemini API is called sparingly, at key checkpoints and session end, to generate structured clinical reports covering form corrections, effort consistency, and rehab progress notes.',
        tags: ['Python', 'MediaPipe', 'TensorFlow', 'React'],
        accent: '#051010',
        img: 'https://images.unsplash.com/photo-1645005512942-a17817fb7c11?w=800&h=400&fit=crop&auto=format',
        imgAlt: 'Physical therapy rehabilitation session',
        github: 'https://github.com/rohan-ak43/Remo',
    },
    {
        title: 'Forá - Time Capsule App',
        description:
            'Forá is a time capsule messaging app that lets users schedule messages to their future selves or others, with precise delivery timing and privacy controls. Built with React and TypeScript on the frontend, with Firebase handling backend storage and authentication. Includes a canvas-based signature feature, optimized for smooth capture and rendering performance. ',
        tags: ['Next.js', 'Firebase', 'TypeScript', 'Solidity'],
        accent: '#081818',
        img: 'https://images.unsplash.com/photo-1634562876572-5abe57afcceb?w=800&h=400&fit=crop&auto=format',
        imgAlt: 'Pen resting on handwritten letter',
        github: 'https://github.com/rohan-ak43/Fora',
    },
]

const TIMELINE = [
    {
        type: 'education',
        title: 'B.S. Abdur Rahman Crescent Institute of Technology',
        org: 'B.Tech CSE(IoT)',
        period: '2023 — 2027',
        description:
            "A 4th year undergraduate student with a strong foundation in computer science and a passion for artificial intelligence, machine learning and neural networks. \n Related Coursework: Data Structures & Algorithms, Python Programming, Probability & Statistics, Database Management System, Data Science and Machine Learning."
    },
    {
        type: 'experience',
        title: 'Mobile App Developer Intern',
        org: 'Neohorizon Analytics',
        period: 'June 2025 – July 2025',
        description:
            'Developed iOS Dynamic Island Live Activity app using SwiftUI and ActivityKit with 95% success rate in realtime stock updates; implemented 40-second auto-refresh for seamless tracking.',
    },
    {
        type: 'experience',
        title: 'Co – Founder | Mobile App Developer',
        org: './localhost',
        period: '2025 — Present',
        description:
            "Co-founded './localhost', a student-led venture creating expressive digital tools. Leading development of Forá time capsule app with focus on seamless integration and scalability.Leading the development of Forá – a time capsule messaging app that allows users to send messages to the future.",
    },
    {
        type: 'achievement',
        title: 'Aarambh Hackathon - Winner',
        org: 'Vel Tech Rangarajan Dr. Sagunthala R & D Institute of Science & Technology, Chennai ',
        period: 'November 2025',
        description:
            'First place for buliding Remo Rehab - a remote rehabilitation platform powered by the Gemini API for AI feedback, smart exercise suggestions, and automated patient report summaries - bridging the gap between doctors and patients.',
    },
    {
        type: 'certification',
        title: 'DATA ANALYTICS USING PANDAS',
        org: 'Guvi Geek Networks, IITM Research Park',
        period: 'Jan 2025',
        description:
            'Data Analytics fundamentals using pandas',
    },
]

const SKILLS_DATA: Record<string, string[]> = {
    Programming: ['Python', 'HTML', 'CSS', 'JavaScript', 'TypeScript', 'MYSQL'],
    Backend: ['FastAPI', 'Node.js', 'REST API'],
    Frontend: ['React', 'Next.js', 'Tailwind CSS'],
    'AI / ML': ['TensorFlow', 'PyTorch', 'OpenCV', 'MediaPipe', 'LangChain', 'Hugging Face'],
    Databases: ['MongoDB', 'Redis', 'Firebase', 'MYSQL'],
    'Cloud & DevOps': ['Docker', 'AWS', 'Github', 'Git', 'CI/CD'],
}

const SKILL_ACCENTS: Record<string, string> = {
    Programming: 'rgba(29,29,31,0.15)',
    Backend: 'rgba(29,29,31,0.15)',
    Frontend: 'rgba(29,29,31,0.15)',
    'AI / ML': 'rgba(29,29,31,0.2)',
    Databases: 'rgba(29,29,31,0.18)',
    'Cloud & DevOps': 'rgba(29,29,31,0.15)',
}

const TYPE_STYLE: Record<string, { dot: string; badge: string; label: string }> = {
    education: { dot: '#1D1D1F', badge: 'rgba(29,29,31,0.18)', label: 'Education' },
    experience: { dot: '#1D1D1F', badge: 'rgba(29,29,31,0.18)', label: 'Experience' },
    achievement: { dot: '#1D1D1F', badge: 'rgba(29,29,31,0.18)', label: 'Achievement' },
    certification: { dot: '#86868B', badge: 'rgba(134,134,139,0.18)', label: 'Certification' },
}

// Shared primitives 

function Hi({ children }: { children: React.ReactNode; color?: string }) {
    const { dark } = useContext(ThemeContext)
    return (
        <span
            style={{
                color: dark ? '#F5F5F7' : '#1D1D1F',
                transition: 'color 0.3s ease, font-weight 0.3s ease',
            }}
            className="font-semibold cursor-default"
            onMouseEnter={(e) => {
                e.currentTarget.style.color = dark ? '#FFFFFF' : '#000000'
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.color = dark ? '#F5F5F7' : '#1D1D1F'
            }}
        >
            {children}
        </span>
    )
}

function FadeUp({
    children,
    delay = 0,
    className = '',
}: {
    children: React.ReactNode
    delay?: number
    className?: string
}) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-80px' })
    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    )
}

function SectionLabel({ children }: { children: string }) {
    const { dark } = useContext(ThemeContext)
    return (
        <span
            className="text-[11px] font-mono tracking-[0.22em] uppercase block mb-4"
            style={{ color: dark ? '#A1A1A6' : '#1D1D1F' }}
        >
            {children}
        </span>
    )
}

// Custom Cursor 

function Cursor() {
    const x = useMotionValue(-100)
    const y = useMotionValue(-100)
    const springX = useSpring(x, { damping: 28, stiffness: 180, mass: 0.5 })
    const springY = useSpring(y, { damping: 28, stiffness: 180, mass: 0.5 })
    const [visible, setVisible] = useState(false)
    const [isTouch, setIsTouch] = useState(false)

    useEffect(() => {
        // Disable custom cursor on touch / hover:none devices
        setIsTouch(window.matchMedia('(hover: none)').matches)
        const move = (e: MouseEvent) => {
            x.set(e.clientX - 20)
            y.set(e.clientY - 20)
            if (!visible) setVisible(true)
        }
        const hide = () => setVisible(false)
        window.addEventListener('mousemove', move)
        window.addEventListener('mouseleave', hide)
        return () => {
            window.removeEventListener('mousemove', move)
            window.removeEventListener('mouseleave', hide)
        }
    }, [x, y, visible])

    const { dark } = useContext(ThemeContext)
    if (isTouch) return null
    return (
        <motion.div
            className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[200]"
            style={{
                x: springX,
                y: springY,
                background: dark
                    ? 'radial-gradient(circle, rgba(200,200,210,0.3) 0%, rgba(200,200,210,0.08) 60%, transparent 100%)'
                    : 'radial-gradient(circle, rgba(29,29,31,0.35) 0%, rgba(29,29,31,0.12) 60%, transparent 100%)',
                filter: 'blur(4px)',
                opacity: visible ? 1 : 0,
            }}
        />
    )
}

// Keyboard Illustration

type KeyAccent = 'orange' | 'dark' | 'space' | 'normal'
interface KeyDef { k: string; u: number; accent?: KeyAccent }

const KB_ROWS: KeyDef[][] = [
    [
        { k: 'Esc', u: 1, accent: 'orange' },
        { k: '1', u: 1 }, { k: '2', u: 1 }, { k: '3', u: 1 }, { k: '4', u: 1 },
        { k: '5', u: 1 }, { k: '6', u: 1 }, { k: '7', u: 1 }, { k: '8', u: 1 },
        { k: '9', u: 1 }, { k: '0', u: 1 }, { k: '-', u: 1 }, { k: '=', u: 1 },
        { k: '⌫', u: 2, accent: 'dark' }, { k: 'Del', u: 1, accent: 'dark' },
    ],
    [
        { k: 'Tab', u: 1.5, accent: 'dark' },
        { k: 'Q', u: 1 }, { k: 'W', u: 1 }, { k: 'E', u: 1 }, { k: 'R', u: 1 },
        { k: 'T', u: 1 }, { k: 'Y', u: 1 }, { k: 'U', u: 1 }, { k: 'I', u: 1 },
        { k: 'O', u: 1 }, { k: 'P', u: 1 }, { k: '[', u: 1 }, { k: ']', u: 1 },
        { k: '\\', u: 1.5 }, { k: 'PgUp', u: 1, accent: 'dark' },
    ],
    [
        { k: 'Caps', u: 1.75, accent: 'dark' },
        { k: 'A', u: 1 }, { k: 'S', u: 1 }, { k: 'D', u: 1 }, { k: 'F', u: 1 },
        { k: 'G', u: 1 }, { k: 'H', u: 1 }, { k: 'J', u: 1 }, { k: 'K', u: 1 },
        { k: 'L', u: 1 }, { k: ';', u: 1 }, { k: "'", u: 1 },
        { k: 'Enter', u: 2.25, accent: 'orange' }, { k: 'PgDn', u: 1, accent: 'dark' },
    ],
    [
        { k: 'Shift', u: 2.25, accent: 'dark' },
        { k: 'Z', u: 1 }, { k: 'X', u: 1 }, { k: 'C', u: 1 }, { k: 'V', u: 1 },
        { k: 'B', u: 1 }, { k: 'N', u: 1 }, { k: 'M', u: 1 }, { k: ',', u: 1 },
        { k: '.', u: 1 }, { k: '/', u: 1 },
        { k: 'Shift', u: 1.75, accent: 'dark' }, { k: '↑', u: 1, accent: 'orange' }, { k: 'End', u: 1, accent: 'dark' },
    ],
    [
        { k: 'Ctrl', u: 1.5, accent: 'dark' }, { k: 'Win', u: 1, accent: 'dark' },
        { k: 'Alt', u: 1.5, accent: 'dark' },
        { k: '', u: 7, accent: 'space' },
        { k: 'Alt', u: 1, accent: 'dark' }, { k: 'Fn', u: 1, accent: 'dark' },
        { k: '←', u: 1, accent: 'orange' }, { k: '↓', u: 1, accent: 'orange' }, { k: '→', u: 1, accent: 'orange' },
    ],
]

const KW = 26   // base key width px
const KH = 28   // key height px
const KG = 4    // gap px

function kw(u: number) { return u * KW + (u - 1) * KG }

function KeyboardIllustration() {
    const { dark } = useContext(ThemeContext)
    const [litKeys, setLitKeys] = useState<Set<string>>(new Set())

    useEffect(() => {
        const sequence: string[][] = [
            ['3-0', '1-4'],  // Shift + R  (capital R)
            [],              // pause
            ['1-9'],         // o
            [],              // pause
            ['2-6'],         // h
            [],              // pause
            ['2-1'],         // a
            [],              // pause
            ['3-6'],         // n
            [],              // long pause before restart
            [],
            [],
        ]
        let step = 0
        const iv = setInterval(() => {
            const keys = sequence[step]
            setLitKeys(new Set(keys))
            if (keys.length > 0) setTimeout(() => setLitKeys(new Set()), 260)
            step = (step + 1) % sequence.length
        }, 380)
        return () => clearInterval(iv)
    }, [])

    const getColors = (key: KeyDef, id: string) => {
        const lit = litKeys.has(id)
        if (lit) return {
            bg: '#F97316',
            text: '#fff',
            shadow: `0 0 10px rgba(249,115,22,0.7), 0 3px 0 #92400E`,
            yOff: 2,
        }
        if (key.accent === 'orange') return {
            bg: dark ? '#C2410C' : '#EA580C',
            text: '#fff',
            shadow: `0 3px 0 ${dark ? '#7C2D12' : '#9A3412'}`,
            yOff: 0,
        }
        if (key.accent === 'dark') return {
            bg: dark ? '#222' : '#3C3C3C',
            text: dark ? '#888' : '#999',
            shadow: `0 3px 0 ${dark ? '#111' : '#1A1A1A'}`,
            yOff: 0,
        }
        if (key.accent === 'space') return {
            bg: dark ? '#2A2A2A' : '#3C3C3C',
            text: '',
            shadow: `0 3px 0 ${dark ? '#111' : '#1A1A1A'}`,
            yOff: 0,
        }
        return {
            bg: dark ? '#404040' : '#D6D6D6',
            text: dark ? '#CCC' : '#2D2D2D',
            shadow: `0 3px 0 ${dark ? '#1A1A1A' : '#A0A0A0'}`,
            yOff: 0,
        }
    }

    const bodyBg = dark
        ? 'linear-gradient(160deg, #1C1C1C 0%, #0F0F0F 100%)'
        : 'linear-gradient(160deg, #2D2D2D 0%, #1A1A1A 100%)'

    return (
        <div
            style={{
                perspective: '700px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
            }}
        >
            {/* Ambient glow under keyboard */}
            <div style={{
                position: 'absolute',
                width: '80%',
                height: '30%',
                bottom: '10%',
                left: '10%',
                background: 'radial-gradient(ellipse, rgba(249,115,22,0.12) 0%, transparent 70%)',
                filter: 'blur(20px)',
                pointerEvents: 'none',
            }} />

            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                <motion.div
                    initial={{ opacity: 0, rotateX: 45, y: 40 }}
                    animate={{ opacity: 1, rotateX: 18, rotateY: -6, y: 0 }}
                    transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                        transformStyle: 'preserve-3d',
                        background: bodyBg,
                        borderRadius: '14px',
                        padding: '14px 16px 18px',
                        boxShadow: dark
                            ? '0 50px 100px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.08)'
                            : '0 50px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.12)',
                    }}
                >
                    {/* Top edge strip */}
                    <div style={{
                        height: '6px',
                        marginBottom: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '4px',
                        paddingRight: '4px',
                    }}>
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 1.5, delay: i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                                style={{
                                    width: 5, height: 5, borderRadius: '50%',
                                    backgroundColor: i === 0 ? '#F97316' : i === 1 ? '#22C55E' : '#3B82F6',
                                }}
                            />
                        ))}
                    </div>

                    {/* Key rows */}
                    {KB_ROWS.map((row, ri) => (
                        <div
                            key={ri}
                            style={{ display: 'flex', gap: `${KG}px`, marginBottom: ri < KB_ROWS.length - 1 ? KG : 0 }}
                        >
                            {row.map((key, ki) => {
                                const id = `${ri}-${ki}`
                                const c = getColors(key, id)
                                const width = kw(key.u)
                                return (
                                    <motion.div
                                        key={ki}
                                        animate={{ y: c.yOff }}
                                        transition={{ duration: 0.08, ease: 'easeOut' }}
                                        style={{
                                            width,
                                            height: KH,
                                            flexShrink: 0,
                                            backgroundColor: c.bg,
                                            borderRadius: '4px',
                                            boxShadow: c.shadow,
                                            display: 'flex',
                                            alignItems: 'flex-end',
                                            justifyContent: 'center',
                                            paddingBottom: '3px',
                                            fontSize: key.u >= 1.5 ? '7px' : '8px',
                                            fontFamily: 'monospace',
                                            fontWeight: 700,
                                            color: c.text,
                                            userSelect: 'none',
                                            cursor: 'default',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            transition: 'background-color 0.12s ease',
                                        }}
                                    >
                                        {/* top sheen */}
                                        <div style={{
                                            position: 'absolute',
                                            top: 0, left: 0, right: 0,
                                            height: '45%',
                                            background: 'linear-gradient(to bottom, rgba(255,255,255,0.14), transparent)',
                                            borderRadius: '4px 4px 0 0',
                                            pointerEvents: 'none',
                                        }} />
                                        <span style={{ position: 'relative', zIndex: 1, letterSpacing: '0.03em' }}>
                                            {key.k}
                                        </span>
                                    </motion.div>
                                )
                            })}
                        </div>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    )
}

// Animated background blobs 

function Blobs() {
    const { dark } = useContext(ThemeContext)
    const colors = dark
        ? ['rgba(76,142,247,0.08)', 'rgba(167,139,250,0.06)', 'rgba(244,114,182,0.07)']
        : ['rgba(29,29,31,0.06)', 'rgba(29,29,31,0.04)', 'rgba(29,29,31,0.05)']
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
            {[
                { w: 560, h: 560, top: '-8%', left: '55%', dur: 22 },
                { w: 480, h: 480, top: '50%', left: '-8%', dur: 28 },
                { w: 400, h: 400, top: '30%', left: '70%', dur: 18 },
            ].map(({ w, h, top, left, dur }, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                        width: w,
                        height: h,
                        top,
                        left,
                        background: colors[i],
                        filter: 'blur(80px)',
                    }}
                    animate={{
                        x: [0, 30, -20, 0],
                        y: [0, -20, 30, 0],
                        scale: [1, 1.08, 0.95, 1],
                    }}
                    transition={{
                        duration: dur,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 4,
                    }}
                />
            ))}
        </div>
    )
}

// Staggered text reveal 

function RevealWord({ word, delay }: { word: string; delay: number }) {
    return (
        <motion.span
            className="inline-block"
            initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
        >
            {word}
        </motion.span>
    )
}

// Navbar 

function Navbar() {
    const { dark, toggleDark } = useContext(ThemeContext)
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [active, setActive] = useState('Home')

    // Consolidated scroll handler: navbar bg + active section detection
    useEffect(() => {
        const sectionIds = NAV_LINKS.map((l) => l.toLowerCase())
        let ticking = false
        let currentActive = 'Home'
        let wasScrolled = false

        const update = () => {
            // Navbar background
            const isScrolled = window.scrollY > 24
            if (isScrolled !== wasScrolled) {
                wasScrolled = isScrolled
                setScrolled(isScrolled)
            }

            // Active section: find the last section whose top has crossed the trigger line
            const offset = 100 // navbar (60px) + buffer
            let current = sectionIds[0]

            for (const id of sectionIds) {
                const el = document.getElementById(id)
                if (!el) continue
                if (el.getBoundingClientRect().top <= offset) {
                    current = id
                }
            }

            const match = NAV_LINKS.find((l) => l.toLowerCase() === current)
            if (match && match !== currentActive) {
                currentActive = match
                setActive(match)
            }
            ticking = false
        }

        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(update)
                ticking = true
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true })
        update() // set initial state
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const go = (id: string) => {
        document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })
        setMenuOpen(false)
    }

    const navBg = scrolled
        ? dark ? 'rgba(10,10,10,0.88)' : 'rgba(255,255,255,0.85)'
        : 'transparent'
    const navBorder = scrolled
        ? dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #D2D2D7'
        : '1px solid transparent'
    const textColor = dark ? '#F5F5F7' : '#1D1D1F'
    const subTextColor = dark ? '#8E8E93' : '#6E6E73'
    const iconColor = dark ? '#6E6E73' : '#86868B'

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
            style={{
                backgroundColor: navBg,
                backdropFilter: scrolled ? 'blur(20px)' : 'none',
                WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
                borderBottom: navBorder,
            }}
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[60px] flex items-center justify-between">
                <button
                    onClick={() => go('Home')}
                    className="font-display font-bold text-[18px] tracking-tight"
                    style={{ color: textColor }}
                >
                    RAK
                </button>

                <div className="hidden md:flex items-center gap-7">
                    {NAV_LINKS.map((link) => (
                        <button
                            key={link}
                            onClick={() => go(link)}
                            className="relative text-[13px] pb-[2px] transition-all duration-250 ease-out"
                            style={{
                                color: active === link ? textColor : subTextColor,
                                fontWeight: active === link ? 600 : 500,
                            }}
                        >
                            {link}
                            {active === link && (
                                <motion.span
                                    layoutId="nav-underline"
                                    className="absolute left-0 right-0 -bottom-[2px] h-[1.5px] rounded-full"
                                    style={{ backgroundColor: dark ? '#F5F5F7' : '#1D1D1F' }}
                                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                />
                            )}
                        </button>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <a href="https://github.com/rohan-ak43" target="_blank" rel="noreferrer" className="transition-colors" style={{ color: iconColor }} aria-label="GitHub">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                    </a>
                    <a href="https://www.linkedin.com/in/arohancist/" target="_blank" rel="noreferrer" className="transition-colors" style={{ color: iconColor }} aria-label="LinkedIn">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                    </a>
                    <a href="mailto:akrohan437@gmial.com" className="transition-colors" style={{ color: iconColor }} aria-label="Email">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                        </svg>
                    </a>

                    {/* Dark mode toggle */}
                    <motion.button
                        id="theme-toggle"
                        aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
                        onClick={toggleDark}
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.92 }}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200"
                        style={{
                            backgroundColor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(29,29,31,0.07)',
                            color: dark ? '#FBBF24' : '#6E6E73',
                            border: dark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(29,29,31,0.12)',
                        }}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {dark ? (
                                <motion.svg
                                    key="moon"
                                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                    exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                    width="15" height="15" viewBox="0 0 24 24" fill="currentColor"
                                >
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                </motion.svg>
                            ) : (
                                <motion.svg
                                    key="sun"
                                    initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                    exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                    width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                >
                                    <circle cx="12" cy="12" r="5" />
                                    <line x1="12" y1="1" x2="12" y2="3" />
                                    <line x1="12" y1="21" x2="12" y2="23" />
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                    <line x1="1" y1="12" x2="3" y2="12" />
                                    <line x1="21" y1="12" x2="23" y2="12" />
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                                </motion.svg>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>

                <div className="md:hidden flex items-center gap-3">
                    {/* Mobile dark mode toggle */}
                    <motion.button
                        id="theme-toggle-mobile"
                        aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
                        onClick={toggleDark}
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.92 }}
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{
                            backgroundColor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(29,29,31,0.07)',
                            color: dark ? '#FBBF24' : '#6E6E73',
                            border: dark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(29,29,31,0.12)',
                        }}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {dark ? (
                                <motion.svg
                                    key="moon-m"
                                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                    exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                                    transition={{ duration: 0.3 }}
                                    width="15" height="15" viewBox="0 0 24 24" fill="currentColor"
                                >
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                </motion.svg>
                            ) : (
                                <motion.svg
                                    key="sun-m"
                                    initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                    exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                                    transition={{ duration: 0.3 }}
                                    width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                >
                                    <circle cx="12" cy="12" r="5" />
                                    <line x1="12" y1="1" x2="12" y2="3" />
                                    <line x1="12" y1="21" x2="12" y2="23" />
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                    <line x1="1" y1="12" x2="3" y2="12" />
                                    <line x1="21" y1="12" x2="23" y2="12" />
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                                </motion.svg>
                            )}
                        </AnimatePresence>
                    </motion.button>

                    <button className="p-1.5" style={{ color: textColor }} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            {menuOpen ? (
                                <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                            ) : (
                                <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18 }}
                        className="md:hidden backdrop-blur-xl px-6 pb-5 pt-1"
                        style={{
                            backgroundColor: dark ? 'rgba(10,10,10,0.97)' : 'rgba(255,255,255,0.96)',
                            borderBottom: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #D2D2D7',
                        }}
                    >
                        {NAV_LINKS.map((link) => (
                            <button
                                key={link}
                                onClick={() => go(link)}
                                className="block w-full text-left py-3 text-sm transition-all duration-200"
                                style={{
                                    color: active === link ? textColor : subTextColor,
                                    fontWeight: active === link ? 600 : 500,
                                    borderBottom: dark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
                                }}
                            >
                                {link}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}

// Hero 

const HERO_WORDS = ['Hello,', "I'm", 'A Rohan.']

function Hero() {
    const { dark } = useContext(ThemeContext)
    return (
        <section id="home" className="relative min-h-screen flex items-center pt-[60px] overflow-hidden" style={{ backgroundColor: dark ? '#0A0A0A' : '#F5F5F7' }}>
            <Blobs />
            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-28 w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                {/* Text */}
                <div>

                    <h1 className="font-display font-bold leading-[1.02] tracking-[-0.025em] mb-4 sm:mb-5" style={{ color: dark ? '#F5F5F7' : '#1D1D1F', fontSize: 'clamp(2.25rem, 8vw, 5.25rem)' }}>
                        {HERO_WORDS.map((word, i) => (
                            <span key={word} className="inline-block mr-[0.2em]">
                                <RevealWord
                                    word={i === 2 ? word.slice(0, -1) : word}
                                    delay={0.5 + i * 0.12}
                                />
                                {i === 2 && (
                                    <motion.span
                                        style={{ color: dark ? '#F5F5F7' : '#1D1D1F' }}
                                        className="not-italic font-extralight"
                                        initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                        transition={{ duration: 0.6, delay: 0.86, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        .
                                    </motion.span>
                                )}
                            </span>
                        ))}
                    </h1>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.78 }}
                        className="text-[16px] font-medium mb-4 tracking-tight"
                        style={{ color: dark ? '#8E8E93' : '#6E6E73' }}
                    >
                        AI Engineer · Full Stack Developer · ML Enthusiast
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.88 }}
                        className="leading-[1.75] mb-6 text-[14px] sm:text-[15.5px] max-w-full lg:max-w-[520px] tracking-[-0.01em]"
                        style={{ color: dark ? '#A1A1AA' : '#6E6E73' }}
                    >
                        Computer Science Engineering student building intelligent systems at the intersection of{' '}
                        <Hi>Machine Learning</Hi>, <Hi>Large Language Models</Hi>, and{' '}
                        <Hi>Retrieval-Augmented Generation (RAG)</Hi>. Passionate about{' '}
                        <Hi>Generative AI</Hi>, <Hi>AI Agents</Hi>, and scalable AI applications.
                    </motion.p>


                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.3 }}
                        className="flex gap-3 flex-wrap"
                    >
                        <motion.button
                            whileHover={{ scale: 1.04, boxShadow: dark ? '0 8px 24px rgba(76,142,247,0.35)' : '0 8px 24px rgba(29,29,31,0.25)' }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-7 py-3.5 rounded-full text-[13px] font-semibold shadow-sm transition-shadow"
                            style={{
                                background: dark ? '#FFFFFF' : '#1D1D1F',
                                color: dark ? '#0A0A0A' : '#FFFFFF',
                            }}
                        >
                            View Projects
                        </motion.button>
                    </motion.div>
                </div>

                {/* Animated element */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="hidden lg:flex items-center justify-center h-[500px]"
                >
                    <KeyboardIllustration />
                </motion.div>
            </div>


        </section>
    )
}

// About 

const ABOUT_CARDS = [
    {
        svg: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3.33 1.67 8.67 1.67 12 0v-5" />
            </svg>
        ),
        title: 'Education',
        text: "B.S. Abdur Rahman Crescent Institute of Science and Technology, B.Tech.CSE(IoT).",
        accent: 'rgba(29,29,31,0.12)',
    },
    {
        svg: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
            </svg>
        ),
        title: 'Experience',
        text: 'Served as a Mobile Application Development Intern at Neohorizon Analytics.',
        accent: 'rgba(29,29,31,0.12)',
    },
    {
        svg: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v11m0 0H5m4 0h4m6-11v11m0 0h-4m4 0H5" />
                <path d="M3 9h18" />
                <circle cx="12" cy="16" r="3" />
                <path d="M12 19v2" />
            </svg>
        ),
        title: 'Experience',
        text: 'Lead the development of Forá (time capsule app)',
        accent: 'rgba(29,29,31,0.12)',
    },
    {
        svg: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
            </svg>
        ),
        title: 'Interests',
        text: "RAG Systems, AI Agents, LLM's, and Full Stack Development",
        accent: 'rgba(134,134,139,0.12)',
    },
]

function About() {
    const { dark } = useContext(ThemeContext)
    return (
        <section id="about" className="py-16 sm:py-24 lg:py-32" style={{ backgroundColor: dark ? '#111111' : '#FFFFFF' }}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 mb-12 lg:mb-20">
                    <FadeUp>
                        <SectionLabel>About Me</SectionLabel>
                        <h2 className="font-display font-bold leading-tight tracking-[-0.02em]" style={{ color: dark ? '#F5F5F7' : '#1D1D1F', fontSize: 'clamp(1.875rem, 5vw, 3.5rem)' }}>
                            Turning ideas into
                            <br />
                            <em className="not-italic font-extralight" style={{ color: dark ? '#F5F5F7' : '#1D1D1F' }}>intelligent systems.</em>
                        </h2>
                    </FadeUp>
                    <FadeUp delay={0.1}>
                        <div className="pt-10 space-y-4 leading-relaxed text-[15px]" style={{ color: dark ? '#8E8E93' : '#6E6E73' }}>
                            <p>
                                I'm a Computer Science student with a deep curiosity for how machines learn. Over
                                the last few years.
                            </p>
                            <p>
                                My work lives at the intersection of <Hi color="rgba(29,29,31,0.18)">Artificial Intelligence</Hi> and{' '}
                                <Hi color="rgba(29,29,31,0.18)">Intelligent Systems</Hi>, develop and deploy them as production grade products.
                            </p>
                        </div>
                    </FadeUp>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {ABOUT_CARDS.map((card, i) => (
                        <FadeUp key={card.title} delay={i * 0.09}>
                            <motion.div
                                whileHover={{ y: -6, boxShadow: dark ? '0 20px 48px rgba(0,0,0,0.4)' : '0 20px 48px rgba(0,0,0,0.08)' }}
                                transition={{ duration: 0.2 }}
                                className="rounded-2xl p-6 h-full cursor-default"
                                style={{
                                    backgroundColor: dark ? '#1A1A1A' : '#FFFFFF',
                                    border: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E5E5EA',
                                }}
                            >
                                <div
                                    style={{
                                        backgroundColor: dark ? 'rgba(255,255,255,0.08)' : card.accent,
                                        color: dark ? '#A1A1A6' : '#1D1D1F',
                                    }}
                                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                                >
                                    {card.svg}
                                </div>
                                <h3 className="font-display font-semibold mb-2 text-[15px]" style={{ color: dark ? '#F5F5F7' : '#1D1D1F' }}>
                                    {card.title}
                                </h3>
                                <p className="text-[13px] leading-relaxed" style={{ color: dark ? '#8E8E93' : '#6E6E73' }}>{card.text}</p>
                            </motion.div>
                        </FadeUp>
                    ))}
                </div>
            </div>
        </section>
    )
}

// Resume 

function TimelineItem({ item, index }: { item: (typeof TIMELINE)[0]; index: number }) {
    const { dark } = useContext(ThemeContext)
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-60px' })
    const style = TYPE_STYLE[item.type]
    const dotColor = dark ? '#4C8EF7' : style.dot
    const badgeColor = dark ? 'rgba(76,142,247,0.18)' : style.badge

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
            className="flex gap-5"
        >
            <div className="flex flex-col items-center">
                <motion.div
                    style={{ backgroundColor: dotColor, boxShadow: `0 0 0 4px ${badgeColor}` }}
                    className="w-3 h-3 rounded-full mt-1.5 shrink-0"
                    initial={{ scale: 0 }}
                    animate={inView ? { scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: index * 0.07 + 0.2, type: 'spring', stiffness: 300 }}
                />
                {index < TIMELINE.length - 1 && (
                    <motion.div
                        className="w-px flex-1 mt-2"
                        style={{ backgroundColor: dark ? 'rgba(255,255,255,0.1)' : '#D2D2D7' }}
                        initial={{ scaleY: 0, originY: 0 }}
                        animate={inView ? { scaleY: 1 } : {}}
                        transition={{ duration: 0.5, delay: index * 0.07 + 0.3 }}
                    />
                )}
            </div>
            <div className="pb-10">
                <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                    <span
                        style={{ backgroundColor: badgeColor, color: dark ? '#93C5FD' : '#1D1D1F' }}
                        className="text-[11px] font-medium px-2.5 py-0.5 rounded-full"
                    >
                        {style.label}
                    </span>
                    <span className="text-[11px] font-mono" style={{ color: dark ? '#6E6E73' : '#86868B' }}>{item.period}</span>
                </div>
                <h3 className="font-display font-semibold text-[17px] leading-tight" style={{ color: dark ? '#F5F5F7' : '#1D1D1F' }}>
                    {item.title}
                </h3>
                <p className="text-[13px] font-medium mb-2 mt-0.5" style={{ color: dark ? '#A1A1A6' : '#1D1D1F' }}>{item.org}</p>
                <p className="text-[13px] leading-relaxed" style={{ color: dark ? '#8E8E93' : '#6E6E73' }}>{item.description}</p>
            </div>
        </motion.div>
    )
}

function Resume() {
    const { dark } = useContext(ThemeContext)
    return (
        <section id="resume" className="py-16 sm:py-24 lg:py-32" style={{ backgroundColor: dark ? '#0A0A0A' : '#F5F5F7' }}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <FadeUp className="mb-16">
                    <SectionLabel>Journey</SectionLabel>
                    <div className="flex flex-wrap items-end justify-between gap-6">
                        <h2 className="font-display font-bold tracking-[-0.02em]" style={{ color: dark ? '#F5F5F7' : '#1D1D1F', fontSize: 'clamp(1.875rem, 5vw, 3rem)' }}>
                            Experience &amp;
                            <br />
                            <em className="not-italic font-extralight" style={{ color: dark ? '#F5F5F7' : '#1D1D1F' }}>Education.</em>
                        </h2>
                        <motion.a
                            href="https://drive.google.com/file/d/1-qY9fbLdEfjMJSL01UFG_koLcNaRBEbY/view?usp=sharing"
                            target="_blank"
                            rel="noreferrer"
                            whileHover={{ scale: 1.04, boxShadow: dark ? '0 8px 24px rgba(76,142,247,0.35)' : '0 8px 24px rgba(29,29,31,0.2)' }}
                            whileTap={{ scale: 0.96 }}
                            className="inline-flex shrink-0 items-center gap-2 px-5 sm:px-6 py-3 rounded-full text-[13px] font-semibold transition-shadow"
                            style={{
                                background: dark ? '#FFFFFF' : '#1D1D1F',
                                color: dark ? '#0A0A0A' : '#FFFFFF',
                            }}
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="12" y1="18" x2="12" y2="12" />
                                <line x1="9" y1="15" x2="15" y2="15" />
                            </svg>
                            View Resume
                        </motion.a>
                    </div>
                </FadeUp>
                <div className="max-w-full lg:max-w-[580px]">
                    {TIMELINE.map((item, i) => (
                        <TimelineItem key={i} item={item} index={i} />
                    ))}
                </div>
            </div>
        </section>
    )
}


// Portfolio 

function ProjectCard({ project, index }: { project: (typeof PROJECTS)[0]; index: number }) {
    const { dark } = useContext(ThemeContext)
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-60px' })
    const [hovered, setHovered] = useState(false)

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: (index % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
            <motion.div
                onHoverStart={() => setHovered(true)}
                onHoverEnd={() => setHovered(false)}
                whileHover={{ y: -8, boxShadow: dark ? '0 20px 48px rgba(0,0,0,0.5)' : '0 20px 48px rgba(0,0,0,0.1)' }}
                transition={{ duration: 0.25 }}
                className="group rounded-2xl overflow-hidden transition-shadow duration-300 h-full flex flex-col"
                style={{
                    backgroundColor: dark ? '#1A1A1A' : '#FFFFFF',
                    border: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E5E5EA',
                }}
            >
                {/* Image */}
                <div className="h-48 overflow-hidden relative" style={{ backgroundColor: project.accent }}>
                    <motion.img
                        src={project.img}
                        alt={project.imgAlt}
                        className="w-full h-full object-cover"
                        animate={{ scale: hovered ? 1.06 : 1 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    />
                    <div
                        className="absolute inset-0 transition-opacity duration-300"
                        style={{
                            background: dark
                                ? `linear-gradient(to bottom, transparent 40%, rgba(26,26,26,0.9) 100%)`
                                : `linear-gradient(to bottom, transparent 40%, rgba(255,255,255,0.85) 100%)`,
                            opacity: hovered ? 0.8 : 0.4,
                        }}
                    />
                    <span className="absolute bottom-3 right-4 font-display font-black text-[28px] leading-none select-none" style={{ color: dark ? 'rgba(255,255,255,0.2)' : 'rgba(29,29,31,0.3)' }}>
                        {String(index + 1).padStart(2, '0')}
                    </span>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-display font-bold text-[15px] sm:text-[16px] mb-2" style={{ color: dark ? '#F5F5F7' : '#1D1D1F' }}>{project.title}</h3>
                    <p className="text-[13px] leading-relaxed mb-4 flex-1 line-clamp-4" style={{ color: dark ? '#8E8E93' : '#6E6E73' }}>{project.description}</p>

                    <div className="flex justify-center">
                        <motion.a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileTap={{ scale: 0.95 }}
                            className="w-[85%] sm:w-[75%] text-center text-[12px] font-medium py-2.5 rounded-xl transition-colors cursor-pointer"
                            style={{ background: dark ? '#FFFFFF' : '#1D1D1F', color: dark ? '#0A0A0A' : '#FFFFFF' }}
                        >
                            GitHub
                        </motion.a>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

function Portfolio() {
    const { dark } = useContext(ThemeContext)
    return (
        <section id="portfolio" className="py-16 sm:py-24 lg:py-32" style={{ backgroundColor: dark ? '#111111' : '#FFFFFF' }}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <FadeUp className="mb-10 sm:mb-16">
                    <SectionLabel>Work</SectionLabel>
                    <h2 className="font-display font-bold tracking-[-0.02em]" style={{ color: dark ? '#F5F5F7' : '#1D1D1F', fontSize: 'clamp(1.875rem, 5vw, 3rem)' }}>
                        Featured
                        <br />
                        <em className="not-italic font-extralight" style={{ color: dark ? '#F5F5F7' : '#1D1D1F' }}>Projects.</em>
                    </h2>
                </FadeUp>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {PROJECTS.map((p, i) => (
                        <ProjectCard key={p.title} project={p} index={i} />
                    ))}
                </div>
            </div>
        </section>
    )
}

// Skills 

function Skills() {
    const { dark } = useContext(ThemeContext)
    return (
        <section id="skills" className="py-16 sm:py-24 lg:py-32" style={{ backgroundColor: dark ? '#0A0A0A' : '#F5F5F7' }}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <FadeUp className="mb-10 sm:mb-16">
                    <SectionLabel>Toolkit</SectionLabel>
                    <h2 className="font-display font-bold tracking-[-0.02em]" style={{ color: dark ? '#F5F5F7' : '#1D1D1F', fontSize: 'clamp(1.875rem, 5vw, 3rem)' }}>
                        Skills &amp;
                        <br />
                        <em className="not-italic font-extralight" style={{ color: dark ? '#F5F5F7' : '#1D1D1F' }}>Technologies.</em>
                    </h2>
                </FadeUp>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(SKILLS_DATA).map(([category, skills], i) => (
                        <FadeUp key={category} delay={i * 0.07} className="h-full">
                            <motion.div
                                whileHover={{ y: -4, boxShadow: dark ? '0 16px 40px rgba(0,0,0,0.4)' : '0 16px 40px rgba(0,0,0,0.06)' }}
                                transition={{ duration: 0.18 }}
                                className="rounded-2xl p-6 h-full"
                                style={{
                                    backgroundColor: dark ? '#1A1A1A' : '#FFFFFF',
                                    border: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E5E5EA',
                                }}
                            >
                                <span
                                    style={{
                                        backgroundColor: dark ? 'rgba(76,142,247,0.15)' : SKILL_ACCENTS[category],
                                        color: dark ? '#93C5FD' : '#1D1D1F',
                                    }}
                                    className="inline-block text-[11px] font-medium px-3 py-1 rounded-full mb-4"
                                >
                                    {category}
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill) => (
                                        <motion.span
                                            key={skill}
                                            whileHover={{ backgroundColor: dark ? 'rgba(76,142,247,0.15)' : SKILL_ACCENTS[category], scale: 1.05 }}
                                            transition={{ duration: 0.15 }}
                                            className="text-[12px] px-3 py-1.5 rounded-lg cursor-default min-w-0 break-words"
                                            style={{
                                                color: dark ? '#A1A1A6' : '#515154',
                                                backgroundColor: dark ? 'rgba(255,255,255,0.05)' : '#F5F5F7',
                                                border: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E5E5EA',
                                            }}
                                        >
                                            {skill}
                                        </motion.span>
                                    ))}
                                </div>
                            </motion.div>
                        </FadeUp>
                    ))}
                </div>
            </div>
        </section>
    )
}

// Contact 

function Contact() {
    const { dark } = useContext(ThemeContext)
    const [form, setForm] = useState({ name: '', email: '', message: '' })
    const [sent, setSent] = useState(false)
    const [sending, setSending] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setSending(true)
        setError('')

        try {
            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    access_key: import.meta.env.VITE_WEB3FORMS_KEY,
                    name: form.name,
                    email: form.email,
                    message: form.message,
                    subject: `Portfolio Contact — ${form.name}`,
                }),
            })

            const data = await res.json()

            if (data.success) {
                setSent(true)
                setForm({ name: '', email: '', message: '' })
                setTimeout(() => setSent(false), 3200)
            } else {
                setError(data.message || 'Something went wrong. Please try again.')
            }
        } catch {
            setError('Network error — please check your connection and try again.')
        } finally {
            setSending(false)
        }
    }

    const inputClass =
        'w-full px-4 py-3.5 rounded-xl text-[14px] focus:outline-none transition-all duration-200'

    const inputStyle = {
        backgroundColor: dark ? '#1A1A1A' : '#FFFFFF',
        border: dark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #D2D2D7',
        color: dark ? '#F5F5F7' : '#1D1D1F',
    }

    const isDisabled = sending || sent

    return (
        <section id="contact" className="py-16 sm:py-24 lg:py-32" style={{ backgroundColor: dark ? '#111111' : '#FFFFFF' }}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    <FadeUp>
                        <SectionLabel>Say Hello</SectionLabel>
                        <h2 className="font-display font-bold tracking-[-0.02em] mb-5 sm:mb-6" style={{ color: dark ? '#F5F5F7' : '#1D1D1F', fontSize: 'clamp(1.875rem, 5vw, 3rem)' }}>
                            {"Let's connect"}
                            <br />
                            <em className="not-italic font-extralight" style={{ color: dark ? '#F5F5F7' : '#1D1D1F' }}>and collaborate.</em>
                        </h2>
                        <p className="leading-relaxed mb-8 sm:mb-10 text-[14px] sm:text-[15px]" style={{ color: dark ? '#8E8E93' : '#6E6E73' }}>
                            I'm always open to new technologies, ideas, collaborations, and opportunities. Whether you
                            have a project in mind or just want to talk about AI, let's connect.
                        </p>
                        <div className="space-y-4">
                            {[
                                {
                                    icon: (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                                            <rect x="2" y="4" width="20" height="16" rx="2" />
                                            <path d="m2 7 8.586 6.586a2 2 0 0 0 2.828 0L22 7" />
                                        </svg>
                                    ),
                                    label: 'akrohan437@gmail.com',
                                    href: 'mailto:akrohan437@gmail.com',
                                },
                                {
                                    icon: (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                    ),
                                    label: 'linkedin.com/in/arohancist',
                                    href: 'https://www.linkedin.com/in/arohancist/',
                                },
                                {
                                    icon: (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                                        </svg>
                                    ),
                                    label: 'github.com/rohan-ak43',
                                    href: 'https://github.com/rohan-ak43',
                                },
                                {
                                    icon: (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                                            <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
                                            <circle cx="12" cy="10" r="3" />
                                        </svg>
                                    ),
                                    label: 'Chennai, Tamil Nadu, India',
                                    href: undefined,
                                },
                            ].map(({ icon, label, href }) => (
                                <div key={label} className="flex items-center gap-3" style={{ color: dark ? '#8E8E93' : '#6E6E73' }}>
                                    <span className="w-5 flex items-center justify-center flex-shrink-0">{icon}</span>
                                    {href ? (
                                        <a href={href} className="text-[13px] transition-colors" style={{ color: 'inherit' }}>
                                            {label}
                                        </a>
                                    ) : (
                                        <span className="text-[13px]">{label}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </FadeUp>

                    <FadeUp delay={0.15}>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[13px] font-medium mb-2" style={{ color: dark ? '#A1A1A6' : '#515154' }}>Name</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="Your name"
                                    required
                                    disabled={isDisabled}
                                    className={inputClass}
                                    style={{ ...inputStyle, '--tw-placeholder-color': 'rgba(255,255,255,0.25)' } as React.CSSProperties}
                                />
                            </div>
                            <div>
                                <label className="block text-[13px] font-medium mb-2" style={{ color: dark ? '#A1A1A6' : '#515154' }}>Email</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    placeholder="your@email.com"
                                    required
                                    disabled={isDisabled}
                                    className={inputClass}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label className="block text-[13px] font-medium mb-2" style={{ color: dark ? '#A1A1A6' : '#515154' }}>Message</label>
                                <textarea
                                    value={form.message}
                                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                                    placeholder="Wanna talk or build something together. Let's connect and talk..."
                                    rows={5}
                                    required
                                    disabled={isDisabled}
                                    className={`${inputClass} resize-none`}
                                    style={inputStyle}
                                />
                            </div>
                            <AnimatePresence mode="wait">
                                <motion.button
                                    key={sent ? 'sent' : sending ? 'sending' : 'send'}
                                    type="submit"
                                    disabled={isDisabled}
                                    whileHover={isDisabled ? {} : { scale: 1.015, boxShadow: '0 8px 24px rgba(29,29,31,0.25)' }}
                                    whileTap={isDisabled ? {} : { scale: 0.985 }}
                                    initial={{ opacity: 0.8 }}
                                    animate={{ opacity: 1 }}
                                    className="w-full py-4 rounded-xl text-[13px] font-semibold transition-colors disabled:cursor-not-allowed"
                                    style={sent
                                        ? { backgroundColor: '#10B981', color: '#FFFFFF' }
                                        : sending
                                            ? { background: dark ? 'rgba(255,255,255,0.7)' : 'rgba(29,29,31,0.7)', color: dark ? '#0A0A0A' : '#FFFFFF' }
                                            : { background: dark ? '#FFFFFF' : '#1D1D1F', color: dark ? '#0A0A0A' : '#FFFFFF' }
                                    }
                                >
                                    {sent ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="20 6 9 17 4 12" /></svg>
                                            Message Sent
                                        </span>
                                    ) : sending ? 'Sending...' : 'Send Message'}
                                </motion.button>
                            </AnimatePresence>
                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-[13px] text-center mt-2"
                                    style={{ color: '#EF4444' }}
                                >
                                    {error}
                                </motion.p>
                            )}
                        </form>
                    </FadeUp>
                </div>
            </div>
        </section>
    )
}


// Footer 

function Footer() {
    const { dark } = useContext(ThemeContext)
    return (
        <footer
            className="py-8"
            style={{
                backgroundColor: dark ? '#0A0A0A' : '#F5F5F7',
                borderTop: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(29,29,31,0.12)',
            }}
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-[12px] text-center sm:text-left" style={{ color: dark ? '#6E6E73' : '#86868B' }}>
                    Designed &amp; Developed by A Rohan &middot; &copy; 2026
                </p>
                <div className="flex items-center gap-6">
                    {[
                        { href: 'https://github.com/rohan-ak43', label: 'GitHub' },
                        { href: 'https://www.linkedin.com/in/arohancist/', label: 'LinkedIn' },
                        { href: 'mailto:akrohan437@gmail.com', label: 'Email' },
                    ].map(({ href, label }) => (
                        <motion.a
                            key={label}
                            href={href}
                            className="group relative text-[11px] font-mono tracking-wide py-1 cursor-pointer"
                            style={{ color: dark ? '#6E6E73' : '#86868B' }}
                            whileHover={{
                                color: dark ? '#FFFFFF' : '#1D1D1F',
                                y: -2
                            }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                        >
                            {label}
                            <span
                                className="absolute bottom-0 left-0 h-[1px] w-0 bg-current transition-all duration-300 ease-out group-hover:w-full"
                            />
                        </motion.a>
                    ))}
                </div>
            </div>
        </footer>
    )
}

// App 

export default function App() {
    const [dark, setDark] = useState(false)
    const toggleDark = () => setDark((d) => !d)

    return (
        <ThemeContext.Provider value={{ dark, toggleDark }}>
            <div
                className="min-h-screen font-sans overflow-x-hidden"
                style={{
                    backgroundColor: dark ? '#0A0A0A' : '#F5F5F7',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    transition: 'background-color 0.4s ease',
                } as CSSProperties}
            >
                <Cursor />
                <Navbar />
                <Hero />
                <About />
                <Resume />
                <Portfolio />
                <Skills />
                <Contact />
                <Footer />
            </div>
        </ThemeContext.Provider>
    )
}








