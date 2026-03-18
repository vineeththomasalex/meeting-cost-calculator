import { ROLE_BANDS, DEFAULT_ROLE_ID, getRoleBand } from '../utils/salaryData';

export interface Attendee {
  id: number;
  roleId: string;
}

interface Props {
  attendees: Attendee[];
  onChange: (attendees: Attendee[]) => void;
  disabled?: boolean;
}

let nextId = 1;
export function createAttendee(roleId = DEFAULT_ROLE_ID): Attendee {
  return { id: nextId++, roleId };
}

export default function AttendeeList({ attendees, onChange, disabled }: Props) {
  const addAttendee = () => {
    onChange([...attendees, createAttendee()]);
  };

  const removeAttendee = (id: number) => {
    if (attendees.length <= 1) return;
    onChange(attendees.filter(a => a.id !== id));
  };

  const updateRole = (id: number, roleId: string) => {
    onChange(attendees.map(a => a.id === id ? { ...a, roleId } : a));
  };

  const totalHourly = attendees.reduce((sum, a) => {
    const band = getRoleBand(a.roleId);
    return sum + band.salary / 2080;
  }, 0);

  return (
    <div className="attendee-list">
      <div className="attendee-header">
        <h3>👥 Attendees ({attendees.length})</h3>
        <button className="btn btn-small" onClick={addAttendee} disabled={disabled}>
          + Add
        </button>
      </div>

      <div className="attendee-items">
        {attendees.map((attendee, i) => (
          <div key={attendee.id} className="attendee-row">
            <span className="attendee-num">#{i + 1}</span>
            <select
              value={attendee.roleId}
              onChange={e => updateRole(attendee.id, e.target.value)}
              disabled={disabled}
            >
              {ROLE_BANDS.map(band => (
                <option key={band.id} value={band.id}>
                  {band.label} (~${(band.salary / 1000).toFixed(0)}k)
                </option>
              ))}
            </select>
            <button
              className="btn btn-remove"
              onClick={() => removeAttendee(attendee.id)}
              disabled={disabled || attendees.length <= 1}
              title="Remove attendee"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="attendee-summary">
        Combined rate: <strong>${totalHourly.toFixed(2)}/hr</strong>
      </div>
    </div>
  );
}
