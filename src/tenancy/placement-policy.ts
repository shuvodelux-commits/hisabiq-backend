export type Plan = 'free' | 'basic' | 'medium' | 'premium';
export type PlacementClass = 'shared_free' | 'shared_paid' | 'dedicated';
export type Capacity = {
  businesses: number;
  usedUnits: number;
  state: 'OPEN' | 'SEALED';
};

export function getPlacementClass(plan: Plan): PlacementClass {
  return plan === 'free' ? 'shared_free' : plan === 'premium' ? 'dedicated' : 'shared_paid';
}

export function canAdmit(plan: Plan, capacity: Capacity): boolean {
  if (capacity.state !== 'OPEN' ||
      !Number.isSafeInteger(capacity.businesses) || capacity.businesses < 0 ||
      !Number.isSafeInteger(capacity.usedUnits) || capacity.usedUnits < 0) return false;
  if (plan === 'free') return capacity.businesses < 250;
  if (plan === 'premium') return capacity.businesses === 0;
  return capacity.usedUnits + (plan === 'basic' ? 100 : 167) <= 5000;
}
