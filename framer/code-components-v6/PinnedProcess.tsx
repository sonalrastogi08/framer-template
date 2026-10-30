// Velvet Crumb — PinnedProcess (v6)
// "How it works" timeline. The section pins while you scroll: the line fills from step 1 to step N,
// each step lights up as the line reaches it, and the page only moves on once the line is full.
// On narrow screens (or reduced motion) it falls back to a normal static stack.
import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { motion, useScroll, useTransform, useReducedMotion, MotionValue } from "framer-motion"

interface Step {
    num: string
    title: string
    text: string
}
interface Props {
    header?: React.ReactNode
    steps: Step[]
    scrollLength: number
    pinFrom: number
    padding: number
    maxWidth: number
    headerGap: number
    dotColor: string
    lineColor: string
    trackColor: string
    numColor: string
    titleColor: string
    textColor: string
    numFont: React.CSSProperties
    titleFont: React.CSSProperties
    bodyFont: React.CSSProperties
    style?: React.CSSProperties
}

function StepItem(props: { step: Step; i: number; n: number; f: MotionValue<number>; animated: boolean; wide: boolean } & Pick<Props, "dotColor" | "lineColor" | "trackColor" | "numColor" | "titleColor" | "textColor" | "numFont" | "titleFont" | "bodyFont">) {
    const { step, i, n, f, animated, wide, dotColor, trackColor, numColor, titleColor, textColor, numFont, titleFont, bodyFont } = props
    const at = i / n
    const opacity = useTransform(f, [Math.max(0, at - 0.03), at + 0.06], [0.28, 1])
    const y = useTransform(f, [Math.max(0, at - 0.03), at + 0.06], [16, 0])
    const dotScale = useTransform(f, [Math.max(0, at - 0.02), at + 0.04], [0.55, 1])
    return (
        <motion.div style={{ position: "relative", paddingTop: 32, flex: "1 1 0", minWidth: wide ? 0 : "100%", opacity: animated ? opacity : 1, y: animated ? y : 0, borderTop: wide ? "none" : `1px solid ${trackColor}` }}>
            <motion.span aria-hidden="true" style={{ position: "absolute", left: 0, top: wide ? -7 : -7, width: 14, height: 14, borderRadius: "50%", background: dotColor, scale: animated ? dotScale : 1 }} />
            <div style={{ ...numFont, color: numColor, lineHeight: 1, marginBottom: 12 }}>{step.num}</div>
            <div style={{ ...titleFont, color: titleColor, marginBottom: 10 }}>{step.title}</div>
            <div style={{ ...bodyFont, color: textColor }}>{step.text}</div>
        </motion.div>
    )
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function PinnedProcess(props: Props) {
    const { header, steps = [], scrollLength, pinFrom, padding, maxWidth, headerGap, dotColor, lineColor, trackColor, numColor, titleColor, textColor, numFont, titleFont, bodyFont, style } = props
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const reduce = useReducedMotion()
    const outer = React.useRef<HTMLDivElement>(null)
    const [vw, setVw] = React.useState(1200)
    const [side, setSide] = React.useState(padding)
    const root = outer
    React.useEffect(() => {
        const measure = () => {
            setVw(window.innerWidth)
            const w = outer.current?.clientWidth || window.innerWidth
            setSide(Math.max(padding, (w - maxWidth) / 2 + padding))
        }
        measure()
        window.addEventListener("resize", measure)
        return () => window.removeEventListener("resize", measure)
    }, [padding, maxWidth])

    const wide = vw >= pinFrom
    const animated = wide && !isCanvas && !reduce
    const { scrollYProgress } = useScroll({ target: root, offset: ["start start", "end end"] })
    const f = useTransform(scrollYProgress, [0.06, 0.88], [0, 1], { clamp: true })
    const n = Math.max(1, steps.length)

    return (
        <div ref={outer} style={{ ...style, position: "relative", height: animated ? `calc(100vh + ${scrollLength}vh)` : "auto" }}>
            <div
                style={{
                    position: animated ? "sticky" : "relative",
                    top: 0,
                    minHeight: animated ? "100vh" : undefined,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: headerGap,
                    padding: `72px ${side}px`,
                    boxSizing: "border-box",
                }}
            >
                {header ? (
                    <div>{React.isValidElement(header) ? React.cloneElement(header as React.ReactElement<any>, { style: { ...((header as any).props?.style || {}), width: "100%" } }) : header}</div>
                ) : null}
                <div style={{ position: "relative", display: "flex", flexDirection: wide ? "row" : "column", gap: wide ? 24 : 28 }}>
                    {wide ? (
                        <div aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, top: 0, height: 2, background: trackColor, overflow: "hidden" }}>
                            <motion.div style={{ height: "100%", background: lineColor, transformOrigin: "0% 50%", scaleX: animated ? f : 1 }} />
                        </div>
                    ) : null}
                    {steps.map((s, i) => (
                        <StepItem key={i} step={s} i={i} n={n} f={f} animated={animated} wide={wide} dotColor={dotColor} lineColor={lineColor} trackColor={trackColor} numColor={numColor} titleColor={titleColor} textColor={textColor} numFont={numFont} titleFont={titleFont} bodyFont={bodyFont} />
                    ))}
                </div>
            </div>
        </div>
    )
}

const st = (num: string, title: string, text: string): Step => ({ num, title, text })

PinnedProcess.defaultProps = {
    steps: [
        st("01", "Enquire", "Fill in the form below. We reply within one working day."),
        st("02", "Taste", "Six-flavour tasting box ($45, credited when you book)."),
        st("03", "Design", "A sketch and quote within 3 working days. Two rounds of edits."),
        st("04", "Deposit", "30% holds your date. Details lock 2 weeks before."),
        st("05", "Deliver", "We deliver and set up tiered cakes at your venue."),
    ],
    scrollLength: 160,
    pinFrom: 700,
    padding: 56,
    maxWidth: 1320,
    headerGap: 88,
    dotColor: "#F5D589",
    lineColor: "#F5D589",
    trackColor: "rgba(251,244,234,0.25)",
    numColor: "#F5D589",
    titleColor: "#FBF4EA",
    textColor: "rgba(251,244,234,0.75)",
}

addPropertyControls(PinnedProcess, {
    header: { type: ControlType.ComponentInstance, title: "Header" },
    steps: {
        type: ControlType.Array,
        title: "Steps",
        control: { type: ControlType.Object, controls: { num: { type: ControlType.String, title: "Number" }, title: { type: ControlType.String, title: "Title" }, text: { type: ControlType.String, title: "Text", displayTextArea: true } } },
    },
    scrollLength: { type: ControlType.Number, title: "Scroll Length", min: 60, max: 400, unit: "vh", description: "How long the section stays pinned" },
    pinFrom: { type: ControlType.Number, title: "Pin From", min: 0, max: 1600, unit: "px" },
    padding: { type: ControlType.Number, title: "Side Padding", min: 0, max: 120, unit: "px" },
    maxWidth: { type: ControlType.Number, title: "Max Width", min: 600, max: 2000, unit: "px" },
    headerGap: { type: ControlType.Number, title: "Header Gap", min: 0, max: 160, unit: "px" },
    numFont: { type: ControlType.Font, title: "Number Font", controls: "extended", defaultFontType: "serif", defaultValue: { fontSize: 48 } },
    titleFont: { type: ControlType.Font, title: "Title Font", controls: "extended", defaultFontType: "serif", defaultValue: { fontSize: 28 } },
    bodyFont: { type: ControlType.Font, title: "Body Font", controls: "extended", defaultFontType: "sans-serif", defaultValue: { fontSize: 14 } },
    dotColor: { type: ControlType.Color, title: "Dot" },
    lineColor: { type: ControlType.Color, title: "Line" },
    trackColor: { type: ControlType.Color, title: "Track" },
    numColor: { type: ControlType.Color, title: "Number" },
    titleColor: { type: ControlType.Color, title: "Title" },
    textColor: { type: ControlType.Color, title: "Text" },
})
