// Cerise — CursorPreviewList
// A typographic menu ("la carte"). Hovering a row shows the dish in an arched frame that trails
// the cursor and tilts with its speed. On touch screens each row shows a small thumbnail instead.
import { useRef, useState } from "react"
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

type Item = { name: string; notes: string; tag: string; price: string; image: { src: string; alt?: string }; link: string; soldOut: boolean }

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function CursorPreviewList(props) {
    const { items, nameFont, ink, mute, gold, line, frameBg } = props as { items: Item[]; nameFont: any; ink: string; mute: string; gold: string; line: string; frameBg: string }
    const [active, setActive] = useState<number | null>(null)
    const x = useMotionValue(0), y = useMotionValue(0), r = useMotionValue(0)
    const sx = useSpring(x, { stiffness: 150, damping: 20 }), sy = useSpring(y, { stiffness: 150, damping: 20 }), sr = useSpring(r, { stiffness: 120, damping: 14 })
    const last = useRef(0)
    const touch = typeof window !== "undefined" && window.matchMedia("(hover: none)").matches
    const roman = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi", "xii"]

    return (
        <div style={{ position: "relative", width: "100%", borderTop: `1px solid ${line}`, fontFamily: "Jost, sans-serif", color: ink }}
            onPointerMove={(e) => { x.set(e.clientX - 150); y.set(e.clientY - 180); r.set(Math.max(-12, Math.min(12, (e.clientX - last.current) * 0.6))); last.current = e.clientX }}
            onPointerLeave={() => setActive(null)}>
            {items.map((it, i) => (
                <motion.a key={i} href={it.link || undefined} onPointerEnter={() => setActive(i)} whileHover={{ paddingLeft: 18 }}
                    style={{ display: "grid", gridTemplateColumns: touch ? "56px 1fr auto" : "60px 1.4fr 1fr auto 100px", gap: 24, alignItems: "center", padding: "24px 0", borderBottom: `1px solid ${line}`, textDecoration: "none", color: "inherit" }}>
                    {touch ? <img src={it.image?.src} alt="" style={{ width: 56 }} /> : <span style={{ fontStyle: "italic", color: gold, ...nameFont, fontSize: 18 }}>{roman[i] || i + 1}.</span>}
                    <span style={{ fontSize: "clamp(1.8rem, 3.4vw, 3.2rem)", lineHeight: 1, letterSpacing: "-0.03em", fontStyle: active === i ? "italic" : "normal", textDecoration: it.soldOut ? "line-through" : "none", color: it.soldOut ? mute : ink, ...nameFont }}>{it.name}</span>
                    {!touch && <span style={{ color: mute, fontSize: 14 }}>{it.notes}</span>}
                    {!touch && <span style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", border: `1px solid ${line}`, borderRadius: 999, padding: "4px 12px", justifySelf: "end" }}>{it.soldOut ? "Sold out" : it.tag}</span>}
                    <span style={{ fontStyle: "italic", fontSize: 24, textAlign: "right", ...nameFont }}>{it.price}</span>
                </motion.a>
            ))}
            {!touch && (
                <AnimatePresence>
                    {active !== null && (
                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                            style={{ position: "fixed", left: 0, top: 0, x: sx, y: sy, rotate: sr, width: 300, height: 360, pointerEvents: "none", zIndex: 50, borderRadius: "160px 160px 8px 8px", overflow: "hidden", display: "grid", placeItems: "center", background: frameBg, border: `1px solid ${line}` }}>
                            <motion.img key={active} src={items[active]?.image?.src} alt="" initial={{ scale: 0.6, rotate: -15 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18 }} style={{ width: "88%" }} />
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    )
}

CursorPreviewList.defaultProps = {
    items: [
        { name: "Cerise Noire", notes: "Morello · vanilla · almond", tag: "Signature", price: "$72", link: "", soldOut: false },
        { name: "Minuit", notes: "70% cocoa · salted caramel", tag: "GF option", price: "$68", link: "", soldOut: false },
        { name: "Rose Litchi", notes: "Rose · lychee · raspberry", tag: "", price: "$70", link: "", soldOut: true },
    ],
    ink: "#F4E9E1", mute: "#B39A93", gold: "#D8B46A", line: "rgba(216,180,106,.28)", frameBg: "radial-gradient(circle at 50% 40%, #2A171B, #140A0C 75%)",
}

addPropertyControls(CursorPreviewList, {
    items: { type: ControlType.Array, title: "Rows", control: { type: ControlType.Object, controls: {
        name: { type: ControlType.String }, notes: { type: ControlType.String }, tag: { type: ControlType.String }, price: { type: ControlType.String },
        image: { type: ControlType.ResponsiveImage }, link: { type: ControlType.Link }, soldOut: { type: ControlType.Boolean, title: "Sold out" } } } },
    nameFont: { type: ControlType.Font, controls: "extended", defaultFontType: "serif", title: "Name font" },
    ink: { type: ControlType.Color }, mute: { type: ControlType.Color }, gold: { type: ControlType.Color }, line: { type: ControlType.Color },
})
