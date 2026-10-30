// Velvet Crumb — HorizontalScroll (v6)
// Bestsellers shelf. On wide screens the section pins and vertical scroll moves the track sideways;
// below "Pin From" it becomes a native swipe row with snapping and a hidden scrollbar. Cards and
// the end card are canvas layers passed in through the Items slot.
import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { motion, useScroll, useTransform, useMotionValue, useReducedMotion } from "framer-motion"

interface Props {
    header?: React.ReactNode
    items: React.ReactNode[]
    gap: number
    padding: number
    maxWidth: number
    headerGap: number
    pinFrom: number
    progressColor: string
    trackColor: string
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function HorizontalScroll(props: Props) {
    const { header, items = [], gap, padding, maxWidth, headerGap, pinFrom, progressColor, trackColor, style } = props
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const reduce = useReducedMotion()
    const outerRef = React.useRef<HTMLDivElement>(null)
    const viewRef = React.useRef<HTMLDivElement>(null)
    const trackRef = React.useRef<HTMLDivElement>(null)
    const [dist, setDist] = React.useState(0)
    const [side, setSide] = React.useState(padding)
    const [pin, setPin] = React.useState(false)
    const nativeProgress = useMotionValue(0)

    React.useEffect(() => {
        if (isCanvas) return
        const measure = () => {
            const view = viewRef.current
            const track = trackRef.current
            if (!view || !track) return
            const w = view.clientWidth
            setSide(Math.max(padding, (w - maxWidth) / 2 + padding))
            setDist(Math.max(0, track.scrollWidth - w))
            setPin(window.innerWidth >= pinFrom && !reduce)
        }
        measure()
        const ro = new ResizeObserver(measure)
        if (trackRef.current) ro.observe(trackRef.current)
        if (viewRef.current) ro.observe(viewRef.current)
        window.addEventListener("resize", measure)
        return () => {
            ro.disconnect()
            window.removeEventListener("resize", measure)
        }
    }, [isCanvas, padding, maxWidth, pinFrom, reduce, items.length])

    const { scrollYProgress } = useScroll({ target: outerRef, offset: ["start start", "end end"] })
    const x = useTransform(scrollYProgress, (v) => -v * dist)
    const active = pin && !isCanvas

    const onNativeScroll = () => {
        const view = viewRef.current
        if (!view) return
        const max = view.scrollWidth - view.clientWidth
        nativeProgress.set(max > 0 ? view.scrollLeft / max : 0)
    }

    return (
        <div ref={outerRef} style={{ ...style, position: "relative", height: active ? `calc(100vh + ${dist}px)` : "auto" }}>
            <div
                style={{
                    position: active ? "sticky" : "relative",
                    top: 0,
                    minHeight: active ? "100vh" : undefined,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: headerGap,
                    padding: "56px 0 40px",
                    boxSizing: "border-box",
                    overflow: "hidden",
                }}
            >
                {header ? (
                    <div style={{ padding: `0 ${side}px` }}>
                        {React.isValidElement(header)
                            ? React.cloneElement(header as React.ReactElement<any>, { style: { ...((header as any).props?.style || {}), width: "100%" } })
                            : header}
                    </div>
                ) : null}
                <div
                    ref={viewRef}
                    onScroll={active ? undefined : onNativeScroll}
                    className="hscroll-view"
                    style={{
                        overflowX: active || isCanvas ? "hidden" : "auto",
                        overflowY: "hidden",
                        scrollSnapType: active ? undefined : "x mandatory",
                        scrollPaddingLeft: side,
                        scrollbarWidth: "none",
                        WebkitOverflowScrolling: "touch",
                    }}
                >
                    <style>{".hscroll-view::-webkit-scrollbar{display:none}"}</style>
                    <motion.div ref={trackRef} style={{ display: "flex", alignItems: "stretch", gap, padding: `8px ${side}px 16px`, width: "max-content", x: active ? x : 0 }}>
                        {items.map((item, i) => (
                            <div key={i} style={{ flex: "none", scrollSnapAlign: "start", display: "flex" }}>
                                {item}
                            </div>
                        ))}
                    </motion.div>
                </div>
                <div aria-hidden="true" style={{ width: "min(180px, 40vw)", height: 4, borderRadius: 4, margin: "0 auto", background: trackColor, overflow: "hidden" }}>
                    <motion.div style={{ height: "100%", background: progressColor, transformOrigin: "0% 50%", scaleX: active ? scrollYProgress : nativeProgress }} />
                </div>
            </div>
        </div>
    )
}

HorizontalScroll.defaultProps = { items: [], gap: 20, padding: 56, maxWidth: 1320, headerGap: 40, pinFrom: 700, progressColor: "#E8576B", trackColor: "rgba(43,22,17,0.12)" }

addPropertyControls(HorizontalScroll, {
    header: { type: ControlType.ComponentInstance, title: "Header" },
    items: { type: ControlType.Array, title: "Items", control: { type: ControlType.ComponentInstance } },
    gap: { type: ControlType.Number, title: "Gap", defaultValue: 20, min: 0, max: 80, unit: "px" },
    padding: { type: ControlType.Number, title: "Side Padding", defaultValue: 56, min: 0, max: 120, unit: "px" },
    maxWidth: { type: ControlType.Number, title: "Max Width", defaultValue: 1320, min: 600, max: 2000, unit: "px" },
    headerGap: { type: ControlType.Number, title: "Header Gap", defaultValue: 40, min: 0, max: 120, unit: "px" },
    pinFrom: { type: ControlType.Number, title: "Pin From", defaultValue: 700, min: 0, max: 1600, unit: "px", description: "Viewport width where pinning starts" },
    progressColor: { type: ControlType.Color, title: "Progress", defaultValue: "#E8576B" },
    trackColor: { type: ControlType.Color, title: "Progress Track", defaultValue: "rgba(43,22,17,0.12)" },
})
