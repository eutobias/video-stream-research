import React from "react";
import { BUTTON_VARIANTS } from "./button.types";

type ButtonProps = {
  children: React.ReactNode;
  variant?: keyof typeof BUTTON_VARIANTS;
};

export const Button = ({ children, variant = "primary" }: ButtonProps) => {
  return (
    <button type="button" className={`nes-btn ${BUTTON_VARIANTS[variant]}`}>
      {children}
    </button>
  );
}
