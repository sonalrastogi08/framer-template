// Velvet Crumb — IcingStatement (v6)
// A big statement that is "piped" onto the page as you scroll: words fade in one by one, chosen
// words get an icing swipe behind them, and a wavy piping line draws itself underneath, ending in
// a little rosette.
import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { motion, useScroll, useTransform, useReducedMotion, MotionValue } from "framer-motion"

interface Props {
    text: string
    highlights: string
    font: React.CSSProperties
    ink: string
    faded: number
    icing: string
    onIcing: string
    pipeColor: string
    showPipe: boolean
    style?: React.CSSProperties
}

const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, "")

function Word(props: { word: string; i: number; n: number; progress: MotionValue<number>; hl: boolean; animated: boolean; faded: number; ink: string; icing: string; onIcing: string }) {
    const { word, i, n, progress, hl, animated, faded, ink, icing, onIcing } = props
    const span = 0.7 / n
    const start = i * span
    const opacity = useTransform(progress, [start, start + span * 1.6], [faded, 1])
    const swipe = useTransform(progress, [start + span * 0.6, start + span * 2.4], [0, 1])
    const color = useTransform(progress, [start + span * 1.2, start + span * 2.4], [ink, onIcing])
    return (
        <motion.span style={{ position: "relative", display: "inline-block", opacity: animated ? opacity : 1, marginRight: "0.28em" }}>
            {hl ? (
                <motion.span
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        left: "-0.12em",
                        right: "-0.12em",
                        top: "0.08em",
                        bottom: "0.02em",
                        background: icing,
                        borderRadius: "0.5em 0.35em 0.55em 0.4em",
                        transformOrigin: "0% 50%",
                        scaleX: animated ? swipe : 1,
                        zIndex: 0,
                    }}
                />
            ) : null}
            <motion.span style={{ position: "relative", zIndex: 1, color: hl ? (animated ? color : onIcing) : ink }}>{word}</motion.span>
        </motion.span>
    )
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function IcingStatement(props: Props) {
    const { text = "", highlights = "", font, ink, faded, icing, onIcing, pipeColor, showPipe, style } = props
    const ref = React.useRef<HTMLDivElement>(null)
    const reduce = useReducedMotion()
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const animated = !isCanvas && !reduce
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] })
    const words = text.split(/\s+/).filter(Boolean)
    const hlSet = new Set(highlights.split(",").map(norm).filter(Boolean))
    const pipe = useTransform(scrollYProgress, [0.55, 0.95], [0, 1])
    const rosette = useTransform(scrollYProgress, [0.9, 1], [0, 1])

    return (
        <div ref={ref} style={{ ...style, position: "relative", color: ink }}>
            <p aria-label={text} style={{ margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em", ...font }}>
                {words.map((w, i) => (
                    <Word key={i} word={w} i={i} n={words.length} progress={scrollYProgress} hl={hlSet.has(norm(w))} animated={animated} faded={faded} ink={ink} icing={icing} onIcing={onIcing} />
                ))}
            </p>
            {showPipe ? (
                <svg aria-hidden="true" viewBox="0 0 1000 60" style={{ display: "block", width: "100%", height: "auto", marginTop: 28, overflow: "visible" }}>
                    <motion.path
                        d="M6 30 C 40 6, 70 54, 104 30 S 168 6, 202 30 S 266 54, 300 30 S 364 6, 398 30 S 462 54, 496 30 S 560 6, 594 30 S 658 54, 692 30 S 756 6, 790 30 S 854 54, 888 30"
                        fill="none"
                        stroke={pipeColor}
                        strokeWidth={13}
                        strokeLinecap="round"
                        style={{ pathLength: animated ? pipe : 1 }}
                    />
                    <motion.g style={{ opacity: animated ? rosette : 1, scale: animated ? rosette : 1, originX: "930px", originY: "30px" }}>
                        {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => (
                            <circle key={k} cx={930 + Math.cos((k * Math.PI) / 4) * 18} cy={30 + Math.sin((k * Math.PI) / 4) * 18} r={9} fill={pipeColor} />
                        ))}
                        <circle cx={930} cy={30} r={9} fill={icing} />
                    </motion.g>
                </svg>
            ) : null}
        </div>
    )
}

IcingStatement.defaultProps = {
    text: "Every cake is finished by hand, one swirl of buttercream at a time.",
    highlights: "finished, hand, buttercream",
    ink: "#2B1611",
    faded: 0.16,
    icing: "#E8576B",
    onIcing: "#FFFDF8",
    pipeColor: "#E8576B",
    showPipe: true,
}

addPropertyControls(IcingStatement, {
    text: { type: ControlType.String, title: "Text", displayTextArea: true },
    highlights: { type: ControlType.String, title: "Icing words", description: "Comma-separated words that get the icing swipe" },
    font: { type: ControlType.Font, title: "Font", controls: "extended", defaultFontType: "serif", defaultValue: { fontSize: 72 } },
    ink: { type: ControlType.Color, title: "Ink" },
    faded: { type: ControlType.Number, title: "Faded", min: 0, max: 0.6, step: 0.02 },
    icing: { type: ControlType.Color, title: "Icing" },
    onIcing: { type: ControlType.Color, title: "Text on icing" },
    showPipe: { type: ControlType.Boolean, title: "Piping line" },
    pipeColor: { type: ControlType.Color, title: "Pipe colour", hidden: (p: Props) => !p.showPipe },
})
