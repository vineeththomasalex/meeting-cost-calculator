export interface RoleBand {
  id: string;
  label: string;
  salary: number;
}

export const ROLE_BANDS: RoleBand[] = [
  { id: 'junior',    label: 'Junior',    salary: 80_000 },
  { id: 'mid',       label: 'Mid-Level', salary: 120_000 },
  { id: 'senior',    label: 'Senior',    salary: 160_000 },
  { id: 'staff',     label: 'Staff',     salary: 200_000 },
  { id: 'principal', label: 'Principal', salary: 250_000 },
  { id: 'director',  label: 'Director',  salary: 300_000 },
  { id: 'vp',        label: 'VP',        salary: 400_000 },
];

export const DEFAULT_ROLE_ID = 'mid';

export function getRoleBand(id: string): RoleBand {
  return ROLE_BANDS.find(r => r.id === id) ?? ROLE_BANDS[1];
}
