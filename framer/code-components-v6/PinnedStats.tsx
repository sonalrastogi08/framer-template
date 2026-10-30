// Velvet Crumb — PinnedStats (v6)
// A row of numbers (ordering policy). The section pins while you scroll and the grey line above each
// item fills with colour one after another; the page only moves on once all lines are full.
// Below the pin width it is a plain static grid.
import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { motion, useScroll, useTransform, useReducedMotion, MotionValue } from "framer-motion"

interface Item {
    value: string
    text: string
}
interface Props {
    header?: React.ReactNode
    items: Item[]
    scrollLength: number
    pinFrom: number
    padding: number
    maxWidth: number
    headerGap: number
    gap: number
    lineColor: string
    trackColor: string
    valueColor: string
    textColor: string
    valueFont: React.CSSProperties
    textFont: React.CSSProperties
    style?: React.CSSProperties
}

function Stat(props: { item: Item; i: number; n: number; p: MotionValue<number>; animated: boolean } & Pick<Props, "lineColor" | "trackColor" | "valueColor" | "textColor" | "valueFont" | "textFont">) {
    const { item, i, n, p, animated, lineColor, trackColor, valueColor, textColor, valueFont, textFont } = props
    const seg = 1 / n
    const fill = useTransform(p, [i * seg, (i + 1) * seg], [0, 1], { clamp: true })
    return (
        <div style={{ display: "grid", gap: 24, alignContent: "start", minWidth: 0 }}>
            <div aria-hidden="true" style={{ height: 2, background: trackColor, overflow: "hidden" }}>
                <motion.div style={{ height: "100%", background: lineColor, transformOrigin: "0% 50%", scaleX: animated ? fill : 1 }} />
            </div>
            <div style={{ ...valueFont, color: valueColor, lineHeight: 1 }}>{item.value}</div>
            <div style={{ ...textFont, color: textColor }}>{item.text}</div>
        </div>
    )
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function PinnedStats(props: Props) {
    const { header, items = [], scrollLength, pinFrom, padding, maxWidth, headerGap, gap, lineColor, trackColor, valueColor, textColor, valueFont, textFont, style } = props
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const reduce = useReducedMotion()
    const outer = React.useRef<HTMLDivElement>(null)
    const [vw, setVw] = React.useState(1200)
    const [side, setSide] = React.useState(padding)
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
    const { scrollYProgress } = useScroll({ target: outer, offset: ["start start", "end end"] })
    const p = useTransform(scrollYProgress, [0.08, 0.9], [0, 1], { clamp: true })
    const n = Math.max(1, items.length)

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
                {header ? <div>{React.isValidElement(header) ? React.cloneElement(header as React.ReactElement<any>, { style: { ...((header as any).props?.style || {}), width: "100%" } }) : header}</div> : null}
                <div style={{ display: "grid", gridTemplateColumns: wide ? `repeat(${n}, minmax(0, 1fr))` : "repeat(auto-fill, minmax(220px, 1fr))", gap }}>
                    {items.map((it, i) => (
                        <Stat key={i} item={it} i={i} n={n} p={p} animated={animated} lineColor={lineColor} trackColor={trackColor} valueColor={valueColor} textColor={textColor} valueFont={valueFont} textFont={textFont} />
                    ))}
                </div>
            </div>
        </div>
    )
}

PinnedStats.defaultProps = {
    items: [
        { value: "12pm", text: "Same-day delivery cut-off for cakes marked “Same day”" },
        { value: "48h", text: "Notice for most celebration cakes; 3 weeks for tiered" },
        { value: "$100", text: "Free local delivery threshold (otherwise $9)" },
        { value: "48h", text: "Changes & cancellations; 72h for 8″+ and tiered cakes" },
    ],
    scrollLength: 160,
    pinFrom: 700,
    padding: 56,
    maxWidth: 1320,
    headerGap: 64,
    gap: 32,
    lineColor: "#E8576B",
    trackColor: "rgba(43,22,17,0.14)",
    valueColor: "#2B1611",
    textColor: "#7A6158",
}

addPropertyControls(PinnedStats, {
    header: { type: ControlType.ComponentInstance, title: "Header" },
    items: { type: ControlType.Array, title: "Items", control: { type: ControlType.Object, controls: { value: { type: ControlType.String, title: "Value" }, text: { type: ControlType.String, title: "Text", displayTextArea: true } } } },
    scrollLength: { type: ControlType.Number, title: "Scroll Length", min: 60, max: 400, unit: "vh", description: "How long the section stays pinned" },
    pinFrom: { type: ControlType.Number, title: "Pin From", min: 0, max: 1600, unit: "px" },
    padding: { type: ControlType.Number, title: "Side Padding", min: 0, max: 120, unit: "px" },
    maxWidth: { type: ControlType.Number, title: "Max Width", min: 600, max: 2000, unit: "px" },
    headerGap: { type: ControlType.Number, title: "Header Gap", min: 0, max: 160, unit: "px" },
    gap: { type: ControlType.Number, title: "Column Gap", min: 0, max: 80, unit: "px" },
    valueFont: { type: ControlType.Font, title: "Value Font", controls: "extended", defaultFontType: "serif", defaultValue: { fontSize: 64 } },
    textFont: { type: ControlType.Font, title: "Text Font", controls: "extended", defaultFontType: "sans-serif", defaultValue: { fontSize: 14 } },
    lineColor: { type: ControlType.Color, title: "Line" },
    trackColor: { type: ControlType.Color, title: "Track" },
    valueColor: { type: ControlType.Color, title: "Value" },
    textColor: { type: ControlType.Color, title: "Text" },
})
