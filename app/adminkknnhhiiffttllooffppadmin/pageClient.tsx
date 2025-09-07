'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiUsers,
  HiCurrencyDollar,
  HiClipboardList,
  HiCog,
  HiPlus,
  HiPencil,
  HiTrash,
  HiEye,
} from 'react-icons/hi';
import Navbar from '@/components/layout/Navbar';
import type { Category, Order, Service, Location, User } from '@/lib/types';

type TabId = 'dashboard' | 'orders' | 'services' | 'categories' | 'locations' | 'users';

export default function AdminPageClient() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);
  const [isEditServiceOpen, setIsEditServiceOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [emailConfigured, setEmailConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    void refreshAll();
    
    // Check email configuration
    const checkEmailConfig = async () => {
      try {
        const response = await fetch('/api/email-status');
        if (response.ok) {
          const data = await response.json();
          setEmailConfigured(data.emailConfigured);
        }
      } catch (error) {
        console.error('Failed to check email configuration:', error);
        setEmailConfigured(false);
      }
    };
    
    checkEmailConfig();
  }, []);

  useEffect(() => {
    let isCancelled = false;
    const fetchLatestOrders = async () => {
      try {
        const res = await fetch('/api/orders', { cache: 'no-store' });
        const data = await res.json();
        if (!isCancelled && Array.isArray(data)) {
          setOrders(data);
        } else if (!isCancelled) {
          console.warn('Orders API returned non-array data:', data);
          setOrders([]);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Error fetching latest orders:', error);
          setOrders([]);
        }
      }
    };
    fetchLatestOrders();

    const onFocus = () => void fetchLatestOrders();
    const onVisibility = () => {
      if (document.visibilityState === 'visible') void fetchLatestOrders();
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      isCancelled = true;
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  async function refreshAll() {
    try {
      const [servicesRes, categoriesRes, locationsRes, ordersRes, usersRes] = await Promise.allSettled([
        fetch('/api/services').then((r) => r.json()),
        fetch('/api/categories').then((r) => r.json()),
        fetch('/api/locations').then((r) => r.json()),
        fetch('/api/orders').then((r) => r.json()),
        fetch('/api/users').then((r) => r.json()),
      ]);
      
      // Handle each API response individually to prevent one failure from affecting others
      if (servicesRes.status === 'fulfilled' && Array.isArray(servicesRes.value)) {
        setServices(servicesRes.value);
      } else {
        console.warn('Services API failed or returned invalid data:', servicesRes);
        setServices([]);
      }
      
      if (categoriesRes.status === 'fulfilled' && Array.isArray(categoriesRes.value)) {
        setCategories(categoriesRes.value);
      } else {
        console.warn('Categories API failed or returned invalid data:', categoriesRes);
        setCategories([]);
      }
      
      if (locationsRes.status === 'fulfilled' && Array.isArray(locationsRes.value)) {
        setLocations(locationsRes.value);
      } else {
        console.warn('Locations API failed or returned invalid data:', locationsRes);
        setLocations([]);
      }
      
      if (ordersRes.status === 'fulfilled' && Array.isArray(ordersRes.value)) {
        setOrders(ordersRes.value);
      } else {
        console.warn('Orders API failed or returned invalid data:', ordersRes);
        setOrders([]);
      }
      
      if (usersRes.status === 'fulfilled' && Array.isArray(usersRes.value)) {
        setUsers(usersRes.value);
      } else {
        console.warn('Users API failed or returned invalid data:', usersRes);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      // Set empty arrays on error to prevent crashes
      setServices([]);
      setCategories([]);
      setLocations([]);
      setOrders([]);
      setUsers([]);
    }
  }

  async function handleStatusChange(orderId: string, newStatus: Order['status']) {
    if (!Array.isArray(orders) || !orderId || !newStatus) return;
    const order = orders.find((o) => o?.id === orderId);
    if (!order) return;
    
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      
      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) => {
          if (!Array.isArray(prev)) return [updated];
          return prev.map((o) => (o?.id === orderId ? updated : o));
        });
        
        // Show success message for email notifications
        if (newStatus === 'confirmed') {
          if (updated.emailSent) {
            alert(`Order confirmed! ✅ Confirmation email sent to ${order.email}`);
          } else if (updated.emailError) {
            alert(`Order confirmed! ⚠️ Email failed: ${updated.emailError}`);
          } else {
            alert(`Order confirmed! Email status unknown.`);
          }
        } else if (newStatus === 'completed') {
          alert(`Order marked as completed!`);
        } else {
          alert(`Order status updated to ${newStatus}`);
        }
        
        // Log the full response for debugging
        console.log('Order update response:', updated);
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        alert(`Failed to update order status: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  }

  async function handleAddService(form: Partial<Service>) {
    setIsSaving(true);
    const res = await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setIsSaving(false);
    if (!res.ok) return;
    const created = await res.json();
    setServices((prev) => {
      if (!Array.isArray(prev)) return [created];
      return [created, ...prev];
    });
    setIsAddServiceOpen(false);
  }

  async function handleDeleteService(serviceId: string | number) {
    const res = await fetch('/api/services', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: serviceId }),
    });
    if (res.ok) setServices((prev) => {
      if (!Array.isArray(prev)) return [];
      return prev.filter((s) => s?.id !== serviceId);
    });
  }

  async function handleAddCategory(form: Partial<Category>) {
    setIsSaving(true);
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setIsSaving(false);
    if (!res.ok) {
      let msg = 'Failed to add category';
      try {
        const j = await res.json();
        if (j?.error) msg = j.error;
      } catch {}
      throw new Error(msg);
    }
    const created = await res.json();
    setCategories((prev) => {
      if (!Array.isArray(prev)) return [created];
      return [created, ...prev];
    });
    setIsAddCategoryOpen(false);
  }

  async function handleDeleteCategory(categoryId: string) {
    const res = await fetch('/api/categories', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: categoryId }),
    });
    if (res.ok) {
      const result = await res.json();
      setCategories((prev) => {
        if (!Array.isArray(prev)) return [];
        return prev.filter((c) => c?.id !== categoryId);
      });
      // Also refresh services in case some were deleted due to cascade
      const servicesRes = await fetch('/api/services');
      if (servicesRes.ok) {
        const servicesData = await servicesRes.json();
        setServices(servicesData ?? []);
      }
      // Show success message if provided
      if (result.message) {
        alert(result.message);
      }
    }
  }

  async function handleAddLocation(form: Partial<Location>) {
    setIsSaving(true);
    try {
      const res = await fetch('/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setIsSaving(false);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Location creation failed:', errorData);
        alert(`Failed to add location: ${errorData.error || 'Unknown error'}`);
        return;
      }
      const created = await res.json();
      setLocations((prev) => {
        if (!Array.isArray(prev)) return [created];
        return [created, ...prev];
      });
      setIsAddLocationOpen(false);
    } catch (error) {
      setIsSaving(false);
      console.error('Location creation error:', error);
      alert('Failed to add location. Please try again.');
    }
  }

  async function handleDeleteLocation(locationId: string) {
    const res = await fetch('/api/locations', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: locationId }),
    });
    if (res.ok) setLocations((prev) => {
      if (!Array.isArray(prev)) return [];
      return prev.filter((l) => l?.id !== locationId);
    });
  }

  async function handleEditService(form: Partial<Service>) {
    if (!editingService) return;
    setIsSaving(true);
    const res = await fetch('/api/services', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingService.id, ...form }),
    });
    setIsSaving(false);
    if (!res.ok) return;
    const updated = await res.json();
            setServices((prev) => {
          if (!Array.isArray(prev)) return [updated];
          return prev.map((s) => (s?.id === editingService.id ? updated : s));
        });
    setIsEditServiceOpen(false);
    setEditingService(null);
  }

  async function handleEditCategory(form: Partial<Category>) {
    if (!editingCategory) return;
    setIsSaving(true);
    const res = await fetch('/api/categories', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingCategory.id, ...form }),
    });
    setIsSaving(false);
    if (!res.ok) {
      let msg = 'Failed to update category';
      try {
        const j = await res.json();
        if (j?.error) msg = j.error;
      } catch {}
      throw new Error(msg);
    }
    const updated = await res.json();
            setCategories((prev) => {
          if (!Array.isArray(prev)) return [updated];
          return prev.map((c) => (c?.id === editingCategory.id ? updated : c));
        });
    setIsEditCategoryOpen(false);
    setEditingCategory(null);
  }

  function handleEditServiceClick(service: Service) {
    setEditingService(service);
    setIsEditServiceOpen(true);
  }

  function handleEditCategoryClick(category: Category) {
    setEditingCategory(category);
    setIsEditCategoryOpen(true);
  }

  // Check if a category has associated services
  function hasAssociatedServices(categorySlug: string): boolean {
    if (!Array.isArray(services) || !categorySlug) return false;
    return services.some(service => service?.category === categorySlug);
  }

  const totalRevenue = useMemo(() => {
    if (!Array.isArray(orders)) return 0;
    return orders.reduce((sum, order) => {
      const total = typeof order?.total === 'number' ? order.total : 0;
      return sum + total;
    }, 0);
  }, [orders]);

  const metrics = [
    { title: 'Total Orders', value: (Array.isArray(orders) ? orders.length : 0).toString(), icon: HiClipboardList, color: 'from-blue-500 to-blue-600', change: '+12%' },
    { title: 'Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: HiCurrencyDollar, color: 'from-green-500 to-green-600', change: '+8%' },
    { title: 'Active Users', value: (Array.isArray(users) ? users.length : 0).toString(), icon: HiUsers, color: 'from-purple-500 to-purple-600', change: '+15%' },
    { title: 'Services', value: (Array.isArray(services) ? services.length : 0).toString(), icon: HiCog, color: 'from-orange-500 to-orange-600', change: '+3%' },
  ];



  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  } as const;
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } } as const;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar className="text-black" />
      <div className="pt-[10vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            <motion.div variants={itemVariants} className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your RIII platform</p>
              
              {/* Email Status Indicator */}
              {emailConfigured !== null && (
                <div className={`mt-4 p-3 rounded-lg ${emailConfigured ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${emailConfigured ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className={`text-sm font-medium ${emailConfigured ? 'text-green-800' : 'text-red-800'}`}>
                      {emailConfigured ? '✅ Email notifications enabled' : '❌ Email notifications disabled'}
                    </span>
                  </div>
                  <p className={`text-xs mt-1 ${emailConfigured ? 'text-green-600' : 'text-red-600'}`}>
                    {emailConfigured 
                      ? 'Confirmation emails will be sent when orders are confirmed'
                      : 'Configure RESEND_API_KEY to enable email notifications'
                    }
                  </p>
                </div>
              )}
            </motion.div>

            {/* Navigation Bar - Moved under email notification */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 overflow-x-auto">
                  {([
                    { id: 'dashboard', name: 'Dashboard' },
                    { id: 'orders', name: 'Orders' },
                    { id: 'services', name: 'Services' },
                    { id: 'categories', name: 'Categories' },
                    { id: 'locations', name: 'Locations' },
                    { id: 'users', name: 'Users' },
                  ] as { id: TabId; name: string }[]).map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>
            </motion.div>

            {activeTab === 'dashboard' && (
              <motion.div variants={containerVariants} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {metrics.map((metric) => {
                    const Icon = metric.icon;
                    return (
                      <motion.div key={metric.title} variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-3 rounded-lg bg-gradient-to-r ${metric.color}`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <span className="text-sm text-green-600 font-medium">{metric.change}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
                        <p className="text-gray-600">{metric.title}</p>
                      </motion.div>
                    );
                  })}
                </div>

                <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Orders</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders?.slice(0, 5).map((order) => (
                          <tr key={order.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.customer_name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{services?.find((s) => String(s.id) === order.serviceid)?.name || 'Unknown Service'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  order.status === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : order.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : order.status === 'confirmed'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">All Orders</h2>
                  <div className="flex gap-2">
                    <button 
                      onClick={refreshAll}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Refresh
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">Export Orders</button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders?.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
                              <div className="text-sm text-gray-500">{order.phone}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{services?.find((s) => String(s.id) === order.serviceid)?.name || 'Unknown Service'}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{order.date}</div>
                            <div className="text-sm text-gray-500">{order.time}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                              className={`text-xs font-semibold rounded-full ${
                                order.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : order.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : order.status === 'confirmed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="in-progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${order.total}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-900"><HiEye className="h-5 w-5" /></button>
                              <button className="text-green-600 hover:text-green-900"><HiPencil className="h-5 w-5" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'services' && (
              <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Services Management</h2>
                  <button onClick={() => setIsAddServiceOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
                    <HiPlus className="h-5 w-5" />
                    Add Service
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services?.map((service) => (
                    <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-bold text-gray-900 mb-2">{service.name}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-green-600 font-bold">${service.price}</span>
                        <span className="text-yellow-500 flex items-center gap-1">⭐ {service.rating}</span>
                      </div>
                      <div className="flex justify-between">
                        <button onClick={() => handleEditServiceClick(service)} className="text-blue-600 hover:text-blue-800 text-sm font-medium"><HiPencil className="inline h-4 w-4 mr-1" />Edit</button>
                         <button onClick={() => handleDeleteService(service.id)} className="text-red-600 hover:text-red-800 text-sm font-medium"><HiTrash className="inline h-4 w-4 mr-1" />Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'categories' && (
              <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Categories Management</h3>
                  <button onClick={() => setIsAddCategoryOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
                    <HiPlus className="h-5 w-5" />
                    Add Category
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories?.map((c) => (
                    <div key={c.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-bold text-gray-900">{c.name}</h4>
                      </div>
                      {c.image && (
                        <div className="mb-2">
                          <img src={c.image} alt={c.name} className="w-full h-28 object-cover rounded" />
                        </div>
                      )}
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{c.description}</p>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500">/{c.slug}</span>
                        <div className="flex gap-2">
                          <button onClick={() => handleEditCategoryClick(c)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            <HiPencil className="inline h-4 w-4 mr-1" />Edit
                          </button>
                          <button onClick={() => handleDeleteCategory(c.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">
                            <HiTrash className="inline h-4 w-4 mr-1" />Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

              {activeTab === 'locations' && (
                <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6 hidden">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Locations Management</h3>
                    <button onClick={() => setIsAddLocationOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
                      <HiPlus className="h-5 w-5" />
                      Add Location
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {locations?.map((l) => (
                      <div key={l.id} className="border border-gray-200 rounded-lg p-4">
                        {l.image && (
                          <div className="mb-2">
                            <img src={l.image} alt={l.name} className="w-full h-28 object-cover rounded" />
                          </div>
                        )}
                        <h4 className="font-bold text-gray-900">{l.name}</h4>
                        <p className="text-gray-600 text-sm">{l.area ? `${l.area}, ` : ''}{l.city}</p>
                        <div className="flex justify-end mt-3">
                          <button onClick={() => handleDeleteLocation(l.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">
                            <HiTrash className="inline h-4 w-4 mr-1" />Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

            {activeTab === 'users' && (
              <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Users Management</h3>
                  <button 
                    onClick={refreshAll}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Refresh
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users?.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.source === 'contact_form'
                                ? 'bg-blue-100 text-blue-800'
                                : user.source === 'order'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              {user.source.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                            <div className="truncate" title={user.message || 'No message'}>
                              {user.message || 'No message'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {(!users || users.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      No users found. Contact form submissions will appear here.
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {isAddServiceOpen && (
              <AddServiceModal
                categories={categories}
                isSaving={isSaving}
                onClose={() => setIsAddServiceOpen(false)}
                onSave={handleAddService}
              />
            )}
            {isAddCategoryOpen && (
              <AddCategoryModal
                isSaving={isSaving}
                onClose={() => setIsAddCategoryOpen(false)}
                onSave={handleAddCategory}
              />
            )}
            {isAddLocationOpen && (
              <AddLocationModal
                isSaving={isSaving}
                onClose={() => setIsAddLocationOpen(false)}
                onSave={handleAddLocation}
              />
            )}
            {isEditServiceOpen && editingService && (
              <EditServiceModal
                service={editingService}
                categories={categories}
                isSaving={isSaving}
                onClose={() => {
                  setIsEditServiceOpen(false);
                  setEditingService(null);
                }}
                onSave={handleEditService}
              />
            )}
            {isEditCategoryOpen && editingCategory && (
              <EditCategoryModal
                category={editingCategory}
                hasAssociatedServices={hasAssociatedServices(editingCategory.slug)}
                isSaving={isSaving}
                onClose={() => {
                  setIsEditCategoryOpen(false);
                  setEditingCategory(null);
                }}
                onSave={handleEditCategory}
              />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function AddServiceModal({
  categories,
  isSaving,
  onClose,
  onSave,
}: {
  categories: Category[];
  isSaving: boolean;
  onClose: () => void;
  onSave: (form: Partial<Service>) => void;
}) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [duration, setDuration] = useState('');
  const [rating, setRating] = useState<number>(5);

  async function uploadSelected(file: File, folder: string) {
    const form = new FormData();
    form.append('file', file);
    form.append('folder', folder);
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    if (!res.ok) throw new Error((await res.json()).error || 'Upload failed');
    const data = await res.json();
    return data.url as string;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Add Service</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
              <option value="">Select a category</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
              <input type="number" min="0" max="100" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <input type="number" step="0.1" value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
            <input value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image (upload)</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded-lg" rows={3} />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">Cancel</button>
          <button
            disabled={isSaving}
            onClick={async () => {
              let imageUrl = image;
              if (imageFile) {
                imageUrl = await uploadSelected(imageFile, 'services/images');
              }
              await onSave({ name, category, price, discount, description, image: imageUrl, duration, rating } as Partial<Service>);
            }}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:bg-gray-400"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

function AddCategoryModal({
  isSaving,
  onClose,
  onSave,
}: {
  isSaving: boolean;
  onClose: () => void;
  onSave: (form: Partial<Category>) => void;
}) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  // icon removed per new schema
  const [image, setImage] = useState('');
  // iconFile removed
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug && name) {
      setSlug(
        name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
      );
    }
  }, [name]);

  async function uploadSelected(file: File, folder: string) {
    const form = new FormData();
    form.append('file', file);
    form.append('folder', folder);
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    if (!res.ok) throw new Error((await res.json()).error || 'Upload failed');
    const data = await res.json();
    return data.url as string;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Add Category</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image (upload)</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded-lg" rows={3} />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">Cancel</button>
          <button
            disabled={isSaving}
            onClick={async () => {
              try {
                setError(null);
                let imageUrl = image;
                if (imageFile) {
                  imageUrl = await uploadSelected(imageFile, 'categories/images');
                }
                if (!name || !slug) {
                  setError('Name and slug are required');
                  return;
                }
                

                
                await onSave({ name, slug, image: imageUrl, description } as Partial<Category>);
              } catch (e: any) {
                setError(e?.message || 'Failed to save');
              }
            }}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:bg-gray-400"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

function AddLocationModal({
  isSaving,
  onClose,
  onSave,
}: {
  isSaving: boolean;
  onClose: () => void;
  onSave: (form: Partial<Location>) => void;
}) {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  async function uploadSelected(file: File, folder: string) {
    const form = new FormData();
    form.append('file', file);
    form.append('folder', folder);
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    if (!res.ok) throw new Error((await res.json()).error || 'Upload failed');
    const data = await res.json();
    return data.url as string;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Add Location</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
              <input value={area} onChange={(e) => setArea(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image (upload)</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full" />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">Cancel</button>
          <button
            disabled={isSaving}
            onClick={async () => {
              let imageUrl = image;
              if (imageFile) imageUrl = await uploadSelected(imageFile, 'locations');
              const newId = crypto.randomUUID(); // Generate UUID
              await onSave({ id: newId, name, city, area, image: imageUrl } as Partial<Location>);
            }}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:bg-gray-400"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

function EditServiceModal({
  service,
  categories,
  isSaving,
  onClose,
  onSave,
}: {
  service: Service;
  categories: Category[];
  isSaving: boolean;
  onClose: () => void;
  onSave: (form: Partial<Service>) => void;
}) {
  const [name, setName] = useState(service.name);
  const [category, setCategory] = useState(service.category);
  const [price, setPrice] = useState<number>(service.price);
  const [discount, setDiscount] = useState<number>(service.discount || 0);
  const [description, setDescription] = useState(service.description);
  const [image, setImage] = useState(service.image);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [duration, setDuration] = useState(service.duration);
  const [rating, setRating] = useState<number>(service.rating);

  async function uploadSelected(file: File, folder: string) {
    const form = new FormData();
    form.append('file', file);
    form.append('folder', folder);
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    if (!res.ok) throw new Error((await res.json()).error || 'Upload failed');
    const data = await res.json();
    return data.url as string;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Edit Service</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
              <option value="">Select a category</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
              <input type="number" min="0" max="100" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <input type="number" step="0.1" value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
            <input value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image (upload)</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full" />
            {image && !imageFile && (
              <div className="mt-2">
                <img src={image} alt="Current image" className="w-20 h-20 object-cover rounded" />
                <p className="text-xs text-gray-500 mt-1">Current image</p>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded-lg" rows={3} />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">Cancel</button>
          <button
            disabled={isSaving}
            onClick={async () => {
              let imageUrl = image;
              if (imageFile) {
                imageUrl = await uploadSelected(imageFile, 'services/images');
              }
              await onSave({ name, category, price, discount, description, image: imageUrl, duration, rating } as Partial<Service>);
            }}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:bg-gray-400"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function EditCategoryModal({
  category,
  hasAssociatedServices,
  isSaving,
  onClose,
  onSave,
}: {
  category: Category;
  hasAssociatedServices: boolean;
  isSaving: boolean;
  onClose: () => void;
  onSave: (form: Partial<Category>) => void;
}) {
  const [name, setName] = useState(category.name);
  const [slug, setSlug] = useState(category.slug);
  const [image, setImage] = useState(category.image);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [description, setDescription] = useState(category.description || '');
  const [error, setError] = useState<string | null>(null);

  async function uploadSelected(file: File, folder: string) {
    const form = new FormData();
    form.append('file', file);
    form.append('folder', folder);
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    if (!res.ok) throw new Error((await res.json()).error || 'Upload failed');
    const data = await res.json();
    return data.url as string;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Edit Category</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input 
              value={slug} 
              onChange={(e) => setSlug(e.target.value)} 
              className="w-full px-3 py-2 border rounded-lg"
            />
            {hasAssociatedServices && (
              <p className="text-xs text-blue-600 mt-1">
                ℹ️ Changing slug will update all associated services automatically
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image (upload)</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full" />
            {image && !imageFile && (
              <div className="mt-2">
                <img src={image} alt="Current image" className="w-20 h-20 object-cover rounded" />
                <p className="text-xs text-gray-500 mt-1">Current image</p>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded-lg" rows={3} />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">Cancel</button>
          <button
            disabled={isSaving}
            onClick={async () => {
              try {
                setError(null);
                let imageUrl = image;
                if (imageFile) {
                  imageUrl = await uploadSelected(imageFile, 'categories/images');
                }
                if (!name || !slug) {
                  setError('Name and slug are required');
                  return;
                }
                await onSave({ name, slug, image: imageUrl, description } as Partial<Category>);
              } catch (e: any) {
                setError(e?.message || 'Failed to save');
              }
            }}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:bg-gray-400"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}