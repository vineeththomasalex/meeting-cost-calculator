import { formatCurrency, COFFEE_COST, EMAIL_THRESHOLD } from '../utils/costCalculator';

interface Props {
  cost: number;
  perMinute: number;
  attendeeCount: number;
}

export default function MeetingStats({ cost, perMinute, attendeeCount }: Props) {
  const coffees = Math.floor(cost / COFFEE_COST);
  const pizzas = Math.floor(cost / 15);
  const costPerPerson = attendeeCount > 0 ? cost / attendeeCount : 0;
  const progress = Math.min(cost / EMAIL_THRESHOLD, 1);

  return (
    <div className="meeting-stats">
      <h3>📊 Live Stats</h3>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Per Minute</span>
          <span className="stat-value">{formatCurrency(perMinute)}</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Per Person</span>
          <span className="stat-value">{formatCurrency(costPerPerson)}</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">☕ Coffees</span>
          <span className="stat-value">{coffees}</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">🍕 Pizzas</span>
          <span className="stat-value">{pizzas}</span>
        </div>
      </div>

      <div className="email-threshold">
        <div className="threshold-label">
          <span>📧 "Could've been an email" meter</span>
          <span>{formatCurrency(cost)} / {formatCurrency(EMAIL_THRESHOLD)}</span>
        </div>
        <div className="threshold-bar">
          <div
            className="threshold-fill"
            style={{
              width: `${progress * 100}%`,
              backgroundColor: progress < 0.5 ? '#4ade80' : progress < 0.8 ? '#facc15' : '#ef4444',
            }}
          />
        </div>
      </div>
    </div>
  );
}
