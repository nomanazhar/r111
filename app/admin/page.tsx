'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HiUsers, 
  HiCurrencyDollar, 
  HiClipboardList, 
  HiCog,
  HiPlus,
  HiPencil,
  HiTrash,
  HiEye
} from 'react-icons/hi';
import Navbar from '@/components/layout/Navbar';
import { useStore } from '@/lib/store';

export default function AdminPage() {
  const { services, categories, orders, updateOrderStatus } = useStore();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Calculate metrics
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const completedOrders = orders.filter(order => order.status === 'completed').length;

  const metrics = [
    {
      title: 'Total Orders',
      value: orders.length.toString(),
      icon: HiClipboardList,
      color: 'from-blue-500 to-blue-600',
      change: '+12%'
    },
    {
      title: 'Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: HiCurrencyDollar,
      color: 'from-green-500 to-green-600',
      change: '+8%'
    },
    {
      title: 'Active Users',
      value: '1,234',
      icon: HiUsers,
      color: 'from-purple-500 to-purple-600',
      change: '+15%'
    },
    {
      title: 'Services',
      value: services.length.toString(),
      icon: HiCog,
      color: 'from-orange-500 to-orange-600',
      change: '+3%'
    }
  ];

  const tabs = [
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'orders', name: 'Orders' },
    { id: 'services', name: 'Services' },
    { id: 'categories', name: 'Categories' },
    { id: 'users', name: 'Users' }
  ];

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateOrderStatus(orderId, newStatus as any);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-[10vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your RIII platform</p>
            </motion.div>

            {/* Navigation Tabs */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {tabs.map((tab) => (
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

            {/* Content */}
            {activeTab === 'dashboard' && (
              <motion.div variants={containerVariants} className="space-y-8">
                {/* Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {metrics.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                      <motion.div
                        key={metric.title}
                        variants={itemVariants}
                        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                      >
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

                {/* Recent Orders */}
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
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {order.customerName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {services.find(s => s.id === order.serviceId)?.name || 'Unknown Service'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${order.total}
                            </td>
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
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Export Orders
                  </button>
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                              <div className="text-sm text-gray-500">{order.phone}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {services.find(s => s.id === order.serviceId)?.name || 'Unknown Service'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{order.date}</div>
                            <div className="text-sm text-gray-500">{order.time}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className={`text-xs font-semibold rounded-full px-2 py-1 border-none outline-none ${
                                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="in-progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${order.total}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-900">
                                <HiEye className="h-5 w-5" />
                              </button>
                              <button className="text-green-600 hover:text-green-900">
                                <HiPencil className="h-5 w-5" />
                              </button>
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
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
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
                        <span className="text-yellow-500 flex items-center gap-1">
                          ⭐ {service.rating}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          <HiPencil className="inline h-4 w-4 mr-1" />
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                          <HiTrash className="inline h-4 w-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {(activeTab === 'categories' || activeTab === 'users') && (
              <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {activeTab === 'categories' ? 'Categories' : 'Users'} Management
                  </h3>
                  <p className="text-gray-600">
                    This section is under development. Full CRUD functionality will be available soon.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}