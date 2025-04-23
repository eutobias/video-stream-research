import React from "react";

type SectionProps = {
  children: React.ReactNode;
  title: string;
};

export const Section = ({ children, title }: SectionProps) => {
  return (
    <div className="nes-container with-title is-centered">
      <p className="title">{title}</p>
      {children}
    </div>
  );
};
