import { formatTime, EMAIL_THRESHOLD } from '../utils/costCalculator';

interface Props {
  cost: number;
  elapsedSeconds: number;
  isRunning: boolean;
}

function getCostColor(cost: number): string {
  if (cost < 100) return '#4ade80';       // green
  if (cost < 250) return '#a3e635';       // lime
  if (cost < EMAIL_THRESHOLD) return '#facc15'; // yellow
  if (cost < 750) return '#fb923c';       // orange
  return '#ef4444';                       // red
}

export default function CostTicker({ cost, elapsedSeconds, isRunning }: Props) {
  const color = getCostColor(cost);
  const overThreshold = cost >= EMAIL_THRESHOLD;

  return (
    <div className="cost-ticker">
      <div className="ticker-display" style={{ color }}>
        <span className="ticker-dollar">$</span>
        <span className="ticker-amount">
          {cost < 1000
            ? cost.toFixed(2)
            : cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>

      <div className="ticker-time">
        ⏱ {formatTime(elapsedSeconds)}
      </div>

      {overThreshold && (
        <div className="ticker-warning">
          📧 This meeting could have been an email!
        </div>
      )}

      <div className={`ticker-pulse ${isRunning ? 'active' : ''}`} />
    </div>
  );
}
