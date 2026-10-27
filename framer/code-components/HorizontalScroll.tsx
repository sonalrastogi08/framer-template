// Velvet — HorizontalScroll
// Pinned section whose children scroll sideways as the page scrolls (GSAP ScrollTrigger).
// Usage: drop on a page, connect a horizontal Stack (your cards) to the "content" slot.
import { useEffect, useRef } from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import gsap from "https://esm.sh/gsap@3.13.0"
import { ScrollTrigger } from "https://esm.sh/gsap@3.13.0/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function HorizontalScroll(props) {
    const { content, gap, padding, scrub, showProgress, progressColor, trackColor, mobileBreakpoint } = props
    const section = useRef<HTMLDivElement>(null)
    const track = useRef<HTMLDivElement>(null)
    const bar = useRef<HTMLDivElement>(null)
    const isCanvas = RenderTarget.current() === RenderTarget.canvas

    useEffect(() => {
        if (isCanvas || !section.current || !track.current) return
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
        const mm = gsap.matchMedia()
        mm.add(`(min-width: ${mobileBreakpoint}px)`, () => {
            const dist = () => track.current!.scrollWidth - section.current!.offsetWidth
            const tween = gsap.to(track.current, {
                x: () => -dist(),
                ease: "none",
                scrollTrigger: {
                    trigger: section.current,
                    start: "top top",
                    end: () => "+=" + dist(),
                    pin: true,
                    scrub,
                    invalidateOnRefresh: true,
                    onUpdate: (s) => bar.current && gsap.set(bar.current, { scaleX: s.progress }),
                },
            })
            Array.from(track.current!.children[0]?.children ?? []).forEach((card) =>
                gsap.from(card, {
                    y: 80, rotate: 4, opacity: 0.2, ease: "none",
                    scrollTrigger: { trigger: card, containerAnimation: tween, start: "left 100%", end: "left 60%", scrub: true },
                })
            )
        })
        return () => mm.revert()
    }, [isCanvas, scrub, mobileBreakpoint])

    return (
        <div ref={section} style={{ width: "100%", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", minHeight: isCanvas ? undefined : "100vh", gap }}>
            <div ref={track} style={{ display: "flex", gap, paddingInline: padding, width: "max-content", overflowX: isCanvas ? "auto" : undefined }}>
                {content}
            </div>
            {showProgress && (
                <div style={{ height: 2, marginInline: padding, background: trackColor, position: "relative" }}>
                    <div ref={bar} style={{ position: "absolute", inset: 0, background: progressColor, transformOrigin: "left", transform: "scaleX(0)" }} />
                </div>
            )}
        </div>
    )
}

HorizontalScroll.defaultProps = { gap: 24, padding: 48, scrub: 1, showProgress: true, progressColor: "#2B1611", trackColor: "rgba(43,22,17,0.14)", mobileBreakpoint: 861 }

addPropertyControls(HorizontalScroll, {
    content: { type: ControlType.ComponentInstance, title: "Content" },
    gap: { type: ControlType.Number, min: 0, max: 120 },
    padding: { type: ControlType.Number, min: 0, max: 200, title: "Side padding" },
    scrub: { type: ControlType.Number, min: 0, max: 3, step: 0.1, title: "Smoothing" },
    showProgress: { type: ControlType.Boolean, title: "Progress bar" },
    progressColor: { type: ControlType.Color, title: "Bar color", hidden: (p) => !p.showProgress },
    trackColor: { type: ControlType.Color, title: "Track color", hidden: (p) => !p.showProgress },
    mobileBreakpoint: { type: ControlType.Number, title: "Disable below", unit: "px" },
})
