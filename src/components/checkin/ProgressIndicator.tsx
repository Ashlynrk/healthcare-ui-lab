export function ProgressIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div
      className="progress"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current}
      aria-valuetext={`Step ${current} of ${total}`}
    >
      <span className="progress-fill" style={{ width: `${(current / total) * 100}%` }} />
    </div>
  );
}
