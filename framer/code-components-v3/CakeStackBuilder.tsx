// Sugarstack — CakeStackBuilder
// The v3 hero centrepiece: a layer cake whose sponge, filling and frosting colours follow the
// options the visitor picks, with an "exploded" anatomy view (layers spread apart, labels appear)
// driven by scroll progress through the section, or by the "See inside" button.
import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform, useSpring, animate, useMotionValue } from "framer-motion"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

type Opt = { name: string; color: string; label: string; price: number }

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function CakeStackBuilder(props) {
    const { sponges, fillings, frostings, basePrice, size, ink, paper, chipActive, explodeOnScroll, spread, buttonLabel, link } = props as {
        sponges: Opt[]; fillings: Opt[]; frostings: Opt[]; basePrice: number; size: string; ink: string; paper: string; chipActive: string; explodeOnScroll: boolean; spread: number; buttonLabel: string; link: string
    }
    const [s, setS] = useState(0), [f, setF] = useState(0), [fr, setFr] = useState(0)
    const ref = useRef<HTMLDivElement>(null)
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const manual = useMotionValue(0)
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
    const scrolled = useTransform(scrollYProgress, [0, 0.6], [0, 1])
    const progress = useSpring(useMotionValue(0), { stiffness: 120, damping: 20 })
    useEffect(() => {
        if (isCanvas) return
        const un1 = scrolled.on("change", (v) => explodeOnScroll && progress.set(Math.max(v, manual.get())))
        const un2 = manual.on("change", (v) => progress.set(Math.max(v, explodeOnScroll ? scrolled.get() : 0)))
        return () => { un1(); un2() }
    }, [isCanvas, explodeOnScroll])

    const S = sponges[s] || sponges[0], F = fillings[f] || fillings[0], FR = frostings[fr] || frostings[0]
    const price = basePrice + (S?.price || 0) + (F?.price || 0) + (FR?.price || 0)
    // offsets (svg units) per layer in the exploded view
    const off = { plate: 70, s1: 40, f1: 18, s2: -6, f2: -30, s3: -56, frost: -96, top: -130 }
    const y = (k: keyof typeof off) => useTransform(progress, [0, 1], [0, off[k] * spread])
    const ys = { plate: y("plate"), s1: y("s1"), f1: y("f1"), s2: y("s2"), f2: y("f2"), s3: y("s3"), frost: y("frost"), top: y("top") }
    const labelOpacity = useTransform(progress, [0.5, 0.9], [0, 1])
    const squish = { scaleY: [1, 0.82, 1.08, 1], transition: { duration: 0.5 } }

    const sponge = (yv, cy) => (
        <motion.g style={{ y: yv, originY: 1 }} key={`s${cy}-${s}`} animate={squish}>
            <path d={`M110 ${cy - 60} V${cy} A150 26 0 0 0 410 ${cy} V${cy - 60}Z`} fill={S?.color} style={{ transition: "fill .4s" }} />
            <ellipse cx="260" cy={cy - 60} rx="150" ry="26" fill={S?.color} style={{ transition: "fill .4s" }} />
            <ellipse cx="260" cy={cy - 60} rx="150" ry="26" fill="#fff" opacity=".18" />
        </motion.g>
    )
    const filling = (yv, cy) => (
        <motion.g style={{ y: yv }} key={`f${cy}-${f}`} animate={squish}>
            <path d={`M110 ${cy - 14} V${cy} A150 26 0 0 0 410 ${cy} V${cy - 14}Z`} fill={F?.color} style={{ transition: "fill .4s" }} />
            <ellipse cx="260" cy={cy - 14} rx="150" ry="26" fill={F?.color} style={{ transition: "fill .4s" }} />
        </motion.g>
    )
    const label = (yv, x, yy, text, anchor: "start" | "end") => (
        <motion.g style={{ y: yv, opacity: isCanvas ? 1 : labelOpacity }}>
            <text x={x} y={yy} textAnchor={anchor} fontSize="17" fontWeight="800" fill={ink} stroke={paper} strokeWidth="6" paintOrder="stroke">{text}</text>
        </motion.g>
    )
    const chips = (opts: Opt[], cur: number, set: (n: number) => void, legend: string) => (
        <fieldset style={{ border: 0, padding: 0, margin: 0, display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            <legend style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", width: 84, float: "left", opacity: 0.75 }}>{legend}</legend>
            {opts.map((o, i) => (
                <motion.button key={o.name} type="button" onClick={() => set(i)} whileHover={{ y: -2 }} whileTap={{ scale: 0.94 }} aria-pressed={cur === i}
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px 6px 6px", borderRadius: 999, border: `2px solid ${ink}`, background: cur === i ? chipActive : paper, boxShadow: cur === i ? `3px 3px 0 ${ink}` : "none", fontWeight: 700, cursor: "pointer", color: ink, font: "inherit" }}>
                    <i style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${ink}`, background: o.color }} />{o.name}
                </motion.button>
            ))}
        </fieldset>
    )

    return (
        <div ref={ref} style={{ width: "100%", height: "100%", display: "grid", gap: 20, color: ink, fontFamily: "Bricolage Grotesque, system-ui, sans-serif" }}>
            <svg viewBox="0 0 520 600" style={{ width: "100%", overflow: "visible" }} role="img" aria-label={`${S?.label}, ${F?.label}, ${FR?.label}`}>
                <motion.g style={{ y: ys.plate }}><ellipse cx="260" cy="530" rx="205" ry="34" fill="#E9DDF7" /><ellipse cx="260" cy="522" rx="205" ry="34" fill="#fff" /></motion.g>
                {sponge(ys.s1, 512)}{filling(ys.f1, 452)}{sponge(ys.s2, 438)}{filling(ys.f2, 378)}{sponge(ys.s3, 364)}
                <motion.g style={{ y: ys.frost }} key={`fr-${fr}`} animate={squish}>
                    <ellipse cx="260" cy="298" rx="154" ry="30" fill={FR?.color} style={{ transition: "fill .4s" }} />
                    <path d="M106 300 L414 300 L414 330 Q404 360 390 330 Q370 372 350 330 Q330 380 310 330 Q290 376 270 330 Q250 384 230 330 Q210 370 190 330 Q170 378 150 330 Q130 360 106 330Z" fill={FR?.color} style={{ transition: "fill .4s" }} />
                </motion.g>
                <motion.g style={{ y: ys.top }}><circle cx="258" cy="268" r="20" fill="#E8365A" /><circle cx="200" cy="278" r="9" fill="#6A6FD6" /><circle cx="318" cy="278" r="9" fill="#6A6FD6" /></motion.g>
                {label(ys.frost, 446, 300, FR?.label, "start")}{label(ys.s3, 64, 338, S?.label, "end")}{label(ys.f2, 446, 375, F?.label, "start")}
            </svg>
            <div style={{ display: "grid", gap: 10, background: paper, border: `2.5px solid ${ink}`, borderRadius: 22, padding: 16, boxShadow: `6px 6px 0 ${ink}` }}>
                {chips(sponges, s, setS, "Sponge")}{chips(fillings, f, setF, "Filling")}{chips(frostings, fr, setFr, "Frosting")}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", borderTop: `2px dashed ${ink}40`, paddingTop: 12 }}>
                    <div><motion.div key={price} initial={{ scale: 1.2 }} animate={{ scale: 1 }} style={{ fontFamily: "Bagel Fat One, sans-serif", fontSize: 36, lineHeight: 1 }}>${price}</motion.div><div style={{ fontSize: 13, opacity: 0.75 }}>{size}</div></div>
                    <div style={{ display: "flex", gap: 8 }}>
                        <motion.button type="button" whileTap={{ scale: 0.95 }} onClick={() => animate(manual, manual.get() > 0.5 ? 0 : 1, { duration: 0.9 })} style={{ border: `2.5px solid ${ink}`, background: paper, borderRadius: 999, padding: "10px 16px", fontWeight: 800, cursor: "pointer", color: ink, font: "inherit" }}>See inside ↕</motion.button>
                        <motion.a href={link || undefined} whileHover={{ x: -2, y: -2 }} style={{ border: `2.5px solid ${ink}`, background: "#FF8FB1", borderRadius: 999, padding: "10px 18px", fontWeight: 800, color: ink, textDecoration: "none", boxShadow: `4px 4px 0 ${ink}` }}>{buttonLabel} →</motion.a>
                    </div>
                </div>
            </div>
        </div>
    )
}

const opt = (name, color, label, price) => ({ name, color, label, price })
CakeStackBuilder.defaultProps = {
    sponges: [opt("Vanilla", "#FFE3A3", "Vanilla bean sponge", 0), opt("Chocolate", "#8A4B3A", "Double chocolate sponge", 4), opt("Red velvet", "#D2394F", "Red velvet sponge", 4)],
    fillings: [opt("Strawberry", "#FF6F91", "Strawberry jam", 0), opt("Pistachio", "#9CCB6B", "Pistachio cream", 6), opt("Caramel", "#E39B3D", "Salted caramel", 3)],
    frostings: [opt("Pink", "#FFB8CC", "Strawberry buttercream", 0), opt("Mint", "#BDEBD3", "Mint chip buttercream", 2), opt("Lemon", "#FFF0A8", "Lemon curd buttercream", 2)],
    basePrice: 48, size: '6" · serves 8–10 · ready today 4pm', ink: "#3B1F2B", paper: "#FFFDF9", chipActive: "#FFE48A", explodeOnScroll: true, spread: 1.7, buttonLabel: "Add to basket", link: "",
}

const optControl = { type: ControlType.Array, control: { type: ControlType.Object, controls: { name: { type: ControlType.String }, color: { type: ControlType.Color }, label: { type: ControlType.String, title: "Anatomy label" }, price: { type: ControlType.Number, title: "+ Price" } } } }
addPropertyControls(CakeStackBuilder, {
    sponges: { ...optControl, title: "Sponges" }, fillings: { ...optControl, title: "Fillings" }, frostings: { ...optControl, title: "Frostings" },
    basePrice: { type: ControlType.Number, title: "Base price" }, size: { type: ControlType.String, title: "Size line" },
    buttonLabel: { type: ControlType.String, title: "Button" }, link: { type: ControlType.Link, title: "Order link" },
    explodeOnScroll: { type: ControlType.Boolean, title: "Explode on scroll" }, spread: { type: ControlType.Number, min: 1, max: 3, step: 0.1 },
    ink: { type: ControlType.Color }, paper: { type: ControlType.Color }, chipActive: { type: ControlType.Color, title: "Active chip" },
})
