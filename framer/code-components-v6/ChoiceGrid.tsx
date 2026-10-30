// Velvet Crumb — ChoiceGrid (v6)
// Selectable cards for forms (single choice = radio, multiple = checkbox). Uses real <input>
// elements with a name, so a Framer form that contains it submits the chosen values.
import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

interface Option {
    label: string
    hint: string
}
interface Props {
    name: string
    mode: "single" | "multiple"
    options: Option[]
    minCard: number
    gap: number
    ink: string
    muted: string
    card: string
    cardOn: string
    borderOff: string
    borderOn: string
    accent: string
    labelFont: React.CSSProperties
    hintFont: React.CSSProperties
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function ChoiceGrid(props: Props) {
    const { name, mode, options = [], minCard, gap, ink, muted, card, cardOn, borderOff, borderOn, accent, labelFont, hintFont, style } = props
    const [picked, setPicked] = React.useState<string[]>([])
    const [focus, setFocus] = React.useState<string | null>(null)
    const single = mode === "single"

    const toggle = (v: string) => {
        setPicked((p) => (single ? [v] : p.includes(v) ? p.filter((x) => x !== v) : [...p, v]))
    }

    return (
        <div role={single ? "radiogroup" : "group"} style={{ ...style, display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${minCard}px, 1fr))`, gap, color: ink }}>
            {options.map((o, i) => {
                const on = picked.includes(o.label)
                return (
                    <label
                        key={i}
                        style={{
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: "16px 18px",
                            borderRadius: 16,
                            border: `1px solid ${on ? borderOn : borderOff}`,
                            background: on ? cardOn : card,
                            boxShadow: focus === o.label ? `0 0 0 2px ${accent}55` : "none",
                            cursor: "pointer",
                            userSelect: "none",
                            transition: "background .2s, border-color .2s, box-shadow .2s",
                        }}
                    >
                        <input
                            type={single ? "radio" : "checkbox"}
                            name={name}
                            value={o.label}
                            checked={on}
                            onChange={() => toggle(o.label)}
                            onFocus={() => setFocus(o.label)}
                            onBlur={() => setFocus(null)}
                            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", margin: 0, opacity: 0, cursor: "pointer" }}
                        />
                        <span
                            aria-hidden="true"
                            style={{
                                flex: "none",
                                width: 20,
                                height: 20,
                                borderRadius: single ? "50%" : 6,
                                border: `1.5px solid ${on ? borderOn : "rgba(43,22,17,0.35)"}`,
                                background: on ? borderOn : "transparent",
                                display: "grid",
                                placeItems: "center",
                                transition: "background .2s, border-color .2s",
                            }}
                        >
                            {on ? (
                                single ? (
                                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: card }} />
                                ) : (
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke={card} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M2.5 6.5 5 9l4.5-5.5" />
                                    </svg>
                                )
                            ) : null}
                        </span>
                        <span style={{ display: "grid", gap: 2, minWidth: 0 }}>
                            <span style={{ ...labelFont, color: ink }}>{o.label}</span>
                            {o.hint ? <span style={{ ...hintFont, color: muted }}>{o.hint}</span> : null}
                        </span>
                    </label>
                )
            })}
        </div>
    )
}

const op = (label: string, hint = ""): Option => ({ label, hint })

ChoiceGrid.defaultProps = {
    name: "choice",
    mode: "single",
    options: [op("Wedding", "Tiered, from 50 servings"), op("Birthday", "Any age, any size"), op("Anniversary", "Engagements too")],
    minCard: 220,
    gap: 12,
    ink: "#2B1611",
    muted: "#7A6158",
    card: "#FBF4EA",
    cardOn: "#E4EBCB",
    borderOff: "rgba(43,22,17,0.14)",
    borderOn: "#2B1611",
    accent: "#E8576B",
}

addPropertyControls(ChoiceGrid, {
    name: { type: ControlType.String, title: "Field name" },
    mode: { type: ControlType.Enum, title: "Choice", options: ["single", "multiple"], optionTitles: ["One (radio)", "Many (checkbox)"], displaySegmentedControl: true },
    options: { type: ControlType.Array, title: "Options", control: { type: ControlType.Object, controls: { label: { type: ControlType.String, title: "Label" }, hint: { type: ControlType.String, title: "Hint" } } } },
    minCard: { type: ControlType.Number, title: "Min card", min: 140, max: 400, unit: "px" },
    gap: { type: ControlType.Number, title: "Gap", min: 0, max: 40, unit: "px" },
    labelFont: { type: ControlType.Font, title: "Label Font", controls: "extended", defaultFontType: "sans-serif", defaultValue: { fontSize: 14 } },
    hintFont: { type: ControlType.Font, title: "Hint Font", controls: "extended", defaultFontType: "sans-serif", defaultValue: { fontSize: 13 } },
    ink: { type: ControlType.Color, title: "Ink" },
    muted: { type: ControlType.Color, title: "Muted" },
    card: { type: ControlType.Color, title: "Card" },
    cardOn: { type: ControlType.Color, title: "Card selected" },
    borderOff: { type: ControlType.Color, title: "Border" },
    borderOn: { type: ControlType.Color, title: "Border selected" },
    accent: { type: ControlType.Color, title: "Focus" },
})
