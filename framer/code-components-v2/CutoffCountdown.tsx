// Cerise — CutoffCountdown
// Live "same-day cut-off in 02:14:33" timer that rolls over to the next day after the cut-off.
import { useEffect, useState } from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function CutoffCountdown(props) {
    const { cutoffHour, label, labelAfter, note, font, color, labelColor } = props
    const [now, setNow] = useState(() => new Date())
    useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id) }, [])
    const t = new Date(now); t.setHours(cutoffHour, 0, 0, 0)
    const after = t <= now
    if (after) t.setDate(t.getDate() + 1)
    const s = Math.max(0, Math.floor((+t - +now) / 1000))
    const p = (n: number) => String(n).padStart(2, "0")
    return (
        <div style={{ display: "grid", gap: 10, color }}>
            <span style={{ fontFamily: "Jost, sans-serif", fontSize: 12, letterSpacing: "0.32em", textTransform: "uppercase", color: labelColor }}>{after ? labelAfter : label}</span>
            <span style={{ fontSize: "clamp(3rem, 7vw, 6.2rem)", lineHeight: 1, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.03em", ...font }}>{p(Math.floor(s / 3600))}:{p(Math.floor((s % 3600) / 60))}:{p(s % 60)}</span>
            <span style={{ fontFamily: "Jost, sans-serif", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.7 }}>{note}</span>
        </div>
    )
}

CutoffCountdown.defaultProps = { cutoffHour: 12, label: "Same-day cut-off in", labelAfter: "Next-day cut-off in", note: "Order before 12:00 for delivery 18:00 – 23:00", color: "#F4E9E1", labelColor: "#D8B46A" }

addPropertyControls(CutoffCountdown, {
    cutoffHour: { type: ControlType.Number, min: 0, max: 23, step: 1, title: "Cut-off hour" },
    label: { type: ControlType.String }, labelAfter: { type: ControlType.String, title: "After cut-off" }, note: { type: ControlType.String },
    font: { type: ControlType.Font, controls: "extended", defaultFontType: "serif" },
    color: { type: ControlType.Color }, labelColor: { type: ControlType.Color, title: "Label color" },
})
