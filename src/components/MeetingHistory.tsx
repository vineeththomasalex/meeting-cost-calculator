import { useState } from 'react';
import { type MeetingRecord, loadHistory, clearHistory, formatCurrency, formatTime } from '../utils/costCalculator';

export default function MeetingHistory() {
  const [history, setHistory] = useState<MeetingRecord[]>(loadHistory);
  const [expanded, setExpanded] = useState(false);

  const handleClear = () => {
    if (confirm('Clear all meeting history?')) {
      clearHistory();
      setHistory([]);
    }
  };

  const refresh = () => setHistory(loadHistory());

  if (history.length === 0) {
    return (
      <div className="meeting-history">
        <h3>📜 Meeting History</h3>
        <p className="history-empty">No meetings recorded yet. Start a timer to track your first meeting!</p>
      </div>
    );
  }

  const displayed = expanded ? history : history.slice(0, 5);
  const totalSpent = history.reduce((s, m) => s + m.cost, 0);

  return (
    <div className="meeting-history">
      <div className="history-header">
        <h3>📜 Meeting History ({history.length})</h3>
        <div className="history-actions">
          <button className="btn btn-small" onClick={refresh}>↻</button>
          <button className="btn btn-small btn-danger" onClick={handleClear}>Clear</button>
        </div>
      </div>

      <div className="history-total">
        All-time total: <strong>{formatCurrency(totalSpent)}</strong>
      </div>

      <div className="history-list">
        {displayed.map(m => (
          <div key={m.id} className="history-item">
            <div className="history-item-top">
              <span className="history-name">{m.name}</span>
              <span className="history-cost" style={{ color: m.cost >= 500 ? '#ef4444' : '#4ade80' }}>
                {formatCurrency(m.cost)}
              </span>
            </div>
            <div className="history-item-bottom">
              <span>{m.attendeeCount} attendees • {formatTime(m.duration)}</span>
              <span>{new Date(m.date).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {history.length > 5 && (
        <button className="btn btn-small" onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Show less' : `Show all ${history.length}`}
        </button>
      )}
    </div>
  );
}
