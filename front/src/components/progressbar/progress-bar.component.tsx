type ProgressBarProps = {
  value: number;
  max?: number;
};

import styles from "./progress-bar.module.css";

export const ProgressBar = ({ value, max = 100 }: ProgressBarProps) => {
  return (
    <progress className={`nes-progress is-pattern ${styles.animateProgress}`} value={value} max={max} />
  );
};
