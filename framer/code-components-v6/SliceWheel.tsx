// Velvet Crumb — SliceWheel (v6)
// The slice bar: a sampler cake seen from above. The wedge at the pointer slides out and its
// details show beside the wheel. Turn it by dragging (with momentum), the arrow buttons, tapping a
// wedge or the arrow keys, then add up to four slices to a box.
import * as React from "react"
import { motion, useMotionValue, animate, useMotionValueEvent, AnimatePresence, useReducedMotion } from "framer-motion"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

type Kind = "plain" | "pistachio" | "fudge" | "raspberry" | "berries" | "crumbs" | "meringue" | "caramel" | "forest"
interface Flavour {
    name: string
    tagline: string
    price: string
    notes: string
    allergens: string
    color: string
    crust: string
    topping: Kind
}
interface Props {
    flavours: Flavour[]
    eyebrow: string
    buttonLabel: string
    boxPrice: string
    ink: string
    muted: string
    accent: string
    plate: string
    nameFont: React.CSSProperties
    bodyFont: React.CSSProperties
    scriptFont: React.CSSProperties
    style?: React.CSSProperties
}

const R = 304
const CRUST = 20
const PULL = 34
const rad = (d: number) => (d * Math.PI) / 180
const pol = (r: number, a: number): [number, number] => [r * Math.cos(rad(a)), r * Math.sin(rad(a))]
const wedgePath = (r0: number, r1: number, a0: number, a1: number) => {
    const [x0, y0] = pol(r1, a0)
    const [x1, y1] = pol(r1, a1)
    if (!r0) return `M0 0 L${x0} ${y0} A${r1} ${r1} 0 0 1 ${x1} ${y1}Z`
    const [x2, y2] = pol(r0, a1)
    const [x3, y3] = pol(r0, a0)
    return `M${x3} ${y3} L${x0} ${y0} A${r1} ${r1} 0 0 1 ${x1} ${y1} L${x2} ${y2} A${r0} ${r0} 0 0 0 ${x3} ${y3}Z`
}

function toppings(kind: Kind, a0: number, step: number, seedStart: number) {
    let seed = seedStart
    const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
    const at = () => pol(R * (0.32 + rnd() * 0.54), a0 + 6 + rnd() * (step - 12))
    const out: React.ReactNode[] = []
    let key = 0
    const n = (k: number, f: (x: number, y: number) => React.ReactNode) => {
        for (let j = 0; j < k; j++) {
            const [x, y] = at()
            out.push(<React.Fragment key={key++}>{f(x, y)}</React.Fragment>)
        }
    }
    const berry = (x: number, y: number) => (
        <g transform={`translate(${x} ${y}) rotate(${rnd() * 360})`}>
            <path d="M-11 -4 Q-11 13 0 16 Q11 13 11 -4 Q0 -10 -11 -4Z" fill="#E23A4E" />
            <path d="M-7 -6 L0 -2 L7 -6 L2 -9 L0 -13 L-2 -9Z" fill="#5E9E4B" />
        </g>
    )
    switch (kind) {
        case "pistachio":
            n(26, (x, y) => <circle cx={x} cy={y} r={1.5 + rnd() * 2.5} fill="#6E8B3D" />)
            n(4, (x, y) => <path transform={`translate(${x} ${y}) rotate(${rnd() * 360})`} d="M0 0 q10 -14 20 0 q-10 8 -20 0z" fill="#E87C93" />)
            n(2, berry)
            break
        case "fudge":
            out.push(<path key={key++} d={wedgePath(R * 0.3, R * 0.5, a0 + 4, a0 + step - 4)} fill="#7A3E2A" opacity={0.5} />)
            n(16, (x, y) => <rect x={x} y={y} width={4 + rnd() * 5} height={3 + rnd() * 4} rx={1} fill="#1E0D09" transform={`rotate(${rnd() * 180} ${x} ${y})`} />)
            n(1, (x, y) => <circle cx={x} cy={y} r={11} fill="#C9A15B" />)
            break
        case "raspberry":
            n(6, (x, y) => (
                <g transform={`translate(${x} ${y})`}>
                    {[[-4, -3], [4, -3], [0, 3], [-4, 4], [4, 4], [0, -6]].map(([a, b], q) => (
                        <circle key={q} cx={a} cy={b} r={3.6} fill="#C8243E" />
                    ))}
                </g>
            ))
            n(3, (x, y) => <circle cx={x} cy={y} r={8} fill="#FFFDF8" />)
            break
        case "berries":
            n(5, berry)
            n(4, (x, y) => (
                <g>
                    <circle cx={x} cy={y} r={9} fill="#fff" />
                    <circle cx={x - 2} cy={y - 2} r={4} fill="#F4E4CF" />
                </g>
            ))
            break
        case "crumbs":
            n(36, (x, y) => <rect x={x} y={y} width={3 + rnd() * 4} height={3 + rnd() * 3} fill="#8E1C26" opacity={0.6 + rnd() * 0.4} transform={`rotate(${rnd() * 90} ${x} ${y})`} />)
            break
        case "meringue":
            n(7, (x, y) => (
                <g transform={`translate(${x} ${y})`}>
                    <circle r={13} fill="#FFF8EA" />
                    <circle r={7} cx={2} cy={-2} fill="#F2C27A" />
                    <circle r={3} cx={3} cy={-3} fill="#C9813A" />
                </g>
            ))
            break
        case "caramel":
            n(3, (x, y) => <path d={`M${x - 18} ${y} q9 -14 18 0 t18 0`} stroke="#FFE2A8" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.85} />)
            n(14, (x, y) => <rect x={x} y={y} width={4} height={4} fill="#fff" opacity={0.85} transform={`rotate(${rnd() * 90} ${x} ${y})`} />)
            break
        case "forest":
            n(4, (x, y) => (
                <g>
                    <circle cx={x} cy={y} r={12} fill="#FFF4E6" />
                    <circle cx={x} cy={y - 3} r={7} fill="#B1112E" />
                    <circle cx={x - 2} cy={y - 5} r={2} fill="#fff" opacity={0.6} />
                </g>
            ))
            n(16, (x, y) => <rect x={x} y={y} width={6} height={2} fill="#1E0D09" transform={`rotate(${rnd() * 180} ${x} ${y})`} />)
            break
    }
    return out
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function SliceWheel(props: Props) {
    const { flavours = [], eyebrow, buttonLabel, boxPrice, ink, muted, accent, plate, nameFont, bodyFont, scriptFont, style } = props
    const N = Math.max(2, flavours.length)
    const STEP = 360 / N
    const P_ANGLE = 180 // pointer on the left, facing the details
    const target = (k: number, near: number) => {
        const b = P_ANGLE - STEP / 2 - k * STEP
        return b + Math.round((near - b) / 360) * 360
    }
    const indexFor = (r: number) => ((Math.round((P_ANGLE - STEP / 2 - r) / STEP) % N) + N) % N
    const rot = useMotionValue(target(0, 0))
    const [i, setI] = React.useState(0)
    const [box, setBox] = React.useState<number[]>([])
    const [narrow, setNarrow] = React.useState(false)
    const svg = React.useRef<SVGSVGElement>(null)
    const root = React.useRef<HTMLDivElement>(null)
    const reduce = useReducedMotion()
    const isCanvas = RenderTarget.current() === RenderTarget.canvas

    const rotor = React.useRef<SVGGElement>(null)
    useMotionValueEvent(rot, "change", (r) => {
        rotor.current?.setAttribute("transform", `rotate(${r})`)
        const k = indexFor(r)
        if (k !== i) setI(k)
    })

    React.useEffect(() => {
        if (isCanvas || !root.current) return
        const ro = new ResizeObserver(([e]) => setNarrow(e.contentRect.width < 820))
        ro.observe(root.current)
        return () => ro.disconnect()
    }, [isCanvas])

    const goTo = (k: number) => {
        const t = target(((k % N) + N) % N, rot.get())
        if (reduce) rot.set(t)
        else animate(rot, t, { type: "spring", stiffness: 120, damping: 20 })
    }

    const drag = React.useRef({ on: false, last: 0, vel: 0, t: 0, moved: 0 })
    const angleAt = (e: React.PointerEvent) => {
        const r = svg.current!.getBoundingClientRect()
        return (Math.atan2(e.clientY - r.top - r.height / 2, e.clientX - r.left - r.width / 2) * 180) / Math.PI
    }
    const onDown = (e: React.PointerEvent) => {
        drag.current = { on: true, last: angleAt(e), vel: 0, t: performance.now(), moved: 0 }
        rot.stop()
    }
    const onMove = (e: React.PointerEvent) => {
        if (!drag.current.on) return
        const a = angleAt(e)
        let d = a - drag.current.last
        if (d > 180) d -= 360
        if (d < -180) d += 360
        const now = performance.now()
        drag.current.vel = d / Math.max(1, now - drag.current.t)
        drag.current.t = now
        drag.current.last = a
        drag.current.moved += Math.abs(d)
        if (drag.current.moved > 2) svg.current?.setPointerCapture?.(e.pointerId)
        rot.set(rot.get() + d)
    }
    const onUp = () => {
        if (!drag.current.on) return
        drag.current.on = false
        if (drag.current.moved <= 2) return
        const fling = drag.current.vel * 220
        animate(rot, target(indexFor(rot.get() + fling), rot.get() + fling), { type: "spring", stiffness: 90, damping: 18 })
    }
    const onKey = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            e.preventDefault()
            goTo(i + 1)
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            e.preventDefault()
            goTo(i - 1)
        }
    }

    const wedges = React.useMemo(
        () => flavours.map((w, k) => ({ w, k, a0: k * STEP, tops: toppings(w.topping, k * STEP, STEP, 7 + k * 13) })),
        [flavours, STEP]
    )
    const f = flavours[i] || flavours[0]
    const full = box.length >= 4
    const addSlice = () => setBox((b) => (b.length >= 4 ? [i] : [...b, i]))
    const boxText = box.length === 0 ? "Empty box" : full ? "Box full · ready to order" : `${box.length} of 4 in your box`

    const label: React.CSSProperties = { ...bodyFont, fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: muted }
    const roundBtn: React.CSSProperties = { width: 44, height: 44, borderRadius: "50%", border: "1px solid rgba(43,22,17,0.14)", background: "transparent", color: ink, cursor: "pointer", fontSize: 18, display: "grid", placeItems: "center" }

    return (
        <div
            ref={root}
            style={{
                ...style,
                display: "grid",
                gridTemplateColumns: narrow ? "1fr" : "1fr 1.1fr",
                alignItems: "center",
                gap: narrow ? 32 : 56,
                color: ink,
                ...bodyFont,
            }}
        >
            <div style={{ display: "grid", gap: 20, order: narrow ? 2 : 0, minWidth: 0 }}>
                <span style={{ ...label, color: ink, display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <i style={{ width: 8, height: 8, borderRadius: "50%", background: accent, display: "block" }} />
                    {eyebrow}
                </span>
                <p style={{ margin: 0, display: "flex", alignItems: "center", gap: 12, ...label }}>
                    <span style={{ ...nameFont, fontSize: 28, letterSpacing: 0, color: ink, fontVariantNumeric: "tabular-nums" }}>{String(i + 1).padStart(2, "0")}</span>
                    <span style={{ width: 40, height: 1, background: "rgba(43,22,17,0.25)" }} />
                    <span>of {String(N).padStart(2, "0")} · spin to choose</span>
                </p>
                <div style={{ overflow: "hidden", paddingBottom: "0.08em" }} aria-live="polite">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.h2
                            key={i}
                            initial={reduce ? false : { y: "105%" }}
                            animate={{ y: "0%" }}
                            exit={reduce ? undefined : { y: "-105%" }}
                            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                            style={{ margin: 0, lineHeight: 0.98, letterSpacing: "-0.02em", ...nameFont }}
                        >
                            {f?.name}
                        </motion.h2>
                    </AnimatePresence>
                </div>
                <p style={{ margin: 0, color: accent, lineHeight: 1, transform: "rotate(-2deg)", transformOrigin: "left", ...scriptFont }}>{f?.tagline}</p>
                <dl style={{ margin: 0, display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px 24px", padding: "18px 0", borderTop: "1px solid rgba(43,22,17,0.14)", borderBottom: "1px solid rgba(43,22,17,0.14)" }}>
                    <dt style={label}>Per slice</dt>
                    <dd style={{ margin: 0, fontWeight: 800, fontSize: 18 }}>{f?.price}</dd>
                    <dt style={label}>Notes</dt>
                    <dd style={{ margin: 0 }}>{f?.notes}</dd>
                    <dt style={label}>Contains</dt>
                    <dd style={{ margin: 0, color: muted }}>{f?.allergens}</dd>
                </dl>
                <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
                    <motion.button
                        type="button"
                        onClick={addSlice}
                        whileHover={{ backgroundColor: accent, borderColor: accent }}
                        whileTap={{ scale: 0.96 }}
                        style={{ ...bodyFont, display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 26px", borderRadius: 999, border: `1px solid ${ink}`, background: ink, color: plate, fontWeight: 700, fontSize: 15, cursor: "pointer" }}
                    >
                        {buttonLabel} <span aria-hidden="true">→</span>
                    </motion.button>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }} aria-label="Your box of four">
                        <svg viewBox="-50 -50 100 100" width={48} height={48} aria-hidden="true">
                            <circle r={46} fill="none" stroke="rgba(43,22,17,0.2)" strokeWidth={2} strokeDasharray="3 5" />
                            {box.map((k, q) => (
                                <motion.path
                                    key={q + "-" + k}
                                    d={wedgePath(0, 42, q * 90 - 90, q * 90)}
                                    fill={flavours[k]?.color}
                                    stroke={plate}
                                    strokeWidth={2}
                                    initial={reduce ? false : { scale: 0.4, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                                />
                            ))}
                        </svg>
                        <span style={{ display: "grid", lineHeight: 1.3 }}>
                            <b style={{ fontSize: 15 }}>{boxText}</b>
                            <small style={{ color: muted, fontSize: 13 }}>Box of 4 slices · {boxPrice}</small>
                        </span>
                    </div>
                </div>
            </div>

            <div style={{ position: "relative", display: "grid", justifyItems: "center", gap: 16, minWidth: 0 }}>
                <svg
                    ref={svg}
                    viewBox="-380 -380 760 760"
                    role="group"
                    tabIndex={0}
                    aria-label="A sampler cake with slices. Drag, tap a slice or use the arrow keys to turn it."
                    onKeyDown={onKey}
                    onPointerDown={onDown}
                    onPointerMove={onMove}
                    onPointerUp={onUp}
                    onPointerCancel={onUp}
                    style={{ width: "100%", maxWidth: 620, touchAction: "pan-y", cursor: "grab", outline: "none", overflow: "visible" }}
                >
                    <defs>
                        <radialGradient id="vc-plate" cx=".5" cy=".45" r=".6">
                            <stop offset=".8" stopColor={plate} />
                            <stop offset="1" stopColor="#EADFCD" />
                        </radialGradient>
                        <radialGradient id="vc-gloss" cx=".35" cy=".3" r=".9">
                            <stop offset="0" stopColor="#fff" stopOpacity=".35" />
                            <stop offset=".5" stopColor="#fff" stopOpacity="0" />
                        </radialGradient>
                        <filter id="vc-drop" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="18" stdDeviation="16" floodColor="#2B1611" floodOpacity=".22" />
                        </filter>
                    </defs>
                    <circle r={372} fill="url(#vc-plate)" filter="url(#vc-drop)" />
                    <circle r={345} fill="none" stroke="#EADFCD" strokeWidth={2} strokeDasharray="2 10" />
                    <g ref={rotor} transform={`rotate(${rot.get()})`}>
                        {wedges.map(({ w, k, a0, tops }) => {
                            const [dx, dy] = pol(k === i ? PULL : 0, a0 + STEP / 2)
                            return (
                                <motion.g
                                    key={k}
                                    animate={{ x: dx, y: dy }}
                                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 18 }}
                                    onClick={() => drag.current.moved <= 2 && goTo(k)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <path d={wedgePath(0, R, a0, a0 + STEP)} fill={w.color} stroke={plate} strokeWidth={3} />
                                    {tops}
                                    <path d={wedgePath(R - CRUST, R, a0, a0 + STEP)} fill={w.crust} />
                                </motion.g>
                            )
                        })}
                    </g>
                    <circle r={304} fill="url(#vc-gloss)" pointerEvents="none" />
                </svg>
                <div
                    aria-hidden="true"
                    style={{ position: "absolute", left: 0, top: "calc(50% - 30px)", transform: "translateY(-50%)", background: ink, color: plate, padding: "6px 12px", borderRadius: 999, fontWeight: 700, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase" }}
                >
                    Your slice
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <button type="button" onClick={() => goTo(i - 1)} aria-label="Previous slice" style={roundBtn}>
                        ←
                    </button>
                    <span style={{ color: muted, fontSize: 14 }}>Drag, tap or use the arrows</span>
                    <button type="button" onClick={() => goTo(i + 1)} aria-label="Next slice" style={roundBtn}>
                        →
                    </button>
                </div>
            </div>
        </div>
    )
}

const fl = (name: string, tagline: string, price: string, notes: string, allergens: string, color: string, crust: string, topping: Kind): Flavour => ({ name, tagline, price, notes, allergens, color, crust, topping })

SliceWheel.defaultProps = {
    flavours: [
        fl("Pistachio Rose", "our signature, since day one", "$9", "Pistachio · rose · strawberry", "Dairy · egg · pistachio · gluten", "#C9D79A", "#8E9B55", "pistachio"),
        fl("Midnight Ganache", "dangerously dark, salted caramel heart", "$8", "70% cocoa · caramel · nibs", "Dairy · egg · gluten · soy", "#4A2318", "#2A130C", "fudge"),
        fl("Raspberry Silk", "pink, light and a little bit tart", "$9", "Raspberry · white chocolate · cream", "Dairy · egg · gluten", "#F3B6BE", "#D98F99", "raspberry"),
        fl("Strawberry Shortcake", "cloud cream, Jersey strawberries", "$8", "Strawberry · cream · sponge", "Dairy · egg · gluten", "#FFF4E6", "#F2D3A2", "berries"),
        fl("Classic Red Velvet", "cream cheese frosting, always", "$8", "Cocoa · buttermilk · cream cheese", "Dairy · egg · gluten", "#FFF3E2", "#8E1C26", "crumbs"),
        fl("Lemon Meringue", "sharp curd under a toasted cloud", "$8", "Lemon · meringue · shortbread", "Dairy · egg · gluten", "#FFE36E", "#D9A55A", "meringue"),
        fl("Salted Caramel", "brown butter sponge, flaky salt", "$8", "Caramel · brown butter · salt", "Dairy · egg · gluten", "#D9893E", "#7A4520", "caramel"),
        fl("Black Forest", "kirsch cherries, cocoa and cream", "$9", "Cherry · cocoa · cream", "Dairy · egg · gluten · alcohol", "#3A1A14", "#1E0D09", "forest"),
    ],
    eyebrow: "The slice bar · by the slice",
    buttonLabel: "Add slice to box",
    boxPrice: "$30",
    ink: "#2B1611",
    muted: "#7A6158",
    accent: "#E8576B",
    plate: "#FFFDF8",
}

addPropertyControls(SliceWheel, {
    flavours: {
        type: ControlType.Array,
        title: "Slices",
        control: {
            type: ControlType.Object,
            controls: {
                name: { type: ControlType.String, title: "Name" },
                tagline: { type: ControlType.String, title: "Tagline" },
                price: { type: ControlType.String, title: "Price" },
                notes: { type: ControlType.String, title: "Notes" },
                allergens: { type: ControlType.String, title: "Contains" },
                color: { type: ControlType.Color, title: "Top colour" },
                crust: { type: ControlType.Color, title: "Crust" },
                topping: { type: ControlType.Enum, title: "Topping", options: ["plain", "pistachio", "fudge", "raspberry", "berries", "crumbs", "meringue", "caramel", "forest"] },
            },
        },
    },
    eyebrow: { type: ControlType.String, title: "Eyebrow" },
    buttonLabel: { type: ControlType.String, title: "Button" },
    boxPrice: { type: ControlType.String, title: "Box Price" },
    nameFont: { type: ControlType.Font, title: "Name Font", controls: "extended", defaultFontType: "serif", defaultValue: { fontSize: 72 } },
    bodyFont: { type: ControlType.Font, title: "Body Font", controls: "extended", defaultFontType: "sans-serif", defaultValue: { fontSize: 16 } },
    scriptFont: { type: ControlType.Font, title: "Script Font", controls: "extended", defaultFontType: "sans-serif", defaultValue: { fontSize: 32 } },
    ink: { type: ControlType.Color, title: "Ink" },
    muted: { type: ControlType.Color, title: "Muted" },
    accent: { type: ControlType.Color, title: "Accent" },
    plate: { type: ControlType.Color, title: "Plate" },
})
