import { describe, expect, it } from 'vitest';
import { canAdmit, getPlacementClass } from '../src/tenancy/placement-policy';

describe('subscription placement policy', () => {
  it.each([
    ['free', 'shared_free'],
    ['basic', 'shared_paid'],
    ['medium', 'shared_paid'],
    ['premium', 'dedicated'],
  ] as const)('%s uses %s', (plan, expected) => {
    expect(getPlacementClass(plan)).toBe(expected);
  });

  it('closes Free admission at 250 businesses', () => {
    expect(canAdmit('free', { businesses: 249, usedUnits: 0, state: 'OPEN' })).toBe(true);
    expect(canAdmit('free', { businesses: 250, usedUnits: 0, state: 'OPEN' })).toBe(false);
  });

  it('reserves integer paid capacity for Basic and Medium', () => {
    expect(canAdmit('basic', { businesses: 49, usedUnits: 4900, state: 'OPEN' })).toBe(true);
    expect(canAdmit('basic', { businesses: 50, usedUnits: 4901, state: 'OPEN' })).toBe(false);
    expect(canAdmit('medium', { businesses: 29, usedUnits: 4833, state: 'OPEN' })).toBe(true);
    expect(canAdmit('medium', { businesses: 29, usedUnits: 4834, state: 'OPEN' })).toBe(false);
  });

  it('keeps a Premium placement single-business and rejects sealed pools', () => {
    expect(canAdmit('premium', { businesses: 0, usedUnits: 0, state: 'OPEN' })).toBe(true);
    expect(canAdmit('premium', { businesses: 1, usedUnits: 0, state: 'OPEN' })).toBe(false);
    expect(canAdmit('free', { businesses: 0, usedUnits: 0, state: 'SEALED' })).toBe(false);
  });

  it('fails closed for corrupt capacity figures', () => {
    expect(canAdmit('basic', { businesses: -1, usedUnits: 0, state: 'OPEN' })).toBe(false);
    expect(canAdmit('medium', { businesses: 0, usedUnits: Number.NaN, state: 'OPEN' })).toBe(false);
  });
});
