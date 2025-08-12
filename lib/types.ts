export interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  duration: string;
  rating: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  image: string;
  slug: string;
}

export interface Location {
  id: string;
  name: string;
  city: string;
  area: string;
  image: string;
}

export interface Review {
  id: string;
  name: string;
  service: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
}

export interface Order {
  id: string;
  userId: string;
  serviceId: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  customerName: string;
  phone: string;
  address: string;
  date: string;
  time: string;
  total: number;
  createdAt: string;
}


