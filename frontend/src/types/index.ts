export interface Experience {
  id: string;
  title: string;
  location: string;
  description: string;
  price: number;
  imageUrl: string;
  slots?: Slot[];
}

export interface Slot {
  id: number;
  experienceId: string;
  startTime: string;
  totalCapacity: number;
  bookedCount: number;
}

export interface PromoCode {
  id: number;
  code: string;
  discountType: 'percentage' | 'flat';
  value: number;
  isActive: boolean;
}

export interface CheckoutData {
  experience: {
    id: string;
    title: string;
    price: number;
  };
  slot: Slot;
  quantity: number;
  subtotal: number;
  taxes: number;
  total: number;
}

export interface BookingRequest {
  slotId: number;
  quantity: number;
  user: {
    name: string;
    email: string;
  };
  total: number;
  promoCode?: string;
}