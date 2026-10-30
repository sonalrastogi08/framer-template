// Velvet Crumb — Odometer (v6)
// Rolling number counter for the stats row: each digit spins up like an odometer reel when it
// scrolls into view. Non-digit characters (",", ".", "h") stay put.
import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { motion, useInView, useReducedMotion } from "framer-motion"

interface Props {
    value: string
    font: React.CSSProperties
    color: string
    duration: number
    stagger: number
    style?: React.CSSProperties
}

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function Odometer(props: Props) {
    const { value, font, color, duration, stagger, style } = props
    const ref = React.useRef<HTMLSpanElement>(null)
    const inView = useInView(ref, { once: true, margin: "0px 0px -18% 0px" })
    const reduce = useReducedMotion()
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const instant = isCanvas || !!reduce
    const chars = String(value || "").split("")
    let digitIndex = 0
    return (
        <span
            ref={ref}
            role="text"
            aria-label={value}
            style={{ ...style, ...font, color, display: "inline-flex", alignItems: "flex-start", lineHeight: 1, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}
        >
            {chars.map((ch, i) => {
                if (!/[0-9]/.test(ch)) {
                    return (
                        <span key={i} aria-hidden="true" style={{ display: "inline-block", height: "1em" }}>
                            {ch}
                        </span>
                    )
                }
                const order = digitIndex++
                const target = 10 + Number(ch)
                return (
                    <span key={i} aria-hidden="true" style={{ display: "inline-block", height: "1em", overflow: "hidden" }}>
                        <motion.span
                            style={{ display: "flex", flexDirection: "column" }}
                            initial={false}
                            animate={{ y: instant || inView ? `-${target}em` : "0em" }}
                            transition={instant ? { duration: 0 } : { duration, delay: order * stagger, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {[...DIGITS, ...DIGITS].map((d, k) => (
                                <span key={k} style={{ display: "block", height: "1em" }}>
                                    {d}
                                </span>
                            ))}
                        </motion.span>
                    </span>
                )
            })}
        </span>
    )
}

Odometer.defaultProps = { value: "12,400", color: "#2B1611", duration: 1.6, stagger: 0.08 }

addPropertyControls(Odometer, {
    value: { type: ControlType.String, title: "Value", defaultValue: "12,400" },
    font: { type: ControlType.Font, title: "Font", controls: "extended", defaultFontType: "serif", defaultValue: { fontSize: 70, lineHeight: 1 } },
    color: { type: ControlType.Color, title: "Color", defaultValue: "#2B1611" },
    duration: { type: ControlType.Number, title: "Duration", defaultValue: 1.6, min: 0.2, max: 4, step: 0.1, unit: "s" },
    stagger: { type: ControlType.Number, title: "Stagger", defaultValue: 0.08, min: 0, max: 0.5, step: 0.01, unit: "s" },
})
