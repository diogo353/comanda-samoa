
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock?: number;
}

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  room: string;
  guestName?: string;
  items: OrderItem[];
  timestamp: number;
  outlet: string;
  total: number;
}

export interface Guest {
  room: string;
  name: string;
  status: 'Checked-in' | 'VIP' | 'Check-out Today';
}

export type OutletType = 'DASHBOARD' | 'LOBBY BAR' | 'BAR PRAIA' | 'PUKA PUKA' | 'RESTAURANTE' | 'HISTORY' | 'ROOMS';

export interface MenuData {
  [key: string]: Product[];
}
