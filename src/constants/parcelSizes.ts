export type ParcelSizeKey = 'extra_small' | 'small' | 'medium' | 'large' | 'extra_large';

export interface ParcelSize {
  key: ParcelSizeKey;
  label: string;
  weight: string;
  dimensions: string;
  dimensionsMm: { l: number; w: number; h: number };
  maxKg: number;
  description: string;
}

export const PARCEL_SIZES: ParcelSize[] = [
  {
    key: 'extra_small',
    label: 'Extra Small',
    weight: 'Up to 2 KG',
    dimensions: '600 × 170 × 80 mm',
    dimensionsMm: { l: 600, w: 170, h: 80 },
    maxKg: 2,
    description: 'Perfect for thin books, small supplies or accessories',
  },
  {
    key: 'small',
    label: 'Small',
    weight: 'Up to 5 KG',
    dimensions: '600 × 410 × 80 mm',
    dimensionsMm: { l: 600, w: 410, h: 80 },
    maxKg: 5,
    description: 'Ideal for standard textbooks and light uniforms',
  },
  {
    key: 'medium',
    label: 'Medium',
    weight: 'Up to 10 KG',
    dimensions: '600 × 410 × 190 mm',
    dimensionsMm: { l: 600, w: 410, h: 190 },
    maxKg: 10,
    description: 'Great for multiple books or larger items',
  },
  {
    key: 'large',
    label: 'Large',
    weight: 'Up to 15 KG',
    dimensions: '600 × 410 × 110 mm',
    dimensionsMm: { l: 600, w: 410, h: 110 },
    maxKg: 15,
    description: 'Suits full uniform sets and sports equipment',
  },
  {
    key: 'extra_large',
    label: 'Extra Large',
    weight: 'Up to 20 KG',
    dimensions: '605 × 410 × 690 mm',
    dimensionsMm: { l: 605, w: 410, h: 690 },
    maxKg: 20,
    description: 'For large/bulky items like bags or equipment sets',
  },
];

export const getParcelSizeByKey = (key: ParcelSizeKey): ParcelSize | undefined =>
  PARCEL_SIZES.find((p) => p.key === key);
