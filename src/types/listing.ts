export interface BaseListingFormData {
  title: string;
  description: string;
  price: number;
  condition: 'New' | 'Good' | 'Better' | 'Average' | 'Below Average';
  quantity: number;
  parcelSize: 'extra_small' | 'small' | 'medium' | 'large' | 'extra_large';
  province?: string;
  imageUrl?: string;
  frontCover?: string;
  backCover?: string;
  insidePages?: string;
  additionalImages?: string[];
}

export interface UniformFormData extends BaseListingFormData {
  schoolName?: string;
  gender?: 'Male' | 'Female' | 'Unisex';
  size?: string;
  color?: string;
  grade?: string;
}

export interface SchoolSupplyFormData extends BaseListingFormData {
  subject?: string;
  grade?: string;
  schoolName?: string;
}

export type ListingCategory = 'book' | 'uniform' | 'school_supply';
