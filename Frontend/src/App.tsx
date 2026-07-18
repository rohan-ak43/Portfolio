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
        accent: '#0a1a1a',
        img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop&auto=format',
        imgAlt: 'Performance analytics dashboard on laptop screen',
    },
    {
        title: 'Movie Recommendation Engine',
        description:
            'Hybrid collaborative + content-based filtering with natural language query support powered by semantic embeddings and vector similarity search.',
        tags: ['Python', 'PyTorch', 'FastAPI', 'PostgreSQL'],
        accent: '#071515',
        img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=400&fit=crop&auto=format',
        imgAlt: 'Cinema theater interior',
    },
    {
        title: 'Remo ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Rehabilitation AI',
        description:
            'AI physiotherapy assistant using MediaPipe pose estimation to guide patients through exercises with real-time biomechanical feedback.',
        tags: ['Python', 'MediaPipe', 'TensorFlow', 'React'],
        accent: '#051010',
        img: 'https://images.unsplash.com/photo-1645005512942-a17817fb7c11?w=800&h=400&fit=crop&auto=format',
        imgAlt: 'Physical therapy rehabilitation session',
    },
    {
        title: 'Time Capsule App',
        description:
            'Encrypted personal archive for sealing memories, letters, and media to be unlocked at a future date with blockchain-verified integrity.',
        tags: ['Next.js', 'Supabase', 'TypeScript', 'Solidity'],
        accent: '#081818',
        img: 'https://images.unsplash.com/photo-1634562876572-5abe57afcceb?w=800&h=400&fit=crop&auto=format',
        imgAlt: 'Pen resting on handwritten letter',
    },
    {
        title: 'TruthSeeker ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Fake News AI',
        description:
            'Multi-modal misinformation detection combining NLP claim verification, source credibility scoring, and image forensics.',
        tags: ['Python', 'BERT', 'FastAPI', 'React', 'Claude API'],
        accent: '#0a1a1a',
        img: 'https://images.unsplash.com/photo-1624269305548-1527ef905ff6?w=800&h=400&fit=crop&auto=format',
        imgAlt: 'Newspaper headline text',
    },
]

const TIMELINE = [
    {
        type: 'education',
        title: 'B.S. Computer Science',
        org: 'University of Technology',
        period: '2022 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Present',
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
        period: '2023 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Present',
        description:
            'Delivered 8+ production-ready web applications across fintech, healthtech, and edtech sectors using React, FastAPI, and PostgreSQL.',
    },
    {
        type: 'achievement',
        title: 'National Hackathon ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â 1st Place',
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

function Hi({ children, color }: { children: React.ReactNode; color: string }) {
    return (
        <span style={{ backgroundColor: color, color: '#1D1D1F' }} className="px-1.5 py-0.5 rounded-md font-semibold">
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
        <span className="text-[11px] font-mono tracking-[0.22em] uppercase block mb-4" style={{ color: '#1D1D1F' }}>
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
                background: 'radial-gradient(circle, rgba(29,29,31,0.35) 0%, rgba(29,29,31,0.12) 60%, transparent 100%)',
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
                background: 'linear-gradient(to right, #1D1D1F, #6E6E73, #D2D2D7)',
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
const NODE_COLORS = ['#1D1D1F', '#6E6E73', '#86868B', '#D2D2D7', '#6E6E73', '#1D1D1F', '#D2D2D7', '#86868B']

function NeuralNet() {
    return (
        <div className="relative w-full h-full flex items-center justify-center select-none">
            {/* Ambient glow */}
            <div
                className="absolute inset-0 rounded-full"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(29,29,31,0.18) 0%, transparent 70%)',
                    filter: 'blur(32px)',
                }}
            />
            <svg
                viewBox="0 0 100 100"
                className="w-full max-w-[420px] h-auto relative z-10"
                style={{ filter: 'drop-shadow(0 0 40px rgba(29,29,31,0.25))' }}
            >
                {EDGES.map(([a, b], i) => (
                    <motion.line
                        key={i}
                        x1={NODES[a].x} y1={NODES[a].y}
                        x2={NODES[b].x} y2={NODES[b].y}
                        stroke="rgba(29,29,31,0.35)"
                        strokeWidth="0.4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.2, 0.7, 0.2] }}
                        transition={{ duration: 3.5 + (i % 3), delay: i * 0.18, repeat: Infinity, ease: 'easeInOut' }}
                    />
                ))}
                {NODES.map((node, i) => (
                    <motion.circle
                        key={i}
                        cx={node.x} cy={node.y} r="2.8"
                        fill={NODE_COLORS[i]}
                        stroke="rgba(0,0,0,0.6)"
                        strokeWidth="0.6"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
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
                    className="absolute text-[9px] font-mono tracking-wider z-10"
                    style={{ top, left, color: 'rgba(29,29,31,0.6)' }}
                    animate={{ opacity: [0.3, 0.8, 0.3], y: [0, -4, 0] }}
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
                { w: 560, h: 560, top: '-8%', left: '55%', color: 'rgba(29,29,31,0.06)', dur: 22 },
                { w: 480, h: 480, top: '50%', left: '-8%', color: 'rgba(29,29,31,0.04)', dur: 28 },
                { w: 400, h: 400, top: '30%', left: '70%', color: 'rgba(29,29,31,0.05)', dur: 18 },
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
                backgroundColor: scrolled ? 'rgba(255,255,255,0.85)' : 'transparent',
                backdropFilter: scrolled ? 'blur(20px)' : 'none',
                WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
                borderBottom: scrolled ? '1px solid #D2D2D7' : '1px solid transparent',
            }}
        >
            <div className="max-w-6xl mx-auto px-6 h-[60px] flex items-center justify-between">
                <button
                    onClick={() => go('Home')}
                    className="font-display font-bold text-[18px] tracking-tight"
                    style={{ color: '#1D1D1F' }}
                >
                    RAK
                </button>

                <div className="hidden md:flex items-center gap-7">
                    {NAV_LINKS.map((link) => (
                        <button
                            key={link}
                            onClick={() => go(link)}
                            className="text-[13px] font-medium transition-colors duration-200"
                            style={{ color: active === link ? '#1D1D1F' : '#6E6E73' }}
                        >
                            {link}
                        </button>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <a href="https://github.com/rohan-ak43" target="_blank" rel="noreferrer" className="transition-colors" style={{ color: '#86868B' }} aria-label="GitHub">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                    </a>
                    <a href="https://www.linkedin.com/in/arohancist/" target="_blank" rel="noreferrer" className="transition-colors" style={{ color: '#86868B' }} aria-label="LinkedIn">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                    </a>
                    <a href="mailto:akrohan437@gmial.com" className="transition-colors" style={{ color: '#86868B' }} aria-label="Email">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                        </svg>
                    </a>
                </div>

                <button className="md:hidden p-1.5" style={{ color: '#1D1D1F' }} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
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
                        className="md:hidden backdrop-blur-xl px-6 pb-5 pt-1"
                        style={{ backgroundColor: 'rgba(255,255,255,0.96)', borderBottom: '1px solid #D2D2D7' }}
                    >
                        {NAV_LINKS.map((link) => (
                            <button
                                key={link}
                                onClick={() => go(link)}
                                className="block w-full text-left py-3 text-sm font-medium"
                                style={{ color: '#1D1D1F', borderBottom: '1px solid rgba(0,0,0,0.06)' }}
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
        <section id="home" className="relative min-h-screen flex items-center pt-[60px] overflow-hidden" style={{ backgroundColor: '#F5F5F7' }}>
            <Blobs />
            <div className="relative z-10 max-w-6xl mx-auto px-6 py-28 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Text */}
                <div>
                    <motion.p
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-[11px] font-mono tracking-[0.22em] uppercase mb-7 flex items-center gap-2"
                        style={{ color: '#1D1D1F' }}
                    >
                        <motion.span
                            className="inline-block w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: '#1D1D1F', boxShadow: '0 0 6px rgba(29,29,31,0.8)' }}
                            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        Available for opportunities
                    </motion.p>

                    <h1 className="font-display text-[58px] md:text-[74px] lg:text-[84px] font-bold leading-[1.02] tracking-[-0.025em] mb-5" style={{ color: '#1D1D1F' }}>
                        {HERO_WORDS.map((word, i) => (
                            <span key={word} className="inline-block mr-[0.2em]">
                                <RevealWord
                                    word={i === 2 ? word.slice(0, -1) : word}
                                    delay={0.5 + i * 0.12}
                                />
                                {i === 2 && (
                                    <motion.span
                                        style={{ color: '#1D1D1F' }}
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
                        style={{ color: '#6E6E73' }}
                    >
                        AI Engineer Ãƒâ€šÃ‚Â· Full Stack Developer Ãƒâ€šÃ‚Â· ML Enthusiast
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.88 }}
                        className="leading-relaxed mb-8 text-[15px] max-w-[500px]"
                        style={{ color: '#6E6E73' }}
                    >
                        Computer Science student building at the intersection of{' '}
                        <Hi color="rgba(29,29,31,0.18)">Machine Learning</Hi>,{' '}
                        <Hi color="rgba(29,29,31,0.18)">Computer Vision</Hi>, and{' '}
                        <Hi color="rgba(29,29,31,0.18)">Full Stack Engineering</Hi>. Passionate about{' '}
                        <Hi color="rgba(134,134,139,0.18)">Generative AI</Hi> and intelligent products.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.98 }}
                        className="flex flex-wrap gap-2 mb-10"
                    >
                        {[
                            { label: 'Deep Learning', color: 'rgba(29,29,31,0.15)' },
                            { label: 'FastAPI', color: 'rgba(29,29,31,0.15)' },
                            { label: 'React', color: 'rgba(29,29,31,0.15)' },
                            { label: 'PyTorch', color: 'rgba(134,134,139,0.15)' },
                            { label: 'Claude API', color: 'rgba(29,29,31,0.15)' },
                        ].map(({ label, color }, i) => (
                            <motion.span
                                key={label}
                                style={{ backgroundColor: color, color: '#1D1D1F', border: '1px solid rgba(29,29,31,0.2)' }}
                                className="text-[11px] font-medium px-3 py-1.5 rounded-full"
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
                            whileHover={{ scale: 1.04, boxShadow: '0 8px 24px rgba(29,29,31,0.25)' }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-7 py-3.5 rounded-full text-[13px] font-semibold shadow-sm transition-shadow"
                            style={{ background: '#1D1D1F', color: '#FFFFFF' }}
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
                <span className="text-[10px] font-mono tracking-[0.15em] uppercase" style={{ color: 'rgba(29,29,31,0.5)' }}>scroll</span>
                <motion.div
                    className="w-px h-8"
                    style={{ background: 'linear-gradient(to bottom, rgba(29,29,31,0.5), transparent)' }}
                    animate={{ scaleY: [1, 0.4, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                />
            </motion.div>
        </section>
    )
}

// About 

const ABOUT_CARDS = [
    { icon: 'ÃƒÂ°Ã…Â¸Ã…Â½Ã¢â‚¬Å“', title: 'Education', text: "B.S. Computer Science, AI/ML specialization. Dean's List 3 consecutive semesters.", accent: 'rgba(29,29,31,0.12)' },
    { icon: 'ÃƒÂ¢Ã…Â¡Ã‚Â¡', title: 'Experience', text: 'AI Research Intern at DataSynth Labs. Freelance full-stack engineer for 3+ years.', accent: 'rgba(29,29,31,0.12)' },
    { icon: 'ÃƒÂ°Ã…Â¸Ã¢â‚¬ÂÃ‚Â¬', title: 'Research', text: 'Co-authored papers on document understanding and pose estimation for rehabilitation.', accent: 'rgba(29,29,31,0.12)' },
    { icon: 'ÃƒÂ°Ã…Â¸Ã…â€™Ã‚Â', title: 'Interests', text: 'Generative AI, robotics, open-source contribution, and developer tooling.', accent: 'rgba(134,134,139,0.12)' },
]

function About() {
    return (
        <section id="about" className="py-32" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-20">
                    <FadeUp>
                        <SectionLabel>About Me</SectionLabel>
                        <h2 className="font-display text-[48px] md:text-[56px] font-bold leading-tight tracking-[-0.02em]" style={{ color: '#1D1D1F' }}>
                            Turning ideas into
                            <br />
                            <em className="not-italic font-extralight" style={{ color: '#1D1D1F' }}>intelligent systems.</em>
                        </h2>
                    </FadeUp>
                    <FadeUp delay={0.1}>
                        <div className="pt-10 space-y-4 leading-relaxed text-[15px]" style={{ color: '#6E6E73' }}>
                            <p>
                                I'm a Computer Science student with a deep curiosity for how machines learn. Over
                                the last three years I've built everything from real-time computer vision pipelines
                                to production-ready web applications.
                            </p>
                            <p>
                                My work lives at the intersection of <Hi color="rgba(29,29,31,0.18)">AI research</Hi> and{' '}
                                <Hi color="rgba(29,29,31,0.18)">practical engineering</Hi> ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â I care about systems that are not
                                just theoretically elegant but actually useful in the real world.
                            </p>
                            <p>
                                When I'm not training models or writing APIs, I'm competing in hackathons,
                                contributing to open source, and exploring the frontier of{' '}
                                <Hi color="rgba(29,29,31,0.18)">Generative AI</Hi>.
                            </p>
                        </div>
                    </FadeUp>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {ABOUT_CARDS.map((card, i) => (
                        <FadeUp key={card.title} delay={i * 0.09}>
                            <motion.div
                                whileHover={{ y: -6, boxShadow: '0 20px 48px rgba(0,0,0,0.08)' }}
                                transition={{ duration: 0.2 }}
                                className="rounded-2xl p-6 h-full cursor-default"
                                style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5EA' }}
                            >
                                <div
                                    style={{ backgroundColor: card.accent }}
                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-[18px] mb-4"
                                >
                                    {card.icon}
                                </div>
                                <h3 className="font-display font-semibold mb-2 text-[15px]" style={{ color: '#1D1D1F' }}>
                                    {card.title}
                                </h3>
                                <p className="text-[13px] leading-relaxed" style={{ color: '#6E6E73' }}>{card.text}</p>
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
                        style={{ backgroundColor: '#D2D2D7' }}
                        initial={{ scaleY: 0, originY: 0 }}
                        animate={inView ? { scaleY: 1 } : {}}
                        transition={{ duration: 0.5, delay: index * 0.07 + 0.3 }}
                    />
                )}
            </div>
            <div className="pb-10">
                <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                    <span
                        style={{ backgroundColor: style.badge, color: '#1D1D1F' }}
                        className="text-[11px] font-medium px-2.5 py-0.5 rounded-full"
                    >
                        {style.label}
                    </span>
                    <span className="text-[11px] font-mono" style={{ color: '#86868B' }}>{item.period}</span>
                </div>
                <h3 className="font-display font-semibold text-[17px] leading-tight" style={{ color: '#1D1D1F' }}>
                    {item.title}
                </h3>
                <p className="text-[13px] font-medium mb-2 mt-0.5" style={{ color: '#1D1D1F' }}>{item.org}</p>
                <p className="text-[13px] leading-relaxed" style={{ color: '#6E6E73' }}>{item.description}</p>
            </div>
        </motion.div>
    )
}

function Resume() {
    return (
        <section id="resume" className="py-32" style={{ backgroundColor: '#F5F5F7' }}>
            <div className="max-w-6xl mx-auto px-6">
                <FadeUp className="mb-16">
                    <SectionLabel>Journey</SectionLabel>
                    <h2 className="font-display text-[48px] font-bold tracking-[-0.02em]" style={{ color: '#1D1D1F' }}>
                        Experience &amp;
                        <br />
                        <em className="not-italic font-extralight" style={{ color: '#1D1D1F' }}>Education.</em>
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
                whileHover={{ y: -8, boxShadow: '0 20px 48px rgba(0,0,0,0.1)' }}
                transition={{ duration: 0.25 }}
                className="group rounded-2xl overflow-hidden transition-shadow duration-300 h-full flex flex-col"
                style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5EA' }}
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
                            background: `linear-gradient(to bottom, transparent 40%, rgba(255,255,255,0.85) 100%)`,
                            opacity: hovered ? 0.8 : 0.4,
                        }}
                    />
                    <span className="absolute bottom-3 right-4 font-display font-black text-[28px] leading-none select-none" style={{ color: 'rgba(29,29,31,0.3)' }}>
                        {String(index + 1).padStart(2, '0')}
                    </span>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-display font-bold text-[16px] mb-2" style={{ color: '#1D1D1F' }}>{project.title}</h3>
                    <p className="text-[13px] leading-relaxed mb-4 flex-1" style={{ color: '#6E6E73' }}>{project.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-5">
                        {project.tags.map((tag) => (
                            <span
                                key={tag}
                                className="text-[11px] px-2.5 py-1 rounded-lg"
                                style={{ backgroundColor: '#F5F5F7', color: '#1D1D1F', border: '1px solid #D2D2D7' }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 text-center text-[12px] font-medium py-2.5 rounded-xl transition-colors"
                            style={{ background: '#1D1D1F', color: '#FFFFFF' }}
                        >
                            GitHub
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 text-center text-[12px] font-medium py-2.5 rounded-xl transition-colors"
                            style={{ border: '1px solid #D2D2D7', color: '#1D1D1F', backgroundColor: 'transparent' }}
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
        <section id="portfolio" className="py-32" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="max-w-6xl mx-auto px-6">
                <FadeUp className="mb-16">
                    <SectionLabel>Work</SectionLabel>
                    <h2 className="font-display text-[48px] font-bold tracking-[-0.02em]" style={{ color: '#1D1D1F' }}>
                        Selected
                        <br />
                        <em className="not-italic font-extralight" style={{ color: '#1D1D1F' }}>Projects.</em>
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
        <section id="skills" className="py-32" style={{ backgroundColor: '#F5F5F7' }}>
            <div className="max-w-6xl mx-auto px-6">
                <FadeUp className="mb-16">
                    <SectionLabel>Toolkit</SectionLabel>
                    <h2 className="font-display text-[48px] font-bold tracking-[-0.02em]" style={{ color: '#1D1D1F' }}>
                        Skills &amp;
                        <br />
                        <em className="not-italic font-extralight" style={{ color: '#1D1D1F' }}>Technologies.</em>
                    </h2>
                </FadeUp>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(SKILLS_DATA).map(([category, skills], i) => (
                        <FadeUp key={category} delay={i * 0.07}>
                            <motion.div
                                whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(0,0,0,0.06)' }}
                                transition={{ duration: 0.18 }}
                                className="rounded-2xl p-6"
                                style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5EA' }}
                            >
                                <span
                                    style={{ backgroundColor: SKILL_ACCENTS[category], color: '#1D1D1F' }}
                                    className="inline-block text-[11px] font-medium px-3 py-1 rounded-full mb-4"
                                >
                                    {category}
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill) => (
                                        <motion.span
                                            key={skill}
                                            whileHover={{ backgroundColor: SKILL_ACCENTS[category], scale: 1.05 }}
                                            transition={{ duration: 0.15 }}
                                            className="text-[12px] px-3 py-1.5 rounded-lg cursor-default"
                                            style={{ color: '#515154', backgroundColor: '#F5F5F7', border: '1px solid #E5E5EA' }}
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
        'w-full px-4 py-3.5 rounded-xl text-[14px] focus:outline-none transition-all duration-200'

    const inputStyle = {
        backgroundColor: '#FFFFFF',
        border: '1px solid #D2D2D7',
        color: '#1D1D1F',
    }

    return (
        <section id="contact" className="py-32" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    <FadeUp>
                        <SectionLabel>Say Hello</SectionLabel>
                        <h2 className="font-display text-[48px] font-bold tracking-[-0.02em] mb-6" style={{ color: '#1D1D1F' }}>
                            {"Let's build"}
                            <br />
                            <em className="not-italic font-extralight" style={{ color: '#1D1D1F' }}>something great.</em>
                        </h2>
                        <p className="leading-relaxed mb-10 text-[15px]" style={{ color: '#6E6E73' }}>
                            I'm always open to new challenges, collaborations, and opportunities. Whether you
                            have a project in mind or just want to talk about AI, drop me a message.
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
                                    href: 'mailto:akrohan437@gmial.com',
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
                                <div key={label} className="flex items-center gap-3" style={{ color: '#6E6E73' }}>
                                    <span className="w-5 flex items-center justify-center flex-shrink-0">{icon}</span>
                                    {href ? (
                                        <a href={href} className="text-[13px] transition-colors hover:text-gray-900">
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
                                <label className="block text-[13px] font-medium mb-2" style={{ color: '#515154' }}>Name</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="Your name"
                                    required
                                    className={inputClass}
                                    style={{ ...inputStyle, '--tw-placeholder-color': 'rgba(255,255,255,0.25)' } as React.CSSProperties}
                                />
                            </div>
                            <div>
                                <label className="block text-[13px] font-medium mb-2" style={{ color: '#515154' }}>Email</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    placeholder="your@email.com"
                                    required
                                    className={inputClass}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label className="block text-[13px] font-medium mb-2" style={{ color: '#515154' }}>Message</label>
                                <textarea
                                    value={form.message}
                                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                                    placeholder="Tell me about your project..."
                                    rows={5}
                                    required
                                    className={`${inputClass} resize-none`}
                                    style={inputStyle}
                                />
                            </div>
                            <AnimatePresence mode="wait">
                                <motion.button
                                    key={sent ? 'sent' : 'send'}
                                    type="submit"
                                    whileHover={{ scale: 1.015, boxShadow: '0 8px 24px rgba(29,29,31,0.25)' }}
                                    whileTap={{ scale: 0.985 }}
                                    initial={{ opacity: 0.8 }}
                                    animate={{ opacity: 1 }}
                                    className="w-full py-4 rounded-xl text-[13px] font-semibold transition-colors"
                                    style={sent
                                        ? { backgroundColor: '#10B981', color: '#1D1D1F' }
                                        : { background: '#1D1D1F', color: '#000000' }
                                    }
                                >
                                    {sent ? 'ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ Message Sent!' : 'Send Message'}
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
        <footer className="py-8" style={{ backgroundColor: '#F5F5F7', borderTop: '1px solid rgba(29,29,31,0.12)' }}>
            <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-[12px]" style={{ color: '#86868B' }}>
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
                            className="text-[11px] font-mono tracking-wide transition-colors hover:text-gray-900"
                            style={{ color: '#86868B' }}
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
            className="min-h-screen font-sans"
            style={{ backgroundColor: '#F5F5F7', WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' } as CSSProperties}
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








