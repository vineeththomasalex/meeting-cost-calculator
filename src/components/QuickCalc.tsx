import { useState, useMemo } from 'react';
import { formatCurrency, perMinuteRate, EMAIL_THRESHOLD, COFFEE_COST } from '../utils/costCalculator';

interface Props {
  salaries: number[];
}

const PRESET_MINUTES = [5, 15, 30, 60];

export default function QuickCalc({ salaries }: Props) {
  const [customMinutes, setCustomMinutes] = useState<number | ''>('');

  const perMin = perMinuteRate(salaries);

  const rows = useMemo(() => {
    const presets = PRESET_MINUTES.map(m => ({
      minutes: m,
      cost: perMin * m,
      coffees: Math.floor((perMin * m) / COFFEE_COST),
    }));
    if (customMinutes && customMinutes > 0) {
      presets.push({
        minutes: customMinutes,
        cost: perMin * customMinutes,
        coffees: Math.floor((perMin * customMinutes) / COFFEE_COST),
      });
    }
    return presets;
  }, [perMin, customMinutes]);

  if (salaries.length === 0) return null;

  return (
    <div className="quick-calc">
      <h3>📊 Cost Projections</h3>
      <p className="quick-calc-subtitle">
        Estimated cost for {salaries.length} attendee{salaries.length !== 1 ? 's' : ''} at {formatCurrency(perMin)}/min
      </p>
      <div className="quick-calc-table-wrapper">
        <table className="quick-calc-table">
          <thead>
            <tr>
              <th>Duration</th>
              <th>Cost</th>
              <th>☕</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.minutes} className={row.cost >= EMAIL_THRESHOLD ? 'over-threshold' : ''}>
                <td className="duration-cell">{row.minutes} min</td>
                <td className="cost-cell">{formatCurrency(row.cost)}</td>
                <td className="coffee-cell">{row.coffees}</td>
                <td className="warning-cell">
                  {row.cost >= EMAIL_THRESHOLD ? '📧' : ''}
                </td>
              </tr>
            ))}
            <tr className={customMinutes && customMinutes > 0 ? '' : 'custom-row-empty'}>
              <td className="duration-cell custom-input-cell">
                <input
                  type="number"
                  min={1}
                  max={480}
                  placeholder="Custom"
                  value={customMinutes}
                  onChange={e => {
                    const v = e.target.value;
                    setCustomMinutes(v === '' ? '' : Math.max(1, parseInt(v) || 1));
                  }}
                  className="custom-minutes-input"
                />
                <span className="min-label">min</span>
              </td>
              {customMinutes && customMinutes > 0 ? (
                <>
                  <td className="cost-cell">{formatCurrency(perMin * customMinutes)}</td>
                  <td className="coffee-cell">{Math.floor((perMin * customMinutes) / COFFEE_COST)}</td>
                  <td className="warning-cell">
                    {perMin * customMinutes >= EMAIL_THRESHOLD ? '📧' : ''}
                  </td>
                </>
              ) : (
                <>
                  <td className="cost-cell dim">—</td>
                  <td className="coffee-cell dim">—</td>
                  <td className="warning-cell"></td>
                </>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
