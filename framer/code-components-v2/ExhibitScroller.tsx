// Cerise — ExhibitScroller
// Pinned "exhibition": while you scroll, one piece at a time takes centre stage. The big number
// rolls, the cake swaps with a rotate/blur transition and the details panel crossfades.
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import gsap from "https://esm.sh/gsap@3.13.0"
import { ScrollTrigger } from "https://esm.sh/gsap@3.13.0/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

type Piece = { name: string; accent: string; description: string; details: string; price: string; tag: string; image: { src: string; alt?: string }; link: string }

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function ExhibitScroller(props) {
    const { pieces, label, titleFont, ink, mute, gold, glow, background } = props as { pieces: Piece[]; label: string; titleFont: any; ink: string; mute: string; gold: string; glow: string; background: string }
    const root = useRef<HTMLDivElement>(null)
    const stage = useRef<HTMLDivElement>(null)
    const [i, setI] = useState(0)
    const [dir, setDir] = useState(1)
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const n = pieces.length || 1

    useEffect(() => {
        if (isCanvas || !root.current) return
        const mm = gsap.matchMedia()
        mm.add("(min-width: 861px)", () => {
            const st = ScrollTrigger.create({ trigger: root.current, start: "top top", end: () => `+=${window.innerHeight * (n - 0.4)}`, pin: stage.current, onUpdate: (s) => {
                const k = Math.min(n - 1, Math.floor(s.progress * n))
                setI((prev) => { if (prev !== k) setDir(k > prev ? 1 : -1); return k })
            } })
            return () => st.kill()
        })
        mm.add("(max-width: 860px)", () => { const id = setInterval(() => { setDir(1); setI((k) => (k + 1) % n) }, 4500); return () => clearInterval(id) })
        return () => mm.revert()
    }, [isCanvas, n])

    const p = pieces[i]
    return (
        <div ref={root} style={{ width: "100%", background, color: ink, fontFamily: "Jost, sans-serif" }}>
            <div ref={stage} style={{ minHeight: isCanvas ? 760 : "100vh", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", alignItems: "center", gap: 24, padding: "40px 4vw", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", left: "50%", top: "52%", width: "70vmin", height: "70vmin", transform: "translate(-50%,-50%)", borderRadius: "50%", background: `radial-gradient(circle, ${glow}, transparent 70%)` }} />
                <div style={{ display: "grid", gap: 18, position: "relative" }}>
                    <span style={{ fontSize: 12, letterSpacing: "0.32em", textTransform: "uppercase", color: gold }}>{label}</span>
                    <div style={{ height: "0.82em", overflow: "hidden", fontSize: "clamp(5rem, 11vw, 11rem)", lineHeight: 0.8, fontStyle: "italic", ...titleFont }}>
                        <AnimatePresence initial={false} custom={dir} mode="popLayout">
                            <motion.span key={i} custom={dir} initial={{ y: `${100 * dir}%` }} animate={{ y: "0%" }} exit={{ y: `${-100 * dir}%` }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} style={{ display: "block" }}>{String(i + 1).padStart(2, "0")}</motion.span>
                        </AnimatePresence>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>{pieces.map((_, k) => <i key={k} onClick={() => setI(k)} style={{ width: 28, height: 2, background: k === i ? gold : "rgba(244,233,225,.12)", cursor: "pointer" }} />)}</div>
                </div>
                <div style={{ height: "min(64vh, 560px)", display: "grid", placeItems: "center", position: "relative" }}>
                    <AnimatePresence initial={false} custom={dir}>
                        <motion.img key={i} src={p?.image?.src} alt={p?.image?.alt || p?.name} initial={{ opacity: 0, scale: 1.25, rotate: 20 * dir, filter: "blur(8px)" }} animate={{ opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" }} exit={{ opacity: 0, scale: 0.7, rotate: -20 * dir, filter: "blur(8px)" }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} style={{ position: "absolute", width: "min(100%, 520px)" }} />
                    </AnimatePresence>
                </div>
                <AnimatePresence mode="wait">
                    <motion.div key={i} initial={{ opacity: 0, y: 30 * dir }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 * dir }} transition={{ duration: 0.5 }} style={{ display: "grid", gap: 16, position: "relative" }}>
                        {p?.tag && <span style={{ justifySelf: "start", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", border: `1px solid ${gold}`, color: gold, borderRadius: 999, padding: "4px 12px" }}>{p.tag}</span>}
                        <h3 style={{ margin: 0, fontSize: "clamp(2.2rem, 3.8vw, 3.6rem)", lineHeight: 1, fontWeight: 400, ...titleFont }}>{p?.name} <i style={{ color: gold }}>{p?.accent}</i></h3>
                        <p style={{ margin: 0, color: mute, fontWeight: 300 }}>{p?.description}</p>
                        <p style={{ margin: 0, fontSize: 13 }}>{p?.details}</p>
                        <div style={{ display: "flex", gap: 18, alignItems: "center" }}><span style={{ fontStyle: "italic", fontSize: 28, color: gold, ...titleFont }}>{p?.price}</span>{p?.link && <a href={p.link} style={{ border: `1px solid ${gold}`, padding: "12px 22px", fontSize: 12, letterSpacing: "0.24em", textTransform: "uppercase", color: ink, textDecoration: "none" }}>Order</a>}</div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

ExhibitScroller.defaultProps = {
    label: "The collection · Autumn 2026",
    pieces: [
        { name: "Cerise", accent: "Noire", description: "Morello cherry, Tahitian vanilla, almond dacquoise, cherry mirror glaze.", details: "Serves 6–8 · 48h notice", price: "$72", tag: "Signature", link: "" },
        { name: "", accent: "Minuit", description: "70% dark chocolate, salted caramel heart, cocoa-nib crunch.", details: "Serves 8–10 · 24h notice", price: "$68", tag: "Bestseller", link: "" },
    ],
    ink: "#F4E9E1", mute: "#B39A93", gold: "#D8B46A", glow: "rgba(231,163,168,.32)", background: "#140A0C",
}

addPropertyControls(ExhibitScroller, {
    label: { type: ControlType.String },
    pieces: { type: ControlType.Array, title: "Pieces", control: { type: ControlType.Object, controls: {
        name: { type: ControlType.String }, accent: { type: ControlType.String, title: "Italic word" }, description: { type: ControlType.String, displayTextArea: true },
        details: { type: ControlType.String }, price: { type: ControlType.String }, tag: { type: ControlType.String }, image: { type: ControlType.ResponsiveImage }, link: { type: ControlType.Link } } } },
    titleFont: { type: ControlType.Font, controls: "extended", defaultFontType: "serif", title: "Title font" },
    ink: { type: ControlType.Color }, mute: { type: ControlType.Color }, gold: { type: ControlType.Color }, glow: { type: ControlType.Color }, background: { type: ControlType.Color },
})
