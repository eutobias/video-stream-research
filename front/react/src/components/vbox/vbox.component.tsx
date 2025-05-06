type VBoxProps = {
  children: React.ReactNode;
};
export const VBox = ({ children }: VBoxProps) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {children}
    </div>
  );
};
