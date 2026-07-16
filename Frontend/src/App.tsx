import {
    useState,
    useEffect,
    useRef,
    type FormEvent,
    type CSSProperties,
} from 'react'
import {
    motion,
    useInView,
    AnimatePresence,
    useScroll,
    useTransform,
    useMotionValue,
    useSpring,
} from 'framer-motion'

// Data 

const NAV_LINKS = ['Home', 'About', 'Resume', 'Portfolio', 'Skills', 'Contact']

const PROJECTS = [
    {
        title: 'AI Cricket Analytics',
        description:
            'Real-time computer vision system analyzing match footage with YOLO-based player tracking, shot classification, and live performance dashboards.',
        tags: ['Python', 'OpenCV', 'YOLO', 'FastAPI', 'React'],
        accent: '#DCEEFF',
        img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop&auto=format',
        imgAlt: 'Performance analytics dashboard on laptop screen',
    },
    {
        title: 'Movie Recommendation Engine',
        description:
            'Hybrid collaborative + content-based filtering with natural language query support powered by semantic embeddings and vector similarity search.',
        tags: ['Python', 'PyTorch', 'FastAPI', 'PostgreSQL'],
        accent: '#E8DFFF',
        img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=400&fit=crop&auto=format',
        imgAlt: 'Cinema theater interior',
    },
    {
        title: 'Remo — Rehabilitation AI',
        description:
            'AI physiotherapy assistant using MediaPipe pose estimation to guide patients through exercises with real-time biomechanical feedback.',
        tags: ['Python', 'MediaPipe', 'TensorFlow', 'React'],
        accent: '#DFF7EC',
        img: 'https://images.unsplash.com/photo-1645005512942-a17817fb7c11?w=800&h=400&fit=crop&auto=format',
        imgAlt: 'Physical therapy rehabilitation session',
    },
    {
        title: 'Time Capsule App',
        description:
            'Encrypted personal archive for sealing memories, letters, and media to be unlocked at a future date with blockchain-verified integrity.',
        tags: ['Next.js', 'Supabase', 'TypeScript', 'Solidity'],
        accent: '#FFF3BF',
        img: 'https://images.unsplash.com/photo-1634562876572-5abe57afcceb?w=800&h=400&fit=crop&auto=format',
        imgAlt: 'Pen resting on handwritten letter',
    },
    {
        title: 'TruthSeeker — Fake News AI',
        description:
            'Multi-modal misinformation detection combining NLP claim verification, source credibility scoring, and image forensics.',
        tags: ['Python', 'BERT', 'FastAPI', 'React', 'Claude API'],
        accent: '#DCEEFF',
        img: 'https://images.unsplash.com/photo-1624269305548-1527ef905ff6?w=800&h=400&fit=crop&auto=format',
        imgAlt: 'Newspaper headline text',
    },
]

const TIMELINE = [
    {
        type: 'education',
        title: 'B.S. Computer Science',
        org: 'University of Technology',
        period: '2022 — Present',
        description:
            "Specializing in Artificial Intelligence and Machine Learning with a Mathematics minor. Dean's List three consecutive semesters.",
    },
    {
        type: 'experience',
        title: 'AI Research Intern',
        org: 'DataSynth Labs',
        period: 'Summer 2024',
        description:
            'Developed a document understanding pipeline using transformer models, reducing extraction error by 34%. Co-authored two research papers.',
    },
    {
        type: 'experience',
        title: 'Full Stack Developer',
        org: 'Freelance',
        period: '2023 — Present',
        description:
            'Delivered 8+ production-ready web applications across fintech, healthtech, and edtech sectors using React, FastAPI, and PostgreSQL.',
    },
    {
        type: 'achievement',
        title: 'National Hackathon — 1st Place',
        org: 'TechFest 2024',
        period: 'October 2024',
        description:
            'First place out of 400+ teams for building a real-time disaster response system combining computer vision with large language models.',
    },
    {
        type: 'certification',
        title: 'Deep Learning Specialization',
        org: 'DeepLearning.AI / Coursera',
        period: '2023',
        description:
            '5-course specialization covering neural networks, CNNs, sequence models, and practical ML engineering from Andrew Ng.',
    },
]

const SKILLS_DATA: Record<string, string[]> = {
    Programming: ['Python', 'TypeScript', 'JavaScript', 'Go', 'SQL'],
    Backend: ['FastAPI', 'Node.js', 'GraphQL', 'REST API', 'gRPC'],
    Frontend: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion'],
    'AI / ML': ['TensorFlow', 'PyTorch', 'OpenCV', 'MediaPipe', 'LangChain', 'Hugging Face'],
    Databases: ['PostgreSQL', 'MongoDB', 'Redis', 'Firebase', 'Supabase'],
    'Cloud & DevOps': ['Docker', 'AWS', 'GCP', 'Git', 'CI/CD'],
}

const SKILL_ACCENTS: Record<string, string> = {
    Programming: '#DCEEFF',
    Backend: '#E8DFFF',
    Frontend: '#DFF7EC',
    'AI / ML': '#FFF3BF',
    Databases: '#DCEEFF',
    'Cloud & DevOps': '#E8DFFF',
}

const TYPE_STYLE: Record<string, { dot: string; badge: string; label: string }> = {
    education: { dot: '#93C5FD', badge: '#DCEEFF', label: 'Education' },
    experience: { dot: '#C4B5FD', badge: '#E8DFFF', label: 'Experience' },
    achievement: { dot: '#FCD34D', badge: '#FFF3BF', label: 'Achievement' },
    certification: { dot: '#6EE7B7', badge: '#DFF7EC', label: 'Certification' },
}

// Shared primitives 

function Hi({ children, color }: { children: React.ReactNode; color: string }) {
    return (
        <span style={{ backgroundColor: color }} className="px-1.5 py-0.5 rounded-md font-medium">
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
    return (
        <span className="text-[11px] font-mono text-gray-400 tracking-[0.22em] uppercase block mb-4">
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

    useEffect(() => {
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

    return (
        <motion.div
            className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[200]"
            style={{
                x: springX,
                y: springY,
                background: 'radial-gradient(circle, rgba(180,210,255,0.55) 0%, rgba(220,238,255,0.2) 60%, transparent 100%)',
                filter: 'blur(4px)',
                opacity: visible ? 1 : 0,
            }}
        />
    )
}

// Scroll Progress Bar 

function ScrollProgress() {
    const { scrollYProgress } = useScroll()
    const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })
    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[60]"
            style={{
                scaleX,
                background: 'linear-gradient(to right, #DCEEFF, #E8DFFF, #DFF7EC)',
            }}
        />
    )
}

// Neural Network animation 

const NODES = [
    { x: 50, y: 18 }, { x: 18, y: 40 }, { x: 82, y: 38 },
    { x: 32, y: 65 }, { x: 68, y: 62 }, { x: 12, y: 72 },
    { x: 88, y: 72 }, { x: 50, y: 82 },
]
const EDGES = [
    [0, 1], [0, 2], [0, 4], [1, 3], [1, 5], [2, 4], [2, 6], [3, 7], [4, 7], [5, 3], [6, 7], [1, 4],
]
const NODE_COLORS = ['#DCEEFF', '#E8DFFF', '#DFF7EC', '#FFF3BF', '#E8DFFF', '#DCEEFF', '#FFF3BF', '#DFF7EC']

function NeuralNet() {
    return (
        <div className="relative w-full h-full flex items-center justify-center select-none">
            {/* Ambient glow */}
            <div
                className="absolute inset-0 rounded-full"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(220,238,255,0.35) 0%, transparent 70%)',
                    filter: 'blur(32px)',
                }}
            />
            <svg
                viewBox="0 0 100 100"
                className="w-full max-w-[420px] h-auto relative z-10"
                style={{ filter: 'drop-shadow(0 0 40px rgba(180,210,255,0.3))' }}
            >
                {EDGES.map(([a, b], i) => (
                    <motion.line
                        key={i}
                        x1={NODES[a].x} y1={NODES[a].y}
                        x2={NODES[b].x} y2={NODES[b].y}
                        stroke="rgba(170,195,235,0.5)"
                        strokeWidth="0.4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.2, 0.6, 0.2] }}
                        transition={{ duration: 3.5 + (i % 3), delay: i * 0.18, repeat: Infinity, ease: 'easeInOut' }}
                    />
                ))}
                {NODES.map((node, i) => (
                    <motion.circle
                        key={i}
                        cx={node.x} cy={node.y} r="2.8"
                        fill={NODE_COLORS[i]}
                        stroke="rgba(255,255,255,0.9)"
                        strokeWidth="0.6"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [1, 1.3, 1], opacity: [0.65, 1, 0.65] }}
                        transition={{ duration: 2.8 + i * 0.25, delay: i * 0.14, repeat: Infinity, ease: 'easeInOut' }}
                    />
                ))}
            </svg>

            {[
                { label: 'GPT-4o', top: '14%', left: '62%' },
                { label: 'Vision', top: '56%', left: '4%' },
                { label: 'BERT', top: '28%', left: '82%' },
                { label: 'RL', top: '78%', left: '44%' },
            ].map(({ label, top, left }, i) => (
                <motion.span
                    key={label}
                    className="absolute text-[9px] font-mono text-gray-300 tracking-wider z-10"
                    style={{ top, left }}
                    animate={{ opacity: [0.2, 0.6, 0.2], y: [0, -4, 0] }}
                    transition={{ duration: 3.5 + i, repeat: Infinity, delay: i * 0.8, ease: 'easeInOut' }}
                >
                    {label}
                </motion.span>
            ))}
        </div>
    )
}

// Animated background blobs 

function Blobs() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
            {[
                { w: 560, h: 560, top: '-8%', left: '55%', color: 'rgba(220,238,255,0.38)', dur: 22 },
                { w: 480, h: 480, top: '50%', left: '-8%', color: 'rgba(232,223,255,0.3)', dur: 28 },
                { w: 400, h: 400, top: '30%', left: '70%', color: 'rgba(223,247,236,0.28)', dur: 18 },
            ].map(({ w, h, top, left, color, dur }, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                        width: w,
                        height: h,
                        top,
                        left,
                        background: color,
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
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [active, setActive] = useState('Home')

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 24)
        window.addEventListener('scroll', fn, { passive: true })
        return () => window.removeEventListener('scroll', fn)
    }, [])

    const go = (id: string) => {
        document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })
        setActive(id)
        setMenuOpen(false)
    }

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
            style={{
                backgroundColor: scrolled ? 'rgba(250,250,250,0.88)' : 'transparent',
                backdropFilter: scrolled ? 'blur(24px)' : 'none',
                WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
                borderBottom: scrolled ? '1px solid #EAEAEA' : '1px solid transparent',
            }}
        >
            <div className="max-w-6xl mx-auto px-6 h-[60px] flex items-center justify-between">
                <button
                    onClick={() => go('Home')}
                    className="font-display font-bold text-[18px] tracking-tight text-gray-900"
                >
                    RAK
                </button>

                <div className="hidden md:flex items-center gap-7">
                    {NAV_LINKS.map((link) => (
                        <button
                            key={link}
                            onClick={() => go(link)}
                            className={`text-[13px] font-medium transition-colors duration-200 ${active === link ? 'text-gray-900' : 'text-gray-500 hover:text-gray-800'
                                }`}
                        >
                            {link}
                        </button>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <a href="https://github.com/rohan-ak43" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-800 transition-colors" aria-label="GitHub">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                    </a>
                    <a href="https://www.linkedin.com/in/arohancist/" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-800 transition-colors" aria-label="LinkedIn">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                    </a>
                    <a href="mailto:akrohan437@gmial.com" className="text-gray-400 hover:text-gray-800 transition-colors" aria-label="Email">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                        </svg>
                    </a>
                </div>

                <button className="md:hidden p-1.5" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {menuOpen ? (
                            <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                        ) : (
                            <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
                        )}
                    </svg>
                </button>
            </div>

            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18 }}
                        className="md:hidden bg-white/96 backdrop-blur-xl border-b border-gray-100 px-6 pb-5 pt-1"
                    >
                        {NAV_LINKS.map((link) => (
                            <button
                                key={link}
                                onClick={() => go(link)}
                                className="block w-full text-left py-3 text-sm text-gray-700 font-medium border-b border-gray-50 last:border-0"
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
    return (
        <section id="home" className="relative min-h-screen flex items-center pt-[60px] overflow-hidden">
            <Blobs />
            <div className="relative z-10 max-w-6xl mx-auto px-6 py-28 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Text */}
                <div>
                    <motion.p
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-[11px] font-mono text-gray-400 tracking-[0.22em] uppercase mb-7 flex items-center gap-2"
                    >
                        <motion.span
                            className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"
                            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            style={{ boxShadow: '0 0 6px rgba(52,211,153,0.7)' }}
                        />
                        Available for opportunities
                    </motion.p>

                    <h1 className="font-display text-[58px] md:text-[74px] lg:text-[84px] font-bold text-gray-900 leading-[1.02] tracking-[-0.025em] mb-5">
                        {HERO_WORDS.map((word, i) => (
                            <span key={word} className="inline-block mr-[0.2em]">
                                <RevealWord
                                    word={i === 2 ? word.slice(0, -1) : word}
                                    delay={0.5 + i * 0.12}
                                />
                                {i === 2 && (
                                    <motion.span
                                        className="not-italic font-extralight text-gray-500"
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
                        className="text-[16px] text-gray-500 font-medium mb-4 tracking-tight"
                    >
                        AI Engineer · Full Stack Developer · ML Enthusiast
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.88 }}
                        className="text-gray-500 leading-relaxed mb-8 text-[15px] max-w-[500px]"
                    >
                        Computer Science student building at the intersection of{' '}
                        <Hi color="#DCEEFF">Machine Learning</Hi>,{' '}
                        <Hi color="#E8DFFF">Computer Vision</Hi>, and{' '}
                        <Hi color="#DFF7EC">Full Stack Engineering</Hi>. Passionate about{' '}
                        <Hi color="#FFF3BF">Generative AI</Hi> and intelligent products.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.98 }}
                        className="flex flex-wrap gap-2 mb-10"
                    >
                        {[
                            { label: 'Deep Learning', color: '#DCEEFF' },
                            { label: 'FastAPI', color: '#E8DFFF' },
                            { label: 'React', color: '#DFF7EC' },
                            { label: 'PyTorch', color: '#FFF3BF' },
                            { label: 'Claude API', color: '#DCEEFF' },
                        ].map(({ label, color }, i) => (
                            <motion.span
                                key={label}
                                style={{ backgroundColor: color }}
                                className="text-[11px] font-medium px-3 py-1.5 rounded-full text-gray-700"
                                initial={{ opacity: 0, scale: 0.85 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: 1.05 + i * 0.06 }}
                            >
                                {label}
                            </motion.span>
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.3 }}
                        className="flex gap-3 flex-wrap"
                    >
                        <motion.button
                            whileHover={{ scale: 1.04, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
                            className="bg-gray-900 text-white px-7 py-3.5 rounded-full text-[13px] font-medium shadow-sm transition-shadow"
                        >
                            View Projects
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.04, borderColor: '#999' }}
                            whileTap={{ scale: 0.96 }}
                            className="border border-gray-200 text-gray-700 px-7 py-3.5 rounded-full text-[13px] font-medium bg-white/60 transition-colors"
                        >
                            Download Resume
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
                    <NeuralNet />
                </motion.div>
            </div>

            {/* Scroll hint */}
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 0.8 }}
            >
                <span className="text-[10px] font-mono text-gray-300 tracking-[0.15em] uppercase">scroll</span>
                <motion.div
                    className="w-px h-8 bg-gradient-to-b from-gray-300 to-transparent"
                    animate={{ scaleY: [1, 0.4, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                />
            </motion.div>
        </section>
    )
}

// About 

const ABOUT_CARDS = [
    { icon: '🎓', title: 'Education', text: "B.S. Computer Science, AI/ML specialization. Dean's List 3 consecutive semesters.", accent: '#DCEEFF' },
    { icon: '⚡', title: 'Experience', text: 'AI Research Intern at DataSynth Labs. Freelance full-stack engineer for 3+ years.', accent: '#E8DFFF' },
    { icon: '🔬', title: 'Research', text: 'Co-authored papers on document understanding and pose estimation for rehabilitation.', accent: '#DFF7EC' },
    { icon: '🌐', title: 'Interests', text: 'Generative AI, robotics, open-source contribution, and developer tooling.', accent: '#FFF3BF' },
]

function About() {
    return (
        <section id="about" className="py-32 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-20">
                    <FadeUp>
                        <SectionLabel>About Me</SectionLabel>
                        <h2 className="font-display text-[48px] md:text-[56px] font-bold text-gray-900 leading-tight tracking-[-0.02em]">
                            Turning ideas into
                            <br />
                            <em className="not-italic font-extralight text-gray-500">intelligent systems.</em>
                        </h2>
                    </FadeUp>
                    <FadeUp delay={0.1}>
                        <div className="pt-10 space-y-4 text-gray-500 leading-relaxed text-[15px]">
                            <p>
                                I'm a Computer Science student with a deep curiosity for how machines learn. Over
                                the last three years I've built everything from real-time computer vision pipelines
                                to production-ready web applications.
                            </p>
                            <p>
                                My work lives at the intersection of <Hi color="#DCEEFF">AI research</Hi> and{' '}
                                <Hi color="#DFF7EC">practical engineering</Hi> — I care about systems that are not
                                just theoretically elegant but actually useful in the real world.
                            </p>
                            <p>
                                When I'm not training models or writing APIs, I'm competing in hackathons,
                                contributing to open source, and exploring the frontier of{' '}
                                <Hi color="#E8DFFF">Generative AI</Hi>.
                            </p>
                        </div>
                    </FadeUp>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {ABOUT_CARDS.map((card, i) => (
                        <FadeUp key={card.title} delay={i * 0.09}>
                            <motion.div
                                whileHover={{ y: -6, boxShadow: '0 20px 48px rgba(0,0,0,0.07)' }}
                                transition={{ duration: 0.2 }}
                                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full cursor-default"
                            >
                                <div
                                    style={{ backgroundColor: card.accent }}
                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-[18px] mb-4"
                                >
                                    {card.icon}
                                </div>
                                <h3 className="font-display font-semibold text-gray-900 mb-2 text-[15px]">
                                    {card.title}
                                </h3>
                                <p className="text-[13px] text-gray-500 leading-relaxed">{card.text}</p>
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
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-60px' })
    const style = TYPE_STYLE[item.type]

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
                    style={{ backgroundColor: style.dot, boxShadow: `0 0 0 4px ${style.badge}` }}
                    className="w-3 h-3 rounded-full mt-1.5 shrink-0"
                    initial={{ scale: 0 }}
                    animate={inView ? { scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: index * 0.07 + 0.2, type: 'spring', stiffness: 300 }}
                />
                {index < TIMELINE.length - 1 && (
                    <motion.div
                        className="w-px flex-1 mt-2"
                        style={{ backgroundColor: '#EAEAEA' }}
                        initial={{ scaleY: 0, originY: 0 }}
                        animate={inView ? { scaleY: 1 } : {}}
                        transition={{ duration: 0.5, delay: index * 0.07 + 0.3 }}
                    />
                )}
            </div>
            <div className="pb-10">
                <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                    <span
                        style={{ backgroundColor: style.badge }}
                        className="text-[11px] font-medium px-2.5 py-0.5 rounded-full text-gray-700"
                    >
                        {style.label}
                    </span>
                    <span className="text-[11px] text-gray-400 font-mono">{item.period}</span>
                </div>
                <h3 className="font-display font-semibold text-gray-900 text-[17px] leading-tight">
                    {item.title}
                </h3>
                <p className="text-[13px] text-gray-400 font-medium mb-2 mt-0.5">{item.org}</p>
                <p className="text-[13px] text-gray-500 leading-relaxed">{item.description}</p>
            </div>
        </motion.div>
    )
}

function Resume() {
    return (
        <section id="resume" className="py-32">
            <div className="max-w-6xl mx-auto px-6">
                <FadeUp className="mb-16">
                    <SectionLabel>Journey</SectionLabel>
                    <h2 className="font-display text-[48px] font-bold text-gray-900 tracking-[-0.02em]">
                        Experience &amp;
                        <br />
                        <em className="not-italic font-extralight text-gray-500">Education.</em>
                    </h2>
                </FadeUp>
                <div className="max-w-[580px]">
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
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-60px' })
    const [hovered, setHovered] = useState(false)

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
            <motion.div
                onHoverStart={() => setHovered(true)}
                onHoverEnd={() => setHovered(false)}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.25 }}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-gray-200/60 transition-shadow duration-300 h-full flex flex-col"
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
                            background: `linear-gradient(to bottom, transparent 40%, ${project.accent}88 100%)`,
                            opacity: hovered ? 0.7 : 0.4,
                        }}
                    />
                    <span className="absolute bottom-3 right-4 font-display font-black text-[28px] text-white/25 leading-none select-none">
                        {String(index + 1).padStart(2, '0')}
                    </span>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-display font-bold text-gray-900 text-[16px] mb-2">{project.title}</h3>
                    <p className="text-[13px] text-gray-500 leading-relaxed mb-4 flex-1">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-5">
                        {project.tags.map((tag) => (
                            <span
                                key={tag}
                                className="text-[11px] bg-gray-50 text-gray-600 px-2.5 py-1 rounded-lg border border-gray-100"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 text-center text-[12px] font-medium bg-gray-900 text-white py-2.5 rounded-xl hover:bg-gray-700 transition-colors"
                        >
                            GitHub
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 text-center text-[12px] font-medium border border-gray-200 text-gray-700 py-2.5 rounded-xl hover:border-gray-400 transition-colors"
                        >
                            Live Demo
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

function Portfolio() {
    return (
        <section id="portfolio" className="py-32 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <FadeUp className="mb-16">
                    <SectionLabel>Work</SectionLabel>
                    <h2 className="font-display text-[48px] font-bold text-gray-900 tracking-[-0.02em]">
                        Selected
                        <br />
                        <em className="not-italic font-extralight text-gray-500">Projects.</em>
                    </h2>
                </FadeUp>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
    return (
        <section id="skills" className="py-32">
            <div className="max-w-6xl mx-auto px-6">
                <FadeUp className="mb-16">
                    <SectionLabel>Toolkit</SectionLabel>
                    <h2 className="font-display text-[48px] font-bold text-gray-900 tracking-[-0.02em]">
                        Skills &amp;
                        <br />
                        <em className="not-italic font-extralight text-gray-500">Technologies.</em>
                    </h2>
                </FadeUp>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(SKILLS_DATA).map(([category, skills], i) => (
                        <FadeUp key={category} delay={i * 0.07}>
                            <motion.div
                                whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(0,0,0,0.05)' }}
                                transition={{ duration: 0.18 }}
                                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
                            >
                                <span
                                    style={{ backgroundColor: SKILL_ACCENTS[category] }}
                                    className="inline-block text-[11px] font-medium px-3 py-1 rounded-full text-gray-700 mb-4"
                                >
                                    {category}
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill) => (
                                        <motion.span
                                            key={skill}
                                            whileHover={{ backgroundColor: SKILL_ACCENTS[category], scale: 1.05 }}
                                            transition={{ duration: 0.15 }}
                                            className="text-[12px] text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 cursor-default"
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
    const [form, setForm] = useState({ name: '', email: '', message: '' })
    const [sent, setSent] = useState(false)

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        setSent(true)
        setForm({ name: '', email: '', message: '' })
        setTimeout(() => setSent(false), 3200)
    }

    const inputClass =
        'w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white transition-all duration-200'

    return (
        <section id="contact" className="py-32 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    <FadeUp>
                        <SectionLabel>Say Hello</SectionLabel>
                        <h2 className="font-display text-[48px] font-bold text-gray-900 tracking-[-0.02em] mb-6">
                            {"Let's build"}
                            <br />
                            <em className="not-italic font-extralight text-gray-500">something great.</em>
                        </h2>
                        <p className="text-gray-500 leading-relaxed mb-10 text-[15px]">
                            I'm always open to new challenges, collaborations, and opportunities. Whether you
                            have a project in mind or just want to talk about AI — drop me a message.
                        </p>
                        <div className="space-y-4">
                            {[
                                { symbol: '✉', label: 'akrohan437@gmial.com', href: 'mailto:akrohan437@gmial.com' },
                                { symbol: '💼', label: 'linkedin.com/in/arohancist', href: 'https://www.linkedin.com/in/arohancist/' },
                                { symbol: '⌨', label: 'github.com/rohan-ak43', href: 'https://github.com/rohan-ak43' },
                                { symbol: '📍', label: 'Chennai, Tamil Nadu, India', href: undefined },
                            ].map(({ symbol, label, href }) => (
                                <div key={label} className="flex items-center gap-3 text-gray-500">
                                    <span className="text-base w-5 text-center">{symbol}</span>
                                    {href ? (
                                        <a href={href} className="text-[13px] hover:text-gray-900 transition-colors">
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
                                <label className="block text-[13px] font-medium text-gray-700 mb-2">Name</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="Your name"
                                    required
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-[13px] font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    placeholder="your@email.com"
                                    required
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-[13px] font-medium text-gray-700 mb-2">Message</label>
                                <textarea
                                    value={form.message}
                                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                                    placeholder="Tell me about your project..."
                                    rows={5}
                                    required
                                    className={`${inputClass} resize-none`}
                                />
                            </div>
                            <AnimatePresence mode="wait">
                                <motion.button
                                    key={sent ? 'sent' : 'send'}
                                    type="submit"
                                    whileHover={{ scale: 1.015, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                                    whileTap={{ scale: 0.985 }}
                                    initial={{ opacity: 0.8 }}
                                    animate={{ opacity: 1 }}
                                    className={`w-full py-4 rounded-xl text-[13px] font-medium transition-colors ${sent
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-gray-900 text-white hover:bg-gray-700'
                                        }`}
                                >
                                    {sent ? '✓ Message Sent!' : 'Send Message'}
                                </motion.button>
                            </AnimatePresence>
                        </form>
                    </FadeUp>
                </div>
            </div>
        </section>
    )
}

// Footer 

function Footer() {
    return (
        <footer className="border-t border-gray-100 py-8">
            <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-[12px] text-gray-400">
                    Designed &amp; Developed by A Rohan &middot; &copy; 2026
                </p>
                <div className="flex items-center gap-6">
                    {[
                        { href: 'https://github.com/rohan-ak43', label: 'GitHub' },
                        { href: 'https://www.linkedin.com/in/arohancist/', label: 'LinkedIn' },
                        { href: 'mailto:akrohan437@gmial.com', label: 'Email' },
                    ].map(({ href, label }) => (
                        <a
                            key={label}
                            href={href}
                            className="text-[11px] font-mono text-gray-300 hover:text-gray-600 transition-colors tracking-wide"
                        >
                            {label}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    )
}

// App 

export default function App() {
    return (
        <div
            className="bg-[#FAFAFA] min-h-screen font-sans"
            style={{ WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' } as CSSProperties}
        >
            <Cursor />
            <ScrollProgress />
            <Navbar />
            <Hero />
            <About />
            <Resume />
            <Portfolio />
            <Skills />
            <Contact />
            <Footer />
        </div>
    )
}
