// Rotunda — SliceWheel
// The v4 hero centrepiece: a sampler cake seen from above. Each wedge is a flavour; the wedge at the
// pointer slides out and its details show beside the wheel. Turn it by dragging (with momentum),
// the arrow buttons, tapping a wedge, or — optionally — by scrolling through the section.
import { useEffect, useMemo, useRef, useState } from "react"
import { motion, useMotionValue, animate, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

type Kind = "plain" | "berries" | "dust" | "peaks" | "nibs" | "petals" | "swirl" | "cherries" | "burnt"
type Flavour = { name: string; tagline: string; price: string; notes: string; color: string; crust: string; topping: Kind; link: string }

const R = 304, CRUST = 20
const rad = (d: number) => (d * Math.PI) / 180
const pol = (r: number, a: number) => [r * Math.cos(rad(a)), r * Math.sin(rad(a))]
const wedgePath = (r0: number, r1: number, a0: number, a1: number) => {
    const [x0, y0] = pol(r1, a0), [x1, y1] = pol(r1, a1)
    if (!r0) return `M0 0 L${x0} ${y0} A${r1} ${r1} 0 0 1 ${x1} ${y1}Z`
    const [x2, y2] = pol(r0, a1), [x3, y3] = pol(r0, a0)
    return `M${x3} ${y3} L${x0} ${y0} A${r1} ${r1} 0 0 1 ${x1} ${y1} L${x2} ${y2} A${r0} ${r0} 0 0 0 ${x3} ${y3}Z`
}
function toppings(kind: Kind, a0: number, step: number, seedStart: number) {
    let seed = seedStart
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280)
    const at = () => pol(R * (0.32 + rnd() * 0.54), a0 + 6 + rnd() * (step - 12))
    const out: JSX.Element[] = []
    const n = (k: number, f: (x: number, y: number, j: number) => JSX.Element) => { for (let j = 0; j < k; j++) { const [x, y] = at(); out.push(f(x, y, j)) } }
    if (kind === "berries") n(5, (x, y, j) => <circle key={j} cx={x} cy={y} r={10} fill="#E23A4E" />)
    if (kind === "dust") n(50, (x, y, j) => <circle key={j} cx={x} cy={y} r={1.4} fill="#000" opacity={0.25} />)
    if (kind === "peaks") n(7, (x, y, j) => <g key={j}><circle cx={x} cy={y} r={13} fill="#FFF8EA" /><circle cx={x + 2} cy={y - 2} r={6} fill="#C9813A" /></g>)
    if (kind === "nibs") n(18, (x, y, j) => <rect key={j} x={x} y={y} width={6} height={4} fill="#1E0D09" transform={`rotate(${j * 37} ${x} ${y})`} />)
    if (kind === "petals") n(6, (x, y, j) => <path key={j} transform={`translate(${x} ${y}) rotate(${j * 61})`} d="M0 0 q10 -14 20 0 q-10 8 -20 0z" fill="#E87C93" />)
    if (kind === "swirl") n(3, (x, y, j) => <path key={j} d={`M${x - 18} ${y} q9 -14 18 0 t18 0`} stroke="#FFE2A8" strokeWidth={5} fill="none" strokeLinecap="round" />)
    if (kind === "cherries") n(4, (x, y, j) => <g key={j}><circle cx={x} cy={y} r={12} fill="#FFF4E6" /><circle cx={x} cy={y - 3} r={7} fill="#B1112E" /></g>)
    if (kind === "burnt") n(12, (x, y, j) => <circle key={j} cx={x} cy={y} r={3 + rnd() * 6} fill="#3E2416" opacity={0.4} />)
    return out
}

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function SliceWheel(props) {
    const { flavours, pointer, spinOnScroll, showInfo, ink, plate, accent, nameFont, buttonLabel } = props as {
        flavours: Flavour[]; pointer: "left" | "top"; spinOnScroll: boolean; showInfo: boolean; ink: string; plate: string; accent: string; nameFont: any; buttonLabel: string
    }
    const N = Math.max(2, flavours.length), STEP = 360 / N
    const pAngle = pointer === "top" ? 270 : 180
    const target = (i: number, near: number) => { const b = pAngle - STEP / 2 - i * STEP; return b + Math.round((near - b) / 360) * 360 }
    const indexFor = (r: number) => ((Math.round((pAngle - STEP / 2 - r) / STEP) % N) + N) % N
    const rot = useMotionValue(target(0, 0))
    const [i, setI] = useState(0)
    const root = useRef<HTMLDivElement>(null)
    const svg = useRef<SVGSVGElement>(null)
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    useMotionValueEvent(rot, "change", (r) => { const k = indexFor(r); if (k !== i) setI(k) })

    const goTo = (k: number) => animate(rot, target(((k % N) + N) % N, rot.get()), { type: "spring", stiffness: 120, damping: 20 })
    const { scrollYProgress } = useScroll({ target: root, offset: ["start start", "end end"] })
    useMotionValueEvent(scrollYProgress, "change", (p) => { if (spinOnScroll && !isCanvas) animate(rot, target(0, 0) - p * (N - 1) * STEP, { duration: 0.4 }) })

    // drag with momentum
    const drag = useRef({ on: false, last: 0, vel: 0, t: 0 })
    const angleAt = (e: React.PointerEvent) => { const r = svg.current!.getBoundingClientRect(); return (Math.atan2(e.clientY - r.top - r.height / 2, e.clientX - r.left - r.width / 2) * 180) / Math.PI }
    const onDown = (e: React.PointerEvent) => { drag.current = { on: true, last: angleAt(e), vel: 0, t: performance.now() }; (e.target as Element).setPointerCapture?.(e.pointerId); rot.stop() }
    const onMove = (e: React.PointerEvent) => {
        if (!drag.current.on) return
        let a = angleAt(e), d = a - drag.current.last
        if (d > 180) d -= 360; if (d < -180) d += 360
        const now = performance.now(); drag.current.vel = d / Math.max(1, now - drag.current.t); drag.current.t = now; drag.current.last = a
        rot.set(rot.get() + d)
    }
    const onUp = () => { if (!drag.current.on) return; drag.current.on = false; const fling = drag.current.vel * 220; animate(rot, target(indexFor(rot.get() + fling), rot.get() + fling), { type: "spring", stiffness: 90, damping: 18 }) }

    const wedges = useMemo(() => flavours.map((f, k) => ({ f, k, a0: k * STEP, tops: toppings(f.topping, k * STEP, STEP, 7 + k * 13) })), [flavours, STEP])
    const f = flavours[i] || flavours[0]

    return (
        <div ref={root} style={{ width: "100%", height: "100%", display: "grid", gridTemplateColumns: showInfo && pointer === "left" ? "1fr 1.05fr" : "1fr", alignItems: "center", gap: 24, color: ink, fontFamily: "Instrument Sans, sans-serif" }}>
            {showInfo && (
                <div style={{ display: "grid", gap: 16, order: pointer === "top" ? 2 : 0 }}>
                    <span style={{ fontWeight: 700, letterSpacing: "0.2em", fontSize: 12, textTransform: "uppercase" }}>{String(i + 1).padStart(2, "0")} of {String(N).padStart(2, "0")}</span>
                    <div style={{ overflow: "hidden" }}>
                        <AnimatePresence mode="wait">
                            <motion.h2 key={i} initial={{ y: "100%" }} animate={{ y: "0%" }} exit={{ y: "-100%" }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                                style={{ margin: 0, textTransform: "uppercase", lineHeight: 0.84, fontSize: "clamp(3.5rem, 8vw, 9rem)", fontWeight: 900, ...nameFont }}>{f?.name}</motion.h2>
                        </AnimatePresence>
                    </div>
                    <p style={{ margin: 0, fontFamily: "Instrument Serif, serif", fontStyle: "italic", fontSize: 28, opacity: 0.8 }}>{f?.tagline}</p>
                    <p style={{ margin: 0 }}><b style={{ fontSize: 32 }}>{f?.price}</b> · {f?.notes}</p>
                    <a href={f?.link || undefined} style={{ justifySelf: "start", background: accent, color: plate, borderRadius: 999, padding: "14px 24px", fontWeight: 700, textDecoration: "none" }}>{buttonLabel} ↗</a>
                </div>
            )}
            <div style={{ position: "relative", display: "grid", placeItems: "center" }}>
                <svg ref={svg} viewBox="-380 -380 760 760" style={{ width: "100%", touchAction: "none", cursor: "grab" }} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
                    <circle r={372} fill={plate} />
                    <motion.g style={{ rotate: rot, originX: "0px", originY: "0px" }}>
                        {wedges.map(({ f: w, k, a0, tops }) => {
                            const [dx, dy] = pol(k === i ? 34 : 0, a0 + STEP / 2)
                            return (
                                <motion.g key={k} animate={{ x: dx, y: dy }} transition={{ type: "spring", stiffness: 300, damping: 18 }} onClick={() => goTo(k)} style={{ cursor: "pointer" }}>
                                    <path d={wedgePath(0, R, a0, a0 + STEP)} fill={w.color} stroke={plate} strokeWidth={3} />
                                    {tops}
                                    <path d={wedgePath(R - CRUST, R, a0, a0 + STEP)} fill={w.crust} />
                                </motion.g>
                            )
                        })}
                    </motion.g>
                </svg>
                <div style={{ position: "absolute", ...(pointer === "top" ? { top: 0, left: "50%", transform: "translateX(-50%)" } : { left: 0, top: "50%", transform: "translateY(-50%)" }), background: ink, color: plate, padding: "6px 12px", borderRadius: 6, fontWeight: 700, fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase" }}>Your slice</div>
                <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                    <button onClick={() => goTo(i - 1)} aria-label="Previous slice" style={{ width: 48, height: 48, borderRadius: "50%", border: `2px solid ${ink}`, background: plate, cursor: "pointer" }}>←</button>
                    <button onClick={() => goTo(i + 1)} aria-label="Next slice" style={{ width: 48, height: 48, borderRadius: "50%", border: `2px solid ${ink}`, background: plate, cursor: "pointer" }}>→</button>
                </div>
            </div>
        </div>
    )
}

const fl = (name, tagline, price, notes, color, crust, topping) => ({ name, tagline, price, notes, color, crust, topping, link: "" })
SliceWheel.defaultProps = {
    flavours: [
        fl("Burnt Basque", "caramelised outside, barely set inside", "$9", "Burnt sugar · vanilla · sea salt", "#E9B86A", "#3E2416", "burnt"),
        fl("Strawberry Shortcake", "cloud cream and Jersey strawberries", "$8", "Strawberry · cream · sponge", "#FFF4E6", "#F2D3A2", "berries"),
        fl("Matcha Mille Crêpe", "twenty paper-thin layers, Uji matcha", "$9", "Matcha · cream · crêpe", "#A8C46F", "#E9D9A8", "dust"),
        fl("Lemon Meringue", "sharp curd under a toasted cloud", "$8", "Lemon · meringue · shortbread", "#FFE36E", "#D9A55A", "peaks"),
        fl("Fudge Royale", "the fudgiest slice in the borough", "$8", "70% cocoa · fudge · nibs", "#4A2318", "#2A130C", "nibs"),
        fl("Pistachio Rose", "Bronte pistachio, rose, raspberry", "$9", "Pistachio · rose · raspberry", "#C2D18E", "#8E9B55", "petals"),
        fl("Salted Caramel", "brown butter sponge, flaky salt", "$8", "Caramel · brown butter · salt", "#D9893E", "#7A4520", "swirl"),
        fl("Black Forest", "kirsch cherries, dark chocolate, cream", "$9", "Cherry · cocoa · cream", "#3A1A14", "#1E0D09", "cherries"),
    ],
    pointer: "left", spinOnScroll: false, showInfo: true, ink: "#2A1A12", plate: "#FFFDF6", accent: "#E2462B", buttonLabel: "Add to box",
}

addPropertyControls(SliceWheel, {
    flavours: { type: ControlType.Array, title: "Slices", control: { type: ControlType.Object, controls: {
        name: { type: ControlType.String }, tagline: { type: ControlType.String }, price: { type: ControlType.String }, notes: { type: ControlType.String },
        color: { type: ControlType.Color, title: "Top colour" }, crust: { type: ControlType.Color, title: "Crust" },
        topping: { type: ControlType.Enum, options: ["plain", "berries", "dust", "peaks", "nibs", "petals", "swirl", "cherries", "burnt"] },
        link: { type: ControlType.Link, title: "Order link" } } } },
    pointer: { type: ControlType.Enum, options: ["left", "top"], optionTitles: ["Left (desktop)", "Top (phone)"], displaySegmentedControl: true },
    spinOnScroll: { type: ControlType.Boolean, title: "Spin on scroll" },
    showInfo: { type: ControlType.Boolean, title: "Show details" },
    nameFont: { type: ControlType.Font, controls: "extended", title: "Name font" },
    buttonLabel: { type: ControlType.String, title: "Button" },
    ink: { type: ControlType.Color }, plate: { type: ControlType.Color }, accent: { type: ControlType.Color },
})
