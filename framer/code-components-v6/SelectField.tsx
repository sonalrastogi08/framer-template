// Velvet Crumb — SelectField (v6)
// A dropdown for Framer forms with a light placeholder and a dark selected value.
// Uses a real <select name=...>, so the enclosing Framer form submits the chosen value.
import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

interface Option {
    label: string
}
interface Props {
    name: string
    placeholder: string
    options: Option[]
    required: boolean
    fieldHeight: number
    radius: number
    ink: string
    placeholderColor: string
    fill: string
    border: string
    borderFocus: string
    font: React.CSSProperties
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function SelectField(props: Props) {
    const { name, placeholder, options = [], required, fieldHeight, radius, ink, placeholderColor, fill, border, borderFocus, font, style } = props
    const [value, setValue] = React.useState("")
    const [focus, setFocus] = React.useState(false)
    const empty = value === ""
    return (
        <div style={{ ...style, position: "relative", width: "100%" }}>
            <select
                name={name}
                value={value}
                required={required}
                onChange={(e) => setValue(e.target.value)}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                style={{
                    ...font,
                    width: "100%",
                    height: fieldHeight,
                    boxSizing: "border-box",
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    padding: "0 44px 0 16px",
                    borderRadius: radius,
                    border: `1px solid ${focus ? borderFocus : border}`,
                    background: fill,
                    color: empty ? placeholderColor : ink,
                    outline: "none",
                    cursor: "pointer",
                    transition: "border-color .2s",
                }}
            >
                <option value="" style={{ color: placeholderColor }}>
                    {placeholder}
                </option>
                {options.map((o, i) => (
                    <option key={i} value={o.label} style={{ color: ink }}>
                        {o.label}
                    </option>
                ))}
            </select>
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={ink} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <path d="M3 5.5 7 9.5l4-4" />
            </svg>
        </div>
    )
}

SelectField.defaultProps = {
    name: "choice",
    placeholder: "Choose…",
    options: [{ label: "Option 1" }, { label: "Option 2" }],
    required: false,
    fieldHeight: 52,
    radius: 16,
    ink: "#2B1611",
    placeholderColor: "rgba(122,97,88,0.55)",
    fill: "#FBF4EA",
    border: "rgba(43,22,17,0.14)",
    borderFocus: "#2B1611",
}

addPropertyControls(SelectField, {
    name: { type: ControlType.String, title: "Field name" },
    placeholder: { type: ControlType.String, title: "Placeholder" },
    options: { type: ControlType.Array, title: "Options", control: { type: ControlType.Object, controls: { label: { type: ControlType.String, title: "Label" } } } },
    required: { type: ControlType.Boolean, title: "Required" },
    font: { type: ControlType.Font, title: "Font", controls: "extended", defaultFontType: "sans-serif", defaultValue: { fontSize: 15 } },
    fieldHeight: { type: ControlType.Number, title: "Field height", min: 36, max: 80, unit: "px" },
    radius: { type: ControlType.Number, title: "Radius", min: 0, max: 40, unit: "px" },
    ink: { type: ControlType.Color, title: "Selected text" },
    placeholderColor: { type: ControlType.Color, title: "Placeholder" },
    fill: { type: ControlType.Color, title: "Fill" },
    border: { type: ControlType.Color, title: "Border" },
    borderFocus: { type: ControlType.Color, title: "Border focus" },
})
