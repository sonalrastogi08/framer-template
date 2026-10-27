// Velvet — ZoomReveal
// A rounded "arch" frame that grows to full-screen as you scroll, while the side words slide out
// and the title fades in (GSAP ScrollTrigger timeline, sticky stage).
import { useEffect, useRef } from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import gsap from "https://esm.sh/gsap@3.13.0"
import { ScrollTrigger } from "https://esm.sh/gsap@3.13.0/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function ZoomReveal(props) {
    const { image, leftWord, rightWord, title, titleAccent, background, frameColor, inkColor, accentColor, scrollLength, font } = props
    const root = useRef<HTMLDivElement>(null)
    const isCanvas = RenderTarget.current() === RenderTarget.canvas

    useEffect(() => {
        if (isCanvas || !root.current) return
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
        const q = gsap.utils.selector(root)
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 1 } })
        tl.to(q("[data-frame]"), { width: "100vw", height: "100vh", borderRadius: 0, ease: "power2.inOut", duration: 1 }, 0)
            .to(q("[data-img]"), { scale: 1.25, y: "8vh", duration: 1 }, 0)
            .to(q("[data-left]"), { xPercent: -120, opacity: 0, duration: 0.6 }, 0)
            .to(q("[data-right]"), { xPercent: 120, opacity: 0, duration: 0.6 }, 0)
            .fromTo(q("[data-title]"), { opacity: 0, y: 60, scale: 0.9 }, { opacity: 1, y: "-22vh", scale: 1, duration: 0.5 }, 0.55)
        return () => { tl.scrollTrigger?.kill(); tl.kill() }
    }, [isCanvas])

    const side: React.CSSProperties = { position: "absolute", zIndex: 1, fontSize: "clamp(3rem, 10vw, 10rem)", lineHeight: 1, letterSpacing: "-0.04em", ...font }
    return (
        <div ref={root} style={{ position: "relative", width: "100%", height: isCanvas ? 700 : `${scrollLength}vh`, background }}>
            <div style={{ position: "sticky", top: 0, height: isCanvas ? 700 : "100vh", overflow: "hidden", display: "grid", placeItems: "center" }}>
                <span data-left style={{ ...side, left: "4vw", top: "18%", color: inkColor }}>{leftWord}</span>
                <span data-right style={{ ...side, right: "4vw", bottom: "18%", color: accentColor, fontStyle: "italic" }}>{rightWord}</span>
                <div data-frame style={{ position: "absolute", width: "34vw", height: "46vh", borderRadius: "300px 300px 32px 32px", background: frameColor, display: "grid", placeItems: "center", overflow: "hidden" }}>
                    {image?.src && <img data-img src={image.src} alt={image.alt || ""} style={{ width: "min(56vh, 520px)", height: "auto" }} />}
                </div>
                <h2 data-title style={{ position: "absolute", zIndex: 2, margin: 0, textAlign: "center", color: "#FBF4EA", fontSize: "clamp(2.6rem, 7vw, 7rem)", lineHeight: 0.98, opacity: isCanvas ? 1 : 0, ...font }}>
                    {title} <em style={{ color: "#F5D589" }}>{titleAccent}</em>
                </h2>
            </div>
        </div>
    )
}

ZoomReveal.defaultProps = { leftWord: "Our", rightWord: "signature", title: "The Midnight", titleAccent: "Ganache.", background: "#FBF4EA", frameColor: "#2B1611", inkColor: "#2B1611", accentColor: "#E8576B", scrollLength: 220 }

addPropertyControls(ZoomReveal, {
    image: { type: ControlType.ResponsiveImage, title: "Image" },
    leftWord: { type: ControlType.String, title: "Left word" },
    rightWord: { type: ControlType.String, title: "Right word" },
    title: { type: ControlType.String },
    titleAccent: { type: ControlType.String, title: "Accent" },
    font: { type: ControlType.Font, controls: "extended", defaultFontType: "serif" },
    background: { type: ControlType.Color },
    frameColor: { type: ControlType.Color, title: "Frame" },
    inkColor: { type: ControlType.Color, title: "Ink" },
    accentColor: { type: ControlType.Color, title: "Accent color" },
    scrollLength: { type: ControlType.Number, min: 150, max: 400, unit: "vh", title: "Scroll length" },
})
