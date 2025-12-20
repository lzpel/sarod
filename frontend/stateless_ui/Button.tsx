// ボタンです
// - tailwindcssを使用してください
// - iconは左、右にchildrenを配置してください
// - & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> で継承可能にしてください
import React, {
  DetailedHTMLProps,
  ButtonHTMLAttributes,
} from "react";

type ButtonProps =
  DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > & {
    icon: React.ReactNode;
  };

export default function Button({
  icon,
  children,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={[
        "inline-flex items-center gap-2 rounded-md px-4 py-2",
        "bg-blue-600 text-white hover:bg-blue-700",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="flex items-center">{icon}</span>
      <span>{children}</span>
    </button>
  );
}