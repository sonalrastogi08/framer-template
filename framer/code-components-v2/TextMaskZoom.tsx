// Cerise — TextMaskZoom
// A giant gradient word you "fly through" on scroll: it scales ~70× around a point inside a letter,
// the screen floods with colour, then a statement fades in (GSAP ScrollTrigger, sticky stage).
import { useEffect, useRef } from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import gsap from "https://esm.sh/gsap@3.13.0"
import { ScrollTrigger } from "https://esm.sh/gsap@3.13.0/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function TextMaskZoom(props) {
    const { word, statement, label, font, statementFont, colorA, colorB, colorC, background, fillColor, textColor, originX, originY, scrollLength } = props
    const root = useRef<HTMLDivElement>(null)
    const isCanvas = RenderTarget.current() === RenderTarget.canvas

    useEffect(() => {
        if (isCanvas || !root.current) return
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
        const q = gsap.utils.selector(root)
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 1 } })
        tl.fromTo(q("[data-word]"), { scale: 0.7 }, { scale: 1, duration: 0.15, ease: "none" })
            .to(q("[data-word]"), { scale: 70, duration: 0.6, ease: "power3.in" }, 0.15)
            .to(q("[data-fill]"), { opacity: 1, duration: 0.15 }, 0.6)
            .to(q("[data-word]"), { opacity: 0, duration: 0.05 }, 0.72)
            .fromTo(q("[data-after]"), { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.2 }, 0.78)
        return () => { tl.scrollTrigger?.kill(); tl.kill() }
    }, [isCanvas])

    const h = isCanvas ? 700 : undefined
    return (
        <div ref={root} style={{ position: "relative", width: "100%", height: h ?? `${scrollLength}vh` }}>
            <div style={{ position: "sticky", top: 0, height: h ?? "100vh", overflow: "hidden", display: "grid", placeItems: "center", background }}>
                <div data-fill style={{ position: "absolute", inset: 0, background: fillColor, opacity: 0 }} />
                <div data-word style={{ position: "relative", zIndex: 2, whiteSpace: "nowrap", lineHeight: 0.8, fontSize: "clamp(6rem, 28vw, 30rem)", letterSpacing: "-0.06em", transformOrigin: `${originX}% ${originY}%`, background: `radial-gradient(circle at 50% 55%, ${colorA}, ${colorB} 35%, ${colorC} 70%)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", ...font }}>{word}</div>
                <div data-after style={{ position: "absolute", inset: 0, zIndex: 3, display: "grid", placeItems: "center", textAlign: "center", padding: 24, opacity: isCanvas ? 1 : 0, color: textColor }}>
                    <div style={{ display: "grid", gap: 24, justifyItems: "center" }}>
                        <span style={{ fontSize: 12, letterSpacing: "0.32em", textTransform: "uppercase" }}>{label}</span>
                        <p style={{ margin: 0, maxWidth: "18ch", fontSize: "clamp(2rem, 5vw, 4.6rem)", lineHeight: 1.04, ...statementFont }}>{statement}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

TextMaskZoom.defaultProps = { word: "TASTE", statement: "Every piece is made the same afternoon it's eaten.", label: "Our philosophy", colorA: "#E7A3A8", colorB: "#C2213F", colorC: "#7A0C1F", background: "#140A0C", fillColor: "#C2213F", textColor: "#F4E9E1", originX: 46.5, originY: 52, scrollLength: 260 }

addPropertyControls(TextMaskZoom, {
    word: { type: ControlType.String },
    font: { type: ControlType.Font, controls: "extended", defaultFontType: "serif", defaultValue: { fontWeight: 700 } },
    originX: { type: ControlType.Number, min: 0, max: 100, unit: "%", title: "Zoom into X" },
    originY: { type: ControlType.Number, min: 0, max: 100, unit: "%", title: "Zoom into Y" },
    colorA: { type: ControlType.Color, title: "Glow" }, colorB: { type: ControlType.Color, title: "Mid" }, colorC: { type: ControlType.Color, title: "Edge" },
    background: { type: ControlType.Color }, fillColor: { type: ControlType.Color, title: "Flood" },
    label: { type: ControlType.String }, statement: { type: ControlType.String, displayTextArea: true },
    statementFont: { type: ControlType.Font, controls: "extended", defaultFontType: "serif" },
    textColor: { type: ControlType.Color, title: "Text" },
    scrollLength: { type: ControlType.Number, min: 150, max: 500, unit: "vh", title: "Scroll length" },
})
