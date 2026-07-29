import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function calculateDaysUntilExpiry(expirationDate: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expirationDate);
  expiry.setHours(0, 0, 0, 0);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function getExpirationUrgency(daysUntilExpiry: number): 'expired' | 'danger' | 'warning' | 'safe' {
  if (daysUntilExpiry < 0) return 'expired';
  if (daysUntilExpiry <= 3) return 'danger';
  if (daysUntilExpiry <= 7) return 'warning';
  return 'safe';
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}
