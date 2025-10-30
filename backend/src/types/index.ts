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

export interface Booking {
  id: number;
  refId: string;
  slotId: number;
  userName: string;
  userEmail: string;
  quantity: number;
  totalAmount: number;
  promoCode?: string;
  createdAt: Date;
}

export interface CreateBookingRequest {
  slotId: number;
  quantity: number;
  user: {
    name: string;
    email: string;
  };
  total: number;
  promoCode?: string;
}