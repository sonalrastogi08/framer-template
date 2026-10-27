// Blåbär — GlazePour
// The v5 hero centrepiece: a mirror glaze poured live onto a cake (canvas). A stream falls,
// spreads over the top, curtains down the sides, drips (the pointer tugs nearby drips longer)
// and pools on a Delft plate. Switching glaze re-pours the new colour over the old one.
// Pour progress can follow scroll through the section, or play automatically.
import { useEffect, useRef, useState } from "react"
import { animate, useScroll, useMotionValueEvent } from "framer-motion"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

type Glaze = { name: string; dark: string; mid: string; light: string }
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const ease = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function GlazePour(props) {
    const { glazes, startIndex, pourOnScroll, autoDuration, plateColor, rimColor, mousse, showPicker, ink, background } = props as {
        glazes: Glaze[]; startIndex: number; pourOnScroll: boolean; autoDuration: number; plateColor: string; rimColor: string; mousse: string; showPicker: boolean; ink: string; background: string
    }
    const wrap = useRef<HTMLDivElement>(null)
    const cv = useRef<HTMLCanvasElement>(null)
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const [gi, setGi] = useState(clamp(startIndex, 0, Math.max(0, glazes.length - 1)))
    const S = useRef({ g: isCanvas || reduced ? 1 : 0, under: null as Glaze | null, mx: -1, drips: [] as { t: number; len: number; w: number; pull: number; ph: number }[] })

    if (!S.current.drips.length) {
        let s = 11
        const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
        S.current.drips = Array.from({ length: 22 }, (_, i) => ({ t: -0.96 + (i / 21) * 1.92, len: 0.25 + rnd() * 0.85, w: 0.045 + rnd() * 0.05, pull: 0, ph: rnd() * 6 }))
    }

    // scroll-driven or automatic pour
    const { scrollYProgress } = useScroll({ target: wrap, offset: ["start end", "end start"] })
    useMotionValueEvent(scrollYProgress, "change", (p) => { if (pourOnScroll && !isCanvas && !reduced) S.current.g = clamp((p - 0.15) / 0.5) })
    const pour = () => {
        if (isCanvas || reduced) { S.current.g = 1; return }
        if (pourOnScroll) return
        S.current.g = 0
        animate(0, 1, { duration: autoDuration, ease: "linear", onUpdate: (v) => (S.current.g = v) })
    }
    useEffect(() => { pour() }, [])

    // render loop
    useEffect(() => {
        const c = cv.current!, ctx = c.getContext("2d")!
        let raf = 0, W = 0, H = 0
        const size = () => { const dpr = Math.min(window.devicePixelRatio || 1, 2); W = c.clientWidth; H = c.clientHeight; c.width = W * dpr; c.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0) }
        size()
        const ro = new ResizeObserver(size); ro.observe(c)
        const draw = (time: number) => {
            const st = S.current, cur = glazes[gi] || glazes[0]
            ctx.clearRect(0, 0, W, H)
            const rx = Math.min(W * 0.3, H * 0.34), ry = rx * 0.27, h = rx * 0.66, cx = W / 2, plateY = H * 0.8, bottomY = plateY - ry * 0.25, topY = bottomY - h
            const edge = (t: number) => topY + ry * Math.sqrt(Math.max(0, 1 - t * t))
            // plate
            ctx.fillStyle = plateColor; ctx.beginPath(); ctx.ellipse(cx, plateY, rx * 1.42, ry * 1.55, 0, 0, Math.PI * 2); ctx.fill()
            ctx.strokeStyle = rimColor; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(cx, plateY, rx * 1.33, ry * 1.4, 0, 0, Math.PI * 2); ctx.stroke()
            ctx.setLineDash([6, 9]); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(cx, plateY, rx * 1.22, ry * 1.24, 0, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([])
            // cake
            ctx.fillStyle = mousse; ctx.beginPath(); ctx.moveTo(cx - rx, topY); ctx.lineTo(cx - rx, bottomY); ctx.ellipse(cx, bottomY, rx, ry, 0, Math.PI, 0, true); ctx.lineTo(cx + rx, topY); ctx.closePath(); ctx.fill()
            ctx.beginPath(); ctx.ellipse(cx, topY, rx, ry, 0, 0, Math.PI * 2); ctx.fill()
            const glaze = (g: number, col: Glaze, stream: boolean) => {
                if (g <= 0) return
                const side = ctx.createLinearGradient(cx - rx, 0, cx + rx, 0)
                side.addColorStop(0, col.dark); side.addColorStop(0.28, col.mid); side.addColorStop(0.36, col.light); side.addColorStop(0.46, col.mid); side.addColorStop(1, col.dark)
                const spread = ease(clamp((g - 0.06) / 0.3)), flow = clamp((g - 0.3) / 0.7)
                if (flow > 0) {
                    const curtain = h * (0.08 + 0.92 * Math.pow(flow, 2.2))
                    ctx.fillStyle = side; ctx.beginPath()
                    for (let k = 0; k <= 48; k++) { const t = -1 + k / 24; k ? ctx.lineTo(cx + rx * t, edge(t) - 1) : ctx.moveTo(cx + rx * t, edge(t) - 1) }
                    for (let k = 48; k >= 0; k--) { const t = -1 + k / 24; ctx.lineTo(cx + rx * t, Math.min(edge(t) + curtain, bottomY + ry * Math.sqrt(1 - t * t))) }
                    ctx.closePath(); ctx.fill()
                    for (const d of st.drips) {
                        const x = cx + rx * d.t
                        const near = st.mx >= 0 ? clamp(1 - Math.abs(st.mx - x) / (rx * 0.25)) : 0
                        d.pull += (near * h * 0.22 - d.pull) * 0.08
                        const len = Math.pow(flow, 1.3) * h * d.len * 0.62 + d.pull * flow + Math.sin(time / 600 + d.ph) * 2 * flow
                        if (len < 2) continue
                        const y0 = Math.min(edge(d.t) + curtain, bottomY + ry * Math.sqrt(1 - d.t * d.t)) - 2, y1 = Math.min(y0 + len, plateY + ry * 0.9), w = rx * d.w
                        ctx.beginPath(); ctx.moveTo(x - w / 2, y0); ctx.lineTo(x - w / 2, y1 - w / 2); ctx.arc(x, y1 - w / 2, (w / 2) * 1.15, Math.PI, 0, true); ctx.lineTo(x + w / 2, y0); ctx.closePath(); ctx.fill()
                    }
                }
                if (spread > 0) {
                    const top = ctx.createRadialGradient(cx - rx * 0.3, topY - ry * 0.4, 2, cx, topY, rx * 1.1)
                    top.addColorStop(0, col.light); top.addColorStop(0.35, col.mid); top.addColorStop(1, col.dark)
                    ctx.fillStyle = top; ctx.beginPath(); ctx.ellipse(cx, topY, rx * Math.min(1.01, spread * 1.03), ry * Math.min(1.01, spread * 1.03), 0, 0, Math.PI * 2); ctx.fill()
                    ctx.globalAlpha = 0.35 * spread; ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.ellipse(cx - rx * 0.35, topY - ry * 0.35, rx * 0.32 * spread, ry * 0.22 * spread, -0.15, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1
                }
                if (stream && g > 0.01 && g < 0.92) {
                    const head = ease(clamp(g / 0.07)), tail = ease(clamp((g - 0.78) / 0.14)), sw = rx * 0.07
                    ctx.fillStyle = side; ctx.fillRect(cx - sw / 2 + Math.sin(time / 90) * 1.5, tail * topY, sw, (head - tail) * topY)
                }
            }
            if (st.under) glaze(1, st.under, false)
            glaze(st.g, cur, true)
            raf = requestAnimationFrame(draw)
        }
        raf = requestAnimationFrame(draw)
        return () => { cancelAnimationFrame(raf); ro.disconnect() }
    }, [gi, glazes, plateColor, rimColor, mousse])

    const pick = (i: number) => {
        if (i === gi) return
        S.current.under = S.current.g > 0.3 ? glazes[gi] : S.current.under
        setGi(i)
        if (!pourOnScroll) { S.current.g = 0; if (!isCanvas && !reduced) animate(0, 1, { duration: autoDuration * 0.85, ease: "linear", onUpdate: (v) => (S.current.g = v) }); else S.current.g = 1 }
    }

    return (
        <div ref={wrap} style={{ position: "relative", width: "100%", height: "100%", background, overflow: "hidden" }}
            onPointerMove={(e) => { const r = cv.current!.getBoundingClientRect(); S.current.mx = e.clientX - r.left }} onPointerLeave={() => (S.current.mx = -1)}>
            <canvas ref={cv} role="img" aria-label={`A ${glazes[gi]?.name || ""} mirror glaze being poured over a cake`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
            {showPicker && (
                <div style={{ position: "absolute", left: 12, bottom: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {glazes.map((g, i) => (
                        <button key={g.name} onClick={() => pick(i)} aria-pressed={i === gi} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px 6px 6px", borderRadius: 999, border: `1.5px solid ${i === gi ? ink : "rgba(20,32,90,.25)"}`, background: "#fff", color: ink, cursor: "pointer", font: "600 14px Archivo, sans-serif" }}>
                            <i style={{ width: 20, height: 20, borderRadius: "50%", background: g.mid }} />{g.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

GlazePour.defaultProps = {
    glazes: [
        { name: "Blueberry", dark: "#2B2370", mid: "#4B3BB0", light: "#8C7BEA" },
        { name: "Lingonberry", dark: "#6E0A1F", mid: "#B3123A", light: "#F06A86" },
        { name: "Cloudberry", dark: "#A55B0E", mid: "#E8902A", light: "#FFD27A" },
    ],
    startIndex: 0, pourOnScroll: false, autoDuration: 3, plateColor: "#FFFFFF", rimColor: "#1F3FBF", mousse: "#FBF6EE", showPicker: true, ink: "#14205A", background: "transparent",
}

addPropertyControls(GlazePour, {
    glazes: { type: ControlType.Array, title: "Glazes", control: { type: ControlType.Object, controls: { name: { type: ControlType.String }, dark: { type: ControlType.Color, title: "Shadow" }, mid: { type: ControlType.Color, title: "Body" }, light: { type: ControlType.Color, title: "Highlight" } } } },
    startIndex: { type: ControlType.Number, min: 0, max: 9, step: 1, title: "Start glaze" },
    pourOnScroll: { type: ControlType.Boolean, title: "Pour on scroll" },
    autoDuration: { type: ControlType.Number, min: 1, max: 8, step: 0.1, unit: "s", title: "Pour time", hidden: (p) => p.pourOnScroll },
    showPicker: { type: ControlType.Boolean, title: "Glaze picker" },
    plateColor: { type: ControlType.Color, title: "Plate" }, rimColor: { type: ControlType.Color, title: "Rim" }, mousse: { type: ControlType.Color, title: "Cake sides" },
    ink: { type: ControlType.Color }, background: { type: ControlType.Color },
})
