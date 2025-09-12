export interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  discount: number;
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

export const categoriesData: Category[] = [
  {
    id: '1',
    name: 'Home Cleaning',
    icon: '🏠',
    description: 'Professional home cleaning services',
    image: 'https://images.pexels.com/photos/4099468/pexels-photo-4099468.jpeg?auto=compress&cs=tinysrgb&w=800',
    slug: 'home-cleaning',
  },
  {
    id: '2',
    name: 'PC Repair',
    icon: '💻',
    description: 'Computer repair and maintenance',
    image: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=800',
    slug: 'pc-repair',
  },
  {
    id: '3',
    name: "Women's Salon",
    icon: '💄',
    description: 'Beauty and hair salon services',
    image: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=800',
    slug: 'womens-salon',
  },
  {
    id: '4',
    name: "Women's Spa",
    icon: '🧘‍♀️',
    description: 'Relaxing spa treatments',
    image: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=800',
    slug: 'womens-spa',
  },
  {
    id: '5',
    name: 'Furniture Cleaning',
    icon: '🪑',
    description: 'Deep cleaning for furniture',
    image: 'https://images.pexels.com/photos/4239037/pexels-photo-4239037.jpeg?auto=compress&cs=tinysrgb&w=800',
    slug: 'furniture-cleaning',
  },
  {
    id: '6',
    name: 'AC Cleaning',
    icon: '❄️',
    description: 'Air conditioner maintenance',
    image: 'https://images.pexels.com/photos/8005207/pexels-photo-8005207.jpeg?auto=compress&cs=tinysrgb&w=800',
    slug: 'ac-cleaning',
  },
];

export const servicesData: Service[] = [
  {
    id: '1',
    name: 'Deep House Cleaning',
    category: 'home-cleaning',
    price: 150,
    discount: 20,
    description: 'Complete deep cleaning service for your entire home',
    image: 'https://images.pexels.com/photos/4099468/pexels-photo-4099468.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '3-4 hours',
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Regular House Cleaning',
    category: 'home-cleaning',
    price: 80,
    discount: 15,
    description: 'Weekly or bi-weekly house cleaning service',
    image: 'https://images.pexels.com/photos/4099093/pexels-photo-4099093.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '2-3 hours',
    rating: 4.7,
  },
  {
    id: '3',
    name: 'Laptop Repair',
    category: 'pc-repair',
    price: 120,
    discount: 25,
    description: 'Complete laptop diagnosis and repair service',
    image: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '2-3 days',
    rating: 4.9,
  },
  {
    id: '4',
    name: 'Desktop Setup',
    category: 'pc-repair',
    price: 200,
    discount: 30,
    description: 'Complete desktop computer setup and optimization',
    image: 'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '1-2 hours',
    rating: 4.6,
  },
];


