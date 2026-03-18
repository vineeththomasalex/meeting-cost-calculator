import { useState, useRef, useCallback, useEffect } from 'react';
import AttendeeList, { type Attendee, createAttendee } from './components/AttendeeList';
import CostTicker from './components/CostTicker';
import MeetingStats from './components/MeetingStats';
import MeetingHistory from './components/MeetingHistory';
import QuickCalc from './components/QuickCalc';
import { getRoleBand } from './utils/salaryData';
import { combinedPerSecondRate, perMinuteRate, saveToHistory } from './utils/costCalculator';
import './App.css';

function App() {
  const [attendees, setAttendees] = useState<Attendee[]>([createAttendee(), createAttendee('senior')]);
  const [isRunning, setIsRunning] = useState(false);
  const [cost, setCost] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [meetingName, setMeetingName] = useState('');

  const startTimeRef = useRef(0);
  const pausedElapsedRef = useRef(0);
  const rafRef = useRef<number>(0);
  const costRef = useRef(0);

  const salaries = attendees.map(a => getRoleBand(a.roleId).salary);
  const ratePerSecond = combinedPerSecondRate(salaries);
  const ratePerMinute = perMinuteRate(salaries);

  const tick = useCallback(() => {
    const now = performance.now();
    const totalElapsed = pausedElapsedRef.current + (now - startTimeRef.current) / 1000;
    const currentCost = totalElapsed * ratePerSecond;
    setElapsed(totalElapsed);
    setCost(currentCost);
    costRef.current = currentCost;
    rafRef.current = requestAnimationFrame(tick);
  }, [ratePerSecond]);

  const handleStart = () => {
    if (isRunning) {
      cancelAnimationFrame(rafRef.current);
      pausedElapsedRef.current = elapsed;
      setIsRunning(false);
    } else {
      startTimeRef.current = performance.now();
      setIsRunning(true);
      rafRef.current = requestAnimationFrame(tick);
    }
  };

  const handleReset = () => {
    cancelAnimationFrame(rafRef.current);
    setIsRunning(false);
    setCost(0);
    setElapsed(0);
    pausedElapsedRef.current = 0;
    costRef.current = 0;
  };

  const handleSave = () => {
    if (elapsed < 1) return;
    const name = meetingName.trim() || `Meeting ${new Date().toLocaleTimeString()}`;
    saveToHistory({
      id: crypto.randomUUID(),
      name,
      cost: costRef.current,
      duration: elapsed,
      attendeeCount: attendees.length,
      date: new Date().toISOString(),
    });
    handleReset();
    setMeetingName('');
  };

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Meeting Cost Calculator 💰</h1>
        <p className="subtitle">See what meetings really cost your organization</p>
      </header>

      <main className="app-main">
        <div className="timer-layout">
          <div className="timer-left">
            <AttendeeList
              attendees={attendees}
              onChange={setAttendees}
              disabled={isRunning}
            />
          </div>

          <div className="timer-center">
            <CostTicker cost={cost} elapsedSeconds={elapsed} isRunning={isRunning} />

            <div className="timer-controls">
              <input
                type="text"
                className="meeting-name-input"
                placeholder="Meeting name (optional)"
                value={meetingName}
                onChange={e => setMeetingName(e.target.value)}
                disabled={isRunning}
              />
              <div className="control-buttons">
                <button
                  className={`btn btn-large ${isRunning ? 'btn-pause' : 'btn-start'}`}
                  onClick={handleStart}
                >
                  {isRunning ? '⏸ Pause' : elapsed > 0 ? '▶ Resume' : '▶ Start'}
                </button>
                <button
                  className="btn btn-large btn-reset"
                  onClick={handleReset}
                  disabled={elapsed === 0}
                >
                  ↺ Reset
                </button>
                <button
                  className="btn btn-large btn-save"
                  onClick={handleSave}
                  disabled={elapsed < 1 || isRunning}
                >
                  💾 Save
                </button>
              </div>
            </div>

            <MeetingStats
              cost={cost}
              perMinute={ratePerMinute}
              attendeeCount={attendees.length}
            />
          </div>
        </div>

        <QuickCalc salaries={salaries} />
        <MeetingHistory />
      </main>

      <footer className="app-footer">
        <p>Salary data based on approximate industry averages. For entertainment purposes only.</p>
      </footer>
    </div>
  );
}

export default App;
