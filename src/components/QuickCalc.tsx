import { useState } from 'react';
import { ROLE_BANDS, DEFAULT_ROLE_ID, getRoleBand } from '../utils/salaryData';
import { formatCurrency, perMinuteRate, EMAIL_THRESHOLD, COFFEE_COST } from '../utils/costCalculator';

export default function QuickCalc() {
  const [count, setCount] = useState(5);
  const [roleId, setRoleId] = useState(DEFAULT_ROLE_ID);
  const [minutes, setMinutes] = useState(30);

  const band = getRoleBand(roleId);
  const salaries = Array(count).fill(band.salary);
  const perMin = perMinuteRate(salaries);
  const totalCost = perMin * minutes;
  const coffees = Math.floor(totalCost / COFFEE_COST);

  return (
    <div className="quick-calc">
      <h3>⚡ Quick Calculator</h3>

      <div className="quick-calc-form">
        <label>
          <span>Attendees</span>
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={e => setCount(Math.max(1, parseInt(e.target.value) || 1))}
          />
        </label>

        <label>
          <span>Avg. Role</span>
          <select value={roleId} onChange={e => setRoleId(e.target.value)}>
            {ROLE_BANDS.map(b => (
              <option key={b.id} value={b.id}>
                {b.label} (~${(b.salary / 1000).toFixed(0)}k)
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Duration (min)</span>
          <input
            type="number"
            min={1}
            max={480}
            value={minutes}
            onChange={e => setMinutes(Math.max(1, parseInt(e.target.value) || 1))}
          />
        </label>
      </div>

      <div className="quick-calc-result">
        <div className="quick-calc-total">
          <span>Estimated Cost</span>
          <strong style={{ color: totalCost >= EMAIL_THRESHOLD ? '#ef4444' : '#4ade80' }}>
            {formatCurrency(totalCost)}
          </strong>
        </div>
        <div className="quick-calc-detail">
          {formatCurrency(perMin)}/min • ☕ {coffees} cups of coffee
        </div>
        {totalCost >= EMAIL_THRESHOLD && (
          <div className="ticker-warning">📧 This could have been an email!</div>
        )}
      </div>
    </div>
  );
}
