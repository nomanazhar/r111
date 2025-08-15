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
import type { Category, Order, Service, Location } from '@/lib/types';

type TabId = 'dashboard' | 'orders' | 'services' | 'categories' | 'locations' | 'users';

export default function AdminPageClient() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    void refreshAll();
  }, []);

  useEffect(() => {
    let isCancelled = false;
    const fetchLatestOrders = async () => {
      try {
        const res = await fetch('/api/orders', { cache: 'no-store' });
        const data = await res.json();
        if (!isCancelled && Array.isArray(data)) setOrders(data);
      } catch {}
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
    const [services, categories, locations, orders] = await Promise.all([
      fetch('/api/services').then((r) => r.json()),
      fetch('/api/categories').then((r) => r.json()),
      fetch('/api/locations').then((r) => r.json()),
      fetch('/api/orders').then((r) => r.json()),
    ]);
    setServices(services ?? []);
    setCategories(categories ?? []);
    setLocations(locations ?? []);
    setOrders(orders ?? []);
  }

  async function handleStatusChange(orderId: string, newStatus: Order['status']) {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    const res = await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, status: newStatus }),
    });
    if (res.ok) {
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
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
    setServices((prev) => [created, ...prev]);
    setIsAddServiceOpen(false);
  }

  async function handleDeleteService(serviceId: string | number) {
    const res = await fetch('/api/services', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: serviceId }),
    });
    if (res.ok) setServices((prev) => prev.filter((s) => s.id !== serviceId));
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
    setCategories((prev) => [created, ...prev]);
    setIsAddCategoryOpen(false);
  }

  async function handleDeleteCategory(categoryId: number) {
    const res = await fetch('/api/categories', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: categoryId }),
    });
    if (res.ok) setCategories((prev) => prev.filter((c) => c.id !== categoryId));
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
      setLocations((prev) => [created, ...prev]);
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
    if (res.ok) setLocations((prev) => prev.filter((l) => l.id !== locationId));
  }

  const totalRevenue = useMemo(() => orders.reduce((sum, order) => sum + (order.total ?? 0), 0), [orders]);

  const metrics = [
    { title: 'Total Orders', value: orders.length.toString(), icon: HiClipboardList, color: 'from-blue-500 to-blue-600', change: '+12%' },
    { title: 'Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: HiCurrencyDollar, color: 'from-green-500 to-green-600', change: '+8%' },
    { title: 'Active Users', value: '1,234', icon: HiUsers, color: 'from-purple-500 to-purple-600', change: '+15%' },
    { title: 'Services', value: services.length.toString(), icon: HiCog, color: 'from-orange-500 to-orange-600', change: '+3%' },
  ];

  const nextCategoryId = useMemo(() => {
    if (!categories || categories.length === 0) return 1;
    return Math.max(...categories.map((c) => Number(c.id) || 0)) + 1;
  }, [categories]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  } as const;
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } } as const;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-[10vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            <motion.div variants={itemVariants} className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your RIII platform</p>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-8">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
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
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
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
                        {orders.slice(0, 5).map((order) => (
                          <tr key={order.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.customer_name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{services.find((s) => String(s.id) === order.serviceId)?.name || 'Unknown Service'}</td>
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
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
                              <div className="text-sm text-gray-500">{order.phone}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{services.find((s) => String(s.id) === order.serviceId)?.name || 'Unknown Service'}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{order.date}</div>
                            <div className="text-sm text-gray-500">{order.time}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                              className={`text-xs font-semibold rounded-full px-2 py-1 border-none outline-none ${
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
                  {services.map((service) => (
                    <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-bold text-gray-900 mb-2">{service.name}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-green-600 font-bold">${service.price}</span>
                        <span className="text-yellow-500 flex items-center gap-1">⭐ {service.rating}</span>
                      </div>
                      <div className="flex justify-between">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium"><HiPencil className="inline h-4 w-4 mr-1" />Edit</button>
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
                  {categories.map((c) => (
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
                        <button onClick={() => handleDeleteCategory(c.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">
                          <HiTrash className="inline h-4 w-4 mr-1" />Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'locations' && (
              <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Locations Management</h3>
                  <button onClick={() => setIsAddLocationOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
                    <HiPlus className="h-5 w-5" />
                    Add Location
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {locations.map((l) => (
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
                nextId={nextCategoryId}
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
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg" />
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
              await onSave({ name, category, price, description, image: imageUrl, duration, rating } as Partial<Service>);
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
  nextId,
  isSaving,
  onClose,
  onSave,
}: {
  nextId: number;
  isSaving: boolean;
  onClose: () => void;
  onSave: (form: Partial<Category>) => void;
}) {
  const [id, setId] = useState<number>(nextId);
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
            <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
            <input
              type="number"
              value={id}
              onChange={(e) => setId(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg bg-gray-50"
              readOnly
            />
          </div>
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
                await onSave({ id, name, slug, image: imageUrl, description } as Partial<Category>);
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