// Velvet — VelocityMarquee
// Infinite ticker that speeds up, reverses and skews with scroll velocity (GSAP ticker + ScrollTrigger).
import { useEffect, useRef } from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import gsap from "https://esm.sh/gsap@3.13.0"
import { ScrollTrigger } from "https://esm.sh/gsap@3.13.0/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function VelocityMarquee(props) {
    const { content, speed, gap, skew, background, rotation, paddingY } = props
    const wrap = useRef<HTMLDivElement>(null)
    const track = useRef<HTMLDivElement>(null)
    const isCanvas = RenderTarget.current() === RenderTarget.canvas

    useEffect(() => {
        if (isCanvas || !track.current) return
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
        let x = 0, dir = -1, boost = 0
        const half = () => track.current!.scrollWidth / 2
        const tick = (_t: number, dt: number) => {
            x += dir * (speed / 1000 + boost) * dt
            if (x <= -half()) x += half()
            if (x > 0) x -= half()
            gsap.set(track.current, { x })
            boost *= 0.92
        }
        gsap.ticker.add(tick)
        const st = ScrollTrigger.create({
            trigger: wrap.current, start: "top bottom", end: "bottom top",
            onUpdate: (s) => {
                dir = s.direction === 1 ? -1 : 1
                boost = Math.min(Math.abs(s.getVelocity()) / 4000, 0.8)
                if (skew) gsap.to(track.current, { skewX: -s.getVelocity() / 400, duration: 0.4, overwrite: true, onComplete: () => gsap.to(track.current, { skewX: 0, duration: 0.6 }) })
            },
        })
        return () => { gsap.ticker.remove(tick); st.kill() }
    }, [isCanvas, speed, skew])

    return (
        <div ref={wrap} style={{ width: "100%", overflow: "hidden", background, paddingBlock: paddingY, transform: `rotate(${rotation}deg)` }}>
            <div ref={track} style={{ display: "flex", gap, width: "max-content", alignItems: "center" }}>
                <div style={{ display: "flex", gap, alignItems: "center" }}>{content}</div>
                <div aria-hidden style={{ display: "flex", gap, alignItems: "center" }}>{content}</div>
            </div>
        </div>
    )
}

VelocityMarquee.defaultProps = { speed: 60, gap: 48, skew: true, background: "#E8576B", rotation: -2, paddingY: 22 }

addPropertyControls(VelocityMarquee, {
    content: { type: ControlType.ComponentInstance, title: "Content" },
    speed: { type: ControlType.Number, min: 0, max: 300, title: "Speed (px/s)" },
    gap: { type: ControlType.Number, min: 0, max: 200 },
    skew: { type: ControlType.Boolean, title: "Skew on scroll" },
    background: { type: ControlType.Color },
    rotation: { type: ControlType.Number, min: -10, max: 10, step: 0.5, unit: "°" },
    paddingY: { type: ControlType.Number, min: 0, max: 80, title: "Padding Y" },
})
