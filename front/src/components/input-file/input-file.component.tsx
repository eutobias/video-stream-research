import { BUTTON_VARIANTS } from "../button/button.types";

type InputFileProps = {
  onSelectFile: (file: File | null) => void;
  selectedFileName?: string;
  variant?: keyof typeof BUTTON_VARIANTS;
};

export const InputFile = ({
  onSelectFile,
  selectedFileName,
  variant = "primary",
}: InputFileProps) => {
  return (
    <label className={`nes-btn ${BUTTON_VARIANTS[variant]}`}>
      <span>{selectedFileName || `Select your file`}</span>
      <input
        type="file"
        accept="video/*"
        onChange={(event) => {
          const currentFile = event.target.files?.[0] || null;
          onSelectFile(currentFile);
        }}
      />
    </label>
  );
};
