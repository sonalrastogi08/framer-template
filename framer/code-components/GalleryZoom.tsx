// Velvet — GalleryZoom
// Starts zoomed into the centre tile, then zooms out to reveal the whole grid as you scroll,
// with tiles staggering in from the centre and a label (e.g. @handle) appearing on top.
import { useEffect, useRef } from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import gsap from "https://esm.sh/gsap@3.13.0"
import { ScrollTrigger } from "https://esm.sh/gsap@3.13.0/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function GalleryZoom(props) {
    const { images, tileColors, label, sublabel, font, radius, scrollLength } = props
    const root = useRef<HTMLDivElement>(null)
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const tiles = Array.from({ length: 15 }, (_, i) => images?.[i % Math.max(images?.length || 1, 1)])

    useEffect(() => {
        if (isCanvas || !root.current) return
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
        const q = gsap.utils.selector(root)
        const grid = q("[data-grid]")[0] as HTMLElement
        const center = q("[data-center]")[0] as HTMLElement
        const scaleUp = () => Math.max(window.innerWidth / center.offsetWidth, window.innerHeight / center.offsetHeight) * 1.05
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 1, invalidateOnRefresh: true } })
        tl.fromTo(grid, { scale: scaleUp }, { scale: 1, ease: "power2.inOut", duration: 1 })
            .from(q("[data-tile]"), { opacity: 0, scale: 0.6, stagger: { each: 0.02, from: "center" }, duration: 0.5 }, 0.2)
            .to(q("[data-label]"), { opacity: 1, duration: 0.3 }, 0.75)
        return () => { tl.scrollTrigger?.kill(); tl.kill() }
    }, [isCanvas])

    return (
        <div ref={root} style={{ position: "relative", width: "100%", height: isCanvas ? 800 : `${scrollLength}vh` }}>
            <div style={{ position: "sticky", top: 0, height: isCanvas ? 800 : "100vh", overflow: "hidden", display: "grid", placeItems: "center" }}>
                <div data-grid style={{ display: "grid", gridTemplateColumns: "repeat(5, 18vw)", gridTemplateRows: "repeat(3, 26vh)", gap: "1.4vw" }}>
                    {tiles.map((img, i) => (
                        <div key={i} {...(i === 7 ? { "data-center": true } : { "data-tile": true })} style={{ borderRadius: radius, overflow: "hidden", background: tileColors?.[i % (tileColors?.length || 1)] || "#F3E7D6", display: "grid", placeItems: "center", gridColumn: i === 7 ? 3 : undefined, gridRow: i === 7 ? 2 : undefined }}>
                            {img?.src && <img src={img.src} alt={img.alt || ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                        </div>
                    ))}
                </div>
                <div data-label style={{ position: "absolute", zIndex: 2, textAlign: "center", background: "#FBF4EA", padding: "28px 40px 32px", borderRadius: 28, opacity: isCanvas ? 1 : 0 }}>
                    <div style={{ fontFamily: "Caveat, cursive", fontSize: 30, color: "#E8576B" }}>{sublabel}</div>
                    <div style={{ fontSize: "clamp(2.4rem, 6vw, 6rem)", lineHeight: 1, color: "#2B1611", ...font }}>{label}</div>
                </div>
            </div>
        </div>
    )
}

GalleryZoom.defaultProps = { label: "@velvetcrumb", sublabel: "follow along", radius: 20, scrollLength: 260, tileColors: ["#F8D7DA", "#E4EBCB", "#F5D589", "#EAD9CF", "#E7E0F0"] }

addPropertyControls(GalleryZoom, {
    images: { type: ControlType.Array, control: { type: ControlType.ResponsiveImage }, maxCount: 15, title: "Images" },
    tileColors: { type: ControlType.Array, control: { type: ControlType.Color }, title: "Tile colors" },
    label: { type: ControlType.String },
    sublabel: { type: ControlType.String, title: "Script line" },
    font: { type: ControlType.Font, controls: "extended", defaultFontType: "serif" },
    radius: { type: ControlType.Number, min: 0, max: 60 },
    scrollLength: { type: ControlType.Number, min: 150, max: 400, unit: "vh", title: "Scroll length" },
})
