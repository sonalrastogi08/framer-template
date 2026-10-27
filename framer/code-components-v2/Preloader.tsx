// Cerise — Preloader
// Full-screen counter 000 → 100 with a gold progress line, then the curtain lifts (GSAP).
// Shows once per browser session. Place it on the Home page, pinned to the top, above everything.
import { useEffect, useRef, useState } from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import gsap from "https://esm.sh/gsap@3.13.0"

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function Preloader(props) {
    const { label, duration, background, color, accent, font, oncePerSession } = props
    const root = useRef<HTMLDivElement>(null)
    const count = useRef<HTMLSpanElement>(null)
    const bar = useRef<HTMLSpanElement>(null)
    const [gone, setGone] = useState(false)
    const isCanvas = RenderTarget.current() === RenderTarget.canvas

    useEffect(() => {
        if (isCanvas) return
        let seen = false
        try { seen = oncePerSession && sessionStorage.getItem("preloader-seen") === "1"; sessionStorage.setItem("preloader-seen", "1") } catch (e) {}
        if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setGone(true); return }
        const o = { v: 0 }
        const tl = gsap.timeline()
            .to(o, { v: 100, duration, ease: "power2.inOut", onUpdate: () => count.current && (count.current.textContent = String(Math.round(o.v)).padStart(3, "0")) })
            .to(bar.current, { scaleX: 1, duration, ease: "power2.inOut" }, 0)
            .to(root.current, { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "expo.inOut", onComplete: () => setGone(true) }, "+=.15")
        return () => tl.kill()
    }, [isCanvas])

    if (gone) return null
    return (
        <div ref={root} style={{ position: isCanvas ? "relative" : "fixed", inset: 0, width: "100%", height: "100%", zIndex: 1000, background, display: "grid", placeItems: "center", clipPath: "inset(0 0 0 0)" }}>
            <div style={{ display: "grid", justifyItems: "center", gap: 12 }}>
                <span style={{ fontFamily: "Jost, sans-serif", fontSize: 12, letterSpacing: "0.32em", textTransform: "uppercase", color: accent }}>{label}</span>
                <span ref={count} style={{ fontSize: "clamp(5rem, 16vw, 13rem)", lineHeight: 1, fontStyle: "italic", color, fontVariantNumeric: "tabular-nums", ...font }}>000</span>
                <div style={{ width: "min(280px, 60vw)", height: 1, background: "rgba(244,233,225,.12)", overflow: "hidden" }}><span ref={bar} style={{ display: "block", height: "100%", background: accent, transformOrigin: "left", transform: "scaleX(0)" }} /></div>
            </div>
        </div>
    )
}

Preloader.defaultProps = { label: "Warming the ovens", duration: 1.6, background: "#140A0C", color: "#F4E9E1", accent: "#D8B46A", oncePerSession: true }

addPropertyControls(Preloader, {
    label: { type: ControlType.String },
    duration: { type: ControlType.Number, min: 0.5, max: 4, step: 0.1, unit: "s" },
    font: { type: ControlType.Font, controls: "extended", defaultFontType: "serif" },
    background: { type: ControlType.Color }, color: { type: ControlType.Color }, accent: { type: ControlType.Color },
    oncePerSession: { type: ControlType.Boolean, title: "Once per visit" },
})
