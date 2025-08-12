import { create } from 'zustand';

interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  duration: string;
  rating: number;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  image: string;
  slug: string;
}

interface Location {
  id: string;
  name: string;
  city: string;
  area: string;
  image: string;
}

interface Review {
  id: string;
  name: string;
  service: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
}

interface Order {
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

interface StoreState {
  categories: Category[];
  services: Service[];
  locations: Location[];
  reviews: Review[];
  orders: Order[];
  currentLocation: string;
  searchQuery: string;
  setCurrentLocation: (location: string) => void;
  setSearchQuery: (query: string) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

export const useStore = create<StoreState>((set) => ({
  currentLocation: '',
  searchQuery: '',
  categories: [
    {
      id: '1',
      name: 'Home Cleaning',
      icon: '🏠',
      description: 'Professional home cleaning services',
      image: 'https://images.pexels.com/photos/4099468/pexels-photo-4099468.jpeg?auto=compress&cs=tinysrgb&w=800',
      slug: 'home-cleaning'
    },
    {
      id: '2',
      name: 'PC Repair',
      icon: '💻',
      description: 'Computer repair and maintenance',
      image: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=800',
      slug: 'pc-repair'
    },
    {
      id: '3',
      name: 'Women\'s Salon',
      icon: '💄',
      description: 'Beauty and hair salon services',
      image: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=800',
      slug: 'womens-salon'
    },
    {
      id: '4',
      name: 'Women\'s Spa',
      icon: '🧘‍♀️',
      description: 'Relaxing spa treatments',
      image: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=800',
      slug: 'womens-spa'
    },
    {
      id: '5',
      name: 'Furniture Cleaning',
      icon: '🪑',
      description: 'Deep cleaning for furniture',
      image: 'https://images.pexels.com/photos/4239037/pexels-photo-4239037.jpeg?auto=compress&cs=tinysrgb&w=800',
      slug: 'furniture-cleaning'
    },
    {
      id: '6',
      name: 'AC Cleaning',
      icon: '❄️',
      description: 'Air conditioner maintenance',
      image: 'https://images.pexels.com/photos/8005207/pexels-photo-8005207.jpeg?auto=compress&cs=tinysrgb&w=800',
      slug: 'ac-cleaning'
    }
  ],
  services: [
    {
      id: '1',
      name: 'Deep House Cleaning',
      category: 'home-cleaning',
      price: 150,
      description: 'Complete deep cleaning service for your entire home',
      image: 'https://images.pexels.com/photos/4099468/pexels-photo-4099468.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '3-4 hours',
      rating: 4.8
    },
    {
      id: '2',
      name: 'Regular House Cleaning',
      category: 'home-cleaning',
      price: 80,
      description: 'Weekly or bi-weekly house cleaning service',
      image: 'https://images.pexels.com/photos/4099093/pexels-photo-4099093.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '2-3 hours',
      rating: 4.7
    },
    {
      id: '3',
      name: 'Laptop Repair',
      category: 'pc-repair',
      price: 120,
      description: 'Complete laptop diagnosis and repair service',
      image: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '2-3 days',
      rating: 4.9
    },
    {
      id: '4',
      name: 'Desktop Setup',
      category: 'pc-repair',
      price: 200,
      description: 'Complete desktop computer setup and optimization',
      image: 'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '1-2 hours',
      rating: 4.6
    }
  ],
  locations: [
    {
      id: '1',
      name: 'Downtown',
      city: 'New York',
      area: 'Manhattan',
      image: 'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: '2',
      name: 'Beverly Hills',
      city: 'Los Angeles',
      area: 'West LA',
      image: 'https://images.pexels.com/photos/681391/pexels-photo-681391.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: '3',
      name: 'South Beach',
      city: 'Miami',
      area: 'Miami Beach',
      image: 'https://images.pexels.com/photos/460621/pexels-photo-460621.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: '4',
      name: 'River North',
      city: 'Chicago',
      area: 'Downtown',
      image: 'https://images.pexels.com/photos/169647/pexels-photo-169647.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ],
  reviews: [
    {
      id: '1',
      name: 'Sarah Johnson',
      service: 'Deep House Cleaning',
      rating: 5,
      comment: 'Absolutely amazing service! My house has never been cleaner.',
      date: '2024-01-15',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      id: '2',
      name: 'Michael Chen',
      service: 'Laptop Repair',
      rating: 5,
      comment: 'Quick and professional repair service. Highly recommended!',
      date: '2024-01-12',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      service: 'Women\'s Salon',
      rating: 4,
      comment: 'Great haircut and styling. Very satisfied with the results.',
      date: '2024-01-10',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      id: '4',
      name: 'David Kim',
      service: 'AC Cleaning',
      rating: 5,
      comment: 'Professional AC cleaning service. My AC works like new now!',
      date: '2024-01-08',
      avatar: 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=200'
    }
  ],
  orders: [],
  setCurrentLocation: (location) => set({ currentLocation: location }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
  updateOrderStatus: (orderId, status) => set((state) => ({
    orders: state.orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    )
  }))
}));