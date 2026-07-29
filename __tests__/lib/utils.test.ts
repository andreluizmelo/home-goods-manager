import {
  cn,
  calculateDaysUntilExpiry,
  getExpirationUrgency,
  formatDate,
} from '@/lib/utils';

describe('cn', () => {
  it('merges class names, dropping falsy values', () => {
    expect(cn('a', false, 'b', undefined, 'c')).toBe('a b c');
  });
});

describe('calculateDaysUntilExpiry', () => {
  it('returns 0 for a date that is today', () => {
    expect(calculateDaysUntilExpiry(new Date())).toBe(0);
  });

  it('returns a positive number of days for a future date', () => {
    const future = new Date();
    future.setDate(future.getDate() + 5);
    expect(calculateDaysUntilExpiry(future)).toBe(5);
  });

  it('returns a negative number of days for a past date', () => {
    const past = new Date();
    past.setDate(past.getDate() - 3);
    expect(calculateDaysUntilExpiry(past)).toBe(-3);
  });
});

describe('getExpirationUrgency', () => {
  it('returns "expired" for negative days', () => {
    expect(getExpirationUrgency(-1)).toBe('expired');
  });

  it('returns "danger" for 0-3 days', () => {
    expect(getExpirationUrgency(0)).toBe('danger');
    expect(getExpirationUrgency(3)).toBe('danger');
  });

  it('returns "warning" for 4-7 days', () => {
    expect(getExpirationUrgency(4)).toBe('warning');
    expect(getExpirationUrgency(7)).toBe('warning');
  });

  it('returns "safe" for more than 7 days', () => {
    expect(getExpirationUrgency(8)).toBe('safe');
  });
});

describe('formatDate', () => {
  it('formats a date as "Mon D, YYYY"', () => {
    expect(formatDate(new Date(2026, 6, 28))).toBe('Jul 28, 2026');
  });
});
