// Velvet Crumb — FlavourPreviewList (v6)
// A typographic flavour menu. Hovering a row shows that cake in an arched frame that trails the
// cursor and tilts with its speed. On touch screens each row shows a small thumbnail instead.
import * as React from "react"
import { motion, useMotionValue, useSpring, AnimatePresence, useReducedMotion } from "framer-motion"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

interface Item {
    name: string
    notes: string
    tag: string
    price: string
    tint: string
    image?: { src?: string; alt?: string } | string
    link: string
    soldOut: boolean
}
interface Props {
    items: Item[]
    nameFont: React.CSSProperties
    bodyFont: React.CSSProperties
    ink: string
    muted: string
    accent: string
    line: string
    frameWidth: number
    style?: React.CSSProperties
}

const srcOf = (img?: Item["image"]) => (typeof img === "string" ? img : img?.src)
const roman = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi", "xii"]

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function FlavourPreviewList(props: Props) {
    const { items = [], nameFont, bodyFont, ink, muted, accent, line, frameWidth, style } = props
    const [active, setActive] = React.useState<number | null>(null)
    const [touchDevice, setTouchDevice] = React.useState(false)
    const [narrow, setNarrow] = React.useState(false)
    const touch = touchDevice || narrow
    const root = React.useRef<HTMLDivElement>(null)
    const reduce = useReducedMotion()
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const r = useMotionValue(0)
    const sx = useSpring(x, { stiffness: 150, damping: 20 })
    const sy = useSpring(y, { stiffness: 150, damping: 20 })
    const sr = useSpring(r, { stiffness: 120, damping: 14 })
    const lastX = React.useRef(0)
    const frameH = frameWidth * 1.2

    React.useEffect(() => {
        setTouchDevice(window.matchMedia("(hover: none)").matches)
        const el = root.current
        if (!el) return
        const ro = new ResizeObserver(([e]) => setNarrow(e.contentRect.width < 720))
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    const onMove = (e: React.PointerEvent) => {
        const b = root.current?.getBoundingClientRect()
        if (!b) return
        x.set(e.clientX - b.left - frameWidth / 2)
        y.set(e.clientY - b.top - frameH / 2)
        r.set(Math.max(-12, Math.min(12, (e.clientX - lastX.current) * 0.6)))
        lastX.current = e.clientX
    }

    const showFrame = !touch && !isCanvas && active !== null
    const cur = active !== null ? items[active] : undefined

    return (
        <div
            ref={root}
            onPointerMove={touch ? undefined : onMove}
            onPointerLeave={() => setActive(null)}
            style={{ ...style, position: "relative", borderTop: `1px solid ${line}`, color: ink, ...bodyFont }}
        >
            {items.map((it, i) => {
                const Row: any = it.link ? motion.a : motion.div
                return (
                    <Row
                        key={i}
                        href={it.link || undefined}
                        onPointerEnter={() => setActive(i)}
                        onFocus={() => setActive(i)}
                        onBlur={() => setActive(null)}
                        tabIndex={0}
                        whileHover={reduce ? undefined : { paddingLeft: 18 }}
                        style={{
                            display: "grid",
                            gridTemplateColumns: touch ? "56px 1fr auto" : "56px 1.4fr 1.2fr auto 90px",
                            gap: touch ? 16 : 24,
                            alignItems: "center",
                            padding: "24px 0",
                            borderBottom: `1px solid ${line}`,
                            textDecoration: "none",
                            color: "inherit",
                            cursor: it.link ? "pointer" : "default",
                            outline: "none",
                        }}
                    >
                        {touch ? (
                            <span style={{ width: 56, height: 56, borderRadius: 14, background: it.tint, display: "grid", placeItems: "center", overflow: "hidden" }}>
                                {srcOf(it.image) ? <img src={srcOf(it.image)} alt="" style={{ width: "86%" }} /> : null}
                            </span>
                        ) : (
                            <span style={{ fontStyle: "italic", color: accent, ...nameFont, fontSize: 20 }}>{roman[i] || i + 1}.</span>
                        )}
                        <span
                            style={{
                                ...nameFont,
                                fontSize: "clamp(1.8rem, 3.4vw, 3.2rem)",
                                lineHeight: 1,
                                letterSpacing: "-0.03em",
                                fontStyle: active === i ? "italic" : "normal",
                                textDecoration: it.soldOut ? "line-through" : "none",
                                color: it.soldOut ? muted : ink,
                                transition: "color .3s",
                            }}
                        >
                            {it.name}
                        </span>
                        {!touch && <span style={{ color: muted, fontSize: 14 }}>{it.notes}</span>}
                        {!touch && (
                            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", border: `1px solid ${line}`, borderRadius: 999, padding: "5px 12px", justifySelf: "end", whiteSpace: "nowrap", visibility: it.soldOut || it.tag ? "visible" : "hidden" }}>
                                {it.soldOut ? "Sold out" : it.tag || "-"}
                            </span>
                        )}
                        <span style={{ ...nameFont, fontStyle: "italic", fontSize: 24, textAlign: "right" }}>{it.price}</span>
                    </Row>
                )
            })}
            {!touch && (
                <AnimatePresence>
                    {showFrame && cur && (
                        <motion.div
                            key="frame"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.25 }}
                            aria-hidden="true"
                            style={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                x: sx,
                                y: sy,
                                rotate: reduce ? 0 : sr,
                                width: frameWidth,
                                height: frameH,
                                pointerEvents: "none",
                                zIndex: 5,
                                borderRadius: `${frameWidth / 2}px ${frameWidth / 2}px 24px 24px`,
                                overflow: "hidden",
                                display: "grid",
                                placeItems: "center",
                                background: cur.tint,
                                boxShadow: "0 30px 60px -30px rgba(43,22,17,0.45)",
                            }}
                        >
                            {srcOf(cur.image) ? (
                                <motion.img
                                    key={active}
                                    src={srcOf(cur.image)}
                                    alt=""
                                    initial={reduce ? false : { scale: 0.6, rotate: -15 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 18 }}
                                    style={{ width: "88%" }}
                                />
                            ) : null}
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    )
}

const row = (name: string, notes: string, tag: string, price: string, tint: string, soldOut = false): Item => ({ name, notes, tag, price, tint, link: "", soldOut })

FlavourPreviewList.defaultProps = {
    items: [
        row("Pistachio Rose", "Pistachio · rose · strawberry", "Signature", "$58", "#E4EBCB"),
        row("Midnight Ganache", "70% cocoa · caramel · nibs", "Bestseller", "$54", "#EAD9CF"),
        row("Raspberry Silk", "Raspberry · white chocolate · cream", "", "$56", "#F8D7DA"),
        row("Strawberry Shortcake", "Strawberry · cream · sponge", "Fresh today", "$48", "#FFF0D6"),
        row("Classic Red Velvet", "Cocoa · buttermilk · cream cheese", "", "$52", "#F3DCDC", true),
    ],
    ink: "#2B1611",
    muted: "#7A6158",
    accent: "#E8576B",
    line: "rgba(43,22,17,0.14)",
    frameWidth: 280,
}

addPropertyControls(FlavourPreviewList, {
    items: {
        type: ControlType.Array,
        title: "Rows",
        control: {
            type: ControlType.Object,
            controls: {
                name: { type: ControlType.String, title: "Name" },
                notes: { type: ControlType.String, title: "Notes" },
                tag: { type: ControlType.String, title: "Tag" },
                price: { type: ControlType.String, title: "Price" },
                tint: { type: ControlType.Color, title: "Frame colour" },
                image: { type: ControlType.ResponsiveImage, title: "Image" },
                link: { type: ControlType.Link, title: "Link" },
                soldOut: { type: ControlType.Boolean, title: "Sold out" },
            },
        },
    },
    nameFont: { type: ControlType.Font, title: "Name Font", controls: "extended", defaultFontType: "serif", defaultValue: { fontSize: 48 } },
    bodyFont: { type: ControlType.Font, title: "Body Font", controls: "extended", defaultFontType: "sans-serif", defaultValue: { fontSize: 16 } },
    frameWidth: { type: ControlType.Number, title: "Frame Width", min: 180, max: 420, unit: "px" },
    ink: { type: ControlType.Color, title: "Ink" },
    muted: { type: ControlType.Color, title: "Muted" },
    accent: { type: ControlType.Color, title: "Accent" },
    line: { type: ControlType.Color, title: "Line" },
})
