import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "danger";
type Size = "sm" | "md";

const VAR: Record<Variant, React.CSSProperties> = {
  primary: { background: "#0b6", color: "#fff", border: "1px solid #0b6" },
  ghost:   { background: "transparent", color: "#0b6", border: "1px solid #0b6" },
  danger:  { background: "#b91c1c", color: "#fff", border: "1px solid #b91c1c" }
};
const SIZE: Record<Size, React.CSSProperties> = {
  sm: { padding: "6px 10px", fontSize: 14 },
  md: { padding: "10px 14px", fontSize: 16 }
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  block?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant="primary", size="md", block, style, ...rest }, ref) => (
    <button
      ref={ref}
      {...rest}
      style={{ borderRadius: 8, cursor: "pointer", ...(block?{width:"100%"}:{}), ...SIZE[size], ...VAR[variant], ...style }}
    />
  )
);
Button.displayName = "Button";