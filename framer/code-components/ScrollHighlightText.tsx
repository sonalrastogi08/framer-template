// Velvet — ScrollHighlightText
// Statement paragraph whose words fade from faint to full ink as it scrolls through the viewport.
import { useEffect, useRef } from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import gsap from "https://esm.sh/gsap@3.13.0"
import { ScrollTrigger } from "https://esm.sh/gsap@3.13.0/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function ScrollHighlightText(props) {
    const { text, font, color, startOpacity, start, end } = props
    const ref = useRef<HTMLParagraphElement>(null)
    const isCanvas = RenderTarget.current() === RenderTarget.canvas

    useEffect(() => {
        if (isCanvas || !ref.current) return
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
        const words = ref.current.querySelectorAll("span")
        const t = gsap.fromTo(words, { opacity: startOpacity }, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: ref.current, start: `top ${start}%`, end: `bottom ${end}%`, scrub: true } })
        return () => { t.scrollTrigger?.kill(); t.kill() }
    }, [isCanvas, text, startOpacity, start, end])

    return (
        <p ref={ref} style={{ margin: 0, color, ...font }}>
            {text.split(/\s+/).map((w, i) => (
                <span key={i} style={{ opacity: isCanvas ? 1 : startOpacity }}>{w} </span>
            ))}
        </p>
    )
}

ScrollHighlightText.defaultProps = {
    text: "We bake small-batch cakes for birthdays, weddings and every just-because in between — with real butter, seasonal fruit and absolutely no shortcuts.",
    color: "#2B1611", startOpacity: 0.14, start: 80, end: 45,
}

addPropertyControls(ScrollHighlightText, {
    text: { type: ControlType.String, displayTextArea: true },
    font: { type: ControlType.Font, controls: "extended", defaultFontType: "serif", defaultValue: { fontSize: 56, lineHeight: "1.12em", letterSpacing: "-0.02em" } },
    color: { type: ControlType.Color },
    startOpacity: { type: ControlType.Number, min: 0, max: 1, step: 0.01, title: "Start opacity" },
    start: { type: ControlType.Number, min: 0, max: 100, unit: "%", title: "Start at" },
    end: { type: ControlType.Number, min: 0, max: 100, unit: "%", title: "End at" },
})
