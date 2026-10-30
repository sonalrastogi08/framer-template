// Velvet Crumb — GalleryZoom (v6)
// Starts zoomed into the centre tile, then zooms out to reveal the whole grid as you scroll,
// with tiles growing in from the centre and a follow card (e.g. @handle) appearing on top.
import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { motion, useScroll, useTransform, useReducedMotion, MotionValue } from "framer-motion"

interface Img {
    src: string
    alt?: string
}
interface Props {
    images: (Img | string)[]
    tileColors: string[]
    label: string
    sublabel: string
    buttonLabel: string
    buttonLink: string
    labelFont: React.CSSProperties
    scriptFont: React.CSSProperties
    bodyFont: React.CSSProperties
    ink: string
    card: string
    accent: string
    radius: number
    scrollLength: number
    style?: React.CSSProperties
}

const COLS = 5
const ROWS = 3
const CENTER = 7 // column 3, row 2

const srcOf = (img?: Img | string) => (typeof img === "string" ? img : img?.src)

function Tile(props: { index: number; progress: MotionValue<number>; animated: boolean; color: string; img?: Img | string; radius: number }) {
    const { index, progress, animated, color, img, radius } = props
    const col = index % COLS
    const row = Math.floor(index / COLS)
    const d = Math.hypot(col - 2, row - 1)
    const start = 0.12 + d * 0.06
    const opacity = useTransform(progress, [start, start + 0.25], [0, 1])
    const scale = useTransform(progress, [start, start + 0.3], [0.6, 1])
    const isCenter = index === CENTER
    const src = srcOf(img)
    return (
        <motion.div
            style={{
                background: color,
                borderRadius: radius,
                display: "grid",
                placeItems: "center",
                overflow: "hidden",
                opacity: animated && !isCenter ? opacity : 1,
                scale: animated && !isCenter ? scale : 1,
            }}
        >
            {src ? <img src={src} alt={isCenter && typeof img !== "string" ? img?.alt || "" : ""} style={{ width: "70%", height: "70%", objectFit: "contain" }} draggable={false} /> : null}
        </motion.div>
    )
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function GalleryZoom(props: Props) {
    const { images = [], tileColors = [], label, sublabel, buttonLabel, buttonLink, labelFont, scriptFont, bodyFont, ink, card, accent, radius, scrollLength, style } = props
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const reduce = useReducedMotion()
    const animated = !isCanvas && !reduce
    const outer = React.useRef<HTMLDivElement>(null)
    const center = React.useRef<HTMLDivElement>(null)
    const [zoom, setZoom] = React.useState(3)

    React.useEffect(() => {
        if (!animated) return
        const measure = () => {
            const el = center.current
            if (!el || !el.offsetWidth) return
            setZoom(Math.max(window.innerWidth / el.offsetWidth, window.innerHeight / el.offsetHeight) * 1.05)
        }
        measure()
        window.addEventListener("resize", measure)
        return () => window.removeEventListener("resize", measure)
    }, [animated])

    const { scrollYProgress } = useScroll({ target: outer, offset: ["start start", "end end"] })
    const gridScale = useTransform(scrollYProgress, [0, 0.7], [zoom, 1])
    const labelOpacity = useTransform(scrollYProgress, [0.68, 0.85], [0, 1])
    const labelY = useTransform(scrollYProgress, [0.68, 0.85], [30, 0])

    const tiles = Array.from({ length: COLS * ROWS }, (_, i) => ({
        img: images.length ? images[i % images.length] : undefined,
        color: tileColors.length ? tileColors[i % tileColors.length] : "#F3E7D6",
    }))

    return (
        <div ref={outer} style={{ ...style, position: "relative", height: animated ? `${scrollLength}vh` : "auto" }}>
            <div
                style={{
                    position: animated ? "sticky" : "relative",
                    top: 0,
                    height: animated ? "100vh" : "auto",
                    padding: animated ? 0 : "80px 0",
                    overflow: "hidden",
                    display: "grid",
                    placeItems: "center",
                }}
            >
                <motion.div
                    style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${COLS}, min(18vw, 260px))`,
                        gridTemplateRows: `repeat(${ROWS}, min(26vh, 240px))`,
                        gap: "min(1.4vw, 20px)",
                        scale: animated ? gridScale : 1,
                        willChange: "transform",
                    }}
                >
                    {tiles.map((t, i) =>
                        i === CENTER ? (
                            <div key={i} ref={center} style={{ display: "grid" }}>
                                <Tile index={i} progress={scrollYProgress} animated={animated} color={t.color} img={t.img} radius={radius} />
                            </div>
                        ) : (
                            <Tile key={i} index={i} progress={scrollYProgress} animated={animated} color={t.color} img={t.img} radius={radius} />
                        )
                    )}
                </motion.div>
                <motion.div
                    style={{
                        position: "absolute",
                        zIndex: 3,
                        textAlign: "center",
                        color: ink,
                        background: card,
                        padding: "28px 40px 32px",
                        borderRadius: 28,
                        boxShadow: "0 30px 60px -30px rgba(43,22,17,0.35)",
                        display: "grid",
                        justifyItems: "center",
                        gap: 6,
                        opacity: animated ? labelOpacity : 1,
                        y: animated ? labelY : 0,
                    }}
                >
                    <span style={{ color: accent, lineHeight: 1, ...scriptFont }}>{sublabel}</span>
                    <span style={{ margin: 0, lineHeight: 1, letterSpacing: "-0.02em", ...labelFont }}>{label}</span>
                    {buttonLabel ? (
                        <motion.a
                            href={buttonLink || undefined}
                            target={buttonLink?.startsWith("http") ? "_blank" : undefined}
                            rel="noopener"
                            whileHover={{ backgroundColor: accent }}
                            style={{ ...bodyFont, marginTop: 16, display: "inline-flex", gap: 10, alignItems: "center", padding: "16px 26px", borderRadius: 999, background: ink, color: card, fontWeight: 700, fontSize: 15, textDecoration: "none" }}
                        >
                            {buttonLabel} <span aria-hidden="true">→</span>
                        </motion.a>
                    ) : null}
                </motion.div>
            </div>
        </div>
    )
}

GalleryZoom.defaultProps = {
    images: [],
    tileColors: ["#F8D7DA", "#E4EBCB", "#F5D589", "#EAD9CF", "#E7E0F0", "#FFFDF8", "#F3DCDC", "#B9CB8C"],
    label: "@velvetcrumb",
    sublabel: "follow along",
    buttonLabel: "Follow on Instagram",
    buttonLink: "https://instagram.com",
    ink: "#2B1611",
    card: "#FBF4EA",
    accent: "#E8576B",
    radius: 20,
    scrollLength: 260,
}

addPropertyControls(GalleryZoom, {
    images: { type: ControlType.Array, title: "Images", control: { type: ControlType.ResponsiveImage }, maxCount: 15 },
    tileColors: { type: ControlType.Array, title: "Tile Colors", control: { type: ControlType.Color } },
    sublabel: { type: ControlType.String, title: "Script" },
    label: { type: ControlType.String, title: "Label" },
    buttonLabel: { type: ControlType.String, title: "Button" },
    buttonLink: { type: ControlType.Link, title: "Link" },
    labelFont: { type: ControlType.Font, title: "Label Font", controls: "extended", defaultFontType: "serif", defaultValue: { fontSize: 88 } },
    scriptFont: { type: ControlType.Font, title: "Script Font", controls: "extended", defaultFontType: "sans-serif", defaultValue: { fontSize: 32 } },
    bodyFont: { type: ControlType.Font, title: "Body Font", controls: "extended", defaultFontType: "sans-serif", defaultValue: { fontSize: 15 } },
    ink: { type: ControlType.Color, title: "Ink" },
    card: { type: ControlType.Color, title: "Card" },
    accent: { type: ControlType.Color, title: "Accent" },
    radius: { type: ControlType.Number, title: "Radius", min: 0, max: 60, unit: "px" },
    scrollLength: { type: ControlType.Number, title: "Scroll Length", min: 150, max: 500, unit: "vh" },
})
