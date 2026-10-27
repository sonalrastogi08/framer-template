// Velvet — OrderModeSelector
// "How do you want it?" pill tabs (Delivery / Pickup / Nationwide / Apps) with a spring-animated
// indicator (Framer Motion layoutId). Each mode carries its own note and link to ANY provider
// (Square, Toast, Shopify, Uber Eats, a form…).
import { useState } from "react"
import { motion, LayoutGroup } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

type Mode = { label: string; note: string; link: string }

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function OrderModeSelector(props) {
    const { modes, ink, paper, muted, showButton, buttonLabel } = props as { modes: Mode[]; ink: string; paper: string; muted: string; showButton: boolean; buttonLabel: string }
    const [active, setActive] = useState(0)
    const mode = modes[active] || modes[0]
    const id = useState(() => Math.random().toString(36).slice(2))[0]

    return (
        <div style={{ display: "grid", gap: 12, justifyItems: "start", fontFamily: "Manrope, sans-serif" }}>
            <LayoutGroup id={id}>
                <div role="tablist" style={{ display: "inline-flex", padding: 6, borderRadius: 999, background: paper, border: "1px solid rgba(43,22,17,.14)" }}>
                    {modes.map((m, i) => (
                        <button key={m.label} role="tab" aria-selected={i === active} onClick={() => setActive(i)}
                            style={{ position: "relative", border: 0, background: "none", padding: "0.75em 1.2em", borderRadius: 999, fontWeight: 700, fontSize: 14, cursor: "pointer", color: i === active ? paper : ink, transition: "color .3s" }}>
                            {i === active && <motion.span layoutId="ind" transition={{ type: "spring", stiffness: 380, damping: 30 }} style={{ position: "absolute", inset: 0, borderRadius: 999, background: ink, zIndex: 0 }} />}
                            <span style={{ position: "relative", zIndex: 1 }}>{m.label}</span>
                        </button>
                    ))}
                </div>
            </LayoutGroup>
            <motion.p key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ margin: 0, fontSize: 14, color: muted }}>{mode?.note}</motion.p>
            {showButton && mode?.link && (
                <a href={mode.link} style={{ background: ink, color: paper, padding: "0.9em 1.4em", borderRadius: 999, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>{buttonLabel} →</a>
            )}
        </div>
    )
}

OrderModeSelector.defaultProps = {
    modes: [
        { label: "Delivery", note: "Order by 12pm for same-day delivery · from $9", link: "" },
        { label: "Pickup", note: "Pick a studio, a day and a 30-min slot", link: "" },
        { label: "Nationwide", note: "Ships frozen to 48 states · free over $100", link: "" },
        { label: "Apps", note: "Also on Uber Eats & DoorDash", link: "" },
    ],
    ink: "#2B1611", paper: "#FFFDF8", muted: "#7A6158", showButton: false, buttonLabel: "Order now",
}

addPropertyControls(OrderModeSelector, {
    modes: {
        type: ControlType.Array, maxCount: 5,
        control: { type: ControlType.Object, controls: { label: { type: ControlType.String }, note: { type: ControlType.String }, link: { type: ControlType.Link } } },
    },
    ink: { type: ControlType.Color }, paper: { type: ControlType.Color }, muted: { type: ControlType.Color },
    showButton: { type: ControlType.Boolean, title: "Order button" },
    buttonLabel: { type: ControlType.String, title: "Button label", hidden: (p) => !p.showButton },
})
