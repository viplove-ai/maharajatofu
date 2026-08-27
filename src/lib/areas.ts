/**
 * The delivery circle, as a fixed list. A dropdown rather than free text is a
 * deliberate data decision: free text gives you two hundred spellings of
 * Vasundhara and no way to count a cluster, and clustering is worth twelve
 * points of contribution margin.
 */
export interface Area {
  id: string
  label: string
  pincode: string
  zone: 'noida' | 'ghaziabad'
}

export const AREAS: readonly Area[] = [
  { id: 'noida-62', label: 'Noida Sector 62', pincode: '201309', zone: 'noida' },
  { id: 'noida-63', label: 'Noida Sector 63', pincode: '201301', zone: 'noida' },
  { id: 'noida-60', label: 'Noida Sector 60', pincode: '201301', zone: 'noida' },
  { id: 'noida-51', label: 'Noida Sector 51', pincode: '201301', zone: 'noida' },
  { id: 'noida-52', label: 'Noida Sector 52', pincode: '201301', zone: 'noida' },
  { id: 'noida-71', label: 'Noida Sector 71', pincode: '201301', zone: 'noida' },
  { id: 'noida-72', label: 'Noida Sector 72', pincode: '201301', zone: 'noida' },
  { id: 'noida-75', label: 'Noida Sector 75', pincode: '201301', zone: 'noida' },
  { id: 'noida-76', label: 'Noida Sector 76', pincode: '201301', zone: 'noida' },
  { id: 'gzb-sec-10', label: 'Ghaziabad Sector 10', pincode: '201002', zone: 'ghaziabad' },
  { id: 'vasundhara-1-5', label: 'Vasundhara Sector 1-5', pincode: '201012', zone: 'ghaziabad' },
  { id: 'vasundhara-6-11', label: 'Vasundhara Sector 6-11', pincode: '201012', zone: 'ghaziabad' },
  { id: 'vasundhara-12-17', label: 'Vasundhara Sector 12-17', pincode: '201012', zone: 'ghaziabad' },
  { id: 'vaishali', label: 'Vaishali', pincode: '201010', zone: 'ghaziabad' },
  { id: 'kaushambi', label: 'Kaushambi', pincode: '201010', zone: 'ghaziabad' },
  { id: 'indirapuram-nyay', label: 'Indirapuram - Nyay Khand', pincode: '201014', zone: 'ghaziabad' },
  { id: 'indirapuram-shakti', label: 'Indirapuram - Shakti Khand', pincode: '201014', zone: 'ghaziabad' },
  { id: 'indirapuram-vaibhav', label: 'Indirapuram - Vaibhav Khand', pincode: '201014', zone: 'ghaziabad' },
  { id: 'indirapuram-ahinsa', label: 'Indirapuram - Ahinsa Khand', pincode: '201014', zone: 'ghaziabad' },
  { id: 'rajendra-nagar', label: 'Rajendra Nagar', pincode: '201005', zone: 'ghaziabad' },
  { id: 'shalimar-garden', label: 'Shalimar Garden', pincode: '201005', zone: 'ghaziabad' },
  { id: 'crossings-republik', label: 'Crossings Republik', pincode: '201016', zone: 'ghaziabad' },
  { id: 'raj-nagar-ext', label: 'Raj Nagar Extension', pincode: '201017', zone: 'ghaziabad' },
  { id: 'ahinsa-khand-2', label: 'Ahinsa Khand 2', pincode: '201014', zone: 'ghaziabad' },
  { id: 'other', label: 'Somewhere else', pincode: '', zone: 'ghaziabad' },
] as const

/** Pincodes the twice-weekly run currently reaches. */
export const SERVED_PINCODES = new Set(
  AREAS.filter((a) => a.id !== 'other').map((a) => a.pincode),
)

export function isServed(pincode: string): boolean {
  return SERVED_PINCODES.has(pincode)
}

export function areaById(id: string): Area | undefined {
  return AREAS.find((a) => a.id === id)
}
